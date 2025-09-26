
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CATEGORIES } from '@/lib/data';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { placeholderImages } from '@/lib/placeholder-images';

const maintenanceCategories = [
  'Plomería',
  'Electricista',
  'Gasista',
  'Cerrajería',
  'Aire Acondicionado',
  'Vidriería',
  'Reparaciones',
  'Limpieza',
];

const improvementCategories = [
  'Albañilería',
  'Pintores',
  'Carpintería',
  'Herrería',
  'Jardinería',
];

const getCategoryByName = (name: string) => CATEGORIES.find(c => c.name === name);
const essentialServicesImage = placeholderImages.find(p => p.id === 'essential-services-house');

const renderCategoryCard = (categoryName: string) => {
  const category = getCategoryByName(categoryName);
  if (!category) return null;

  return (
    <Link
      key={category.id}
      href={`/servicios/${encodeURIComponent(
        category.name.toLowerCase().replace(/ y /g, '-').replace(/ /g, '-')
      )}`}
      className="group relative block"
    >
      <Card className="overflow-hidden shadow-lg transition-all duration-300 group-hover:shadow-xl">
        <div className="relative aspect-[4/3] w-full">
          <Image
            src={category.imageUrl || 'https://picsum.photos/seed/placeholder/400/300'}
            alt={category.description}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            data-ai-hint={category.imageHint}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
        </div>
        <div className="absolute bottom-0 left-0 p-4 text-white">
          <p className="text-sm mt-1 opacity-90">{category.description}</p>
          <p className="text-xs mt-2 font-semibold opacity-80 group-hover:opacity-100 group-hover:underline">
            Encontralo en {category.name}
          </p>
        </div>
      </Card>
    </Link>
  );
};

export default function EssentialServicesPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:px-6">
      <div className="text-center mb-16 max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline">
              Servicios esenciales para el hogar.
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Ya sea que tengas tu propia casa o estés alquilando, siempre aparece alguna urgencia. ¿Se te llueve el techo? ¿Saltó la térmica? ¿La calefaccion no arranca? Quedate tranquilo, estás en el lugar justo. Acá encontrás al profesional que necesitás para cualquier arreglo del hogar.
          </p>
          <div className="mt-8">
              <Button asChild size="lg">
              <Link href="/servicios">Contrata un profesional</Link>
              </Button>
          </div>
      </div>

      <div className="space-y-16">
        <section>
          <h2 className="text-2xl font-bold font-headline mb-6">Mantenimiento y Reparaciones del Hogar</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {maintenanceCategories.map(renderCategoryCard)}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold font-headline mb-6">Mejoras y Proyectos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {improvementCategories.map(renderCategoryCard)}
          </div>
        </section>
      </div>
    </div>
  );
}
