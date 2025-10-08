// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// ⚠️ Configuración del proyecto REAL en Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAx9ZN9RvrruSNxc7CE-Xqo7AARhpNKmrk",
  authDomain: "studio-4820039016-5ae38.firebaseapp.com",
  projectId: "studio-4820039016-5ae38",
  storageBucket: "studio-4820039016-5ae38.firebasestorage.app",
  messagingSenderId: "821979814317",
  appId: "1:821979814317:web:abd23395565fe4e58f6924"
};

// Inicializa Firebase solo si no hay apps inicializadas
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Exporta servicios para toda la app
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
