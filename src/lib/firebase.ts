// src/lib/firebase.ts
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";

// Solución: Se "hardcodean" las variables para asegurar que estén disponibles durante la compilación.
const firebaseConfig = {
  apiKey: "AIzaSyAkwEuIqBsIIY_cKmrAkSQhVVUhdrn1xhc",
  authDomain: "studio-4820039016-5ae38.firebaseapp.com",
  projectId: "studio-4820039016-5ae38",
  storageBucket: "studio-4820039016-5ae38.appspot.com",
  messagingSenderId: "821979814317",
  appId: "1:821979814317:web:abd23395565fe4e58f6924"
};

// Inicialización segura de la app de Firebase
let app: FirebaseApp;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);
const storage: FirebaseStorage = getStorage(app);

// Exportamos las instancias para compatibilidad
export { app, auth, db, storage };

// Exportamos getters que son la forma recomendada de acceder
export const getFirebaseAuth = () => getAuth(app);
export const getFirestoreDb = () => getFirestore(app);
export const getFirebaseStorage = () => getStorage(app);
