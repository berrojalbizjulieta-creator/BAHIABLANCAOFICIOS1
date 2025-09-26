

'use client';

import { useParams } from 'next/navigation';
import { CATEGORIES, PROFESSIONALS } from '@/lib/data';
import ProfessionalCard from '@/components/professionals/professional-card';
import { Button } from '@/components/ui/button';
import { ListFilter, Loader2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useEffect, useState, useMemo } from 'react';
import type { Professional } from '@/lib/types';

const PAGE_SIZE = 12;

export default function CategoryPage() {
  const params = useParams();
  const categoryName = decodeURIComponent(params.categoryName as string)
    .replace(/-/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase()) // Capitalize words
    .replace('Y', 'y');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const category = useMemo(() => CATEGORIES.find(
    (c) => c.name.toLowerCase() === categoryName.toLowerCase()
  ), [categoryName]);

  const allProfessionalsInCategory = useMemo(() => {
      if (!category) return [];
      return PROFESSIONALS.filter(p => p.categoryIds.includes(category.id));
  }, [category]);
  
   useEffect(() => {
    // Reset to first page when category changes
    setCurrentPage(1);
    setLoading(false);
  }, [allProfessionalsInCategory]);

  // Pagination logic
  const totalPages = Math.ceil(allProfessionalsInCategory.length / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const currentProfessionals = allProfessionalsInCategory.slice(startIndex, endIndex);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo(0, 0); // Scroll to top on page change
  };


  if (loading && !category) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold">Cargando categoría...</h1>
        <Loader2 className="mx-auto mt-4 h-8 w-8 animate-spin" />
      </div>
    );
  }

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
      
       {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="mr-2 h-8 w-8 animate-spin" />
            <span>Cargando profesionales...</span>
          </div>
       ) : currentProfessionals.length > 0 ? (
        <div className="space-y-6">
          {currentProfessionals.map((professional) => (
            <ProfessionalCard
              key={professional.id}
              professional={professional}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg text-center p-4">
            <p className="text-lg font-medium text-muted-foreground">
                Aún no hay profesionales en &quot;{category.name}&quot;.
            </p>
            <p className="text-sm text-muted-foreground mt-2">¡Sé el primero en registrarte en esta categoría!</p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-12 flex justify-center items-center gap-4">
          <Button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            variant="outline"
          >
            Anterior
          </Button>
          <span className="text-sm text-muted-foreground">
            Página {currentPage} de {totalPages}
          </span>
          <Button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            variant="outline"
          >
            Siguiente
          </Button>
        </div>
      )}

    </div>
  );
}
