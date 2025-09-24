import {
  Wrench,
  Plug,
  Paintbrush,
  Hammer,
  Wind,
  Flower,
  Computer,
  Building,
  Truck,
  Sparkles,
  PartyPopper,
  BookOpen,
  HeartHandshake,
  Palette,
  ChefHat,
  Lightbulb,
  ShieldCheck,
  Brush,
  KeyRound,
  Dog,
  Camera,
  Dumbbell,
  GlassWater,
  Fan,
  Bug,
} from 'lucide-react';
import type { Category, Professional, Banner, Client } from '@/lib/types';
import { placeholderImages } from './placeholder-images';
import { subMonths, subDays } from 'date-fns';

const getImage = (id: string) =>
  placeholderImages.find((img) => img.id === id) || {
    imageUrl: '',
    imageHint: '',
    description: '',
  };

export const CATEGORIES: Category[] = [
    { id: 11, name: 'Plomería', icon: Wrench, description: 'Arreglar canillas, caños y desagües.', imageUrl: getImage('cat-plomeria-2').imageUrl, imageHint: getImage('cat-plomeria-2').imageHint },
    { id: 14, name: 'Electricista', icon: Plug, description: 'Enchufes, cables, arreglos eléctricos.', imageUrl: getImage('cat-electricista-2').imageUrl, imageHint: getImage('cat-electricista-2').imageHint },
    { id: 17, name: 'Pintores', icon: Paintbrush, description: 'Pintura de paredes, revoques y techos.', imageUrl: getImage('cat-pintores').imageUrl, imageHint: getImage('cat-pintores').imageHint },
    { id: 15, name: 'Carpintería', icon: Hammer, description: 'Muebles a medida, puertas, madera.', imageUrl: getImage('cat-carpinteria').imageUrl, imageHint: getImage('cat-carpinteria').imageHint },
    { id: 3, name: 'Limpieza', icon: Sparkles, description: 'Limpieza profunda, pulido de pisos.', imageUrl: getImage('cat-limpieza').imageUrl, imageHint: getImage('cat-limpieza').imageHint },
    { id: 2, name: 'Jardinería', icon: Flower, description: 'Cortar pasto, plantar, cuidar el jardín.', imageUrl: getImage('cat-jardineria').imageUrl, imageHint: getImage('cat-jardineria').imageHint },
    { id: 4, name: 'Mudanzas', icon: Truck, description: 'Llevar muebles y cajas de acá para allá.', imageUrl: getImage('cat-mudanzas').imageUrl, imageHint: getImage('cat-mudanzas').imageHint },
    { id: 13, name: 'Albañilería', icon: Hammer, description: 'Obras, arreglos, refacciones.', imageUrl: getImage('cat-albanileria').imageUrl, imageHint: getImage('cat-albanileria').imageHint },
    { id: 16, name: 'Herrería', icon: ShieldCheck, description: 'Rejas, portones, trabajos en hierro.', imageUrl: getImage('cat-herreria').imageUrl, imageHint: getImage('cat-herreria').imageHint },
    { id: 5, name: 'Reparaciones', icon: Wrench, description: 'Arreglos de todo tipo.', imageUrl: getImage('cat-reparaciones').imageUrl, imageHint: getImage('cat-reparaciones').imageHint },
    { id: 9, name: 'Fotografía', icon: Camera, description: 'Fotos para eventos, productos o redes.', imageUrl: getImage('cat-fotografia').imageUrl, imageHint: getImage('cat-fotografia').imageHint },
    { id: 6, name: 'Eventos', icon: PartyPopper, description: 'DJs, shows, catering para cumpleaños.', imageUrl: getImage('cat-eventos').imageUrl, imageHint: getImage('cat-eventos').imageHint },
    { id: 7, name: 'Clases', icon: BookOpen, description: 'Música, idiomas, apoyo escolar.', imageUrl: getImage('cat-clases').imageUrl, imageHint: getImage('cat-clases').imageHint },
    { id: 58, name: 'Entrenadores', icon: Dumbbell, description: 'Yoga, personal trainer, pilates.', imageUrl: getImage('cat-entrenadores').imageUrl, imageHint: getImage('cat-entrenadores').imageHint },
    { id: 55, name: 'Mascotas', icon: Dog, description: 'Paseo de perros, cuidado de gatos.', imageUrl: getImage('cat-mascotas').imageUrl, imageHint: getImage('cat-mascotas').imageHint },
    { id: 38, name: 'Tecnología', icon: Computer, description: 'Arreglo de compus, celulares y redes.', imageUrl: getImage('cat-tecnologia').imageUrl, imageHint: getImage('cat-tecnologia').imageHint },
    { id: 12, name: 'Gasista', icon: Wind, description: 'Instalación y arreglo de gas, calderas, cocinas.', imageUrl: getImage('cat-gasista').imageUrl, imageHint: getImage('cat-gasista').imageHint },
    { id: 64, name: 'Cerrajería', icon: KeyRound, description: 'Apertura de puertas, cerraduras, llaves.', imageUrl: getImage('cat-cerrajeria').imageUrl, imageHint: getImage('cat-cerrajeria').imageHint },
    { id: 23, name: 'Climatización', icon: Fan, description: 'Aires acondicionados, estufas y radiadores.', imageUrl: getImage('cat-climatizacion-2').imageUrl, imageHint: getImage('cat-climatizacion-2').imageHint },
    { id: 65, name: 'Vidriería', icon: GlassWater, description: 'Reemplazo de vidrios, espejos y ventanas.', imageUrl: getImage('cat-vidrieria-2').imageUrl, imageHint: getImage('cat-vidrieria-2').imageHint },
    { id: 66, name: 'Control de Plagas', icon: Bug, description: 'Fumigación y control de plagas.', imageUrl: getImage('cat-plagas').imageUrl, imageHint: getImage('cat-plagas').imageHint },
];


