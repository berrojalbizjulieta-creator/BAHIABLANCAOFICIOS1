'use client';

import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Loader2, ShieldCheck, Sparkles } from 'lucide-react';
import type { Professional, User as AppUser } from '@/lib/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { isAfter, subMonths } from 'date-fns';
import { collection, getDocs, doc, updateDoc, writeBatch } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { CATEGORIES } from '@/lib/data';
import Link from 'next/link';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface CombinedProfessionalData extends Professional {
  userIsActive?: boolean;
}

export default function ProfessionalsTable() {
  const [professionals, setProfessionals] = useState<CombinedProfessionalData[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [profSnap, usersSnap] = await Promise.all([
            getDocs(collection(db, 'professionalsDetails')),
            getDocs(collection(db, 'users'))
        ]);
        
        const usersData = new Map(usersSnap.docs.map(d => [d.id, d.data() as AppUser]));

        const combinedData = profSnap.docs.map(profDoc => {
            const profData = profDoc.data() as Professional;
            const userData = usersData.get(profDoc.id);
            return {
                ...profData,
                id: profDoc.id,
                userIsActive: userData?.isActive ?? false,
                isFeatured: profData.isFeatured ?? false, // Ensure default value
                registrationDate: profData.registrationDate?.toDate ? profData.registrationDate.toDate() : new Date(),
                lastPaymentDate: profData.lastPaymentDate?.toDate ? profData.lastPaymentDate.toDate() : undefined,
            }
        });
        
        setProfessionals(combinedData);
      } catch (error) {
          console.error("Error fetching professionals:", error);
          toast({ title: 'Error', description: 'No se pudieron cargar los profesionales.', variant: 'destructive'});
      }
      setLoading(false);
    }
    fetchData();
  }, [toast]);


  const handleToggleActive = async (id: string, isActive: boolean) => {
    // Optimistic UI update
    setProfessionals(prev =>
      prev.map(p => (p.id === id ? { ...p, userIsActive: isActive } : p))
    );
    try {
        const userDocRef = doc(db, 'users', id);
        await updateDoc(userDocRef, { isActive: isActive });
        toast({
            title: 'Estado Actualizado',
            description: `El profesional ha sido ${isActive ? 'activado' : 'desactivado'}.`,
        });
    } catch (error) {
        console.error("Error toggling active state:", error);
        // Rollback UI on error
        setProfessionals(prev =>
            prev.map(p => (p.id === id ? { ...p, userIsActive: !isActive } : p))
        );
        toast({ title: 'Error', description: 'No se pudo actualizar el estado.', variant: 'destructive'});
    }
  };
  
  const handleToggleFeatured = async (id: string, isFeatured: boolean) => {
    setProfessionals(prev =>
        prev.map(p => (p.id === id ? { ...p, isFeatured: isFeatured } : p))
    );
    try {
        const profDocRef = doc(db, 'professionalsDetails', id);
        await updateDoc(profDocRef, { isFeatured: isFeatured });
        toast({
            title: 'Profesional Actualizado',
            description: `El profesional ha sido ${isFeatured ? 'añadido a destacados' : 'quitado de destacados'}.`,
        });
    } catch (error) {
        console.error("Error toggling featured state:", error);
        setProfessionals(prev =>
            prev.map(p => (p.id === id ? { ...p, isFeatured: !isFeatured } : p))
        );
        toast({ title: 'Error', description: 'No se pudo actualizar el estado de destacado.', variant: 'destructive'});
    }
  }

  const handleMarkAsPaid = async (id: string) => {
    const newLastPaymentDate = new Date();
    // Optimistic UI update
    setProfessionals(prev =>
      prev.map(p => p.id === id ? {...p, lastPaymentDate: newLastPaymentDate, subscription: {...p.subscription, isSubscriptionActive: true}} : p)
    )
     try {
        const profDocRef = doc(db, 'professionalsDetails', id);
        await updateDoc(profDocRef, { 
            lastPaymentDate: newLastPaymentDate,
            'subscription.isSubscriptionActive': true,
        });
        toast({
            title: 'Pago Registrado',
            description: `Se ha marcado el pago para el profesional.`,
        });
     } catch (error) {
         console.error("Error marking as paid:", error);
         toast({ title: 'Error', description: 'No se pudo registrar el pago.', variant: 'destructive'});
         // Rollback is more complex, might need to re-fetch
     }
  }

  const isPaymentActive = (lastPaymentDate?: Date) => {
    if (!lastPaymentDate) return false;
    return isAfter(lastPaymentDate, subMonths(new Date(), 1));
  }


  return (
    <Card>
      <CardHeader>
        <CardTitle>Profesionales Registrados ({professionals.length})</CardTitle>
        <CardDescription>
          Gestiona los profesionales de la plataforma. Activa o desactiva sus perfiles y promociónalos.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
         {loading ? (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin h-8 w-8 text-primary" />
            </div>
         ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Oficio Principal</TableHead>
              <TableHead>Estado de Pago</TableHead>
              <TableHead>Destacado</TableHead>
              <TableHead>Miembro desde</TableHead>
              <TableHead>Activo</TableHead>
              <TableHead>
                <span className="sr-only">Acciones</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {professionals.map(pro => {
              const primaryCategory = CATEGORIES.find(c => c.id === pro.categoryIds[0]);
              const paymentIsActive = isPaymentActive(pro.lastPaymentDate);

              return (
              <TableRow key={pro.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{pro.name}</span>
                    {pro.isVerified && <ShieldCheck className="h-5 w-5 text-blue-500" />}
                  </div>
                  <div className="text-sm text-muted-foreground">{pro.email}</div>
                </TableCell>
                <TableCell>{primaryCategory?.name || 'No especificado'}</TableCell>
                <TableCell>
                  <Badge variant={paymentIsActive ? 'default' : 'destructive'} className={paymentIsActive ? 'bg-green-600' : ''}>
                    {paymentIsActive ? 'Al día' : 'Pendiente'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Tooltip>
                    <TooltipTrigger>
                       <Switch
                          checked={pro.isFeatured}
                          onCheckedChange={value => handleToggleFeatured(pro.id, value)}
                          aria-label="Destacar profesional"
                        />
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{pro.isFeatured ? 'Quitar de destacados' : 'Añadir a destacados'}</p>
                    </TooltipContent>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  {format(pro.registrationDate, 'd MMM, yyyy', { locale: es })}
                </TableCell>
                <TableCell>
                  <Switch
                    checked={pro.userIsActive}
                    onCheckedChange={value => handleToggleActive(pro.id, value)}
                    aria-label="Activar/desactivar profesional"
                  />
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleMarkAsPaid(pro.id)}>Marcar como pagado</DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/profesional/${pro.id}`} target="_blank">Ver Perfil</Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )})}
          </TableBody>
        </Table>
        )}
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}
