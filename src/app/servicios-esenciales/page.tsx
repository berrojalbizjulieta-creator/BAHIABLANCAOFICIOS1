'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

// Datos de las tarjetas basados en la imagen
const kitchenServices = [
  {
    title: 'Plomería de emergencia',
    link: '/servicios/plomeria',
    imageUrl: 'https://i.pinimg.com/1200x/32/b1/98/32b198f79fca1f095128e0a0b179365b.jpg',
    imageHint: 'plumbing tools',
    description: 'Ver fontaneros cerca de ti'
  },
  {
    title: 'Reparación de trituradores de basura',
    link: '/servicios/plomeria',
    imageUrl: 'https://i.pinimg.com/736x/87/1a/35/871a3554e287534433e14e27c1f0b094.jpg',
    imageHint: 'garbage disposal repair',
    description: 'Vea profesionales de eliminación de basura'
  },
  {
    title: 'Reparación de fregaderos o grifos',
    link: '/servicios/plomeria',
    imageUrl: 'https://i.pinimg.com/736x/a7/6d/46/a76d46d0a7a0b38c3e803a60a4f5f5f7.jpg',
    imageHint: 'sink repair',
    description: 'Ver fontaneros cerca de ti'
  },
  {
    title: 'Reparación de refrigeradores',
    link: '/servicios/reparaciones',
    imageUrl: 'https://i.pinimg.com/736x/c5/45/b5/c545b53023e80b87556f8f117a151b54.jpg',
    imageHint: 'refrigerator repair',
    description: 'Vea especialistas en servicio de electrodomésticos'
  }
];

const bathroomServices = [
  {
    title: 'Plomería de emergencia',
    link: '/servicios/plomeria',
    imageUrl: 'https://i.pinimg.com/736x/f9/3e/d5/f93ed5f313c8b154b89d2b456aad8160.jpg',
    imageHint: 'plumber fixing pipe',
    description: 'Ver fontaneros cerca de ti'
  },
  {
    title: 'Reparación de inodoros',
    link: '/servicios/plomeria',
    imageUrl: 'https://images.unsplash.com/photo-1621232359467-9d6934ea2771?q=80&w=870',
    imageHint: 'toilet repair',
    description: 'Ver fontaneros cerca de ti'
  },
  {
    title: 'Reparación de fregaderos o grifos',
    link: '/servicios/plomeria',
    imageUrl: 'https://images.unsplash.com/photo-1616047006789-b7af5afb8c20?q=80&w=880',
    imageHint: 'bathroom sink',
    description: 'Ver fontaneros cerca de ti'
  },
  {
    title: 'Reparación de puertas de ducha',
    link: '/servicios/vidrieria',
    imageUrl: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?q=80&w=870',
    imageHint: 'shower door',
    description: 'Ver fontaneros cerca de ti'
  }
];

const ServiceCard = ({ title, link, imageUrl, imageHint, description }: { title: string, link: string, imageUrl: string, imageHint: string, description: string }) => {
  return (
    <Link href={link} className="group">
      <Card className="relative overflow-hidden shadow-lg transition-all duration-300 group-hover:shadow-xl">
        <div className="relative aspect-[4/3] w-full">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            data-ai-hint={imageHint}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
        </div>
        <div className="absolute bottom-0 left-0 p-4 text-white">
          <h3 className="text-lg font-bold font-headline">{title}</h3>
          <p className="text-sm mt-1 opacity-90 group-hover:underline">
            {description}
          </p>
        </div>
      </Card>
    </Link>
  );
};

export default function EssentialServicesPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:px-6">
      <div className="text-center mb-16 max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline">
              Servicios esenciales para el hogar.
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Ya sea que tengas tu propia casa o estés alquilando, siempre aparece alguna urgencia. ¿Se te llueve el techo? ¿Saltó la térmica? ¿La calefaccion no arranca? Quedate tranquilo, estás en el lugar justo. Acá encontrás al profesional que necesitás para cualquier arreglo del hogar.
          </p>
          <div className="mt-8">
              <Button asChild size="lg">
              <Link href="/servicios">Contrata un profesional</Link>
              </Button>
          </div>
      </div>

      <div className="space-y-16">
        <section>
          <h2 className="text-2xl font-bold font-headline mb-6">Preocupaciones de la cocina</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {kitchenServices.map(service => <ServiceCard key={service.title} {...service} />)}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold font-headline mb-6">Averías en el baño</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {bathroomServices.map(service => <ServiceCard key={service.title} {...service} />)}
          </div>
        </section>
      </div>
    </div>
  );
}
