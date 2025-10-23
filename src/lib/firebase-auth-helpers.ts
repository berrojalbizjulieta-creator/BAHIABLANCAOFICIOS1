// src/lib/firebase-auth-helpers.ts
import { getAuth, onAuthStateChanged, type Auth } from 'firebase/auth';
import { getStorage, type FirebaseStorage } from 'firebase/storage';
import { app } from './firebase'; // Importa la app ya inicializada

/**
 * Asegura que el estado de autenticación de Firebase se resuelva antes de
 * devolver una instancia de Storage. Esto previene condiciones de carrera
 * donde se intenta una operación de Storage antes de que el SDK reconozca
 * al usuario logueado.
 * 
 * @returns Una promesa que resuelve con la instancia de Firebase Storage.
 */
export function getAuthenticatedStorageInstance(): Promise<FirebaseStorage> {
  return new Promise((resolve, reject) => {
    const auth: Auth = getAuth(app);
    const storage: FirebaseStorage = getStorage(app);

    // Si ya hay un usuario, resuelve inmediatamente.
    if (auth.currentUser) {
      resolve(storage);
      return;
    }

    // Si no, espera al primer cambio de estado de autenticación.
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe(); // Nos desuscribimos para no seguir escuchando.
      if (user) {
        resolve(storage);
      } else {
        // Si no hay usuario después de la espera, la operación no debería estar permitida.
        reject(new Error('Usuario no autenticado. La operación fue denegada.'));
      }
    });
  });
}
