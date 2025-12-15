// firebase.ts - VERSIONE CORRETTA PER VITE + FIREBASE V12

import { initializeApp } from "firebase/app";
import { 
    getAuth, 
    onAuthStateChanged, 
    signOut, 
    signInWithEmailAndPassword 
} from "firebase/auth";
import { 
    getFirestore, 
    collection, 
    doc, 
    setDoc, 
    getDoc, 
    updateDoc, 
    getDocs, 
    query, 
    where 
} from "firebase/firestore";

import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// ⚠️ QUI METTI LE TUE CONFIGURAZIONI
import { firebaseConfig } from "./config";

const app = initializeApp(firebaseConfig);

// ✅ QUESTA È LA RIGA CHE MANCAVA (e che corregge l'errore in console):
export const isFirebaseInitialized = app ? true : false;

// AUTH
export const auth = getAuth(app);
export { onAuthStateChanged, signOut, signInWithEmailAndPassword };

// FIRESTORE
export const db = getFirestore(app);
export { 
    collection, doc, setDoc, getDoc, updateDoc, 
    getDocs, query, where 
};

// STORAGE
export const storage = getStorage(app);
export { ref, uploadBytes, getDownloadURL };