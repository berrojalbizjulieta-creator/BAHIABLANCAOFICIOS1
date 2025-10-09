import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";

// Configuración de tu proyecto
const firebaseConfig = {
  apiKey: "AIzaSyAx9ZN9RvrruSNxc7CE-Xqo7AARhpNKmrk",
  authDomain: "studio-4820039016-5ae38.firebaseapp.com",
  projectId: "studio-4820039016-5ae38",
  storageBucket: "studio-4820039016-5ae38.appspot.com",
  messagingSenderId: "821979814317",
  appId: "1:821979814317:web:abd23395565fe4e58f6924"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function testFirestore() {
  const docRef = doc(db, "pruebaTemporal", "docTemporal");

  // Crear documento
  await setDoc(docRef, { mensaje: "Prueba temporal" });
  console.log("Documento creado correctamente");

  // Leer documento
  const snapshot = await getDoc(docRef);
  console.log("Documento leído:", snapshot.data());

  // Eliminar documento
  await deleteDoc(docRef);
  console.log("Documento eliminado correctamente");
}

testFirestore().catch(console.error);
