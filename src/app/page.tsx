'use client';
// Force Rebuild: Sat Jul 27 2024 22:20:10 GMT+0000 (Coordinated Universal Time)

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect, useState } from 'react';

// --- Componentes que se cargan inmediatamente ---
import CategoriesGrid from '@/components/home/categories-grid';
import HeroSection from '@/components/home/hero-section';
import AdBanner from '@/components/home/ad-banner';

// --- Componentes que se cargarán dinámicamente ---
const AppPromoSection = dynamic(() => import('@/components/home/app-promo-section'), { 
  ssr: false 
});
const JoinUsSection = dynamic(() => import('@/components/home/join-us-section'), { 
  ssr: false 
});
const TestimonialSection = dynamic(() => import('@/components/home/testimonial-section'), { 
  ssr: false 
});

// Definimos PromoSlider fuera para poder usarlo después
const PromoSlider = dynamic(() => import('@/components/home/promo-slider'), { 
  ssr: false,
});


export default function Home() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Este efecto solo se ejecuta en el navegador, después de la carga inicial.
    // Esto asegura que los componentes que dependen del navegador se rendericen sin errores de hidratación.
    setIsClient(true);
  }, []);

  return (
    <>
      <HeroSection />
      <CategoriesGrid />
      <AdBanner />
      
      {/* El PromoSlider solo se renderizará en el lado del cliente */}
      {isClient ? <PromoSlider /> : <section className="py-12 md:py-20 bg-muted/20"><div className="container mx-auto px-4 md:px-6"><Skeleton className="h-96 w-full" /></div></section>}
      
      <AppPromoSection />
      <JoinUsSection />
      <TestimonialSection />
    </>
  );
}
