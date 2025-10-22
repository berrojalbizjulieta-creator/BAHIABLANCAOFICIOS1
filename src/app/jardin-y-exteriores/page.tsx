
'use client';

import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { placeholderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { CATEGORIES } from '@/lib/data';
import type { Category } from '@/lib/types';


const lawnServices = [
  {
    subtitle: 'Mantenimiento integral',
    title: 'Cuidado completo del césped',
    categoryName: 'Jardinería',
    image: placeholderImages.find(p => p.id === 'garden-full-service'),
    imageHint: 'lush garden',
  },
  {
    subtitle: 'Servicio rápido y prolijo',
    title: 'Corte y recorte de césped',
    categoryName: 'Jardinería',
    image: placeholderImages.find(p => p.id === 'garden-mowing'),
    imageHint: 'lawn mower',
  },
  {
    subtitle: 'Seguridad y experiencia',
    title: 'Poda de árboles',
    categoryName: 'Jardinería',
    image: placeholderImages.find(p => p.id === 'garden-tree-trimming'),
    imageHint: 'tree trimming',
  },
];

const gardenGoalsServices = [
    {
        subtitle: 'Césped verde y parejo',
        title: 'Cuidado del cesped',
        categoryName: 'Jardinería',
        image: placeholderImages.find(p => p.id === 'garden-sod-installation'),
        imageHint: 'sod installation',
    },
    {
        subtitle: 'Ahorrá agua y tiempo',
        title: 'Instalación de riego',
        categoryName: 'Jardinería',
        image: placeholderImages.find(p => p.id === 'garden-sprinkler'),
        imageHint: 'sprinkler system',
    },
     {
        subtitle: 'Protegé tus plantas',
        title: 'Mulching y cobertura',
        categoryName: 'Jardinería',
        image: placeholderImages.find(p => p.id === 'garden-mulching'),
        imageHint: 'gardening mulch',
    },
    {
        subtitle: 'Más seguridad y privacidad',
        title: 'Instalación de cercos',
        categoryName: 'Herrería',
        image: placeholderImages.find(p => p.id === 'garden-fence'),
        imageHint: 'wood fence',
    },
    {
        subtitle: 'Agua cristalina todo el año',
        title: 'Limpieza de piletas',
        categoryName: 'Limpieza',
        image: placeholderImages.find(p => p.id === 'pool-cleaning'),
        imageHint: 'pool cleaning',
    }
];

const getCategoryByName = (name: string): Category | undefined => {
    return CATEGORIES.find(c => c.name.toLowerCase() === name.toLowerCase());
}

const ServiceCard = ({ subtitle, title, categoryName, image }: { subtitle?: string, title: string, categoryName: string, image: any }) => {
    if (!image) return null;

    const category = getCategoryByName(categoryName);
    if (!category) return null;
    
    const link = `/servicios/${encodeURIComponent(category.name.toLowerCase().replace(/ y /g, '-').replace(/ /g, '-'))}`;

    return (
        <Link href={link} className="group">
          <Card className="relative overflow-hidden shadow-lg transition-all duration-300 group-hover:shadow-xl">
            <div className="relative aspect-[4/3] w-full">
              <Image
                src={image.imageUrl}
                alt={title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                data-ai-hint={image.imageHint}
              />
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>
             <div className="absolute bottom-0 left-0 p-4 text-white">
                {subtitle && <p className="text-sm font-medium opacity-90">{subtitle}</p>}
                <h3 className="text-lg font-bold font-headline">{title}</h3>
            </div>
          </Card>
        </Link>
    )
}

export default function OutdoorServicesPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:px-6">
      <div className="text-left mb-16 max-w-4xl">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline">
             Tu jardín, tu lugar.
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Desde el pasto hasta las plantas, encontrá todo lo que necesitás para que tu espacio exterior luzca impecable. Pedí profesionales para mantenimiento, arreglos o proyectos de jardinería.
          </p>
      </div>

      <div className="space-y-16">
        <section>
          <h2 className="text-2xl font-bold font-headline mb-6">Del Césped a la Hoja</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {lawnServices.map((service) => <ServiceCard key={service.title} {...service} />)}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold font-headline mb-6">Objetivos de Jardinería</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {gardenGoalsServices.map((service) => <ServiceCard key={service.title} {...service} />)}
          </div>
        </section>
      </div>
    </div>
  );
}
