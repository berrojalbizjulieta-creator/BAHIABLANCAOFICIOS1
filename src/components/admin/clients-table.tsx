
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
import { Switch } from '@/components/ui/switch';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Loader2 } from 'lucide-react';
import type { User as AppUser } from '@/lib/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { collection, getDocs, doc, updateDoc, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';

export default function ClientsTable() {
  const [clients, setClients] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('role', '==', 'client'));
        const usersSnap = await getDocs(q);
        
        const clientsData = usersSnap.docs.map(userDoc => {
            const userData = userDoc.data() as AppUser;
            return {
                ...userData,
                id: userDoc.id,
                registrationDate: userData.registrationDate?.toDate ? userData.registrationDate.toDate() : new Date(),
            }
        });
        
        setClients(clientsData);
      } catch (error) {
          console.error("Error fetching clients:", error);
          toast({ title: 'Error', description: 'No se pudieron cargar los clientes.', variant: 'destructive'});
      }
      setLoading(false);
    }
    fetchData();
  }, [toast]);


  const handleToggleActive = async (id: string, isActive: boolean) => {
    // Optimistic UI update
    setClients(prev =>
      prev.map(c => (c.id === id ? { ...c, isActive: isActive } : c))
    );
    try {
        const userDocRef = doc(db, 'users', id);
        await updateDoc(userDocRef, { isActive: isActive });
        toast({
            title: 'Estado Actualizado',
            description: `El cliente ha sido ${isActive ? 'activado' : 'desactivado'}.`,
        });
    } catch (error) {
        console.error("Error toggling active state:", error);
        // Rollback UI on error
        setClients(prev =>
            prev.map(c => (c.id === id ? { ...c, isActive: !isActive } : c))
        );
        toast({ title: 'Error', description: 'No se pudo actualizar el estado.', variant: 'destructive'});
    }
  };
  

  return (
    <Card>
      <CardHeader>
        <CardTitle>Clientes Registrados</CardTitle>
        <CardDescription>
          Gestiona los clientes de la plataforma.
        </CardDescription>
      </CardHeader>
      <CardContent>
         {loading ? (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin h-8 w-8 text-primary" />
            </div>
         ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Miembro desde</TableHead>
              <TableHead>Activo</TableHead>
              <TableHead>
                <span className="sr-only">Acciones</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map(client => {
              return (
              <TableRow key={client.id}>
                <TableCell>
                  <div className="font-medium">{client.name}</div>
                  <div className="text-sm text-muted-foreground">{client.email}</div>
                </TableCell>
                <TableCell>
                  {format(client.registrationDate, 'd MMMM, yyyy', { locale: es })}
                </TableCell>
                <TableCell>
                  <Switch
                    checked={client.isActive}
                    onCheckedChange={value => handleToggleActive(client.id, value)}
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
                       <DropdownMenuItem asChild>
                        {/* A client profile could simply be their dashboard page */}
                        <Link href={`/dashboard`} target="_blank">Ver Perfil</Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )})}
          </TableBody>
        </Table>
        )}
      </CardContent>
    </Card>
  );
}

