import CategoriesGrid from '@/components/home/categories-grid';
import HeroSection from '@/components/home/hero-section';
import PromoSlider from '@/components/home/promo-slider';
import AppPromoSection from '@/components/home/app-promo-section';
import JoinUsSection from '@/components/home/join-us-section';
import TestimonialSection from '@/components/home/testimonial-section';

export default function Home() {
  return (
    <>
      <HeroSection />
      <CategoriesGrid />
      <PromoSlider />
      <AppPromoSection />
      <JoinUsSection />
      <TestimonialSection />
    </>
  );
}
