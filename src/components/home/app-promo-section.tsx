'use client';

import Image from 'next/image';
import { placeholderImages } from '@/lib/placeholder-images';
import { Button } from '../ui/button';
import Link from 'next/link';

const appImage = placeholderImages.find(img => img.id === 'app-promo-mockup');

export default function AppPromoSection() {
  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold font-headline tracking-tighter text-foreground">
              La única app que necesitas para solucionarlo todo
            </h2>
            <p className="mt-4 text-muted-foreground text-lg md:text-xl max-w-md mx-auto md:mx-0">
              Desde guías personalizadas hasta la planificación de proyectos sin esfuerzo, todo está aquí, en una sola aplicación gratuita. ¡Próximamente!
            </p>
            <div className="mt-8 flex justify-center md:justify-start gap-4">
              <Link href="#" passHref>
                <Image src="/app-store-badge.svg" alt="Download on the App Store" width={135} height={40} />
              </Link>
              <Link href="#" passHref>
                <Image src="/google-play-badge.svg" alt="Get it on Google Play" width={135} height={40} />
              </Link>
            </div>
          </div>
          <div className="flex justify-center">
            {appImage && (
              <Image
                src={appImage.imageUrl}
                alt={appImage.description}
                width={300}
                height={600}
                className="rounded-[2.5rem] shadow-2xl object-cover"
                data-ai-hint={appImage.imageHint}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
