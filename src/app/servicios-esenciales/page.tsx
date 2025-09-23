
'use client';

import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { CATEGORIES } from '@/lib/data';
import Link from 'next/link';

// Define las categorías que consideras "esenciales"
const essentialCategoryNames = [
  'Plomería',
  'Electricista',
  'Albañilería',
  'Gasista',
  'Cerrajería',
  'Pintores',
  'Carpintería',
  'Climatización',
  'Herrería',
  'Vidriería',
  'Limpieza',
  'Reparaciones',
];

const essentialCategories = CATEGORIES.filter((category) =>
  essentialCategoryNames.includes(category.name)
);

export default function EssentialServicesPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:px-6">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline">
          Servicios Esenciales para tu Hogar
        </h1>
        <p className="mt-3 max-w-2xl mx-auto text-muted-foreground md:text-lg">
          Todo lo que necesitas para mantener tu casa en perfecto estado. Encuentra profesionales de confianza para cada tarea.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {essentialCategories.map((category) => (
          <Link
            key={category.id}
            href={`/servicios/${encodeURIComponent(
              category.name.toLowerCase().replace(/ y /g, '-').replace(/ /g, '-')
            )}`}
            className="cursor-pointer group"
          >
            <Card className="hover:shadow-lg transition-all h-full">
              <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                <div className="bg-primary/10 p-3 rounded-full group-hover:bg-accent/20 transition-colors">
                  <category.icon className="h-6 w-6 text-primary group-hover:text-accent-foreground" />
                </div>
                <CardTitle className="font-headline text-base">
                  {category.name}
                </CardTitle>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
