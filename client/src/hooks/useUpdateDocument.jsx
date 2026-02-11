import { useState, useReducer, useEffect } from "react";
import { db } from "../firebase/config";
import { updateDoc, doc, Timestamp } from "firebase/firestore";


const initialState = {
    data: null,
    loading: false,
    error: null,
};

const updateReducer = (state, action) => {
    switch (action.type) {
        case "LOADING":
            return { data: null, loading: true, error: null };
        case "UPDATED_DOC":
            return { data: action.payload, loading: false, error: null };
        case "ERROR":
            return { data: null, loading: false, error: action.payload };
        default:
            return state;
    }
};

export const useUpdateDocument = (collectionName) => {
    const [response, dispatch] = useReducer(updateReducer, initialState);

    //Deal with memory leak
    const [cancelled, setCancelled] = useState(false);

    const checkIfIsCancelled = (action) => {
        if (!cancelled) {
            dispatch(action);
        }
    }

    const updateDocument = async (id, data) => {
        if (!data || typeof data !== "object") {
            checkIfIsCancelled({ type: "ERROR", payload: "Dados inválidos para edição!" });
            return;
        }

        checkIfIsCancelled({ type: "LOADING" });

        try {
            const docRef = doc(db, collectionName, id);
            const updatedData = await updateDoc(docRef, {
                ...data,
                updatedAt: Timestamp.now(),
            });

            checkIfIsCancelled({ type: "UPDATED_DOC", payload: updatedData });
        } catch (error) {
            checkIfIsCancelled({ type: "ERROR", payload: error.message });
        }
    };

    useEffect(() => {
        return () => {
            setCancelled(true); // Marca como cancelado quando o componente for desmontado
        };
    }, []);

    return { ...response, updateDocument };
};