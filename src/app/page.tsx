import CategoriesGrid from '@/components/home/categories-grid';
import HeroSection from '@/components/home/hero-section';
import PromoSlider from '@/components/home/promo-slider';
import AppPromoSection from '@/components/home/app-promo-section';
import JoinUsSection from '@/components/home/join-us-section';
import TestimonialSection from '@/components/home/testimonial-section';
import AdBanner from '@/components/home/ad-banner';

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
