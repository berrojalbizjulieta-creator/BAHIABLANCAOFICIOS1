import { NextResponse } from "next/server";
import { PROFESSIONALS } from '@/lib/data';
import { CATEGORIES } from '@/lib/data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.toLowerCase() || "";

  if (!q) {
    return NextResponse.json([]);
  }

  const results = PROFESSIONALS.filter(
    (p) => {
      // Find all categories for the professional
      const professionalCategories = CATEGORIES.filter(c => p.categoryIds.includes(c.id));
      
      // Check if query matches professional name, any of their category names, or any of their specialties
      return p.name.toLowerCase().includes(q) ||
             professionalCategories.some(c => c.name.toLowerCase().includes(q)) ||
             p.specialties.some(s => s.toLowerCase().includes(q));
    }
  );

  if (results.length === 0) {
    return NextResponse.json([]);
  }

  return NextResponse.json(results.map(p => {
    // For display, we'll just show the first category. The profile page shows all of them.
    const primaryCategory = CATEGORIES.find(c => c.id === p.categoryIds[0]);
    return {
        id: p.id,
        nombre: p.name,
        rubro: primaryCategory?.name || 'Sin categoría',
        photoUrl: p.photoUrl,
        avgRating: p.avgRating
    }
  }));
}
