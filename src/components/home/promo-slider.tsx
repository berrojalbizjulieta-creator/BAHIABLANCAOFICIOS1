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

export default function PromoSlider() {
  return (
    <section className="py-12 md:py-20 bg-muted/20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-left mb-10">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">
            Servicios que podrían interesarte
          </h2>
          <p className="mt-3 max-w-2xl text-muted-foreground md:text-lg">
            Explora otras categorías populares y encuentra la ayuda que necesitas.
          </p>
        </div>
        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {BANNERS.map((banner) => (
              <CarouselItem key={banner.id} className="md:basis-1/2 lg:basis-1/3">
                <Link href={banner.buttonLink || '#'} className="block group">
                  <div className="relative h-80 w-full overflow-hidden rounded-lg shadow-lg">
                    <Image
                      src={banner.imageUrl}
                      alt={banner.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      data-ai-hint={banner.imageHint}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-6 text-white">
                      <h3 className="text-2xl font-bold font-headline">
                        {banner.title}
                      </h3>
                      {banner.buttonText && (
                        <Button asChild className="mt-2" variant="secondary" size="sm">
                          <span tabIndex={-1}>{banner.buttonText}</span>
                        </Button>
                      )}
                    </div>
                  </div>
                </Link>
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
