/* eslint-disable max-len, no-multi-spaces */
// functions/src/index.ts

import * as admin from "firebase-admin";
import { onDocumentWritten, Change, DocumentSnapshot, FirestoreEvent } from "firebase-functions/v2/firestore";
import { onCall } from "firebase-functions/v2/https";
import * as functions from "firebase-functions";
import * as Busboy from "busboy";
import { v4 as uuidv4 } from "uuid";


admin.initializeApp();
const db = admin.firestore();
const storage = admin.storage();


export const uploadFile = onCall({ cors: true }, async (request) => {
  if (request.auth?.token.admin !== true) {
    throw new functions.https.HttpsError(
      "permission-denied",
      "Debe ser un administrador para subir archivos."
    );
  }

  const busboy = Busboy({ headers: request.rawRequest.headers });
  const tmpdir = require("os").tmpdir();
  const fs = require("fs");
  const path = require("path");

  const fileWrites: Promise<any>[] = [];
  const fields: { [key: string]: string } = {};
  
  let fileData: { path: string, name: string, type: string } | null = null;

  return new Promise((resolve, reject) => {
    busboy.on("field", (fieldname, val) => {
      fields[fieldname] = val;
    });

    busboy.on("file", (fieldname, file, filename) => {
      const filepath = path.join(tmpdir, filename.filename);
      const writeStream = fs.createWriteStream(filepath);
      file.pipe(writeStream);

      const promise = new Promise((resolve, reject) => {
        file.on("end", () => {
          writeStream.end();
        });
        writeStream.on("finish", () => {
          fileData = { path: filepath, name: filename.filename, type: filename.mimeType };
          resolve(filepath);
        });
        writeStream.on("error", reject);
      });
      fileWrites.push(promise);
    });

    busboy.on("finish", async () => {
      await Promise.all(fileWrites);

      if (!fileData) {
        reject(new functions.https.HttpsError("invalid-argument", "No se encontró ningún archivo."));
        return;
      }
      
      const bucket = storage.bucket();
      const destination = fields.destination || "adBanners";
      const uniqueFilename = `${Date.now()}_${fileData.name}`;
      const storagePath = `${destination}/${uniqueFilename}`;
      
      try {
        const [uploadedFile] = await bucket.upload(fileData.path, {
          destination: storagePath,
          metadata: {
            contentType: fileData.type,
            metadata: {
              firebaseStorageDownloadTokens: uuidv4(),
            },
          },
        });

        const downloadURL = await uploadedFile.getSignedUrl({
            action: 'read',
            expires: '03-09-2491'
        }).then(urls => urls[0]);
        
        fs.unlinkSync(fileData.path);
        
        resolve({ downloadURL, storagePath });

      } catch (error) {
        console.error("Error al subir a Firebase Storage:", error);
        reject(new functions.https.HttpsError("internal", "No se pudo subir el archivo."));
      }
    });

    busboy.end(request.rawRequest.rawBody);
  });
});


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