import { AuthContext } from "./AuthContext";
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/config";
import { saveToLocalStorage, removeToLocalStorage } from "../../utils/config";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const token = await firebaseUser.getIdToken();

        const userData = {
          name: firebaseUser.displayName,
          userId: firebaseUser.uid,
          token,
        };

        setUser(userData);
        saveToLocalStorage("user", userData);
      } else {
        setUser(null);
        removeToLocalStorage("user");
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
