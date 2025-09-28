
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/icons/logo';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { LayoutDashboard, LogOut, Menu } from 'lucide-react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Skeleton } from '../ui/skeleton';

const navLinks = [
  { href: '/', label: 'Inicio' },
  { href: '/servicios', label: 'Servicios' },
  { href: '/busco-un-profesional', label: 'Busco a alguien que...' },
  { href: '/sobre-nosotros', label: 'Sobre Nosotros' },
  { href: '/contacto', label: 'Contacto' },
];

export function Header() {
  const { user, loading } = useAdminAuth();
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  const renderAuthButtons = () => {
    if (loading || !isClient) {
       return (
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-24" />
        </div>
      );
    }

    if (user) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'Usuario'} />
                <AvatarFallback>{user.email?.[0]?.toUpperCase()}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href="/dashboard"><LayoutDashboard className="mr-2"/> Mi Panel</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-500">
             <LogOut className="mr-2"/> Cerrar Sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
    if (loading || !isClient) {
      return null;
    }

    if (user) {
      return (
        <div className="flex flex-col gap-3">
            <Button variant="outline" asChild>
                <Link href="/dashboard">Mi Panel</Link>
            </Button>
            <Button variant="destructive" onClick={handleLogout}>Cerrar Sesión</Button>
        </div>
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

        <nav className="hidden md:flex items-center gap-6 text-base font-medium">
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
