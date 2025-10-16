

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
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from "embla-carousel-autoplay"

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
    const fetchProfessionals = async () => {
      setLoading(true);
      try {
        const allActiveProfessionals = await getAllActiveProfessionals(db);
        setAllProfessionals(allActiveProfessionals);
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
  }, [toast]);

  // 1. Filtrar los profesionales que pertenecen a la categoría actual
  const professionalsInCategory = useMemo(() => {
      if (!category) return [];
      return allProfessionals.filter(p => p.categoryIds.includes(category.id));
  }, [allProfessionals, category]);

  // 2. Separar destacados de regulares
  const featuredProfessionals = useMemo(() => {
      return professionalsInCategory.filter(p => p.isFeatured);
  }, [professionalsInCategory]);

  const regularProfessionals = useMemo(() => {
      return professionalsInCategory.filter(p => !p.isFeatured);
  }, [professionalsInCategory]);
  

  const sortedRegularProfessionals = useMemo(() => {
    let sorted = [...regularProfessionals];
    switch (sortBy) {
      case 'rating':
        sorted.sort((a, b) => (b.avgRating || 0) - (a.avgRating || 0));
        break;
      case 'verified':
        sorted.sort((a, b) => {
            if (a.isVerified && !b.isVerified) return -1;
            if (!a.isVerified && b.isVerified) return 1;
            return (b.avgRating || 0) - (a.avgRating || 0);
        });
        break;
      case 'availability':
        sorted.sort((a, b) => {
          const aIsAvailable = isAvailableNow(a.schedule);
          const bIsAvailable = isAvailableNow(b.schedule);
          if (aIsAvailable && !bIsAvailable) return -1;
          if (!aIsAvailable && bIsAvailable) return 1;
          return (b.avgRating || 0) - (a.avgRating || 0);
        });
        break;
      default:
        sorted.sort((a, b) => (b.avgRating || 0) - (a.avgRating || 0));
        break;
    }
    return sorted;
  }, [regularProfessionals, sortBy]);

  const totalPages = Math.ceil(sortedRegularProfessionals.length / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const currentRegularProfessionals = sortedRegularProfessionals.slice(startIndex, endIndex);

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
          {featuredProfessionals.length > 0 && (
            <section className="mb-12">
              <h2 className="text-xl font-bold font-headline mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary"/>
                Profesionales Recomendados
              </h2>
               <Carousel 
                  opts={{ align: "start", loop: true }}
                  plugins={[Autoplay({ delay: 5000, stopOnInteraction: false })]}
                  className="w-full"
                >
                  <CarouselContent>
                      {featuredProfessionals.map((prof) => (
                          <CarouselItem key={prof.id}>
                              <ProfessionalCard professional={prof} isFeatured={true} />
                          </CarouselItem>
                      ))}
                  </CarouselContent>
              </Carousel>
            </section>
          )}

          {currentRegularProfessionals.length > 0 ? (
            <div className="space-y-6">
              {currentRegularProfessionals.map((professional) => (
                <ProfessionalCard
                  key={professional.id as string}
                  professional={professional}
                />
              ))}
            </div>
          ) : (
             (professionalsInCategory.length === 0) && (
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
