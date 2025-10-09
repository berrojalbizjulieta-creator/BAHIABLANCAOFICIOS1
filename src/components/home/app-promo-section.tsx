'use client';

import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
// Importa directamente el JSON para evitar problemas de carga.
import allImages from '@/lib/placeholder-images.json';

const celularImg = allImages.placeholderImages.find(p => p.id === 'app-promo-mockup');

export default function AppPromoSection() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const x = useTransform(scrollYProgress, [0, 1], ['50%', '-50%']);

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


  return (
    <section 
        ref={sectionRef} 
        className="relative py-20 md:py-32 overflow-hidden bg-muted/20"
    >
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <motion.div 
            className="text-center md:text-left"
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
                <motion.span variants={textVariants} className="text-2xl md:text-3xl font-medium self-end">Tus soluciones en la palma de la mano</motion.span>
            </div>
          </motion.div>
          
          <motion.div 
            style={{ x }}
            className="absolute top-1/2 left-1/2 -translate-y-1/2 w-[250px] md:w-[350px] z-0 opacity-80 md:opacity-100"
          >
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
          </motion.div>

        </div>
      </div>
    </section>
  );
}
