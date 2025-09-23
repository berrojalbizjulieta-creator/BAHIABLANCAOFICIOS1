'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/hooks/useAdminAuth';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { RecentSales } from '@/components/admin/recent-sales';
import { Overview } from '@/components/admin/overview';
import { DollarSign, Users, Briefcase, UserPlus } from 'lucide-react';
import ProfessionalsTable from '@/components/admin/professionals-table';
import VerificationRequests from '@/components/admin/verification-requests';

function AdminDashboard() {
    return (
    <div className="flex-col md:flex">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard de Administración</h2>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="professionals">Profesionales</TabsTrigger>
            <TabsTrigger value="verifications">Verificaciones</TabsTrigger>
            <TabsTrigger value="analytics" disabled>
              Analytics (Próximamente)
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Ingresos Totales
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$45,231.89</div>
                  <p className="text-xs text-muted-foreground">
                    +20.1% desde el mes pasado
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Nuevos Usuarios (Clientes)
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+2350</div>
                  <p className="text-xs text-muted-foreground">
                    +180.1% desde el mes pasado
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Nuevos Profesionales
                  </CardTitle>
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+12</div>
                  <p className="text-xs text-muted-foreground">
                    +19% desde el mes pasado
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Suscripciones Activas
                  </CardTitle>
                  <UserPlus className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+573</div>
                  <p className="text-xs text-muted-foreground">
                    +201 desde la última hora
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Resumen de Actividad</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <Overview />
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Usuarios Recientes</CardTitle>
                  <CardDescription>
                    Hubo 26 nuevos usuarios este mes.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentSales />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="professionals" className="space-y-4">
             <ProfessionalsTable />
          </TabsContent>
          
          <TabsContent value="verifications" className="space-y-4">
              <VerificationRequests />
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
}


export default function DashboardPage() {
  const router = useRouter();
  const { isAdmin, isProfessional, loading } = useAdminAuth();
  
  useEffect(() => {
    if (!loading) {
      if (isAdmin) {
        // Admin stays here, AdminDashboard is rendered
      } else if (isProfessional) {
        router.replace('/dashboard/profile');
      } else {
        // For clients or non-identified users, redirect to home
        router.replace('/');
      }
    }
  }, [loading, isAdmin, isProfessional, router]);

  if (loading) {
     return (
        <div className="container mx-auto px-4 py-12 md:px-6">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline mb-8">
            Cargando...
          </h1>
            <p>Verificando tu rol de usuario.</p>
        </div>
      );
  }
  
  if (isAdmin) {
      return <AdminDashboard />;
  }

  // This will be briefly visible before redirection for non-admins
  return (
    <div className="container mx-auto px-4 py-12 md:px-6">
      <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline mb-8">
        Redirigiendo...
      </h1>
        <p>Serás redirigido a tu panel de control en un momento.</p>
    </div>
  );
}