export const PROFESSIONALS: Professional[] = [
  {
    id: 1,
    name: 'Carlos Rodriguez',
    email: 'carlos.rodriguez@oficios.com',
    phone: '2914123456',
    photoUrl: getImage('prof-1').imageUrl,
    photoHint: getImage('prof-1').imageHint,
    specialties: ['Reparación de Fugas', 'Instalación de Grifería', 'Destapaciones'],
    avgRating: 4.8,
    categoryId: 11,
    priceInfo: 'Hora de trabajo desde $2500 ARS. Presupuestos sin cargo.',
    isSubscriptionActive: true,
    subscriptionTier: 'standard',
    registrationDate: subMonths(new Date(), 2),
    lastPaymentDate: subMonths(new Date(), 2),
    isActive: true,
    isVerified: false,
    testimonials: [
        {
        id: 10,
        clientName: 'Sofía C.',
        clientPhotoUrl: '',
        clientPhotoHint: '',
        rating: 5,
        text: 'No me había dado cuenta de cuántos profesionales había en Bahía. Escribís cosas como "limpieza de casas" o "jardinería" y aparecen un montón de opciones. Lo que sea que necesites, acá está.',
      },
      {
        id: 11,
        clientName: 'Mateo R.',
        clientPhotoUrl: '',
        clientPhotoHint: '',
        rating: 5,
        text: 'La página está re buena... La verdad soy estudiante de afuera y me re salvó, no conocía a ningún plomero de confianza acá en Bahía y todo re bien! Recomendable.',
      },
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
    workPhotos: [
      getImage('work-3'),
    ],
  },
  {
    id: 2,
    name: 'Lucía Fernandez',
    email: 'lucia.fernandez@oficios.com',
    phone: '2914123457',
    photoUrl: getImage('prof-2').imageUrl,
    photoHint: getImage('prof-2').imageHint,
    specialties: ['Instalaciones Eléctricas', 'Tableros', 'Reparación de Cortocircuitos'],
    avgRating: 5.0,
    categoryId: 14,
    priceInfo: 'Consultar por instalación. Revisiones desde $2000 ARS.',
    isSubscriptionActive: true,
    subscriptionTier: 'premium',
    registrationDate: subDays(new Date(), 15),
    lastPaymentDate: subDays(new Date(), 10),
    isActive: true,
    isVerified: true,
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
    workPhotos: [
      getImage('work-5'),
    ]
  },
  {
    id: 3,
    name: 'Miguel Torres',
    email: 'miguel.torres@oficios.com',
    phone: '2914123458',
    photoUrl: getImage('prof-3').imageUrl,
    photoHint: getImage('prof-3').imageHint,
    specialties: ['Pintura de Interiores', 'Empapelado', 'Pintura de Exteriores'],
    avgRating: 4.5,
    categoryId: 17,
    priceInfo: 'Presupuestos a medida según m2. Incluye materiales.',
    isSubscriptionActive: true,
    subscriptionTier: 'standard',
    registrationDate: subMonths(new Date(), 6),
    lastPaymentDate: subDays(new Date(), 5),
    isActive: true,
    isVerified: false,
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
    workPhotos: [
        getImage('work-2'),
    ]
  },
  {
    id: 4,
    name: 'Jorge Herrera',
    email: 'jorge.herrera@oficios.com',
    phone: '2914123459',
    photoUrl: getImage('prof-4').imageUrl,
    photoHint: getImage('prof-4').imageHint,
    specialties: ['Muebles a Medida', 'Restauración de Muebles'],
    avgRating: 4.9,
    categoryId: 15,
    isSubscriptionActive: true,
    subscriptionTier: 'premium',
    registrationDate: subMonths(new Date(), 1),
    lastPaymentDate: subDays(new Date(), 20),
    isActive: false,
    isVerified: false,
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
    workPhotos: [
        getImage('work-4'),
    ]
  },
];

export const BANNERS: Banner[] = [
  {
    id: 1,
    title: 'Servicios esenciales de tu hogar',
    description: 'Encontrá plomeros, albañiles, gasistas, etc',
    imageUrl: 'https://i.pinimg.com/1200x/e2/41/5e/e2415e5d7e8e6e804e007d4147a9a04b.jpg',
    imageHint: 'plumber working',
    buttonText: 'Ver Profesionales',
    buttonLink: '/servicios-esenciales',
  },
  {
    id: 2,
    title: 'Dale vida a tu jardín',
    description: 'Cortá el pasto, poné luces y armá tu patio',
    imageUrl: 'https://i.pinimg.com/1200x/ce/30/e6/ce30e6fa6063da846fedd81b4d6d5567.jpg',
    imageHint: 'garden tools',
    buttonText: 'Explorar Ideas',
    buttonLink: '/jardin-y-exteriores',
  },
  {
    id: 3,
    title: 'Servicios de limpieza',
    description:
      'De casas, departamentos y limpieza post obra',
    imageUrl: 'https://i.pinimg.com/1200x/65/bd/62/65bd622b8c2073058b8c0d669fdfde5a.jpg',
    imageHint: 'cleaning products',
    buttonText: 'Contratar Jardineros',
    buttonLink: '/servicios/jardineria-y-paisajismo',
  },
  {
    id: 4,
    title: 'Servicios de Pintura',
    description: 'Dale un nuevo color a tu vida con pintores expertos.',
    imageUrl: 'https://i0.wp.com/villamariavivo.com/wp-content/uploads/2025/05/Chamtac-Pintores-en-Cordoba.png?fit=600%2C315&ssl=1',
    imageHint: 'painter working',
    buttonText: 'Ver Pintores',
    buttonLink: '/servicios/pintura',
  },
];

export const CLIENTS: Client[] = [
    {
        id: 1,
        name: 'Ana Gomez',
        email: 'ana.gomez@cliente.com',
        photoUrl: getImage('client-1').imageUrl,
        registrationDate: subDays(new Date(), 5),
        isActive: true,
    },
    {
        id: 2,
        name: 'Juan Pérez',
        email: 'juan.perez@cliente.com',
        photoUrl: getImage('client-3').imageUrl,
        registrationDate: subMonths(new Date(), 3),
        isActive: true,
    },
    {
        id: 3,
        name: 'María López',
        email: 'maria.lopez@cliente.com',
        photoUrl: getImage('client-2').imageUrl,
        registrationDate: subDays(new Date(), 90),
        isActive: false,
    }
]

export const AD_BANNERS = [
  {
    id: 1,
    imageUrl: 'https://picsum.photos/seed/ad1/1200/400',
    alt: 'Publicidad de herramientas',
    imageHint: 'construction tools',
  },
  {
    id: 2,
    imageUrl: 'https://picsum.photos/seed/ad2/1200/400',
    alt: 'Publicidad de materiales de construcción',
    imageHint: 'building materials',
  },
  {
    id: 3,
    imageUrl: 'https://picsum.photos/seed/ad3/1200/400',
    alt: 'Publicidad de productos de limpieza',
    imageHint: 'cleaning supplies',
  },
];
    

    


















    


