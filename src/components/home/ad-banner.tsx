'use client';

import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { Card } from '../ui/card';
import { AD_BANNERS } from '@/lib/data';

export default function AdBanner() {
  return (
    <section className="py-8">
      <div className="container mx-auto px-4 md:px-6">
        <Carousel
          plugins={[
            Autoplay({
              delay: 4000,
              stopOnInteraction: true,
            }),
          ]}
          className="w-full"
          opts={{
            loop: true,
          }}
        >
          <CarouselContent>
            {AD_BANNERS.map(banner => (
              <CarouselItem key={banner.id}>
                <Card className="overflow-hidden">
                  <div className="relative aspect-[3/1] w-full">
                    <Image
                      src={banner.imageUrl}
                      alt={banner.alt}
                      fill
                      className="object-cover"
                      data-ai-hint={banner.imageHint}
                    />
                  </div>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}
