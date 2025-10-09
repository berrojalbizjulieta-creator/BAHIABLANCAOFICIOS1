'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { placeholderImages } from '@/lib/placeholder-images';

const celularImg = placeholderImages.find(p => p.id === 'app-promo-mockup-new');

export default function AppPromoSection() {
  return (
    <section className="relative py-20 md:py-24 overflow-hidden bg-muted/20">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="text-center md:text-left">
            <div className="flex flex-col font-headline tracking-tighter text-foreground">
                <span className="text-3xl md:text-4xl font-bold">PRÓXIMAMENTE...</span>
                <span className="text-2xl md:text-3xl font-medium self-start md:self-end">Una app pensada para quienes hacen</span>
            </div>
          </div>
          <motion.div
             initial={{ opacity: 0, x: 100 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.8, ease: "easeOut" }}
             className="flex justify-center md:justify-end"
           >
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
          </motion.div>
        </div>
      </div>
    </section>
  );
}
