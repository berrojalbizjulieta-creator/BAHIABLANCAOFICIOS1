'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

function ClientDashboard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Panel de Cliente</CardTitle>
        <CardDescription>
          Revisa tu actividad reciente y testimonios.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-semibold">
            Profesionales Contactados Recientemente
          </h3>
          <ul className="mt-2 space-y-2">
            <li className="flex justify-between items-center text-sm p-2 rounded-md bg-muted/50">
              <span>Carlos Rodriguez (Plomería)</span>{' '}
              <span className="text-muted-foreground">15/07/2024</span>
            </li>
            <li className="flex justify-between items-center text-sm p-2 rounded-md bg-muted/50">
              <span>Lucía Fernandez (Electricidad)</span>{' '}
              <span className="text-muted-foreground">02/07/2024</span>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold">Mis Testimonios</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Aún no has dejado ningún testimonio.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  
  // For now, let's assume the user is a professional and redirect.
  // In a real app, you'd have logic to determine user type.
  React.useEffect(() => {
    router.replace('/dashboard/profile');
  }, [router]);

  return (
    <div className="container mx-auto px-4 py-12 md:px-6">
      <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline mb-8">
        Redirigiendo...
      </h1>
        <p>Serás redirigido a tu panel de control en un momento.</p>
    </div>
  );
}
