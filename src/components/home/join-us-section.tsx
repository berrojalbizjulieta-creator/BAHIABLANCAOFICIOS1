
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { placeholderImages } from '@/lib/placeholder-images';

const joinIllustration = placeholderImages.find(p => p.id === 'work-5');

export default function JoinUsSection() {
  return (
    <section className="py-20 md:py-24 bg-muted/20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="flex justify-center">
              <Image
                src="https://i.postimg.cc/prbsXFyh/b5a7f93a-e2d3-4543-a2ef-d1765fb00143.jpg"
                alt="Profesionales de distintos oficios trabajando juntos"
                width={500}
                height={500}
                className="rounded-xl object-cover border-8 border-background shadow-xl"
                data-ai-hint="professionals working"
              />
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold font-headline tracking-tighter text-foreground">
              Unite a la comunidad
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">
              Cualquiera sea el trabajo que hagas, tenemos clientes buscándote. Formá parte de la comunidad de profesionales de Bahía Blanca Oficios y activá tu Plan Premium GRATIS por 3 meses.
            </p>
            <Button asChild className="mt-6">
              <Link href="/signup">
                Activá tu prueba GRATIS ahora
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
