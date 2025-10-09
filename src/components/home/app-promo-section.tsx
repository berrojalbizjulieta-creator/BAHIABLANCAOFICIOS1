
'use client';

import Image from 'next/image';
import { placeholderImages } from '@/lib/placeholder-images';

const celularImg = placeholderImages.find(p => p.id === 'app-promo-mockup-new');

export default function AppPromoSection() {
  return (
    <section className="py-20 md:py-24 overflow-hidden bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          
          <div className="text-center md:text-left">
            <div className="flex flex-col font-headline tracking-tighter text-foreground">
                <span className="text-3xl md:text-4xl font-bold">PRÓXIMAMENTE...</span>
                <span className="text-2xl md:text-3xl font-medium self-start md:self-end">Tus soluciones en la palma de la mano</span>
            </div>
          </div>
          
          <div className="flex justify-center items-center">
            {celularImg && (
                <Image
                    src={celularImg.imageUrl}
                    alt={celularImg.description}
                    width={400}
                    height={800}
                    className="object-contain max-w-xs md:max-w-sm"
                    data-ai-hint={celularImg.imageHint}
                />
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
