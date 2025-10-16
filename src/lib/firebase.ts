
// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Se inserta la configuración directamente para evitar problemas con variables de entorno en el build.
const firebaseConfig = {
  apiKey: "AIzaSyAkwEuIqBsIIY_cKmrAkSQhVVUhdrn1xhc",
  authDomain: "studio-4820039016-5ae38.firebaseapp.com",
  projectId: "studio-4820039016-5ae38",
  storageBucket: "studio-4820039016-5ae38.appspot.com",
  messagingSenderId: "821979814317",
  appId: "1:821979814317:web:abd23395565fe4e58f6924"
};

// Inicializa Firebase solo si no hay apps inicializadas
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Exporta servicios para toda la app
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
