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
import { useEffect, useState } from 'react';
import type { Professional } from '@/lib/types';
import { db } from '@/lib/firebase';
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getDocs,
  DocumentData,
  QueryDocumentSnapshot,
} from 'firebase/firestore';

const PAGE_SIZE = 5;

export default function CategoryPage() {
  const params = useParams();
  const categoryName = decodeURIComponent(params.categoryName as string)
    .replace(/-/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase()) // Capitalize words
    .replace('Y', 'y');
  
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  const category = CATEGORIES.find(
    (c) => c.name.toLowerCase() === categoryName.toLowerCase()
  );

  const fetchProfessionals = async () => {
    if (!category) return;
    setLoading(true);

    try {
      let q;
      const professionalsRef = collection(db, "professionals");

      if (lastVisible) {
        q = query(
          professionalsRef,
          where('categoryId', '==', category.id),
          where('isSubscriptionActive', '==', true),
          orderBy('name'),
          startAfter(lastVisible),
          limit(PAGE_SIZE)
        );
      } else {
        q = query(
          professionalsRef,
          where('categoryId', '==', category.id),
          where('isSubscriptionActive', '==', true),
          orderBy('name'),
          limit(PAGE_SIZE)
        );
      }

      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        setHasMore(false);
        return;
      }
      
      const newProfessionals = snapshot.docs.map(doc => {
          const data = doc.data();
          // Convert Firestore Timestamps to JS Dates
          const registrationDate = data.registrationDate?.toDate ? data.registrationDate.toDate() : new Date();
          const lastPaymentDate = data.lastPaymentDate?.toDate ? data.lastPaymentDate.toDate() : undefined;
          
          return {
            id: doc.id,
            ...data,
            registrationDate,
            lastPaymentDate
          } as Professional;
      });

      setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
      setProfessionals(prev => [...prev, ...newProfessionals]);

      if (snapshot.docs.length < PAGE_SIZE) {
          setHasMore(false);
      }

    } catch (error) {
        console.error("Error fetching professionals: ", error);
    } finally {
        setLoading(false);
    }
  };
  
   useEffect(() => {
    // Reset state when category changes
    setProfessionals([]);
    setLastVisible(null);
    setHasMore(true);
    setLoading(true);

    if (category) {
      fetchProfessionals();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);


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
      
       {professionals.length > 0 ? (
        <div className="space-y-6">
          {professionals.map((professional) => (
            <ProfessionalCard
              key={professional.id}
              professional={professional}
            />
          ))}
        </div>
      ) : (
        !loading && !hasMore && (
            <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg text-center">
                <p className="text-lg font-medium text-muted-foreground">
                    No hay profesionales disponibles en esta categoría por el
                    momento.
                </p>
                <p className="text-sm text-muted-foreground mt-2">Vuelve a intentarlo más tarde o explora otras categorías.</p>
            </div>
        )
      )}

      <div className="mt-10 text-center">
          {loading && (
             <div className="flex items-center justify-center">
                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                <span>Cargando...</span>
            </div>
          )}
          {!loading && hasMore && (
            <Button onClick={fetchProfessionals}>Cargar más</Button>
          )}
          {!hasMore && professionals.length > 0 && (
            <p className="text-muted-foreground">No hay más profesionales para mostrar.</p>
          )}
      </div>

    </div>
  );
}
