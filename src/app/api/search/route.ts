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
      const category = CATEGORIES.find(c => c.id === p.categoryId);
      return p.name.toLowerCase().includes(q) ||
             (category && category.name.toLowerCase().includes(q)) ||
             p.specialties.some(s => s.toLowerCase().includes(q));
    }
  );

  if (results.length === 0) {
    return NextResponse.json([]);
  }

  return NextResponse.json(results.map(p => {
    const category = CATEGORIES.find(c => c.id === p.categoryId);
    return {
        id: p.id,
        nombre: p.name,
        rubro: category?.name || 'Sin categoría',
        photoUrl: p.photoUrl,
        avgRating: p.avgRating
    }
  }));
}