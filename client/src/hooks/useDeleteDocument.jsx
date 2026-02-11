import { useState, useReducer, useEffect } from "react";
import { db } from "../firebase/config";
import { doc, deleteDoc } from "firebase/firestore";


const initialState = {
    data: null,
    loading: false,
    error: null,
};

const deleteReducer = (state, action) => {
    switch (action.type) {
        case "LOADING":
            return { data: null, loading: true, error: null };
        case "DELETED_DOC":
            return { data: action.payload, loading: false, error: null };
        case "ERROR":
            return { data: null, loading: false, error: action.payload };
        default:
            return state;
    }
};

export const useDeleteDocument = (collectionName) => {
    const [response, dispatch] = useReducer(deleteReducer, initialState);

    //Deal with memory leak
    const [cancelled, setCancelled] = useState(false);

    const checkIfIsCancelled = (action) => {
        if (!cancelled) {
            dispatch(action);
        }
        // console.log("Componente desmontado, cancelando operações...");
        // return () => setCancelled(true);
    }

    const deleteDocument = async (id) => {
        checkIfIsCancelled({ type: "LOADING" });

        try {
            // Cria uma referência ao documento
            const docRef = doc(db, collectionName, id);

            // Deleta o documento
            await deleteDoc(docRef);

            checkIfIsCancelled({ type: "DELETED_DOC", payload: id });
        } catch (error) {
            checkIfIsCancelled({ type: "ERROR", payload: error.message });
        }
    };

    useEffect(() => {
        return () => {
            setCancelled(true); // Marca como cancelado quando o componente desmonta
        };
    }, []);

    return { ...response, deleteDocument };
};