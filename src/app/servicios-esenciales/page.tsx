
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CATEGORIES, essentialCategories } from '@/lib/data';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

const maintenanceCategories = [
  'Plomería',
  'Electricista',
  'Gasista Matriculado',
  'Cerrajería',
  'Reparaciones',
  'Vidriería',
  'Aire Acondicionado',
  'Control de Plagas',
];

const improvementCategories = [
  'Albañilería',
  'Pintores',
  'Carpintería',
  'Herrería',
  'Jardinería',
];

// Usamos el array `essentialCategories` que ya tiene los subtítulos
const getCategoryData = (name: string) => essentialCategories.find(c => c.name === name) || CATEGORIES.find(c => c.name === name);

const CategoryCard = ({ category }: { category: (typeof CATEGORIES)[0] & { subtitle?: string } }) => {
    if (!category) return null;
    return (
        <Link 
            href={`/servicios/${encodeURIComponent(category.name.toLowerCase().replace(/ y /g, '-').replace(/ /g, '-'))}`} 
            className="group"
        >
            <Card className="relative overflow-hidden shadow-lg transition-all duration-300 group-hover:shadow-xl">
                <div className="relative aspect-[4/3] w-full">
                    <Image
                        src={category.imageUrl!}
                        alt={category.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        data-ai-hint={category.imageHint}
                    />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>
                <div className="absolute bottom-0 left-0 p-4 text-white">
                     {category.subtitle && <p className="text-sm font-medium opacity-90">{category.subtitle}</p>}
                     <h3 className="text-lg font-bold font-headline">{category.name}</h3>
                </div>
            </Card>
        </Link>
    )
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {maintenanceCategories.map((name) => {
                const category = getCategoryData(name);
                return category ? <CategoryCard key={category.id} category={category} /> : null;
            })}
          </div>
        </section>
        
        <section>
          <h2 className="text-2xl font-bold font-headline mb-6">Mejoras para tu casa</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {improvementCategories.map((name) => {
                const category = getCategoryData(name);
                return category ? <CategoryCard key={category.id} category={category} /> : null;
            })}
          </div>
        </section>

      </div>
    </div>
  );
}
