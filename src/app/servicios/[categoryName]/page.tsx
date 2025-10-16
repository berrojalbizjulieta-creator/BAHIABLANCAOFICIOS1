
'use client';

import { useParams } from 'next/navigation';
import { CATEGORIES } from '@/lib/data';
import ProfessionalCard from '@/components/professionals/professional-card';
import { Button } from '@/components/ui/button';
import { ListFilter, Loader2, Sparkles } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useMemo, useState, useEffect } from 'react';
import type { Professional, Schedule } from '@/lib/types';
import { getAllActiveProfessionals } from '@/lib/firestore-queries';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

const PAGE_SIZE = 12;

type SortType = 'rating' | 'verified' | 'availability';

const isAvailableNow = (schedule?: Schedule[]): boolean => {
  if (!schedule) return false;

  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 (Sun) to 6 (Sat)
  const dayMapping = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
  const currentDayStr = dayMapping[dayOfWeek];

  const todaySchedule = schedule.find((s) => s.day === currentDayStr);
  if (!todaySchedule || !todaySchedule.enabled) {
    return false;
  }

  const [openHour, openMinute] = todaySchedule.open.split(':').map(Number);
  const [closeHour, closeMinute] = todaySchedule.close.split(':').map(Number);

  const openTime = new Date(now);
  openTime.setHours(openHour, openMinute, 0, 0);

  const closeTime = new Date(now);
  closeTime.setHours(closeHour, closeMinute, 0, 0);

  return now >= openTime && now <= closeTime;
};

export default function CategoryPage() {
  const params = useParams();
  const categoryName = decodeURIComponent(params.categoryName as string)
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (l) => l.toUpperCase()) // Capitalize words
    .replace('Y', 'y');

  const [allProfessionals, setAllProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<SortType>('rating');
  const { toast } = useToast();

  const category = useMemo(
    () => CATEGORIES.find((c) => c.name.toLowerCase() === categoryName.toLowerCase()),
    [categoryName]
  );
  
  useEffect(() => {
    if (!category) {
      setLoading(false);
      return;
    }

    const fetchProfessionals = async () => {
      setLoading(true);
      try {
        const allActiveProfessionals = await getAllActiveProfessionals(db);

        const professionalsInCategory = allActiveProfessionals.filter(p => 
            p.categoryIds.includes(category.id)
        );
        
        setAllProfessionals(professionalsInCategory);
        
      } catch (error) {
        console.error('Error fetching professionals:', error);
        toast({
          title: 'Error',
          description: 'No se pudieron cargar los profesionales.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfessionals();
  }, [category, toast]);

  const sortedProfessionals = useMemo(() => {
    // 1. Separar destacados de regulares
    const featured = allProfessionals.filter(p => p.isFeatured);
    const regular = allProfessionals.filter(p => !p.isFeatured);

    // 2. Ordenar destacados por rating (siempre)
    featured.sort((a, b) => (b.avgRating || 0) - (a.avgRating || 0));

    // 3. Ordenar regulares según el filtro seleccionado
    let sortedRegular = [...regular];
    switch (sortBy) {
      case 'rating':
        sortedRegular.sort((a, b) => (b.avgRating || 0) - (a.avgRating || 0));
        break;
      case 'verified':
        // Muestra verificados primero, luego no verificados. Dentro de cada grupo, ordena por rating.
        sortedRegular.sort((a, b) => {
            if (a.isVerified && !b.isVerified) return -1;
            if (!a.isVerified && b.isVerified) return 1;
            return (b.avgRating || 0) - (a.avgRating || 0);
        });
        break;
      case 'availability':
        sortedRegular.sort((a, b) => {
          const aIsAvailable = isAvailableNow(a.schedule);
          const bIsAvailable = isAvailableNow(b.schedule);
          if (aIsAvailable && !bIsAvailable) return -1;
          if (!aIsAvailable && bIsAvailable) return 1;
          if (aIsAvailable && bIsAvailable) return (b.avgRating || 0) - (a.avgRating || 0);
          return 0;
        });
        break;
      default:
        sortedRegular.sort((a, b) => (b.avgRating || 0) - (a.avgRating || 0));
        break;
    }
    // 4. Unir las listas, con los destacados siempre al principio
    return [...featured, ...sortedRegular];
  }, [allProfessionals, sortBy]);

  const totalPages = Math.ceil(sortedProfessionals.length / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const currentProfessionals = sortedProfessionals.slice(startIndex, endIndex);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo(0, 0);
  };
  
  const handleSortChange = (sortValue: SortType) => {
    setSortBy(sortValue);
    setCurrentPage(1);
  }

  if (!category && !loading) {
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
      {category && (
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
              <DropdownMenuItem onSelect={() => handleSortChange('rating')}>Mejor Rankeados</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => handleSortChange('verified')}>Solo Verificados</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => handleSortChange('availability')}>Disponibles Ahora</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin h-8 w-8 text-primary" />
        </div>
      ) : (
        <>
          {currentProfessionals.length > 0 ? (
            <div className="space-y-6">
              {currentProfessionals.map((professional) => (
                <ProfessionalCard
                  key={professional.id as string}
                  professional={professional}
                  isFeatured={professional.isFeatured}
                />
              ))}
            </div>
          ) : (
             (allProfessionals.length === 0) && (
                 <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg text-center p-4">
                    <p className="text-lg font-medium text-muted-foreground">
                        {`Aún no hay profesionales en "${category?.name}".`}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                        ¡Sé el primero en registrarte en esta categoría!
                    </p>
                </div>
             )
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
        </>
      )}
    </div>
  );
}
