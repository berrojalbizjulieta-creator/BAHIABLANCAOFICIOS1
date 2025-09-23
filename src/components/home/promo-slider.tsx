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
import Link from 'next/link';
import { Card, CardContent } from '../ui/card';
import { ArrowRight } from 'lucide-react';

export default function PromoSlider() {
  return (
    <section className="py-12 md:py-20 bg-muted/20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-left mb-10">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">
            Explora otros servicios
          </h2>
          <p className="mt-3 max-w-2xl text-muted-foreground md:text-lg">
            Descubre todo lo que nuestros profesionales pueden hacer por ti y tu hogar.
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
                 <Card className="overflow-hidden h-full flex flex-col">
                    <div className="relative aspect-[4/3] w-full overflow-hidden">
                      <Image
                        src={banner.imageUrl}
                        alt={banner.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        data-ai-hint={banner.imageHint}
                      />
                    </div>
                    <CardContent className="p-4 flex-1 flex flex-col justify-between">
                       <div>
                          <h3 className="text-lg font-bold font-headline mb-1">
                            {banner.title}
                          </h3>
                           <p className="text-sm text-muted-foreground">{banner.description}</p>
                       </div>
                       {banner.buttonText && (
                         <div className="flex items-center text-primary font-semibold text-sm mt-4 group-hover:underline">
                           {banner.buttonText}
                           <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                         </div>
                       )}
                    </CardContent>
                  </Card>
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
