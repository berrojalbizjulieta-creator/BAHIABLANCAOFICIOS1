
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { placeholderImages } from '@/lib/placeholder-images';

const celularImg = placeholderImages.find(p => p.id === 'app-promo-mockup-new');

export default function AppPromoSection() {
  return (
    <section className="relative py-20 md:py-24 overflow-hidden bg-muted/20">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold font-headline tracking-tighter text-foreground">
              Tus soluciones, en la palma de tu mano. Próximamente.
            </h2>
            <div className="mt-8 flex justify-center md:justify-start gap-4">
              <Link href="#" passHref>
                <Image
                  src="/google-play-badge.svg"
                  alt="Get it on Google Play"
                  width={135}
                  height={40}
                  className="opacity-90 hover:opacity-100 transition-opacity"
                />
              </Link>
              <Link href="#" passHref>
                <Image
                  src="/app-store-badge.svg"
                  alt="Download on the App Store"
                  width={135}
                  height={40}
                  className="opacity-90 hover:opacity-100 transition-opacity"
                />
              </Link>
            </div>
          </div>
          <div className="flex justify-center md:justify-start">
            {celularImg && (
              <Image
                src={celularImg.imageUrl}
                alt={celularImg.description}
                width={350}
                height={700}
                className="object-contain"
                data-ai-hint={celularImg.imageHint}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
