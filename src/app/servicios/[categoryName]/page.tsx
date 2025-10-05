'use client';

import { useParams } from 'next/navigation';
import { CATEGORIES } from '@/lib/data';
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
import type { Professional, Schedule } from '@/lib/types';
import { db } from '@/lib/firebase';
import { getProfessionalsFilteredAndSorted } from '@/lib/firestore-queries'; // Importar la nueva función

const PAGE_SIZE = 12;

type SortType = 'default' | 'rating' | 'price' | 'availability';

const isAvailableNow = (schedule?: Schedule[]): boolean => {
    if (!schedule) return false;

    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 (Sun) to 6 (Sat)
    const dayMapping = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
    const currentDayStr = dayMapping[dayOfWeek];
    
    const todaySchedule = schedule.find(s => s.day === currentDayStr);
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
}


export default function CategoryPage() {
  const params = useParams();
  const categoryName = decodeURIComponent(params.categoryName as string)
    .replace(/-/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase()) // Capitalize words
    .replace('Y', 'y');
  
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortType>('default');
  const [error, setError] = useState<string | null>(null);

  const category = useMemo(() => CATEGORIES.find(
    (c) => c.name.toLowerCase() === categoryName.toLowerCase()
  ), [categoryName]);

  useEffect(() => {
    const fetchProfessionals = async () => {
      if (!category) {
        setError('Categoría no encontrada.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Usamos la nueva función centralizada
        const fetchedProfessionals = await getProfessionalsFilteredAndSorted(db, [category.id], false);
        
        // El mapeo para convertir Timestamps a Dates sigue siendo importante
        const processedProfessionals = fetchedProfessionals.map(prof => {
            const data = prof as any; // Usar 'any' temporalmente para acceder a propiedades sin tipo
            if (data.registrationDate && data.registrationDate.toDate) {
                data.registrationDate = data.registrationDate.toDate();
            }
            if (data.lastPaymentDate && data.lastPaymentDate.toDate) {
                data.lastPaymentDate = data.lastPaymentDate.toDate();
            }
            return data as Professional;
        });

        setProfessionals(processedProfessionals);

      } catch (err: any) {
        console.error("Error al obtener profesionales:", err);
        setError('No se pudieron cargar los profesionales. Por favor, inténtalo de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    if (categoryName) {
      fetchProfessionals();
    }
  }, [categoryName, category]);


  const sortedProfessionals = useMemo(() => {
    let sorted = [...professionals];
    switch (sortBy) {
        case 'rating':
            sorted.sort((a,b) => b.avgRating - a.avgRating);
            break;
        case 'price':
            sorted.sort((a,b) => {
                const priceA = a.priceInfo ? parseFloat(a.priceInfo.replace(/[^0-9.-]+/g,"")) : Infinity;
                const priceB = b.priceInfo ? parseFloat(b.priceInfo.replace(/[^0-9.-]+/g,"")) : Infinity;
                return priceA - priceB;
            });
            break;
        case 'availability':
             sorted.sort((a, b) => {
                const aIsAvailable = isAvailableNow(a.schedule);
                const bIsAvailable = isAvailableNow(b.schedule);
                if (aIsAvailable && !bIsAvailable) return -1;
                if (!aIsAvailable && bIsAvailable) return 1;
                // As a secondary sort, rank by rating
                return b.avgRating - a.avgRating;
            });
            break;
        default:
             // Default sort is by rating
             sorted.sort((a,b) => b.avgRating - a.avgRating);
            break;
    }
    return sorted;
  }, [professionals, sortBy]);

  // Pagination logic
  const totalPages = Math.ceil(sortedProfessionals.length / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const currentProfessionals = sortedProfessionals.slice(startIndex, endIndex);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo(0, 0); // Scroll to top on page change
  };


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
              <DropdownMenuItem onSelect={() => setSortBy('rating')}>Mejor Rankeados</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setSortBy('price')}>Más Baratos</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setSortBy('availability')}>Disponibilidad</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
      
       {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="mr-2 h-8 w-8 animate-spin" />
            <span>Cargando profesionales...</span>
          </div>
       ) : error ? (
          <div className="flex items-center justify-center h-64 text-red-500">
             <p>{error}</p>
          </div>
       ) : currentProfessionals.length > 0 ? (
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
                Aún no hay profesionales en &quot;{category?.name}&quot;.
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
