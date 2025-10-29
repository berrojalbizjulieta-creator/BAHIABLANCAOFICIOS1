
import { NextResponse } from 'next/server';
import { doc, setDoc, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { format } from 'date-fns';

export async function POST(request: Request) {
  // This endpoint is designed to be "fire-and-forget" from the client.
  // We don't block the client and handle everything server-side.
  
  try {
    const now = new Date();
    const dayKey = `daily_${format(now, 'yyyy-MM-dd')}`;
    const monthKey = `monthly_${format(now, 'yyyy-MM')}`;

    const analyticsRef = doc(db, 'analytics', 'pageViews');

    // We use setDoc with merge:true and increment to atomically update counters.
    // This is highly efficient for Firestore as it avoids read-modify-write cycles
    // and creates the document with the fields if it doesn't exist.
    await setDoc(analyticsRef, {
        [dayKey]: increment(1),
        [monthKey]: increment(1),
        totalViews: increment(1)
    }, { merge: true });

    // Respond quickly to the client.
    return NextResponse.json({ success: true }, { status: 202 });

  } catch (error) {
    console.error("Error tracking page view:", error);
    // Even if it fails, we don't want to cause client-side issues.
    // We just log the error and respond.
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
