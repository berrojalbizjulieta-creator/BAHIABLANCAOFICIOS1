'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/icons/logo';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { useAdminAuth } from '@/hooks/useAdminAuth';

const navLinks = [
  { href: '/', label: 'Inicio' },
  { href: '/servicios', label: 'Servicios' },
  { href: '/#about', label: 'Sobre Nosotros' },
  { href: '/contacto', label: 'Contacto' },
];

export function Header() {
  const { user } = useAdminAuth();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const renderAuthButtons = () => {
    if (!isClient) {
      // Render a placeholder on the server to prevent hydration mismatch.
      return <div className="hidden md:flex items-center gap-3 h-9 w-44"></div>;
    }

    if (user) {
      return (
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard">Mi Panel</Link>
        </Button>
      );
    }

    return (
      <>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/login">Iniciar Sesión</Link>
        </Button>
        <Button size="sm" asChild>
          <Link href="/signup">Registrarse</Link>
        </Button>
      </>
    );
  };

  const renderMobileAuthContent = () => {
    if (!isClient) {
      return null;
    }

    if (user) {
      return (
         <Button variant="outline" asChild>
            <Link href="/dashboard">Mi Panel</Link>
        </Button>
      );
    }

    return (
      <div className="flex flex-col gap-3">
        <Button variant="outline" asChild>
          <Link href="/login">Iniciar Sesión</Link>
        </Button>
        <Button asChild>
          <Link href="/signup">Registrarse</Link>
        </Button>
      </div>
    );
  };


  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-7xl items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Logo className="h-8 w-auto" />
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-foreground/60 transition-colors hover:text-foreground/80"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {renderAuthButtons()}
        </div>

        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Abrir menú</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col h-full">
                <div className="flex items-center mb-6">
                   <Logo className="h-8 w-auto" />
                </div>
                <nav className="flex flex-col gap-4 text-lg font-medium">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-foreground/80 transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
                <div className="mt-auto border-t pt-6">
                   {renderMobileAuthContent()}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
