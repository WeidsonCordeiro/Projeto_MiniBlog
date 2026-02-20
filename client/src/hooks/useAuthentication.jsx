//Components
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
} from "firebase/auth";
import { useState, useEffect } from "react";

export const useAuthentication = () => {
  //Cleanup
  //Deal with memory leak
  const [cancelled, setCancelled] = useState(false);
  ////////////
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);
  //const [user, setUser] = useState(null);

  const checkIfIsCancelled = () => {
    if (cancelled) {
      return;
    }
  };

  const auth = getAuth();

  const createUser = async (data) => {
    checkIfIsCancelled();
    setLoading(true);
    setError(null);

    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        data.displayEmail,
        data.displayPassWord
      );
      await updateProfile(user, { displayName: data.displayName });
      return user;
    } catch (error) {
      let systemErrorMessage;
      console.error(error.message);
      if (error.message.includes("Password")) {
        systemErrorMessage = "A Senha deve ter no mínimo 6 caracteres";
      } else if (error.message.includes("email-already")) {
        systemErrorMessage = "Email já cadastrado";
      } else {
        systemErrorMessage = "Ocorreu um erro ao cadastrar o usuário";
      }
      setError(systemErrorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => setCancelled(true);
  }, []);

  const login = async (data) => {
    checkIfIsCancelled();
    setLoading(true);
    setError(null);

    try {
      const { user } = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.passWord
      );

      const token = await auth.currentUser.getIdToken(true); // força refresh
      console.log(token);

      localStorage.setItem(
        "user",
        JSON.stringify({
          name: user.displayName,
          token: token,
        })
      );

      return user;
    } catch (error) {
      console.error("Erro no login:", error.code);

      const errorMessages = {
        "auth/user-not-found": "Usuário não encontrado",
        "auth/wrong-password": "Senha incorreta",
        "auth/invalid-email": "Email inválido",
      };

      setError(
        errorMessages[error.code] ||
          "Ocorreu um erro ao buscar o usuário, tente novamente"
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    checkIfIsCancelled();
    setLoading(true);
    setError(null);

    try {
      await signOut(auth);
      localStorage.removeItem("user");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { auth, createUser, loading, error, logout, login };
};
