import CategoriesGrid from '@/components/home/categories-grid';
import HeroSection from '@/components/home/hero-section';
import PromoSlider from '@/components/home/promo-slider';

export default function Home() {
  return (
    <>
      <HeroSection />
      <CategoriesGrid />
      <PromoSlider />
    </>
  );
}
