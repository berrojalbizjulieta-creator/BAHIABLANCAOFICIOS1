'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import ClientDashboard from '@/components/dashboard/client-dashboard';

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
import { DollarSign, Users, Briefcase, UserPlus, Loader2 } from 'lucide-react';
import ProfessionalsTable from '@/components/admin/professionals-table';
import ClientsTable from '@/components/admin/clients-table';
import VerificationRequests from '@/components/admin/verification-requests';
import AdManagement from '@/components/admin/ad-management';
import { collection, getDocs, query, where, Timestamp, getCountFromServer, DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Professional, User as AppUser } from '@/lib/types';
import { subMonths, startOfMonth, endOfMonth, eachMonthOfInterval } from 'date-fns';

interface DashboardStats {
  totalRevenue: number;
  newClients: number;
  newClientsChange: number;
  newProfessionals: number;
  newProfessionalsChange: number;
  activeSubscriptions: number;
  overviewData: { name: string; total: number }[];
}

// Simplified function to fetch and filter in code
async function getCountForPeriod(collectionName: string, role: string | null, startDate: Date, endDate: Date) {
    let q;
    if (role) {
        q = query(collection(db, collectionName), where('role', '==', role));
    } else {
        q = query(collection(db, collectionName));
    }
    
    const snapshot = await getDocs(q);
    
    const filteredDocs = snapshot.docs.filter(doc => {
        const data = doc.data();
        const regDate = data.registrationDate?.toDate ? data.registrationDate.toDate() : null;
        if (!regDate) return false;
        return regDate >= startDate && regDate < endDate;
    });

    return filteredDocs.length;
}


async function getProfessionalsForPeriod(startDate: Date, endDate: Date) {
    const q = query(
        collection(db, 'professionalsDetails'),
        where('registrationDate', '>=', startDate),
        where('registrationDate', '<', endDate)
    );
    const snapshot = await getDocs(q);
    return snapshot.size;
}


