'use client';

import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { Card } from '../ui/card';

const adBanners = [
  {
    id: 1,
    imageUrl: 'https://picsum.photos/seed/ad1/1200/400',
    alt: 'Publicidad de herramientas',
    imageHint: 'construction tools',
  },
  {
    id: 2,
    imageUrl: 'https://picsum.photos/seed/ad2/1200/400',
    alt: 'Publicidad de materiales de construcción',
    imageHint: 'building materials',
  },
  {
    id: 3,
    imageUrl: 'https://picsum.photos/seed/ad3/1200/400',
    alt: 'Publicidad de productos de limpieza',
    imageHint: 'cleaning supplies',
  },
];

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
            {adBanners.map(banner => (
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
