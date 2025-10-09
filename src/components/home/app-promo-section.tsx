'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { placeholderImages } from '@/lib/placeholder-images';

// Usamos una imagen que sabemos que existe en el JSON de placeholders.
const celularImg = placeholderImages.find(p => p.id === 'app-promo-mockup');

export default function AppPromoSection() {
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="py-20 md:py-32 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          
          <motion.div 
            className="text-center md:text-left z-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={{
                visible: {
                    transition: {
                        staggerChildren: 0.3
                    }
                }
            }}
          >
            <div className="flex flex-col font-headline tracking-tighter text-foreground">
                <motion.span variants={textVariants} className="text-3xl md:text-4xl font-bold">PRÓXIMAMENTE...</motion.span>
                <motion.span variants={textVariants} className="text-2xl md:text-3xl font-medium self-start md:self-end">Tus soluciones en la palma de la mano</motion.span>
            </div>
          </motion.div>
          
          <motion.div 
            className="flex justify-center items-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={imageVariants}
          >
             {celularImg && (
                <Image
                    src={celularImg.imageUrl}
                    alt="Aplicación móvil de BahiaBlancaOficios"
                    width={350}
                    height={700}
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
