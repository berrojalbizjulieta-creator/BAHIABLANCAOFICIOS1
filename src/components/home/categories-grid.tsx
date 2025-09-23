'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CATEGORIES } from '@/lib/data';
import Link from 'next/link';
import { Button } from '../ui/button';
import { ArrowRight } from 'lucide-react';

// Categorías a mostrar en la página de inicio
const popularCategoryNames = [
  'Plomería',
  'Gasista',
  'Electricidad',
  'Pintura',
  'Limpieza y Mantenimiento',
  'Albañilería',
  'Fletes y Transportes Pequeños',
  'Jardinería y Paisajismo',
  'Aire Acondicionado y Calefacción',
];

const popularCategories = CATEGORIES.filter(c => popularCategoryNames.includes(c.name));

export default function CategoriesGrid() {
  return (
    <section id="services" className="py-12 md:py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">
            Nuestros Servicios Más Populares
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-muted-foreground md:text-lg">
            Encuentra al profesional ideal para cada tipo de trabajo.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {popularCategories.map((category) => (
             <Link
              key={category.id}
              href={`/servicios/${encodeURIComponent(category.name.toLowerCase().replace(/ y /g, '-').replace(/ /g, '-'))}`}
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer group"
            >
              <Card
                className="h-full hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <CardHeader className="items-center text-center">
                  <div className="bg-primary/10 p-4 rounded-full mb-3 group-hover:bg-accent/20 transition-colors">
                    <category.icon className="h-8 w-8 text-primary group-hover:text-accent-foreground" />
                  </div>
                  <CardTitle className="font-headline text-lg">
                    {category.name}
                  </CardTitle>
                </CardHeader>
              </Card>
            </Link>
          ))}
           <Link
              href="/servicios"
              className="cursor-pointer group"
            >
              <Card
                className="h-full hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center bg-muted/50 hover:bg-muted"
              >
                <CardHeader className="items-center text-center">
                   <div className="bg-primary/10 p-4 rounded-full mb-3 group-hover:bg-accent/20 transition-colors">
                    <ArrowRight className="h-8 w-8 text-primary group-hover:text-accent-foreground" />
                  </div>
                  <CardTitle className="font-headline text-lg">
                    Ver Más
                  </CardTitle>
                </CardHeader>
              </Card>
            </Link>
        </div>
      </div>
    </section>
  );
}
