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
        data.email,
        data.passWord,
      );
      await updateProfile(user, { displayName: data.name });

      return user;
    } catch (error) {
      console.error("Erro no registo:", error.code);

      const errorMessages = {
        "auth/weak-password": "A senha deve ter no mínimo 6 caracteres",
        "auth/email-already-in-use": "Email já cadastrado",
        "auth/invalid-email": "Email inválido",
        "auth/operation-not-allowed": "Operação não permitida",
        // Adicione outros códigos de erro conforme necessário
      };

      setError(
        errorMessages[error.code] ||
          "Ocorreu um erro ao registar o usuário, tente novamente",
      );
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
        data.passWord,
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
          "Ocorreu um erro ao buscar o usuário, tente novamente",
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
    } catch (error) {
      console.error("Erro no logout:", error.code);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { auth, createUser, loading, error, logout, login };
};
