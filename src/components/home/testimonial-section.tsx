'use client';

import { PROFESSIONALS } from '@/lib/data';
import TestimonialSlider from '../professionals/testimonial-slider';

export default function TestimonialSection() {
  const testimonials = PROFESSIONALS.flatMap(p => p.testimonials);

  return (
    <section className="py-20 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold font-headline tracking-tighter text-foreground">
              Estas reseñas lo dicen mejor.
            </h2>
            <blockquote className="mt-6 border-l-4 border-primary pl-4 italic text-muted-foreground">
              <p className="text-lg">
                “No me había dado cuenta de cuántos profesionales había en Bahía. Escribís cosas como &quot;limpieza de casas&quot; o &quot;jardinería&quot; y aparecen un montón de opciones. Lo que sea que necesites, acá está.”
              </p>
              <cite className="mt-4 block font-semibold not-italic text-foreground">
                - Sofía C.
              </cite>
            </blockquote>
          </div>
          <div className="flex justify-center">
            <TestimonialSlider testimonials={testimonials} />
          </div>
        </div>
      </div>
    </section>
  );
}
