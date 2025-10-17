
'use client';

import { Facebook, Instagram, Phone, Mail } from 'lucide-react';
import Link from 'next/link';
import { Logo } from '../icons/logo';
import { useState } from 'react';
import TermsDialog from '../auth/terms-dialog';
import PrivacyPolicyDialog from '../auth/privacy-policy-dialog';
import { Button } from '../ui/button';

export function Footer() {
  const whatsappNumber = '5492915088831';
  const emailAddress = 'bahiablancaoficios@gmail.com';
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  return (
    <>
      <footer className="bg-muted/40" id="about">
        <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
            <div className="lg:col-span-1 text-center lg:text-left">
              <div className="flex justify-center lg:justify-start">
                <Logo className="h-10 w-auto" />
              </div>
              <p className="mt-4 max-w-xs text-sm text-muted-foreground mx-auto lg:mx-0">
                Conectando a la comunidad de Bahía Blanca con los mejores
                profesionales y oficios.
              </p>
              <div className="mt-6 flex space-x-4 justify-center lg:justify-start">
                <Link
                  href="https://www.facebook.com/share/1CCm6VA8BM/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary"
                >
                  <span className="sr-only">Facebook</span>
                  <Facebook className="h-6 w-6" />
                </Link>
                <Link
                  href="https://www.instagram.com/bahiablancaoficios?igsh=ZzJlYzJwMzhtYjBp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary"
                >
                  <span className="sr-only">Instagram</span>
                  <Instagram className="h-6 w-6" />
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 lg:col-span-3 sm:grid-cols-4 text-center sm:text-left">
              <div>
                <p className="font-bold text-foreground">Servicios</p>
                <nav className="mt-4 flex flex-col space-y-2 text-sm">
                  <Link
                    href="/servicios/plomeria"
                    className="text-muted-foreground hover:text-primary"
                  >
                    Plomería
                  </Link>
                  <Link
                    href="/servicios/electricista"
                    className="text-muted-foreground hover:text-primary"
                  >
                    Electricidad
                  </Link>
                  <Link
                    href="/servicios/pintores"
                    className="text-muted-foreground hover:text-primary"
                  >
                    Pintura
                  </Link>
                  <Link
                    href="/servicios/jardineria"
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
                    href="/sobre-nosotros"
                    className="text-muted-foreground hover:text-primary"
                  >
                    Sobre OficiosBB
                  </Link>
                  <Link
                    href="/signup"
                    className="text-muted-foreground hover:text-primary"
                  >
                    Para Profesionales
                  </Link>
                  <Link
                    href="/contacto"
                    className="text-muted-foreground hover:text-primary"
                  >
                    Contacto
                  </Link>
                </nav>
              </div>
              
              <div>
                <p className="font-bold text-foreground">Contacto Rápido</p>
                <nav className="mt-4 flex flex-col space-y-3 text-sm">
                  <a
                    href={`https://wa.me/${whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary justify-center sm:justify-start"
                  >
                    <Phone className="h-4 w-4"/>
                    WhatsApp
                  </a>
                  <a
                    href={`mailto:${emailAddress}`}
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary justify-center sm:justify-start"
                  >
                    <Mail className="h-4 w-4" />
                    Email
                  </a>
                </nav>
              </div>

              <div>
                <p className="font-bold text-foreground">Legal</p>
                <nav className="mt-4 flex flex-col space-y-2 text-sm">
                  <Button
                    variant="link"
                    className="p-0 h-auto justify-center sm:justify-start text-muted-foreground hover:text-primary"
                    onClick={() => setIsTermsOpen(true)}
                  >
                    Términos y Condiciones
                  </Button>
                   <Button
                    variant="link"
                    className="p-0 h-auto justify-center sm:justify-start text-muted-foreground hover:text-primary"
                    onClick={() => setIsPrivacyOpen(true)}
                  >
                    Política de Privacidad
                  </Button>
                </nav>
              </div>
            </div>
          </div>

          <div className="mt-10 border-t border-border pt-6 text-center text-sm text-muted-foreground">
            <p>
              &copy; {new Date().getFullYear()} Bahia Blanca Oficios. Todos los
              derechos reservados.
            </p>
          </div>
        </div>
      </footer>
      <TermsDialog isOpen={isTermsOpen} onOpenChange={setIsTermsOpen} />
      <PrivacyPolicyDialog isOpen={isPrivacyOpen} onOpenChange={setIsPrivacyOpen} />
    </>
  );
}
