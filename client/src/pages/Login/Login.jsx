//Components
import { useState, useEffect } from 'react'
import { useAuthentication } from '../../hooks/useAuthentication';
import { validateEmail } from '../../hooks/useValidationEmail';

//CSS
import styles from './Login.module.css'

const Login = () => {

    const [displayEmail, setDisplayEmail] = useState("");
    const [displayPassWord, setDisplayPassWord] = useState("");
    const [error, setError] = useState("");
    const [errorMessage, setErrorMessage] = useState({});
    const { login, error: authenticationError, loading } = useAuthentication();

    const handleSubmet = async (e) => {
        e.preventDefault();

        setError("");
        let validationErrors = {}; // Objeto para armazenar erros locais

        const user = {
            displayEmail,
            displayPassWord,
        }


        if (!displayEmail.trim()) {
            validationErrors.displayEmail = "E-mail é obrigatório.";
        } else if (!validateEmail(displayEmail.trim())) {
            validationErrors.displayEmail = "Por favor, insira um e-mail válido.";
        }

        if (!displayPassWord.trim()) {
            validationErrors.displayPassWord = "Senha é obrigatória.";
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrorMessage(validationErrors); // Atualiza os erros no estado
            return;
        }

        setErrorMessage({}); // Limpa os erros se tudo estiver válido

        try {
            const response = await login(user);
            // console.log("response", response);
        } catch (error) {
            setError("Erro ao Entrar. Tente novamente.");
        }

    }

    useEffect(() => {
        if (authenticationError) {
            setError(authenticationError);
        }
    }, [authenticationError]);


    return (
        <div className={styles.login}>
            <h1>Login</h1>
            <p>Faça o login para ter acesso ao sistema</p>
            <form onSubmit={handleSubmet} noValidate>
                <label><span>Email:</span>
                    <input type="email" name='displayEmail' placeholder='Email do Usuário' value={displayEmail} onChange={(e) => setDisplayEmail(e.target.value)} />
                </label>
                {errorMessage.displayEmail && <div className="errormsg">
                    <p>{errorMessage.displayEmail}</p>
                </div>}
                <label><span>Senha:</span>
                    <input type="password" name='displayPassWord' placeholder='Senha do Usuário' value={displayPassWord} onChange={(e) => setDisplayPassWord(e.target.value)} />
                </label>
                {errorMessage.displayPassWord && <div className="errormsg">
                    <p>{errorMessage.displayPassWord}</p>
                </div>}

                {errorMessage.displayConfirmPassWord && <div className="errormsg">
                    <p>{errorMessage.displayConfirmPassWord}</p>
                </div>}
                {!loading && <button className='btn'>Entrar</button>}
                {loading && <button className='btn' disabled>Aguarde...</button>}
                {error && <p className='error'>{error}</p>}
            </form>
        </div>
    )
}

export default Login