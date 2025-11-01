// Force Rebuild: Sat Jul 27 2024 22:20:10 GMT+0000 (Coordinated Universal Time)
// Force Rebuild: Sat Jul 27 2024 22:15:33 GMT+0000 (Coordinated Universal Time)
// Restoration Point: Fri Jul 26 2024 18:23:44 GMT+0000 (Coordinated Universal Time)

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

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

const CtaSection = () => (
    <section className="py-8">
        <div className="container mx-auto px-4">
            <div className="bg-muted/30 p-6 rounded-lg text-center border">
                <h3 className="font-bold text-lg text-foreground">¿Sos profesional o tenés un oficio?</h3>
                <p className="text-muted-foreground text-sm mt-1 mb-4">Sumate a nuestra comunidad y conseguí más clientes.</p>
                <Button asChild size="lg" className="w-full sm:w-auto">
                    <Link href="/signup">
                        REGISTRATE ACÁ
                    </Link>
                </Button>
            </div>
        </div>
    </section>
);


export default function Home() {
  return (
    <>
      <HeroSection />
      <CategoriesGrid />
      <CtaSection />
      <AdBanner />
      <PromoSlider />
      <AppPromoSection />
      <JoinUsSection />
      <TestimonialSection />
    </>
  );
}
