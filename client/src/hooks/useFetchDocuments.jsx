//Components    
import { useState, useEffect } from "react";
import { db } from "../firebase/config";
import { collection, query, orderBy, onSnapshot, where } from "firebase/firestore";

export const useFetchDocuments = (docCollection, search = null, uid = null) => {
    const [documents, setDocuments] = useState(null);
    const [loading, setLoading] = useState(null);
    const [error, setError] = useState(null);
    const [cancelled, setCancelled] = useState(false); //Deal with memory leak

    useEffect(() => {

        async function loadData() {
            if (cancelled) return;
            setLoading(true);
            setError(null);
            try {
                const collectionRef = await collection(db, docCollection);
                let q;
                if(search){
                    q = await query(collectionRef, where("tagsArray", "array-contains", search), orderBy("createdAt", "desc"));
                }else if (uid) {
                    q = await query(collectionRef, where("uid", "==", uid), orderBy("createdAt", "desc"));
                }else{
                    q = await query(collectionRef, orderBy("createdAt", "desc"));
                }
                
                const unsubscribe = onSnapshot(q, (querySnapshot) => {
                    const docs = querySnapshot.docs.map((doc) => ({
                        ...doc.data(),
                        id: doc.id,
                    }));
                    
                    if (!cancelled) {
                        setDocuments(docs);
                    }
                });

                return () => unsubscribe();

            } catch (error) {
                if (!cancelled) {
                    console.log(error);
                    setError(error.message);
                }
            } finally {
                setLoading(false);
            }
        }

        loadData();

        return () => setCancelled(true);

    }, [docCollection, search, uid]);

    return { documents, loading, error };
};