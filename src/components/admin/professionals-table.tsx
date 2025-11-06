
'use client';

import { useState, useEffect, useMemo } from 'react';
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
import { format, isAfter, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { collection, getDocs, doc, updateDoc, writeBatch } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { CATEGORIES } from '@/lib/data';
import Link from 'next/link';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


interface CombinedProfessionalData extends Professional {
  userIsActive?: boolean;
}

export default function ProfessionalsTable() {
  const [professionals, setProfessionals] = useState<CombinedProfessionalData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('active'); // 'active', 'inactive', 'all'
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
                lastPaymentDate: profData.subscription?.lastPaymentDate ? (profData.subscription.lastPaymentDate as any).toDate() : undefined,
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
    const originalProfessionals = [...professionals];
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
        setProfessionals(originalProfessionals);
        toast({ title: 'Error', description: 'No se pudo actualizar el estado.', variant: 'destructive'});
    }
  };
  
  const handleToggleFeatured = async (id: string, isFeatured: boolean) => {
    const originalProfessionals = [...professionals];
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
        setProfessionals(originalProfessionals);
        toast({ title: 'Error', description: 'No se pudo actualizar el estado de destacado.', variant: 'destructive'});
    }
  }

  const handleMarkAsPaid = async (id: string) => {
    const newLastPaymentDate = new Date();
    setProfessionals(prev =>
      prev.map(p => p.id === id ? {...p, subscription: {...p.subscription, lastPaymentDate: newLastPaymentDate, isSubscriptionActive: true}} : p)
    )
     try {
        const profDocRef = doc(db, 'professionalsDetails', id);
        await updateDoc(profDocRef, { 
            'subscription.lastPaymentDate': newLastPaymentDate,
            'subscription.isSubscriptionActive': true,
        });
        toast({
            title: 'Pago Registrado',
            description: `Se ha marcado el pago para el profesional.`,
        });
     } catch (error) {
         console.error("Error marking as paid:", error);
         toast({ title: 'Error', description: 'No se pudo registrar el pago.', variant: 'destructive'});
     }
  }

  const isPaymentActive = (lastPaymentDate?: Date) => {
    if (!lastPaymentDate) return false;
    return isAfter(lastPaymentDate, subMonths(new Date(), 1));
  }

  const filteredProfessionals = useMemo(() => {
    return professionals.filter(pro => {
      if (filter === 'active') return pro.userIsActive;
      if (filter === 'inactive') return !pro.userIsActive;
      return true; // 'all'
    });
  }, [professionals, filter]);


  return (
    <Card>
      <CardHeader>
        <CardTitle>Profesionales Registrados</CardTitle>
        <CardDescription>
          Gestiona los profesionales de la plataforma. Activa o desactiva sus perfiles y promociónalos.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={filter} onValueChange={setFilter} className="mb-4">
            <TabsList>
                <TabsTrigger value="active">Activos ({professionals.filter(p => p.userIsActive).length})</TabsTrigger>
                <TabsTrigger value="inactive">Inactivos ({professionals.filter(p => !p.userIsActive).length})</TabsTrigger>
                <TabsTrigger value="all">Todos ({professionals.length})</TabsTrigger>
            </TabsList>
        </Tabs>
        <TooltipProvider>
         {loading ? (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin h-8 w-8 text-primary" />
            </div>
         ) : (
        <div className="border rounded-md">
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
            {filteredProfessionals.length > 0 ? (
                filteredProfessionals.map(pro => {
                const primaryCategory = CATEGORIES.find(c => c.id === pro.categoryIds[0]);
                const paymentIsActive = pro.subscription?.isSubscriptionActive && isPaymentActive(pro.subscription?.lastPaymentDate);

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
                      {pro.registrationDate ? format(pro.registrationDate, 'd MMM, yyyy', { locale: es }) : 'N/A'}
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
                )})
            ) : (
                <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                        No se encontraron profesionales para este filtro.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
        </div>
        )}
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}
