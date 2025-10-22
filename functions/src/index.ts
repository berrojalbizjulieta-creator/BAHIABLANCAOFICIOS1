/* eslint-disable max-len, no-multi-spaces */
// functions/src/index.ts

import * as admin from "firebase-admin";
import { onDocumentWritten, Change, DocumentSnapshot, FirestoreEvent } from "firebase-functions/v2/firestore";
// onCall ya no es necesario para la subida de archivos
// import { onCall } from "firebase-functions/v2/https";
import * as functions from "firebase-functions";
// import { v4 as uuidv4 } from "uuid"; // Ya no se usa para generar tokens


admin.initializeApp();
const db = admin.firestore();
// const storage = admin.storage(); // Ya no es necesario si la subida es desde el cliente

// La función 'uploadFile' se elimina ya que la lógica ahora reside en el cliente.

/**
 * Esta es nuestra "herramienta automática". Se dispara (se activa) cada vez que:
 * 1. Se crea una nueva reseña en la colección 'reviews'.
 * 2. Se actualiza una reseña existente en la colección 'reviews'.
 * 3. Se elimina una reseña de la colección 'reviews'.
 */
export const updateProfessionalAvgRating = onDocumentWritten(
  "reviews/{reviewId}", // <-- ¡Atención! Escucha la colección 'reviews'
  // Ajustamos el tipo de 'event' para que sea EXPLICITAMENTE compatible con Cloud Functions V2
  async (event: FirestoreEvent<Change<DocumentSnapshot> | undefined, { reviewId: string }>) => {
    // En V2, el 'event' tiene una propiedad 'data' que es el 'Change<DocumentSnapshot>' O 'undefined'.

    // Si event.data es undefined, significa que no hay datos del cambio (ej. documento inexistente o eliminado).
    if (!event.data) {
      functions.logger.log("No event.data found in the event object.");
      return null;
    }

    const before = event.data.before; // Estado del documento ANTES del cambio
    const after = event.data.after; // Estado del documento DESPUÉS del cambio

    // Usamos after.data() si existe (documento creado/actualizado),
    // de lo contrario usamos before.data() (documento eliminado).
    const reviewData = after.exists ? after.data() : before.data();

    // Si por alguna razón no hay datos (ej. documento inexistente, error), salimos.
    if (!reviewData) {
      functions.logger.log("No review data found after change or deletion, this should not happen if event.data exists.");
      return null;
    }

    // Aquí obtenemos la ID del profesional y la calificación de la reseña.
    const professionalId = reviewData.professionalId;

    // Verificación de professionalId
    if (!professionalId || typeof professionalId !== "string") {
      functions.logger.error(
        "Review document is missing a valid professionalId:",
        reviewData,
      );
      return null;
    }

    // Recopilar TODAS las reseñas (actuales) para ESTE profesional.
    const reviewsRef = db.collection("reviews");
    const professionalReviewsSnapshot = await reviewsRef
      .where("professionalId", "==", professionalId) // Filtramos por el profesional correcto
      .get(); // Obtenemos todas esas reseñas

    let totalRating = 0;
    let numberOfReviews = 0;

    // Iterar sobre las reseñas para calcular la suma de las puntuaciones y el conteo.
    professionalReviewsSnapshot.forEach((doc) => {
      const currentReview = doc.data();
      if (typeof currentReview.rating === "number") {
        totalRating += currentReview.rating;
        numberOfReviews++;
      }
    });

    // Calcular el promedio (avgRating).
    const avgRating = numberOfReviews > 0 ? totalRating / numberOfReviews : 0;

    // Actualizar el "libro" del profesional en 'professionalsDetails'.
    const professionalRef = db.collection("professionalsDetails").doc(professionalId);
    
    try {
        const professionalDoc = await professionalRef.get();

        const dataToUpdate = {
            avgRating: parseFloat(avgRating.toFixed(2)),
            totalReviews: numberOfReviews,
        };

        if (professionalDoc.exists) {
            // Si el documento existe, lo actualizamos.
            await professionalRef.update(dataToUpdate);
        } else {
            // Si no existe, lo creamos.
            await professionalRef.set(dataToUpdate);
        }

        functions.logger.log(
            `Professional ${professionalId} avgRating/totalReviews updated to ${avgRating.toFixed(2)} with ${numberOfReviews} reviews.`,
        );
    } catch (error) {
        functions.logger.error(
            `Error updating professional ${professionalId} rating:`,
            error,
        );
    }


    return null;
  },
);
