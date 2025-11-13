'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useEffect, useState } from 'react';
import type { User, Professional } from '@/lib/types';
import { collection, getDocs, limit, orderBy, query, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Skeleton } from '../ui/skeleton';
import { CATEGORIES } from '@/lib/data'; // Importar categorías

// Extender la interfaz para incluir detalles del profesional
interface RecentUser extends User {
  professionalDetails?: Professional | null;
}

export function RecentSales() {
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentUsers = async () => {
      try {
        const q = query(collection(db, 'users'), orderBy('registrationDate', 'desc'), limit(5));
        const querySnapshot = await getDocs(q);

        const usersPromises = querySnapshot.docs.map(async (userDoc) => {
          const userData = userDoc.data() as User;
          let professionalDetails: Professional | null = null;

          // Si el usuario es profesional, busca sus detalles para obtener el oficio.
          if (userData.role === 'professional') {
            const profRef = doc(db, 'professionalsDetails', userDoc.id);
            const profSnap = await getDoc(profRef);
            if (profSnap.exists()) {
              professionalDetails = profSnap.data() as Professional;
            }
          }
          
          return {
            id: userDoc.id,
            ...userData,
            registrationDate: userData.registrationDate?.toDate ? userData.registrationDate.toDate() : new Date(),
            professionalDetails, // Adjuntar los detalles del profesional al objeto de usuario
          } as RecentUser;
        });

        const users = await Promise.all(usersPromises);
        setRecentUsers(users);

      } catch (error) {
        console.error("Error fetching recent users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecentUsers();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center">
            <Skeleton className="h-9 w-9 rounded-full" />
            <div className="ml-4 space-y-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-4 w-[150px]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {recentUsers.map((user) => {
        let roleDisplay = 'Cliente';
        if (user.role === 'professional') {
          const primaryCategoryId = user.professionalDetails?.categoryIds?.[0];
          const category = CATEGORIES.find(c => c.id === primaryCategoryId);
          // Si se encuentra la categoría, muestra su nombre; si no, muestra "Profesional".
          roleDisplay = category ? category.name : 'Profesional';
        }

        return (
          <div key={user.id} className="flex items-center">
            <Avatar className="h-9 w-9">
              <AvatarImage src={user.photoUrl || ''} alt={user.name} />
              <AvatarFallback>{user.name?.charAt(0) || user.email.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">{user.name || 'Sin nombre'}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
            <div className={`ml-auto text-right text-sm font-medium ${user.role === 'client' ? 'text-muted-foreground' : 'text-primary'}`}>
              {roleDisplay}
            </div>
          </div>
        );
      })}
    </div>
  );
}
