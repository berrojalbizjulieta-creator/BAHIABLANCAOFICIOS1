import { NextResponse } from 'next/server';
import { collection, getDocs, query, where, addDoc, serverTimestamp } from 'firebase/firestore';
import { getFirestoreDb } from '@/lib/firebase';
import { CATEGORIES, CATEGORY_SPECIALTIES } from '@/lib/data';
import type { Professional } from '@/lib/types';
import Fuse from 'fuse.js';

export const dynamic = 'force-dynamic';

// Opciones de configuración para Fuse.js para una búsqueda tolerante a errores
const fuseOptions = {
  includeScore: true,
  threshold: 0.4, // Umbral de coincidencia (0.0 es exacto, 1.0 es cualquiera)
  minMatchCharLength: 3,
  keys: [
    { name: 'name', weight: 0.4 },
    { name: 'description', weight: 0.2 },
    { name: 'specialties', weight: 0.4 },
  ],
};

const logFailedSearch = async (term: string) => {
    if (!term || term.trim().length < 3) return;
    try {
        await addDoc(collection(getFirestoreDb(), 'searchAnalytics'), {
            term: term,
            timestamp: serverTimestamp(),
            status: 'failed',
        });
    } catch (error) {
        console.error("Error logging failed search:", error);
    }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');
  const db = getFirestoreDb();

  if (!q) {
    return NextResponse.json([]);
  }

  try {
    // 1. Obtener todos los profesionales activos.
    const professionalsRef = collection(db, 'professionalsDetails');
    const professionalsSnapshot = await getDocs(
      query(professionalsRef, where('isActive', '==', true), where('subscription.isSubscriptionActive', '==', true))
    );
    
    const allProfessionals = professionalsSnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
    } as Professional));

    // 2. Usar Fuse.js para realizar la búsqueda "fuzzy" sobre los profesionales.
    const fuse = new Fuse(allProfessionals, fuseOptions);
    const fuseResults = fuse.search(q);

    // Mapear los resultados para darles una estructura consistente.
    let results = fuseResults.map(result => ({
      ...result.item,
      score: result.score, // Mantener el score para posible ordenación avanzada
    }));

    // 3. Si la búsqueda directa no da resultados, buscar por categoría/especialidad global
    if (results.length === 0) {
        const normalizedQuery = q.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const queryWords = normalizedQuery.split(' ').filter(w => w.length > 0);

        const matchingCategoryIds = new Set<number>();
        for (const catId in CATEGORY_SPECIALTIES) {
            const categoryData = CATEGORY_SPECIALTIES[Number(catId)];
            const categoryContent = `${categoryData.name.toLowerCase()} ${categoryData.specialties.join(' ')}`.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

            if (queryWords.some(word => categoryContent.includes(word))) {
                matchingCategoryIds.add(Number(catId));
            }
        }
        
        if (matchingCategoryIds.size > 0) {
            const categoryResults = allProfessionals.filter(prof => 
                prof.categoryIds.some(id => matchingCategoryIds.has(id))
            );
            // Asignar un score más bajo (mejor) para estos resultados
            results = categoryResults.map(item => ({ ...item, score: 0.5 }));
        }
    }
    
    // 4. Si después de todo no hay resultados, registrar la búsqueda fallida.
    if (results.length === 0) {
      await logFailedSearch(q);
      return NextResponse.json([]);
    }
    
    // Ordenar por score (menor es mejor) y luego por rating
    results.sort((a, b) => {
        if (a.score !== b.score) {
            return (a.score || 1) - (b.score || 1);
        }
        return (b.avgRating || 0) - (a.avgRating || 0);
    });

    // Devolvemos solo los datos necesarios para la UI, tomando los 10 mejores.
    return NextResponse.json(results.slice(0, 10).map(p => {
      const primaryCategory = CATEGORIES.find(c => c.id === p.categoryIds[0]);
      return {
          id: p.id,
          nombre: p.name,
          rubro: primaryCategory?.name || 'Sin categoría',
          photoUrl: p.photoUrl,
          avgRating: p.avgRating || 0,
      }
    }));

  } catch (error) {
    console.error("Error searching professionals:", error);
    return NextResponse.json({ error: "Failed to fetch search results." }, { status: 500 });
  }
}
