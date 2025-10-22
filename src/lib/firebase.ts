// src/lib/firebase.ts
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";
import { getFunctions, Functions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: "AIzaSyAkwEuIqBsIIY_cKmrAkSQhVVUhdrn1xhc",
  authDomain: "studio-4820039016-5ae38.firebaseapp.com",
  projectId: "studio-4820039016-5ae38",
  storageBucket: "studio-4820039016-5ae38.firebasestorage.app",
  messagingSenderId: "821979814317",
  appId: "1:821979814317:web:abd23395565fe4e58f6924"
};

let app: FirebaseApp;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);
const storage: FirebaseStorage = getStorage(app);
const functions: Functions = getFunctions(app);

export { app, auth, db, storage, functions };

// Legacy getters for any components that might still use them.
export const getFirebaseAuth = () => auth;
export const getFirestoreDb = () => db;
export const getFirebaseStorage = () => storage;
