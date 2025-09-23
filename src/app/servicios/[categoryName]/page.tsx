'use client';

import { useParams } from 'next/navigation';
import { CATEGORIES, PROFESSIONALS } from '@/lib/data';
import ProfessionalCard from '@/components/professionals/professional-card';
import { Button } from '@/components/ui/button';
import { ListFilter } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function CategoryPage() {
  const params = useParams();
  const categoryName = decodeURIComponent(params.categoryName as string)
    .replace(/-/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase()) // Capitalize words
    .replace('Y', 'y');


  const category = CATEGORIES.find(
    (c) => c.name.toLowerCase() === categoryName.toLowerCase()
  );

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold">Categoría no encontrada</h1>
        <p className="text-muted-foreground mt-2">
          No pudimos encontrar la categoría de servicio que estás buscando.
        </p>
      </div>
    );
  }

  const filteredProfessionals = PROFESSIONALS.filter(
    (p) => p.categoryId === category.id && p.isSubscriptionActive
  );

  return (
    <div className="container mx-auto px-4 py-12 md:px-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div className="flex items-center gap-3 mb-4 sm:mb-0">
          <div className="bg-primary/10 p-3 rounded-full">
            <category.icon className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">
            {category.name}
          </h1>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <ListFilter className="mr-2" />
              Ordenar por
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Mejor Rankeados</DropdownMenuItem>
            <DropdownMenuItem>Más Baratos</DropdownMenuItem>
            <DropdownMenuItem>Disponibilidad</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
       {filteredProfessionals.length > 0 ? (
        <div className="space-y-6">
          {filteredProfessionals.map((professional) => (
            <ProfessionalCard
              key={professional.id}
              professional={professional}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg text-center">
          <p className="text-lg font-medium text-muted-foreground">
            No hay profesionales disponibles en esta categoría por el
            momento.
          </p>
           <p className="text-sm text-muted-foreground mt-2">Vuelve a intentarlo más tarde o explora otras categorías.</p>
        </div>
      )}

    </div>
  );
}
