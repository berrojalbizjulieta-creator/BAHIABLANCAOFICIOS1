
import { NextResponse } from 'next/server';
import { doc, setDoc, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { format } from 'date-fns';

export async function POST(request: Request) {
  try {
    const now = new Date();
    // CORRECCIÓN: Se crea una referencia a un documento dentro de una colección.
    // La ruta es par: coleccion/documento.
    const dayDocRef = doc(db, 'analytics/daily', format(now, 'yyyy-MM-dd'));
    const monthDocRef = doc(db, 'analytics/monthly', format(now, 'yyyy-MM'));

    // Se usan operaciones atómicas para incrementar los contadores.
    // Esto es seguro y eficiente.
    await Promise.all([
        setDoc(dayDocRef, { count: increment(1) }, { merge: true }),
        setDoc(monthDocRef, { count: increment(1) }, { merge: true })
    ]);

    // Respondemos rápidamente al cliente.
    return NextResponse.json({ success: true }, { status: 202 });

  } catch (error: any) {
    console.error("Error tracking page view:", error);
    // Devolvemos un error claro si algo falla.
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
