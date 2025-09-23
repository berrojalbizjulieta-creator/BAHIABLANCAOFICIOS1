'use client';

import { useState } from 'react';
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
import { MoreHorizontal } from 'lucide-react';
import { PROFESSIONALS, CATEGORIES } from '@/lib/data';
import type { Professional } from '@/lib/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { isAfter, subMonths } from 'date-fns';

export default function ProfessionalsTable() {
  const [professionals, setProfessionals] = useState<Professional[]>(PROFESSIONALS);
  const { toast } = useToast();

  const handleToggleActive = (id: number, isActive: boolean) => {
    setProfessionals(prev =>
      prev.map(p => (p.id === id ? { ...p, isActive } : p))
    );
    toast({
      title: 'Estado Actualizado',
      description: `El profesional ha sido ${isActive ? 'activado' : 'desactivado'}.`,
    });
  };
  
  const handleMarkAsPaid = (id: number) => {
    setProfessionals(prev =>
      prev.map(p => p.id === id ? {...p, lastPaymentDate: new Date(), isSubscriptionActive: true} : p)
    )
     toast({
      title: 'Pago Registrado',
      description: `Se ha marcado el pago para el profesional.`,
    });
  }

  const isPaymentActive = (lastPaymentDate?: Date) => {
    if (!lastPaymentDate) return false;
    return isAfter(lastPaymentDate, subMonths(new Date(), 1));
  }


  return (
    <Card>
      <CardHeader>
        <CardTitle>Profesionales Registrados</CardTitle>
        <CardDescription>
          Gestiona los profesionales de la plataforma.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Oficio</TableHead>
              <TableHead>Estado de Pago</TableHead>
              <TableHead>Miembro desde</TableHead>
              <TableHead>Activo</TableHead>
              <TableHead>
                <span className="sr-only">Acciones</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {professionals.map(pro => {
              const category = CATEGORIES.find(c => c.id === pro.categoryId);
              const paymentIsActive = isPaymentActive(pro.lastPaymentDate);

              return (
              <TableRow key={pro.id}>
                <TableCell>
                  <div className="font-medium">{pro.name}</div>
                  <div className="text-sm text-muted-foreground">{pro.email}</div>
                </TableCell>
                <TableCell>{category?.name || 'No especificado'}</TableCell>
                <TableCell>
                  <Badge variant={paymentIsActive ? 'default' : 'destructive'} className={paymentIsActive ? 'bg-green-600' : ''}>
                    {paymentIsActive ? 'Pagado' : 'Pendiente'}
                  </Badge>
                </TableCell>
                <TableCell>
                  {format(pro.registrationDate, 'd MMMM, yyyy', { locale: es })}
                </TableCell>
                <TableCell>
                  <Switch
                    checked={pro.isActive}
                    onCheckedChange={value => handleToggleActive(pro.id, value)}
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
                      <DropdownMenuItem>Ver Perfil</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )})}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
