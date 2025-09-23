'use client';

import { PROFESSIONALS } from '@/lib/data';
import TestimonialSlider from '../professionals/testimonial-slider';

export default function TestimonialSection() {
  const testimonials = PROFESSIONALS.flatMap(p => p.testimonials);

  return (
    <section className="py-20 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-1 gap-12 items-center">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold font-headline tracking-tighter text-foreground">
              Estas reseñas lo dicen mejor.
            </h2>
             <TestimonialSlider testimonials={testimonials} />
          </div>
        </div>
      </div>
    </section>
  );
}
