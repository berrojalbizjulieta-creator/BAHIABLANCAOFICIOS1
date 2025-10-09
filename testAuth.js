// testAuth.js
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

// Configuración de tu clon
const firebaseConfig = {
  apiKey: "AIzaSyAx9ZN9RvrruSNxc7CE-Xqo7AARhpNKmrk",
  authDomain: "studio-4820039016-5ae38.firebaseapp.com",
  databaseURL: "https://studio-4820039016-5ae38-default-rtdb.firebaseio.com",
  projectId: "studio-4820039016-5ae38",
  storageBucket: "studio-4820039016-5ae38.firebasestorage.app",
  messagingSenderId: "821979814317",
  appId: "1:821979814317:web:abd23395565fe4e58f6924"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Credenciales de prueba (las que diste)
const testEmail = "PABLOGIMENEZ@GMAIL.COM";
const testPassword = "CONTRASELA123456";

async function testFirestore() {
  try {
    // Loguearse
    const userCredential = await signInWithEmailAndPassword(auth, testEmail, testPassword);
    console.log("Usuario logueado:", userCredential.user.uid);

    const docRef = doc(db, "pruebaTemporal", "docTemporal");

    // Crear documento temporal
    await setDoc(docRef, { mensaje: "Prueba temporal" });
    console.log("Documento creado correctamente");

    // Leer documento
    const snapshot = await getDoc(docRef);
    console.log("Documento leído:", snapshot.data());

    // Eliminar documento
    await deleteDoc(docRef);
    console.log("Documento eliminado correctamente");
  } catch (error) {
    console.error("Error:", error);
  }
}

testFirestore();

