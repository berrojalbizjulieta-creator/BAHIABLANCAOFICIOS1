'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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
import VerificationRequests from '@/components/admin/verification-requests';
import AdManagement from '@/components/admin/ad-management';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Professional, User as AppUser } from '@/lib/types';
import { subMonths } from 'date-fns';

interface DashboardStats {
  totalRevenue: number;
  revenueChange: number;
  newClients: number;
  newClientsChange: number;
  newProfessionals: number;
  newProfessionalsChange: number;
  activeSubscriptions: number;
  activeSubscriptionsChange: number;
  overviewData: { name: string; total: number }[];
}

function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loadingStats, setLoadingStats] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            setLoadingStats(true);
            try {
                const usersSnapshot = await getDocs(collection(db, 'users'));
                const professionalsSnapshot = await getDocs(collection(db, 'professionalsDetails'));

                const allUsers = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AppUser));
                const allProfessionals = professionalsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Professional));

                const now = new Date();
                const oneMonthAgo = subMonths(now, 1);
                const twoMonthsAgo = subMonths(now, 2);

                const newClients = allUsers.filter(u => u.role === 'client' && u.registrationDate > oneMonthAgo).length;
                const prevMonthNewClients = allUsers.filter(u => u.role === 'client' && u.registrationDate > twoMonthsAgo && u.registrationDate <= oneMonthAgo).length;
                
                const newProfessionals = allProfessionals.filter(p => p.registrationDate > oneMonthAgo).length;
                const prevMonthNewProfessionals = allProfessionals.filter(p => p.registrationDate > twoMonthsAgo && p.registrationDate <= oneMonthAgo).length;

                const activeSubscriptions = allProfessionals.filter(p => p.subscription?.isSubscriptionActive).length;
                
                const calculatePercentageChange = (current: number, previous: number) => {
                    if (previous === 0) return current > 0 ? 100 : 0;
                    return ((current - previous) / previous) * 100;
                };

                const overviewData = Array.from({ length: 12 }, (_, i) => {
                    const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
                    const monthName = month.toLocaleString('es-ES', { month: 'short' });
                    return { name: monthName.charAt(0).toUpperCase() + monthName.slice(1), total: 0 };
                }).reverse();

                allProfessionals.forEach(prof => {
                    if (prof.registrationDate) {
                        const monthIndex = 11 - (now.getMonth() - prof.registrationDate.getMonth() + 12) % 12;
                        if(monthIndex >= 0 && monthIndex < 12) {
                            overviewData[monthIndex].total += 1;
                        }
                    }
                });

                setStats({
                    totalRevenue: allProfessionals.reduce((acc, p) => acc + (p.subscriptionTier === 'premium' ? 15000 : 9000), 0),
                    revenueChange: 20.1, // Placeholder
                    newClients,
                    newClientsChange: calculatePercentageChange(newClients, prevMonthNewClients),
                    newProfessionals,
                    newProfessionalsChange: calculatePercentageChange(newProfessionals, prevMonthNewProfessionals),
                    activeSubscriptions,
                    activeSubscriptionsChange: 20, // Placeholder
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
                    +{stats.revenueChange.toFixed(1)}% desde el mes pasado
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
                    {stats.newClientsChange >= 0 ? '+' : ''}{stats.newClientsChange.toFixed(1)}% desde el mes pasado
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
                    {stats.newProfessionalsChange >= 0 ? '+' : ''}{stats.newProfessionalsChange.toFixed(1)}% desde el mes pasado
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
                     +{stats.activeSubscriptionsChange.toFixed(1)}% que el mes pasado
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


export default function DashboardPage() {
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
