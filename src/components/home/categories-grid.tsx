'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CATEGORIES } from '@/lib/data';
import type { Category } from '@/lib/types';
import ProfessionalsModal from '../professionals/professionals-modal';
import Link from 'next/link';

const TOP_CATEGORIES = [
  'Plomería',
  'Fletes y Transportes Pequeños',
  'Electricidad',
  'Pintura',
  'Albañilería',
  'Aire Acondicionado y Calefacción'
];

export default function CategoriesGrid() {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const topCategories = CATEGORIES.filter(c => TOP_CATEGORIES.includes(c.name));

  return (
    <section id="services" className="py-12 md:py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">
            Los servicios más solicitados
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-muted-foreground md:text-lg">
            Encuentra al profesional ideal para cada tipo de trabajo.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {topCategories.map((category) => (
            <Card
              key={category.id}
              onClick={() => setSelectedCategory(category)}
              className="cursor-pointer group hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <CardHeader className="items-center text-center">
                <div className="bg-primary/10 p-4 rounded-full mb-3 group-hover:bg-accent/20 transition-colors">
                  <category.icon className="h-8 w-8 text-primary group-hover:text-accent-foreground" />
                </div>
                <CardTitle className="font-headline text-lg">
                  {category.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center text-sm text-muted-foreground -mt-4 pb-4">
                <p>{category.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
         <div className="mt-6 text-right">
            <Link href="/servicios" className="text-sm font-medium text-primary hover:underline">
                Ver todos
            </Link>
        </div>
      </div>
      <ProfessionalsModal 
        category={selectedCategory}
        isOpen={!!selectedCategory}
        onClose={() => setSelectedCategory(null)}
      />
    </section>
  );
}
