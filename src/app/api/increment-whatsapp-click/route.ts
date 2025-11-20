import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, updateDoc, increment } from "firebase/firestore";

export async function POST(req: Request) {
  try {
    const { professionalId } = await req.json();

    if (!professionalId) {
      return NextResponse.json({ ok: false, error: "professionalId is required" }, { status: 400 });
    }

    const ref = doc(db, "professionalsDetails", professionalId);
    await updateDoc(ref, {
      whatsappClicks: increment(1)
    });

    return NextResponse.json({ ok: true });

  } catch (error) {
    console.error("Error incrementing WhatsApp click:", error);
    // Devolvemos un error genérico para no exponer detalles de la implementación.
    return NextResponse.json({ ok: false, error: "Failed to increment click count." }, { status: 500 });
  }
}
