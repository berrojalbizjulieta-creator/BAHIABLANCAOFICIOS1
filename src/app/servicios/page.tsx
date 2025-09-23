'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CATEGORIES } from '@/lib/data';
import type { Category } from '@/lib/types';
import ProfessionalsModal from '@/components/professionals/professionals-modal';

export default function ServicesPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const handleOpenModal = (category: Category) => {
    setSelectedCategory(category);
  };
  
  const handleCloseModal = () => {
    setSelectedCategory(null);
  };

  return (
    <div className="container mx-auto px-4 py-12 md:px-6">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">
          Todos Nuestros Servicios
        </h1>
        <p className="mt-3 max-w-2xl mx-auto text-muted-foreground md:text-lg">
          Explora la lista completa de oficios y encuentra lo que necesitas.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {CATEGORIES.map((category) => (
          <Card
            key={category.id}
            onClick={() => handleOpenModal(category)}
            className="cursor-pointer group hover:shadow-lg transition-all"
          >
            <CardHeader className="flex flex-row items-center gap-4 space-y-0">
               <div className="bg-primary/10 p-3 rounded-full group-hover:bg-accent/20 transition-colors">
                  <category.icon className="h-6 w-6 text-primary group-hover:text-accent-foreground" />
                </div>
              <CardTitle className="font-headline text-base">
                {category.name}
              </CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>

      <ProfessionalsModal
        category={selectedCategory}
        isOpen={!!selectedCategory}
        onClose={handleCloseModal}
      />
    </div>
  );
}
