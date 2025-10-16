
// src/lib/firebase.ts
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;

// Inicialización perezosa para evitar errores durante el build
function initializeFirebase() {
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
}

// Solo inicializa en el lado del cliente o en un entorno donde las variables estén definidas
if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
  initializeFirebase();
}

// Exportamos una función que asegura la inicialización antes de usar los servicios
const ensureFirebaseInitialized = () => {
  if (!getApps().length) {
    initializeFirebase();
  }
};

// Se exportan getters en lugar de las instancias directas
export const getFirebaseAuth = () => {
  ensureFirebaseInitialized();
  return auth;
}

export const getFirestoreDb = () => {
    ensureFirebaseInitialized();
    return db;
}

export const getFirebaseStorage = () => {
    ensureFirebaseInitialized();
    return storage;
}

// Exportamos las instancias para los archivos que ya las usan,
// pero la inicialización ahora es más segura.
// Esto evita tener que refactorizar todos los archivos que importan 'db', 'auth', etc.
if (!getApps().length && process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
  initializeFirebase();
}

export { app, auth, db, storage };
