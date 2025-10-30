
// Force Rebuild: Sat Jul 27 2024 22:15:33 GMT+0000 (Coordinated Universal Time)
// Restoration Point: Fri Jul 26 2024 18:23:44 GMT+0000 (Coordinated Universal Time)

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

// --- Componentes que se cargan inmediatamente ---
import CategoriesGrid from '@/components/home/categories-grid';
import HeroSection from '@/components/home/hero-section';
import AdBanner from '@/components/home/ad-banner';

// --- Componentes que se cargarán dinámicamente (cuando el usuario se acerque a ellos) ---
const PromoSlider = dynamic(() => import('@/components/home/promo-slider'), { 
  loading: () => <Skeleton className="h-96 w-full" />,
  ssr: false 
});
const AppPromoSection = dynamic(() => import('@/components/home/app-promo-section'), { 
  ssr: false 
});
const JoinUsSection = dynamic(() => import('@/components/home/join-us-section'), { 
  ssr: false 
});
const TestimonialSection = dynamic(() => import('@/components/home/testimonial-section'), { 
  ssr: false 
});


export default function Home() {
  return (
    <>
      <HeroSection />
      <CategoriesGrid />
      <AdBanner />
      <PromoSlider />
      <AppPromoSection />
      <JoinUsSection />
      <TestimonialSection />
    </>
  );
}
