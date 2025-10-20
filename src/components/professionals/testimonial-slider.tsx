'use client';

import type { Testimonial } from '@/lib/types';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent } from '../ui/card';
import Autoplay from "embla-carousel-autoplay";

interface TestimonialSliderProps {
  testimonials: Testimonial[];
}

export default function TestimonialSlider({
  testimonials,
}: TestimonialSliderProps) {
  return (
    <Carousel
      opts={{
        align: 'start',
        loop: testimonials.length > 1,
      }}
      plugins={[
        Autoplay({
          delay: 5000,
        }),
      ]}
      className="w-full max-w-2xl mx-auto mt-10"
    >
      <CarouselContent className="-ml-2">
        {testimonials.map((testimonial) => (
          <CarouselItem key={testimonial.id} className="pl-2">
            <Card className="bg-transparent border-none shadow-none">
              <CardContent className="p-4 text-center">
                 <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground max-w-xl mx-auto">
                    <p className="text-lg">
                       “{testimonial.text}”
                    </p>
                    <cite className="mt-4 block font-semibold not-italic text-foreground">
                        - {testimonial.clientName}
                    </cite>
                </blockquote>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
        {testimonials.length > 1 && (
        <>
          <CarouselPrevious className="absolute left-4 md:-left-4 top-1/2 -translate-y-1/2" />
          <CarouselNext className="absolute right-4 md:-right-4 top-1/2 -translate-y-1/2" />
        </>
      )}
    </Carousel>
  );
}
