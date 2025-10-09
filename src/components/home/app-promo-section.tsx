'use client';

import Image from 'next/image';
import { placeholderImages } from '@/lib/placeholder-images';

const celularImg = placeholderImages.find(p => p.id === 'app-promo-mockup');

export default function AppPromoSection() {
  return (
    <section className="relative py-20 md:py-24 overflow-hidden bg-muted/20">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="text-center md:text-left">
            <div className="flex flex-col font-headline tracking-tighter text-foreground">
                <span className="text-3xl md:text-4xl font-bold">PRÓXIMAMENTE...</span>
                <span className="text-2xl md:text-3xl font-medium self-end">Tus soluciones en la palma de la mano</span>
            </div>
          </div>
          <div className="flex justify-center md:justify-start">
            {celularImg && (
              <Image
                src={celularImg.imageUrl}
                alt={celularImg.description}
                width={800}
                height={1600}
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
