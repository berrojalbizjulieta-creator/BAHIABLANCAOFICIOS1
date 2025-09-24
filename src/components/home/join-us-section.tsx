
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { placeholderImages } from '@/lib/placeholder-images';
import { ArrowRight } from 'lucide-react';

const joinIllustration = placeholderImages.find(p => p.id === 'work-5');

export default function JoinUsSection() {
  return (
    <section className="py-20 md:py-24 bg-muted/20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="flex justify-center">
            {joinIllustration && (
              <Image
                src="https://i.pinimg.com/736x/db/f0/57/dbf0577b8b35d18acf0d51b9207b5a70.jpg"
                alt="Agustín y Julieta"
                width={450}
                height={450}
                className="rounded-full object-cover border-8 border-background shadow-xl"
                data-ai-hint="couple portrait"
              />
            )}
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold font-headline tracking-tighter text-foreground">
              Abierto al público.
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">
              Cualquiera sea el trabajo que hagas, encontraremos para vos el que estás buscando. Sumate a nuestra comunidad de profesionales.
            </p>
            <Button asChild className="mt-6">
              <Link href="/signup">
                Conviértete en un profesional <ArrowRight className="ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
