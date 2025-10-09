
'use client';

import Image from 'next/image';

export default function AppPromoSection() {
  return (
    <section className="py-20 md:py-24 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          
          <div 
            className="text-center md:text-left z-10"
          >
            <div className="flex flex-col font-headline tracking-tighter text-foreground">
                <span className="text-3xl md:text-4xl font-bold">PRÓXIMAMENTE...</span>
                <span className="text-2xl md:text-3xl font-medium self-start md:self-end">Tus soluciones en la palma de la mano</span>
            </div>
          </div>
          
          <div 
            className="flex justify-center items-center"
          >
            <Image
                src="https://i.postimg.cc/s2wgLdCg/Group-1000003323-1.png"
                alt="Aplicación móvil de BahiaBlancaOficios"
                width={400}
                height={800}
                className="object-contain max-w-[250px] md:max-w-xs"
                data-ai-hint="phone app mockup"
            />
          </div>

        </div>
      </div>
    </section>
  );
}
