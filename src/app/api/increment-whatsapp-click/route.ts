import { db } from "@/lib/firebase";
import { doc, updateDoc, increment } from "firebase/firestore";

// Esta es la API Route que se ejecuta en el servidor.
// Está diseñada para ser compatible con peticiones "no-cors" desde el navegador.
export async function POST(req: Request) {
  try {
    // Permite POST sin CORS ni cookies de forma segura
    const bodyText = await req.text();           
    const data = JSON.parse(bodyText || "{}");

    // Si no viene el ID del profesional, no hacemos nada pero respondemos que está todo OK
    // para no generar errores en el navegador del cliente.
    if (!data.professionalId) {
      return new Response(null, { status: 204 });
    }

    const ref = doc(db, "professionalsDetails", data.professionalId);

    // Se actualiza el contador en Firestore
    await updateDoc(ref, {
      whatsappClicks: increment(1)
    });

    // Respuesta silenciosa (204 No Content) para evitar errores con "no-cors"
    return new Response(null, { status: 204 });

  } catch (e) {
    // Si algo falla en el servidor, también devolvemos una respuesta silenciosa
    // para no causar errores en el navegador del usuario.
    console.error("Error en API de incremento:", e);
    return new Response(null, { status: 204 });
  }
}
