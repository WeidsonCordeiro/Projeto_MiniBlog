import { useState, useReducer, useEffect } from "react";
import { db } from "../firebase/config";
import { collection, addDoc, Timestamp } from "firebase/firestore";


const initialState = {
    data: null,
    loading: false,
    error: null,
};

const insertReducer = (state, action) => {
    switch (action.type) {
        case "LOADING":
            return { data: null, loading: true, error: null };
        case "INSERTED_DOC":
            return { data: action.payload, loading: false, error: null };
        case "ERROR":
            return { data: null, loading: false, error: action.payload };
        default:
            return state;
    }
};

export const useInsertDocument = (collectionName) => {
    const [response, dispatch] = useReducer(insertReducer, initialState);

    //Deal with memory leak
    const [cancelled, setCancelled] = useState(false);

    const checkIfIsCancelled = (action) => {
        if (!cancelled) {
            dispatch(action);
        }
    }

    const insertDocument = async (data) => {
        if (!data || typeof data !== "object") {
            checkIfIsCancelled({ type: "ERROR", payload: "Dados inválidos para inserção." });
            return;
        }

        checkIfIsCancelled({ type: "LOADING" });

        try {
            const docRef = await addDoc(collection(db, collectionName), {
                ...data,
                createdAt: Timestamp.now(),
            });
            checkIfIsCancelled({ type: "INSERTED_DOC", payload: docRef });
        } catch (error) {
            checkIfIsCancelled({ type: "ERROR", payload: error.message });
        }
    };

    useEffect(() => {
        return () => {
            setCancelled(true); // Marca como cancelado quando o componente for desmontado
        };
    }, []);

    return { ...response, insertDocument };
};