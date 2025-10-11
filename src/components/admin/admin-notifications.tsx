'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Bell, ShieldCheck, Loader2 } from 'lucide-react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Separator } from '../ui/separator';

export default function AdminNotifications() {
  const [pendingVerifications, setPendingVerifications] = useState(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const q = query(collection(db, "professionalsDetails"), where("verificationStatus", "==", "pending"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setPendingVerifications(querySnapshot.size);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching pending verifications:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleNotificationClick = (path: string) => {
    router.push(path);
  }

  const hasNotifications = pendingVerifications > 0;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {hasNotifications && (
            <span className="absolute top-1 right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Notificaciones</h4>
            <p className="text-sm text-muted-foreground">
              Tareas pendientes de administración.
            </p>
          </div>
          <Separator />
          {loading ? (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="animate-spin" />
            </div>
          ) : hasNotifications ? (
            <div className="grid gap-2">
                <button 
                    onClick={() => handleNotificationClick('/dashboard?tab=verifications')} 
                    className="group flex items-center justify-between rounded-md p-2 hover:bg-accent hover:text-accent-foreground text-left w-full"
                >
                    <div className='flex items-center gap-3'>
                        <div className="bg-blue-100 p-2 rounded-full">
                            <ShieldCheck className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="grid gap-1">
                            <p className="text-sm font-medium">Verificaciones</p>
                            <p className="text-sm text-muted-foreground">
                                {pendingVerifications} solicitud{pendingVerifications > 1 ? 'es' : ''} pendiente{pendingVerifications > 1 ? 's' : ''}.
                            </p>
                        </div>
                    </div>
                </button>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center p-4">
              No hay notificaciones nuevas.
            </p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
