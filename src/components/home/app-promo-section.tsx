'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

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
    hidden: { opacity: 0, scale: 0.9, y: 50 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
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
            <Image
                src="https://i.postimg.cc/s2wgLdCg/Group-1000003323-1.png"
                alt="Aplicación móvil de BahiaBlancaOficios"
                width={400}
                height={800}
                className="object-contain max-w-xs md:max-w-sm drop-shadow-2xl"
                data-ai-hint="phone app mockup"
            />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
