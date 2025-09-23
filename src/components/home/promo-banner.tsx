'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function PromoBanner() {
  return (
    <section className="bg-muted/30 py-12 md:py-16">
      <div className="container mx-auto px-4 md:px-6">
        <Link href="/servicios" className="block w-full h-auto rounded-xl overflow-hidden group shadow-lg hover:shadow-2xl transition-shadow duration-300">
          <div className="relative aspect-[4/1] w-full">
            <Image
              src="https://i.pinimg.com/1200x/f1/58/a4/f158a4fbfe21b2f80c299ea49b409ec9.jpg"
              alt="Banner de herramientas y oficios"
              fill
              sizes="(max-width: 768px) 100vw, 1200px"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              data-ai-hint="tools banner"
            />
          </div>
        </Link>
      </div>
    </section>
  );
}
