'use client';

import Image from 'next/image';
import { BANNERS } from '@/lib/data';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Button } from '../ui/button';
import Link from 'next/link';
import { placeholderImages } from '@/lib/placeholder-images';

const getImage = (id: string) =>
  placeholderImages.find((img) => img.id === id) || {
    imageUrl: '',
    imageHint: '',
  };

const promoBanners = [
    getImage('promo-banner-1'),
    getImage('promo-banner-3'),
    getImage('promo-banner-2'),
].filter(Boolean);


export default function PromoSlider() {
  return (
    <section className="py-12 md:py-20 bg-muted/20">
      <div className="container mx-auto px-4 md:px-6">
        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {BANNERS.map((banner) => (
              <CarouselItem key={banner.id}>
                <div className="relative h-64 md:h-80 w-full overflow-hidden rounded-lg shadow-lg">
                  <Image
                    src={banner.imageUrl}
                    alt={banner.title}
                    fill
                    sizes="100vw"
                    className="object-cover"
                    data-ai-hint={banner.imageHint}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-6 md:p-8 text-white">
                    <h3 className="text-2xl md:text-3xl font-bold font-headline">
                      {banner.title}
                    </h3>
                    <p className="mt-2 max-w-lg text-sm md:text-base">
                      {banner.description}
                    </p>
                    {banner.buttonText && banner.buttonLink && (
                      <Button asChild className="mt-4" variant="secondary">
                        <Link href={banner.buttonLink}>{banner.buttonText}</Link>
                      </Button>
                    )}
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 hidden md:inline-flex" />
          <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:inline-flex" />
        </Carousel>
      </div>
    </section>
  );
}
