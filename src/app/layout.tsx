'use client';

import type { Metadata } from 'next';
import { PT_Sans } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Toaster } from '@/components/ui/toaster';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';


const ptSans = PT_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-pt-sans',
});

// Metadata can't be dynamically generated in a client component,
// but we can define a static one. For dynamic titles, other strategies are needed.
// export const metadata: Metadata = {
//   title: 'Bahia Blanca Oficios',
//   description: 'Encuentra profesionales de confianza en Bahía Blanca.',
// };

function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Solo se ejecuta en el navegador y no rastrea las visitas al panel de administración.
    if (typeof window !== 'undefined' && !pathname.startsWith('/dashboard')) {

      // 🔹 Clave única para marcar que la visita ya fue contada esta sesión
      const sessionKey = 'bbo_visit_counted';

      // 🔹 Revisamos si ya se contó una visita en esta sesión
      const hasBeenCounted = sessionStorage.getItem(sessionKey);

      // 🔹 Si aún no fue contada, la registramos y marcamos la sesión
      if (!hasBeenCounted) {
        fetch('/api/track-view', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ page: pathname }),
          keepalive: true, // Garantiza que se envíe aunque el usuario navegue rápido
        }).catch(console.error);

        // Marcamos que la sesión ya fue contada
        sessionStorage.setItem(sessionKey, 'true');
      }
    }
  }, [pathname]);

  return null;
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className={`${ptSans.variable} font-body antialiased`}>
        <AnalyticsTracker />
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <Toaster />
      </body>
    </html>
  );
}
