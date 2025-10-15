import { NextResponse } from 'next/server';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { CATEGORIES, CATEGORY_SPECIALTIES } from '@/lib/data';
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
  const queryWords = normalizedQuery.split(' ').filter(w => w.length > 0);

  try {
    // 1. Encontrar categorías que coincidan con la búsqueda a través de sus especialidades
    const matchingCategoryIds = new Set<number>();
    for (const catId in CATEGORY_SPECIALTIES) {
      const categoryData = CATEGORY_SPECIALTIES[Number(catId)];
      const specialtiesText = categoryData.specialties.map(normalizeText).join(' ');
      const categoryNameText = normalizeText(categoryData.name);
      
      const categoryContent = `${categoryNameText} ${specialtiesText}`;

      if (queryWords.every(word => categoryContent.includes(word))) {
        matchingCategoryIds.add(Number(catId));
      }
    }

    // 2. Obtener todos los profesionales
    const professionalsRef = collection(db, 'professionalsDetails');
    const professionalsSnapshot = await getDocs(professionalsRef);
    
    const allProfessionals = professionalsSnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
    } as Professional));

    // 3. Filtrar profesionales
    const results = allProfessionals.filter(prof => {
      // Solo incluir profesionales activos y con suscripción
      if (!prof.isActive || !prof.subscription?.isSubscriptionActive) {
          return false;
      }
        
      // Filtrar por perfil del profesional (nombre, descripción, especialidades propias)
      const name = normalizeText(prof.name);
      const description = normalizeText(prof.description);
      const specialties = prof.specialties?.map(normalizeText).join(' ') || '';
      const professionalProfileText = `${name} ${description} ${specialties}`;

      // Búsqueda mejorada: todas las palabras de la consulta deben estar presentes
      if (queryWords.every(word => professionalProfileText.includes(word))) {
        return true;
      }
      
      // Filtrar si el profesional pertenece a una de las categorías que coinciden con la búsqueda
      if (prof.categoryIds.some(id => matchingCategoryIds.has(id))) {
          return true;
      }

      return false;
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
