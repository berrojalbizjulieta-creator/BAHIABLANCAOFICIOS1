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

export default function DashboardPage() {
  const router = useRouter();
  
  // For now, let's assume the user is a client and redirect.
  // In a real app, you'd have logic to determine user type.
  React.useEffect(() => {
    router.replace('/dashboard/client');
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
