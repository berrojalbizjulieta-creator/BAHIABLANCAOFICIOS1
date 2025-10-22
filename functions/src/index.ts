
/* eslint-disable max-len, no-multi-spaces */
// functions/src/index.ts

import * as admin from "firebase-admin";
import { onDocumentWritten, Change, DocumentSnapshot, FirestoreEvent } from "firebase-functions/v2/firestore";
import { onCall } from "firebase-functions/v2/https";
import * as functions from "firebase-functions";
import { v4 as uuidv4 } from "uuid"; 


admin.initializeApp();
const db = admin.firestore();
const storage = admin.storage();


export const uploadFile = onCall({ cors: true }, async (request) => {
  if (!request.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "La función debe ser llamada por un usuario autenticado.",
    );
  }

  const file = request.data.file;
  const path = request.data.path;
  const contentType = request.data.contentType;

  if (!file || !path || !contentType) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "La función requiere los argumentos 'file', 'path' y 'contentType'.",
    );
  }

  const fileBuffer = Buffer.from(file, "base64");
  const bucket = storage.bucket();
  const fileUpload = bucket.file(path);

  try {
    await fileUpload.save(fileBuffer, {
      metadata: {
        contentType: contentType,
        // Hacemos el archivo públicamente legible
        cacheControl: 'public, max-age=31536000',
      },
      public: true,
    });
    
    // Devolvemos la URL pública en el formato correcto
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${path}`;

    return { downloadURL: publicUrl, storagePath: path };

  } catch (error) {
    console.error("ERROR AL SUBIR ARCHIVO:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Error al subir el archivo.",
    );
  }
});


/**
 * Esta es nuestra "herramienta automática". Se dispara (se activa) cada vez que:
 * 1. Se crea una nueva reseña en la colección 'reviews'.
 * 2. Se actualiza una reseña existente en la colección 'reviews'.
 * 3. Se elimina una reseña de la colección 'reviews'.
 */
export const updateProfessionalAvgRating = onDocumentWritten(
  "reviews/{reviewId}", // <-- ¡Atención! Escucha la colección 'reviews'
  async (event: FirestoreEvent<Change<DocumentSnapshot> | undefined, { reviewId: string }>) => {
    if (!event.data) {
      functions.logger.log("No event.data found in the event object.");
      return null;
    }

    const before = event.data.before;
    const after = event.data.after;
    const reviewData = after.exists ? after.data() : before.data();

    if (!reviewData) {
      functions.logger.log("No review data found after change or deletion, this should not happen if event.data exists.");
      return null;
    }

    const professionalId = reviewData.professionalId;

    if (!professionalId || typeof professionalId !== "string") {
      functions.logger.error(
        "Review document is missing a valid professionalId:",
        reviewData,
      );
      return null;
    }

    const reviewsRef = db.collection("reviews");
    const professionalReviewsSnapshot = await reviewsRef
      .where("professionalId", "==", professionalId)
      .get();

    let totalRating = 0;
    let numberOfReviews = 0;

    professionalReviewsSnapshot.forEach((doc) => {
      const currentReview = doc.data();
      if (typeof currentReview.rating === "number") {
        totalRating += currentReview.rating;
        numberOfReviews++;
      }
    });

    const avgRating = numberOfReviews > 0 ? totalRating / numberOfReviews : 0;

    const professionalRef = db.collection("professionalsDetails").doc(professionalId);
    
    try {
        const professionalDoc = await professionalRef.get();
        const dataToUpdate = {
            avgRating: parseFloat(avgRating.toFixed(2)),
            totalReviews: numberOfReviews,
        };

        if (professionalDoc.exists) {
            await professionalRef.update(dataToUpdate);
        } else {
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
