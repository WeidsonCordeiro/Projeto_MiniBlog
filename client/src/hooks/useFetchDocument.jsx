//Components    
import { useState, useEffect } from "react";
import { db } from "../firebase/config";
import { doc, getDoc } from "firebase/firestore";

export const useFetchDocument = (docCollection, id) => {
    const [document, setDocument] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!docCollection || !id) return; // Evita chamadas desnecessárias

        const abortController = new AbortController();

        async function loadDocument() {
            setLoading(true);
            try {
                const docRef = await doc(db, docCollection, id);
                const docSnap = await getDoc(docRef);
                if (!abortController.signal.aborted) {
                    setDocument(docSnap.exists() ? docSnap.data() : null);
                }
            } catch (error) {
                if (!abortController.signal.aborted) {
                    console.error("Error fetching document:", error);
                    setError(error.message || "An error occurred");
                }
            } finally {
                if (!abortController.signal.aborted) {
                    setLoading(false);
                }
            }
        }

        if (docCollection && id) loadDocument();

        return () => abortController.abort(); // Cancela a requisição se o componente desmontar

    }, [docCollection, id]);

    return { document, loading, error };
};