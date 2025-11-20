import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, updateDoc, increment } from "firebase/firestore";

export async function POST(req: Request) {
  try {
    const { professionalId } = await req.json();

    if (!professionalId) {
      return NextResponse.json({ error: "Missing professionalId" }, { status: 400 });
    }

    await updateDoc(doc(db, "professionalsDetails", professionalId), {
      whatsappClicks: increment(1),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error incrementing click via fallback:", error);
    return NextResponse.json({ error: true }, { status: 500 });
  }
}
