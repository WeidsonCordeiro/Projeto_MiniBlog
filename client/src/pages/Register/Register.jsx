//Components
import { useState, useEffect } from 'react'
import { useAuthentication } from '../../hooks/useAuthentication';
import { validateEmail } from '../../hooks/useValidationEmail';

//CSS
import styles from './Register.module.css'

const Register = () => {
    const [displayName, setDisplayName] = useState("");
    const [displayEmail, setDisplayEmail] = useState("");
    const [displayPassWord, setDisplayPassWord] = useState("");
    const [displayConfirmPassWord, setDisplayConfirmPassWord] = useState("");
    const [error, setError] = useState("");
    const [errorMessage, setErrorMessage] = useState({});
    const { createUser, error: authenticationError, loading } = useAuthentication();

    const handleSubmet = async (e) => {
        e.preventDefault();

        setError("");
        let validationErrors = {}; // Objeto para armazenar erros locais

        const user = {
            displayName,
            displayEmail,
            displayPassWord,
            displayConfirmPassWord,
        }

        if (!displayName.trim()) {
            validationErrors.displayName = "Nome é obrigatório.";
        }

        if (!displayEmail.trim()) {
            validationErrors.displayEmail = "E-mail é obrigatório.";
        } else if (!validateEmail(displayEmail.trim())) {
            validationErrors.displayEmail = "Por favor, insira um e-mail válido.";
        }

        if (!displayPassWord.trim()) {
            validationErrors.displayPassWord = "Senha é obrigatória.";
        }

        if (!displayConfirmPassWord.trim()) {
            validationErrors.displayConfirmPassWord = "Confirmação de senha é obrigatória.";
        }

        if (displayPassWord && displayConfirmPassWord && displayPassWord !== displayConfirmPassWord) {
            validationErrors.displayConfirmPassWord = "As senhas não conferem!";
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrorMessage(validationErrors); // Atualiza os erros no estado
            return;
        }

        setErrorMessage({}); // Limpa os erros se tudo estiver válido

        try {
            const response = await createUser(user);
            console.log("response", response);
        } catch (error) {
            setError("Erro ao criar usuário. Tente novamente.");
        }

    }

    useEffect(() => {
        if (authenticationError) {
            setError(authenticationError);
        }
    }, [authenticationError]);

    return (
        <div className={styles.register}>
            <h1>Cadastre-se para postar!</h1>
            <p>Crie seu usuário e compartilhe suas histórias</p>
            <form onSubmit={handleSubmet} noValidate>
                <label><span>Nome:</span>
                    <input type="text" name='displayName' placeholder='Nome do Usuário' value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                </label>
                {errorMessage.displayName && <div className="errormsg">
                    <p>{errorMessage.displayName}</p>
                </div>}
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
                <label><span>Confirmar Senha:</span>
                    <input type="password" name='displayConfirmPassWord' placeholder='Confirme a sua senha' value={displayConfirmPassWord} onChange={(e) => setDisplayConfirmPassWord(e.target.value)} />
                </label>
                {errorMessage.displayConfirmPassWord && <div className="errormsg">
                    <p>{errorMessage.displayConfirmPassWord}</p>
                </div>}
                {!loading && <button className='btn'>Cadastrar</button>}
                {loading && <button className='btn' disabled>Aguarde...</button>}
                {error && <p className='error'>{error}</p>}
            </form>
        </div>
    )
}

export default Register