
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
import { getProfessionalsForCategoryByFeaturedStatus } from '@/lib/firestore-queries';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

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
  const [featuredProfessionals, setFeaturedProfessionals] = useState<Professional[]>([]);
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
        const [featured, regular] = await Promise.all([
          getProfessionalsForCategoryByFeaturedStatus(db, category.id, true),
          getProfessionalsForCategoryByFeaturedStatus(db, category.id, false)
        ]);
        setFeaturedProfessionals(featured);
        setAllProfessionals(regular);
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
    let sorted = [...allProfessionals];
    switch (sortBy) {
      case 'rating':
        sorted.sort((a, b) => b.avgRating - a.avgRating);
        break;
      case 'verified':
        sorted = sorted.filter(p => p.isVerified);
        // Opcional: ordenar los verificados por rating
        sorted.sort((a, b) => b.avgRating - a.avgRating);
        break;
      case 'availability':
        sorted.sort((a, b) => {
          const aIsAvailable = isAvailableNow(a.schedule);
          const bIsAvailable = isAvailableNow(b.schedule);
          if (aIsAvailable && !bIsAvailable) return -1;
          if (!aIsAvailable && bIsAvailable) return 1;
          // As a secondary sort, use rating for available professionals
          if (aIsAvailable && bIsAvailable) return b.avgRating - a.avgRating;
          return 0; // Keep original order if both are unavailable
        });
        break;
      default:
        // Default sort by rating
        sorted.sort((a, b) => b.avgRating - a.avgRating);
        break;
    }
    return sorted;
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
    setCurrentPage(1); // Reset page to 1 when sort order changes
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
          {featuredProfessionals.length > 0 && (
            <section className="mb-12">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-6 h-6 text-yellow-500" />
                <h2 className="text-2xl font-bold font-headline">Profesionales Recomendados</h2>
              </div>
              <Carousel
                opts={{ align: 'start', loop: featuredProfessionals.length > 1 }}
                className="w-full"
              >
                <CarouselContent className="-ml-4">
                  {featuredProfessionals.map((professional) => (
                    <CarouselItem key={professional.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                      <ProfessionalCard professional={professional} />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="absolute -left-4 top-1/2 -translate-y-1/2 hidden md:inline-flex" />
                <CarouselNext className="absolute -right-4 top-1/2 -translate-y-1/2 hidden md:inline-flex" />
              </Carousel>
              <hr className="my-8"/>
            </section>
          )}

          {currentProfessionals.length > 0 ? (
            <div className="space-y-6">
              {currentProfessionals.map((professional) => (
                <ProfessionalCard
                  key={professional.id as string}
                  professional={professional}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg text-center p-4">
              <p className="text-lg font-medium text-muted-foreground">
                {sortBy === 'verified'
                  ? `No se encontraron profesionales verificados en "${category?.name}".`
                  : `Aún no hay profesionales en "${category?.name}".`
                }
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                ¡Sé el primero en registrarte en esta categoría!
              </p>
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
        </>
      )}
    </div>
  );
}
