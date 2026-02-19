//Components
import { useState, useEffect } from "react";
import { useAuthentication } from "../../hooks/useAuthentication";
import { validateEmail } from "../../hooks/useValidationEmail";

//CSS
import styles from "./Login.module.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [passWord, setPassWord] = useState("");
  const [error, setError] = useState("");
  const [errorMessage, setErrorMessage] = useState({});
  const { login, error: authenticationError, loading } = useAuthentication();

  const handleSubmet = async (e) => {
    e.preventDefault();

    setError("");
    let validationErrors = {}; // Objeto para armazenar erros locais

    const user = {
      email,
      passWord,
    };

    if (!email.trim()) {
      validationErrors.email = "E-mail é obrigatório.";
    } else if (!validateEmail(email.trim())) {
      validationErrors.email = "Por favor, insira um e-mail válido.";
    }

    if (!passWord.trim()) {
      validationErrors.passWord = "Senha é obrigatória.";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrorMessage(validationErrors); // Atualiza os erros no estado
      return;
    }

    setErrorMessage({}); // Limpa os erros se tudo estiver válido

    try {
      await login(user);
    } catch (error) {
      setError("Erro ao Entrar. Tente novamente.");
    }
  };

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
        <label>
          <span>Email:</span>
          <input
            type="email"
            name="email"
            placeholder="Email do Usuário"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        {errorMessage.email && (
          <div className="errormsg">
            <p>{errorMessage.email}</p>
          </div>
        )}
        <label>
          <span>Senha:</span>
          <input
            type="password"
            name="passWord"
            placeholder="Senha do Usuário"
            value={passWord}
            onChange={(e) => setPassWord(e.target.value)}
          />
        </label>
        {errorMessage.passWord && (
          <div className="errormsg">
            <p>{errorMessage.passWord}</p>
          </div>
        )}

        {errorMessage.displayConfirmPassWord && (
          <div className="errormsg">
            <p>{errorMessage.displayConfirmPassWord}</p>
          </div>
        )}
        {!loading && <button className="btn">Entrar</button>}
        {loading && (
          <button className="btn" disabled>
            Aguarde...
          </button>
        )}
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

export default Login;
