'use client';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { useEffect, useState } from 'react';
import type { User, Professional } from '@/lib/types';
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Skeleton } from '../ui/skeleton';


export function RecentSales() {
    const [recentUsers, setRecentUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchRecentUsers = async () => {
        try {
            const q = query(collection(db, 'users'), orderBy('registrationDate', 'desc'), limit(5));
            const querySnapshot = await getDocs(q);
            const users = querySnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    registrationDate: data.registrationDate?.toDate ? data.registrationDate.toDate() : new Date(),
                } as User;
            })
            setRecentUsers(users);
        } catch (error) {
            console.error("Error fetching recent users:", error);
        } finally {
            setLoading(false);
        }
      }
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
      )
  }

  return (
    <div className="space-y-8">
        {recentUsers.map(user => (
            <div key={user.id} className="flex items-center">
                <Avatar className="h-9 w-9">
                <AvatarImage src={user.photoUrl || ''} alt={user.name} />
                <AvatarFallback>{user.name?.charAt(0) || user.email.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">{user.name || 'Sin nombre'}</p>
                <p className="text-sm text-muted-foreground">
                    {user.email}
                </p>
                </div>
                <div className={`ml-auto font-medium ${user.role === 'client' ? 'text-muted-foreground' : ''}`}>
                    {user.role === 'professional' ? 'Profesional' : 'Cliente'}
                </div>
            </div>
        ))}
    </div>
  );
}
