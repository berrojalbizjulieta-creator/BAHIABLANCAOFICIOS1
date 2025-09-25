'use client';

import type { User } from 'firebase/auth';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '../ui/button';
import Link from 'next/link';

interface ClientDashboardProps {
  user: User;
}

export default function ClientDashboard({ user }: ClientDashboardProps) {
  return (
    <div className="container mx-auto px-4 py-12 md:px-6">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <Avatar className="w-24 h-24 mx-auto mb-4 border-2 border-primary">
              <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'Usuario'} />
              <AvatarFallback>{user.email?.[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <CardTitle className="text-2xl font-headline">¡Bienvenido, {user.displayName || user.email}!</CardTitle>
            <CardDescription>Este es tu panel de control de cliente.</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-6">
              Desde aquí podrás gestionar tus solicitudes y ver tus profesionales contactados próximamente.
            </p>
            <Button asChild>
                <Link href="/servicios">Buscar un Profesional</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
