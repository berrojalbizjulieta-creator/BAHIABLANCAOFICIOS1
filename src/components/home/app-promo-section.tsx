'use client';

import Image from 'next/image';
import { placeholderImages } from '@/lib/placeholder-images';

const celularImg = placeholderImages.find(p => p.id === 'app-promo-mockup-new');

export default function AppPromoSection() {
  return (
    <section className="relative py-20 md:py-24 overflow-hidden bg-muted/20">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold font-headline tracking-tighter text-foreground">
              <span className="block">PRÓXIMAMENTE...</span>
              <span className="block text-2xl md:text-3xl font-medium mt-2">Tus soluciones en la palma de la mano</span>
            </h2>
          </div>
          <div className="flex justify-center md:justify-start">
            {celularImg && (
              <Image
                src={celularImg.imageUrl}
                alt={celularImg.description}
                width={550}
                height={1100}
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
