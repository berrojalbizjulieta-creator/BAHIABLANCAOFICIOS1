'use client';

import dynamic from 'next/dynamic';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const LoginForm = dynamic(() => import('@/components/auth/login-form'), {
  ssr: false,
  loading: () => (
     <div className="flex items-center justify-center min-h-[calc(100vh-10rem)] py-12">
        <Card className="w-full max-w-sm">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl font-headline">
                    Cargando...
                </CardTitle>
                <CardDescription>
                    Un momento por favor.
                </CardDescription>
            </CardHeader>
        </Card>
     </div>
  )
});

export default function LoginPage() {
  return <LoginForm />;
}
