'use client';

import Image from 'next/image';
import Link from 'next/link';
import { placeholderImages } from '@/lib/placeholder-images';

const backgroundImage = placeholderImages.find(img => img.id === 'hero-background-1');

export default function AppPromoSection() {
  return (
    <section className="relative py-20 md:py-24 bg-background">
      {backgroundImage && (
        <Image
            src={backgroundImage.imageUrl}
            alt={backgroundImage.description}
            fill
            className="object-cover"
            data-ai-hint={backgroundImage.imageHint}
        />
      )}
      <div className="absolute inset-0 bg-black/60"></div>
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold font-headline tracking-tighter text-white">
              Hazlo fácil, hazlo desde la app
            </h2>
            <p className="mt-4 text-white/80 text-lg md:text-xl">
              Tus proyectos, tus profesionales y tus pagos, todo en un mismo lugar. ¡Próximamente disponible!
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link href="#" passHref>
                <Image src="/app-store-badge.svg" alt="Download on the App Store" width={135} height={40} className='opacity-90 hover:opacity-100 transition-opacity'/>
              </Link>
              <Link href="#" passHref>
                <Image src="/google-play-badge.svg" alt="Get it on Google Play" width={135} height={40} className='opacity-90 hover:opacity-100 transition-opacity'/>
              </Link>
            </div>
          </div>
      </div>
    </section>
  );
}
