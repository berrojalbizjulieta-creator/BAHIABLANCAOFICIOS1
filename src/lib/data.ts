import {
  Wrench,
  Plug,
  Paintbrush,
  Hammer,
  Wind,
  DoorOpen,
  Flower,
  Computer,
} from 'lucide-react';
import type { Category, Professional, Banner } from '@/lib/types';
import { PlaceHolderImages } from './placeholder-images';

const getImage = (id: string) =>
  PlaceHolderImages.find((img) => img.id === id) || {
    imageUrl: '',
    imageHint: '',
  };

export const CATEGORIES: Category[] = [
  {
    id: 1,
    name: 'Plomería',
    icon: Wrench,
    description: 'Soluciones para tuberías, grifos y filtraciones.',
  },
  {
    id: 2,
    name: 'Electricidad',
    icon: Plug,
    description: 'Instalaciones, reparaciones y mantenimiento eléctrico.',
  },
  {
    id: 3,
    name: 'Pintura',
    icon: Paintbrush,
    description: 'Pintura de interiores, exteriores y decorativa.',
  },
  {
    id: 4,
    name: 'Carpintería',
    icon: Hammer,
    description: 'Muebles a medida, reparaciones y trabajos en madera.',
  },
  {
    id: 5,
    name: 'Aire Acondicionado',
    icon: Wind,
    description: 'Instalación, mantenimiento y reparación de equipos.',
  },
  {
    id: 6,
    name: 'Cerrajería',
    icon: DoorOpen,
    description: 'Apertura de puertas, cambio de cerraduras y seguridad.',
  },
  {
    id: 7,
    name: 'Jardinería',
    icon: Flower,
    description: 'Mantenimiento de jardines, poda y paisajismo.',
  },
  {
    id: 8,
    name: 'Reparación de PC',
    icon: Computer,
    description: 'Soporte técnico, reparación de hardware y software.',
  },
];

export const PROFESSIONALS: Professional[] = [
  {
    id: 1,
    name: 'Carlos Rodriguez',
    photoUrl: getImage('prof-1').imageUrl,
    photoHint: getImage('prof-1').imageHint,
    specialties: ['Reparación de Fugas', 'Instalación de Grifería'],
    avgRating: 4.8,
    categoryId: 1,
    testimonials: [
      {
        id: 1,
        clientName: 'Ana Gomez',
        clientPhotoUrl: getImage('client-1').imageUrl,
        clientPhotoHint: getImage('client-1').imageHint,
        rating: 5,
        text: 'Excelente servicio. Rápido y muy profesional.',
      },
      {
        id: 2,
        clientName: 'Juan Pérez',
        clientPhotoUrl: getImage('client-3').imageUrl,
        clientPhotoHint: getImage('client-3').imageHint,
        rating: 4,
        text: 'Buen trabajo, resolvió el problema de la tubería eficientemente.',
      },
    ],
  },
  {
    id: 2,
    name: 'Lucía Fernandez',
    photoUrl: getImage('prof-2').imageUrl,
    photoHint: getImage('prof-2').imageHint,
    specialties: ['Instalaciones Eléctricas', 'Tableros'],
    avgRating: 5.0,
    categoryId: 2,
    testimonials: [
      {
        id: 3,
        clientName: 'María López',
        clientPhotoUrl: getImage('client-2').imageUrl,
        clientPhotoHint: getImage('client-2').imageHint,
        rating: 5,
        text: '¡Impecable! Muy prolija y atenta a los detalles.',
      },
      {
        id: 4,
        clientName: 'Pedro Martins',
        clientPhotoUrl: getImage('client-4').imageUrl,
        clientPhotoHint: getImage('client-4').imageHint,
        rating: 5,
        text: 'La mejor electricista de la ciudad. Totalmente recomendada.',
      },
    ],
  },
  {
    id: 3,
    name: 'Miguel Torres',
    photoUrl: getImage('prof-3').imageUrl,
    photoHint: getImage('prof-3').imageHint,
    specialties: ['Pintura de Interiores', 'Empapelado'],
    avgRating: 4.5,
    categoryId: 3,
    testimonials: [
      {
        id: 5,
        clientName: 'Laura Sanchez',
        clientPhotoUrl: getImage('client-1').imageUrl,
        clientPhotoHint: getImage('client-1').imageHint,
        rating: 4,
        text: 'El departamento quedó como nuevo, aunque tardó un poco más de lo esperado.',
      },
    ],
  },
  {
    id: 4,
    name: 'Jorge Herrera',
    photoUrl: getImage('prof-4').imageUrl,
    photoHint: getImage('prof-4').imageHint,
    specialties: ['Muebles a Medida'],
    avgRating: 4.9,
    categoryId: 4,
    testimonials: [
      {
        id: 6,
        clientName: 'Sofía Castro',
        clientPhotoUrl: getImage('client-2').imageUrl,
        clientPhotoHint: getImage('client-2').imageHint,
        rating: 5,
        text: 'El ropero que diseñó es perfecto. Un verdadero artesano.',
      },
    ],
  },
   {
    id: 5,
    name: 'Marta Diaz',
    photoUrl: getImage('prof-6').imageUrl,
    photoHint: getImage('prof-6').imageHint,
    specialties: ['Cambio de Cerraduras', 'Aperturas de emergencia'],
    avgRating: 4.7,
    categoryId: 6,
    testimonials: [
      {
        id: 7,
        clientName: 'Roberto "Tito" Ramirez',
        clientPhotoUrl: getImage('client-3').imageUrl,
        clientPhotoHint: getImage('client-3').imageHint,
        rating: 5,
        text: 'Me salvó a las 3 AM cuando perdí las llaves. ¡Una genia!',
      },
    ],
  },
   {
    id: 6,
    name: 'Raúl Benitez',
    photoUrl: getImage('prof-5').imageUrl,
    photoHint: getImage('prof-5').imageHint,
    specialties: ['Instalación de Split', 'Mantenimiento'],
    avgRating: 4.6,
    categoryId: 5,
    testimonials: [],
  },
];

export const BANNERS: Banner[] = [
  {
    id: 1,
    title: 'Descuentos de Invierno en Calefacción',
    description:
      'Prepara tu hogar para el frío. 20% de descuento en instalación y mantenimiento de sistemas de calefacción.',
    imageUrl: getImage('promo-banner-1').imageUrl,
    imageHint: getImage('promo-banner-1').imageHint,
    buttonText: 'Ver Profesionales',
    buttonLink: '#',
  },
  {
    id: 2,
    title: 'Renueva tu Hogar',
    description:
      'Servicios de pintura y carpintería para darle una nueva vida a tus espacios. Pide tu presupuesto sin cargo.',
    imageUrl: getImage('promo-banner-3').imageUrl,
    imageHint: getImage('promo-banner-3').imageHint,
    buttonText: 'Explorar Servicios',
    buttonLink: '#',
  },
  {
    id: 3,
    title: '¿Emergencia Eléctrica?',
    description: 'Electricistas matriculados disponibles 24/7 para urgencias.',
    imageUrl: getImage('promo-banner-2').imageUrl,
    imageHint: getImage('promo-banner-2').imageHint,
  },
];
