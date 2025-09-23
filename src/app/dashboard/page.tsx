'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

// MOCK: En una app real, esto vendría de Firebase Auth
// y determinaría a qué panel redirigir al usuario.
const MOCK_USER_TYPE = 'professional'; // o 'client'

export default function DashboardPage() {
  const router = useRouter();
  
  React.useEffect(() => {
    if (MOCK_USER_TYPE === 'professional') {
        router.replace('/dashboard/profile');
    } else {
        // Para cualquier otro usuario (ej. cliente), redirigir a la página de inicio
        router.replace('/');
    }
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
