import { NextResponse } from 'next/server';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { CATEGORIES } from '@/lib/data';
import type { Professional } from '@/lib/types';

// Función para normalizar texto (quitar acentos y a minúsculas)
const normalizeText = (text: string | null | undefined): string => {
    return (text || '')
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  if (!q) {
    return NextResponse.json([]);
  }

  const normalizedQuery = normalizeText(q);

  try {
    const professionalsRef = collection(db, 'professionalsDetails');
    const qSnapshot = query(professionalsRef, 
        where('isActive', '==', true),
        where('subscription.isSubscriptionActive', '==', true)
    );
    
    const professionalsSnapshot = await getDocs(qSnapshot);
    
    const allProfessionals = professionalsSnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
    } as Professional));

    const results = allProfessionals.filter(prof => {
      const professionalCategories = CATEGORIES.filter(c => prof.categoryIds?.includes(c.id));

      const name = normalizeText(prof.name);
      const description = normalizeText(prof.description);
      const specialties = prof.specialties?.map(normalizeText).join(' ') || '';
      const categoryNames = professionalCategories.map(c => normalizeText(c.name)).join(' ');

      const searchableText = `${name} ${description} ${specialties} ${categoryNames}`;
      
      return searchableText.includes(normalizedQuery);
    });
    
    if (results.length === 0) {
      return NextResponse.json([]);
    }
    
    // Devolvemos solo los datos necesarios para la UI de resultados
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
