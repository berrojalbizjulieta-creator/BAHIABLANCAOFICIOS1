import { Facebook, Instagram, Twitter } from 'lucide-react';
import Link from 'next/link';
import { Logo } from '../icons/logo';

export function Footer() {
  return (
    <footer className="bg-muted/40" id="about">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div>
            <Logo className="h-10 w-auto" />
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              Conectando a la comunidad de Bahía Blanca con los mejores
              profesionales y oficios.
            </p>
            <div className="mt-6 flex space-x-4">
              <Link
                href="#"
                className="text-muted-foreground hover:text-primary"
              >
                <span className="sr-only">Facebook</span>
                <Facebook className="h-6 w-6" />
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-primary"
              >
                <span className="sr-only">Instagram</span>
                <Instagram className="h-6 w-6" />
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-primary"
              >
                <span className="sr-only">Twitter</span>
                <Twitter className="h-6 w-6" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 lg:col-span-2 sm:grid-cols-4">
            <div>
              <p className="font-bold text-foreground">Servicios</p>
              <nav className="mt-4 flex flex-col space-y-2 text-sm">
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary"
                >
                  Plomería
                </Link>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary"
                >
                  Electricidad
                </Link>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary"
                >
                  Pintura
                </Link>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary"
                >
                  Jardinería
                </Link>
              </nav>
            </div>

            <div>
              <p className="font-bold text-foreground">Nosotros</p>
              <nav className="mt-4 flex flex-col space-y-2 text-sm">
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary"
                >
                  Sobre OficiosBB
                </Link>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary"
                >
                  Para Profesionales
                </Link>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary"
                >
                  Contacto
                </Link>
              </nav>
            </div>
             <div>
              <p className="font-bold text-foreground">Legal</p>
              <nav className="mt-4 flex flex-col space-y-2 text-sm">
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary"
                >
                  Términos y Condiciones
                </Link>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary"
                >
                  Política de Privacidad
                </Link>
              </nav>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-6 text-center text-sm text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} Bahia Blanca Oficios. Todos los
            derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
