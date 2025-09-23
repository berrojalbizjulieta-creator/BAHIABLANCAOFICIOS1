import CategoriesGrid from '@/components/home/categories-grid';
import HeroSection from '@/components/home/hero-section';
import PromoSlider from '@/components/home/promo-slider';
import AppPromoSection from '@/components/home/app-promo-section';
import PromoBanner from '@/components/home/promo-banner';

export default function Home() {
  return (
    <>
      <HeroSection />
      <PromoBanner />
      <CategoriesGrid />
      <PromoSlider />
      <AppPromoSection />
    </>
  );
}
