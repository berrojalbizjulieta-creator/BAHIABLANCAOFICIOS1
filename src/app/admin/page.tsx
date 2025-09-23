'use client';
import React, { useState, useMemo } from 'react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ListFilter, MoreHorizontal, User, Briefcase, Power, PowerOff, DollarSign } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PROFESSIONALS as initialProfessionals, CLIENTS as initialClients, CATEGORIES } from '@/lib/data';
import type { Professional, Client } from '@/lib/types';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

// Combina ambos tipos de usuarios en una sola lista para el panel
type User = (Professional & { userType: 'professional' }) | (Client & { userType: 'client' });

export default function AdminPage() {
  const { loading, isAdmin } = useAdminAuth();
  const { toast } = useToast();
  
  const [professionals, setProfessionals] = useState<Professional[]>(initialProfessionals);
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [filter, setFilter] = useState<string>('Todos');

  const users = useMemo(() => {
    const professionalUsers: User[] = professionals.map(p => ({ ...p, userType: 'professional' }));
    const clientUsers: User[] = clients.map(c => ({ ...c, userType: 'client' }));
    return [...professionalUsers, ...clientUsers];
  }, [professionals, clients]);

  const filteredUsers = useMemo(() => {
    if (filter === 'Todos') {
      return users;
    }
    return users.filter(user => {
      if (user.userType === 'professional') {
        const category = CATEGORIES.find(c => c.id === user.categoryId);
        return category?.name === filter;
      }
      return false;
    });
  }, [users, filter]);

  const toggleUserStatus = (userId: number, userType: 'professional' | 'client') => {
    if (userType === 'professional') {
      setProfessionals(prev => prev.map(p => 
        p.id === userId ? { ...p, isActive: !p.isActive } : p
      ));
    } else {
      setClients(prev => prev.map(c => 
        c.id === userId ? { ...c, isActive: !c.isActive } : c
      ));
    }
    toast({
      title: 'Estado de usuario actualizado',
      description: 'El usuario ha sido activado/desactivado correctamente.',
    });
  };

  const markAsPaid = (professionalId: number) => {
    setProfessionals(prev => prev.map(p => 
      p.id === professionalId ? { ...p, isSubscriptionActive: true, lastPaymentDate: new Date() } : p
    ));
    toast({
      title: 'Pago registrado',
      description: 'La membresía del profesional ha sido marcada como pagada.',
    });
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Cargando panel de administración...</div>;
  }

  if (!isAdmin) {
    // El hook useAdminAuth ya se encarga de la redirección, pero esto es una doble seguridad.
    return <div className="flex h-screen items-center justify-center">Acceso denegado.</div>;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto py-10">
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div>
                <CardTitle className="text-2xl font-headline">Panel de Administración</CardTitle>
                <CardDescription>Gestión de usuarios, pagos y categorías de Bahia Blanca Oficios.</CardDescription>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="mt-4 sm:mt-0">
                    <ListFilter className="mr-2" />
                    Filtrar por Oficio ({filter})
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setFilter('Todos')}>Todos</DropdownMenuItem>
                  {CATEGORIES.map(category => (
                    <DropdownMenuItem key={category.id} onClick={() => setFilter(category.name)}>
                      {category.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuario</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Oficio/Categoría</TableHead>
                    <TableHead>Estado de Pago</TableHead>
                    <TableHead>Fecha de Registro</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map(user => {
                    const categoryName = user.userType === 'professional' ? (CATEGORIES.find(c => c.id === user.categoryId)?.name || 'N/A') : 'N/A';
                    
                    return (
                      <TableRow key={`${user.userType}-${user.id}`}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={user.photoUrl} alt={user.name} />
                              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.userType === 'professional' ? 'default' : 'secondary'}>
                            {user.userType === 'professional' ? <Briefcase className="mr-1 h-3 w-3" /> : <User className="mr-1 h-3 w-3" />}
                            {user.userType === 'professional' ? 'Profesional' : 'Cliente'}
                          </Badge>
                        </TableCell>
                        <TableCell>{categoryName}</TableCell>
                        <TableCell>
                          {user.userType === 'professional' && (
                            <Badge variant={user.isSubscriptionActive ? 'default' : 'destructive'} className={user.isSubscriptionActive ? 'bg-green-500' : ''}>
                              {user.isSubscriptionActive ? 'Activa' : 'Vencida'}
                            </Badge>
                          )}
                          {user.userType === 'professional' && user.lastPaymentDate && (
                             <p className="text-xs text-muted-foreground mt-1">
                              Último pago: {format(new Date(user.lastPaymentDate), 'dd/MM/yyyy')}
                            </p>
                          )}
                        </TableCell>
                        <TableCell>
                          {user.registrationDate ? format(new Date(user.registrationDate), 'dd/MM/yyyy') : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.isActive ? 'outline' : 'destructive'} className={user.isActive ? 'border-green-500 text-green-700' : ''}>
                             {user.isActive ? 'Activo' : 'Inactivo'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {user.userType === 'professional' && !user.isSubscriptionActive && (
                                <DropdownMenuItem onClick={() => markAsPaid(user.id)}>
                                  <DollarSign className="mr-2" /> Marcar como Pagado
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem onClick={() => toggleUserStatus(user.id, user.userType)}>
                                {user.isActive ? <PowerOff className="mr-2" /> : <Power className="mr-2" />}
                                {user.isActive ? 'Desactivar' : 'Activar'}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
             {filteredUsers.length === 0 && (
                <div className="text-center py-10">
                    <p className="text-muted-foreground">No se encontraron usuarios que coincidan con el filtro seleccionado.</p>
                </div>
             )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
