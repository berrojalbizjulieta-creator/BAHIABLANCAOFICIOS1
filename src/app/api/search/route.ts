import { NextResponse } from 'next/server';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { CATEGORIES } from '@/lib/data';
import type { Professional } from '@/lib/types';

// Función para normalizar texto (quitar acentos y a minúsculas)
const normalizeText = (text: string = ''): string => {
    return text
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

  // Normalizar y dividir la consulta de búsqueda en palabras clave
  const searchKeywords = normalizeText(q).split(' ').filter(k => k.length > 2);

  if (searchKeywords.length === 0) {
      return NextResponse.json([]);
  }

  try {
    // Solo traemos profesionales activos y con suscripción activa desde Firestore
    const professionalsRef = collection(db, 'professionalsDetails');
    const q = query(professionalsRef, 
        where('isActive', '==', true), 
        where('subscription.isSubscriptionActive', '==', true)
    );
    
    const professionalsSnapshot = await getDocs(q);
    
    const allProfessionals = professionalsSnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
    } as Professional));

    const scoredResults: (Professional & { score: number })[] = [];

    allProfessionals.forEach(prof => {
      let score = 0;
      const professionalCategories = CATEGORIES.filter(c => prof.categoryIds?.includes(c.id));

      const profName = normalizeText(prof.name);
      const profDescription = normalizeText(prof.description);
      const profSpecialties = prof.specialties?.map(normalizeText) || [];
      const profCategoryNames = professionalCategories.map(c => normalizeText(c.name));

      searchKeywords.forEach(keyword => {
        // Puntuación más alta para nombre y categorías
        if (profName.includes(keyword)) score += 10;
        if (profCategoryNames.some(cat => cat.includes(keyword))) score += 8;

        // Puntuación media para especialidades
        if (profSpecialties.some(spec => spec.includes(keyword))) score += 5;
        
        // Puntuación baja para descripción
        if (profDescription.includes(keyword)) score += 1;
      });

      if (score > 0) {
        scoredResults.push({ ...prof, score });
      }
    });

    // Ordenar resultados por puntuación (de mayor a menor)
    const sortedResults = scoredResults.sort((a, b) => b.score - a.score);
    
    if (sortedResults.length === 0) {
      return NextResponse.json([]);
    }
    
    // Devolvemos solo los datos necesarios para la UI de resultados
    return NextResponse.json(sortedResults.map(p => {
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
