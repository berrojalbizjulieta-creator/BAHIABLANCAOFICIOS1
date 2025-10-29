
import { NextResponse } from 'next/server';
import { doc, setDoc, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { format } from 'date-fns';

export async function POST(request: Request) {
  // This endpoint is designed to be "fire-and-forget" from the client.
  // We don't block the client and handle everything server-side.
  
  try {
    const now = new Date();
    // Using subcollections for daily and monthly counts for better scalability and to avoid dynamic field key issues.
    const dayDocRef = doc(db, 'analytics/daily', format(now, 'yyyy-MM-dd'));
    const monthDocRef = doc(db, 'analytics/monthly', format(now, 'yyyy-MM'));

    // Atomically increment counts for the day and the month.
    // This is highly efficient and creates the document if it doesn't exist.
    await Promise.all([
        setDoc(dayDocRef, { count: increment(1) }, { merge: true }),
        setDoc(monthDocRef, { count: increment(1) }, { merge: true })
    ]);

    // Respond quickly to the client.
    return NextResponse.json({ success: true }, { status: 202 });

  } catch (error: any) {
    console.error("Error tracking page view:", error);
    // Even if it fails, we don't want to cause client-side issues.
    // We just log the error and respond.
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