function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loadingStats, setLoadingStats] = useState(true);
    const searchParams = useSearchParams();
    const router = useRouter();

    const activeTab = searchParams.get('tab') || 'overview';

    useEffect(() => {
        const fetchStats = async () => {
            setLoadingStats(true);
            try {
                const now = new Date();
                const oneMonthAgo = subMonths(now, 1);
                const twoMonthsAgo = subMonths(now, 2);

                const [
                    newClientsCount,
                    prevMonthNewClientsCount,
                    allProfessionalsSnapshot,
                    overviewData,
                ] = await Promise.all([
                    getCountForPeriod('users', 'client', oneMonthAgo, now),
                    getCountForPeriod('users', 'client', twoMonthsAgo, oneMonthAgo),
                    getDocs(query(collection(db, 'professionalsDetails'), where('subscription.isSubscriptionActive', '==', true))),
                    Promise.all(eachMonthOfInterval({ start: subMonths(now, 11), end: now }).map(async (monthStart) => {
                        const monthEnd = endOfMonth(monthStart);
                        const monthName = monthStart.toLocaleString('es-ES', { month: 'short' }).replace('.', '').replace(/^\w/, (c) => c.toUpperCase());
                        const count = await getProfessionalsForPeriod(monthStart, monthEnd);
                        return { name: monthName, total: count };
                    }))
                ]);

                const activeSubscriptions = allProfessionalsSnapshot.size;
                const totalRevenue = activeSubscriptions * 15800; // Assuming fixed price

                const calculatePercentageChange = (current: number, previous: number) => {
                    if (previous === 0) return current > 0 ? 100 : 0;
                    return ((current - previous) / previous) * 100;
                };

                const newProfessionalsCount = overviewData.find(d => d.name === now.toLocaleString('es-ES', { month: 'short' }).replace('.', '').replace(/^\w/, (c) => c.toUpperCase()))?.total || 0;
                const prevMonthProfessionalsCount = overviewData.find(d => d.name === oneMonthAgo.toLocaleString('es-ES', { month: 'short' }).replace('.', '').replace(/^\w/, (c) => c.toUpperCase()))?.total || 0;


                setStats({
                    totalRevenue,
                    newClients: newClientsCount,
                    newClientsChange: calculatePercentageChange(newClientsCount, prevMonthNewClientsCount),
                    newProfessionals: newProfessionalsCount,
                    newProfessionalsChange: calculatePercentageChange(newProfessionalsCount, prevMonthProfessionalsCount),
                    activeSubscriptions,
                    overviewData,
                });

            } catch (error) {
                console.error("Error fetching dashboard stats:", error);
            } finally {
                setLoadingStats(false);
            }
        };

        fetchStats();
    }, []);

    const onTabChange = (value: string) => {
      router.push(`/dashboard?tab=${value}`);
    };

    return (
    <div className="flex-col md:flex">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard de Administración</h2>
        </div>
        <Tabs value={activeTab} onValueChange={onTabChange} className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="professionals">Profesionales</TabsTrigger>
            <TabsTrigger value="clients">Clientes</TabsTrigger>
            <TabsTrigger value="verifications">Verificaciones</TabsTrigger>
            <TabsTrigger value="ads">Publicidad</TabsTrigger>
            <TabsTrigger value="analytics" disabled>
              Analytics (Próximamente)
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
             {loadingStats || !stats ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin h-8 w-8 text-primary" />
              </div>
            ) : (
            <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Ingresos Totales (Estimado)
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString('es-AR')}</div>
                  <p className="text-xs text-muted-foreground">
                    Estimado mensual basado en suscripciones activas
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Nuevos Clientes
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+{stats.newClients}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.newClientsChange.toFixed(1)}% desde el mes pasado
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
                  <div className="text-2xl font-bold">+{stats.newProfessionals}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.newProfessionalsChange.toFixed(1)}% desde el mes pasado
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
                  <div className="text-2xl font-bold">{stats.activeSubscriptions}</div>
                  <p className="text-xs text-muted-foreground">
                     Total de profesionales activos en la plataforma.
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Nuevos Profesionales por Mes</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <Overview data={stats.overviewData}/>
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Registros Recientes</CardTitle>
                </CardHeader>
                <CardContent>
                  <RecentSales />
                </CardContent>
              </Card>
            </div>
            </>
            )}
          </TabsContent>

          <TabsContent value="professionals" className="space-y-4">
             <ProfessionalsTable />
          </TabsContent>

           <TabsContent value="clients" className="space-y-4">
             <ClientsTable />
          </TabsContent>
          
          <TabsContent value="verifications" className="space-y-4">
              <VerificationRequests />
          </TabsContent>

          <TabsContent value="ads" className="space-y-4">
            <AdManagement />
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
}

function DashboardPageContent() {
  const router = useRouter();
  const { user, isAdmin, isProfessional, loading } = useAdminAuth();
  
  useEffect(() => {
    if (!loading) {
      if (isAdmin) {
        // Admin stays here, AdminDashboard is rendered
      } else if (isProfessional) {
        router.replace('/dashboard/profile');
      } else if (!user) {
        // If not admin, not professional, and not logged in, go to login
        router.replace('/login');
      }
      // If client (is logged in, but not admin or professional), stay and render ClientDashboard
    }
  }, [loading, user, isAdmin, isProfessional, router]);

  if (loading) {
     return (
        <div className="flex justify-center items-center h-screen">
          <Loader2 className="animate-spin h-12 w-12 text-primary" />
        </div>
      );
  }
  
  if (isAdmin) {
      return <AdminDashboard />;
  }

  if (!isProfessional && user) {
    return <ClientDashboard user={user} />;
  }

  // This will be briefly visible before redirection for other cases
  return (
    <div className="container mx-auto px-4 py-12 md:px-6">
      <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline mb-8">
        Redirigiendo...
      </h1>
        <p>Serás redirigido a tu panel de control en un momento.</p>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin h-12 w-12 text-primary" /></div>}>
      <DashboardPageContent />
    </Suspense>
  )
}
