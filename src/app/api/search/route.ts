
import { NextResponse } from 'next/server';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { CATEGORIES } from '@/lib/data';
import type { Professional } from '@/lib/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.toLowerCase() || '';

  if (!q) {
    return NextResponse.json([]);
  }

  try {
    const professionalsSnapshot = await getDocs(collection(db, 'professionalsDetails'));
    const allProfessionals = professionalsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Professional));

    const activeProfessionals = allProfessionals.filter(p => p.isActive && p.subscription?.isSubscriptionActive);

    const results = activeProfessionals.filter(p => {
      const professionalCategories = CATEGORIES.filter(c => p.categoryIds?.includes(c.id));
      
      const nameMatch = p.name.toLowerCase().includes(q);
      const categoryMatch = professionalCategories.some(c => c.name.toLowerCase().includes(q));
      const specialtyMatch = p.specialties?.some(s => s.toLowerCase().includes(q));

      return nameMatch || categoryMatch || specialtyMatch;
    });

    if (results.length === 0) {
      return NextResponse.json([]);
    }

    return NextResponse.json(results.map(p => {
      const primaryCategory = CATEGORIES.find(c => c.id === p.categoryIds[0]);
      return {
          id: p.id,
          nombre: p.name,
          rubro: primaryCategory?.name || 'Sin categoría',
          photoUrl: p.photoUrl,
          avgRating: p.avgRating
      }
    }));
  } catch (error) {
    console.error("Error searching professionals:", error);
    return NextResponse.json({ error: "Failed to fetch search results." }, { status: 500 });
  }
}
