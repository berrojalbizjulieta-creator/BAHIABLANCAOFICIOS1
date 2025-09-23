import Image from 'next/image';
import { Star } from 'lucide-react';
import type { Testimonial } from '@/lib/types';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

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
      className="w-full"
    >
      <CarouselContent className="-ml-2">
        {testimonials.map((testimonial) => (
          <CarouselItem key={testimonial.id} className="pl-2">
            <Card className="bg-muted/50 border-none shadow-none">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarImage
                      src={testimonial.clientPhotoUrl}
                      alt={testimonial.clientName}
                      data-ai-hint={testimonial.clientPhotoHint}
                    />
                    <AvatarFallback>
                      {testimonial.clientName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-sm">
                        {testimonial.clientName}
                      </p>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < testimonial.rating
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 italic">
                      &quot;{testimonial.text}&quot;
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      {testimonials.length > 1 && (
        <>
          <CarouselPrevious className="absolute -left-3 top-1/2 -translate-y-1/2" />
          <CarouselNext className="absolute -right-3 top-1/2 -translate-y-1/2" />
        </>
      )}
    </Carousel>
  );
}
