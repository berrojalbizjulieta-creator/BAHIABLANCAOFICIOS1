
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
  Car,
  Moon,
} from 'lucide-react';
import type { Category, Professional, Banner, JobRequest, CategorySpecialties, Schedule } from '@/lib/types';
import { placeholderImages } from './placeholder-images';
import { subMonths, subDays, subHours } from 'date-fns';
import { PLOMERIA_KEYWORDS } from './keywords/plomeria';
import { GASISTA_KEYWORDS } from './keywords/gasista';
import { PINTORES_KEYWORDS } from './keywords/pintores';
import { CARPINTERIA_KEYWORDS } from './keywords/carpinteria';
import { ELECTRICISTA_KEYWORDS } from './keywords/electricista';
import { LIMPIEZA_KEYWORDS } from './keywords/limpieza';
import { JARDINERIA_KEYWORDS } from './keywords/jardineria';
import { MUDANZAS_KEYWORDS } from './keywords/mudanzas';
import { ALBANILERIA_KEYWORDS } from './keywords/albanileria';
import { HERRERIA_KEYWORDS } from './keywords/herreria';
import { FOTOGRAFIA_KEYWORDS } from './keywords/fotografia';
import { EVENTOS_KEYWORDS } from './keywords/eventos';
import { CLASES_KEYWORDS } from './keywords/clases';
import { ENTRENADORES_KEYWORDS } from './keywords/entrenadores';
import { MASCOTAS_KEYWORDS } from './keywords/mascotas';
import { TECNOLOGIA_KEYWORDS } from './keywords/tecnologia';
import { CERRAJERIA_KEYWORDS } from './keywords/cerrajeria';
import { AIRE_ACONDICIONADO_KEYWORDS } from './keywords/aire-acondicionado';
import { VIDRIERIA_KEYWORDS } from './keywords/vidrieria';
import { CONTROL_DE_PLAGAS_KEYWORDS } from './keywords/control-de-plagas';
import { MECANICA_KEYWORDS } from './keywords/mecanica';
import { REPARACIONES_KEYWORDS } from './keywords/reparaciones';
import { BELLEZA_KEYWORDS } from './keywords/belleza';
import { ASTROLOGIA_KEYWORDS } from './keywords/astrologia';

const getImage = (id: string) =>
  placeholderImages.find((img) => img.id === id) || {
    imageUrl: '',
    imageHint: '',
    description: '',
  };

export const defaultSchedule: Schedule[] = [
    { day: 'Dom', open: '00:00', close: '00:00', enabled: false },
    { day: 'Lun', open: '09:00', close: '18:00', enabled: true },
    { day: 'Mar', open: '09:00', close: '18:00', enabled: true },
    { day: 'Mie', open: '09:00', close: '18:00', enabled: true },
    { day: 'Jue', open: '09:00', close: '18:00', enabled: true },
    { day: 'Vie', open: '09:00', close: '18:00', enabled: true },
    { day: 'Sab', open: '09:00', close: '13:00', enabled: false },
];

const alwaysAvailableSchedule: Schedule[] = [
    { day: 'Dom', open: '00:00', close: '23:59', enabled: true },
    { day: 'Lun', open: '00:00', close: '23:59', enabled: true },
    { day: 'Mar', open: '00:00', close: '23:59', enabled: true },
    { day: 'Mie', open: '00:00', close: '23:59', enabled: true },
    { day: 'Jue', open: '00:00', close: '23:59', enabled: true },
    { day: 'Vie', open: '00:00', close: '23:59', enabled: true },
    { day: 'Sab', 'open': '00:00', close: '23:59', enabled: true },
];

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
    { id: 12, name: 'Gasista Matriculado', icon: Wind, description: 'Instalación y arreglo de gas, calderas, cocinas.', imageUrl: getImage('cat-gasista').imageUrl, imageHint: getImage('cat-gasista').imageHint },
    { id: 64, name: 'Cerrajería', icon: KeyRound, description: 'Apertura de puertas, cerraduras, llaves.', imageUrl: getImage('cat-cerrajeria').imageUrl, imageHint: getImage('cat-cerrajeria').imageHint },
    { id: 67, name: 'Aire Acondicionado', icon: Fan, description: 'Instalación y reparación de aires acondicionados.', imageUrl: getImage('cat-climatizacion-2').imageUrl, imageHint: getImage('cat-climatizacion-2').imageHint },
    { id: 65, name: 'Vidriería', icon: GlassWater, description: 'Reemplazo de vidrios, espejos y ventanas.', imageUrl: getImage('cat-vidrieria-2').imageUrl, imageHint: getImage('cat-vidrieria-2').imageHint },
    { id: 66, name: 'Control de Plagas', icon: Bug, description: 'Fumigación y control de plagas.', imageUrl: getImage('cat-plagas').imageUrl, imageHint: getImage('cat-plagas').imageHint },
    { id: 68, name: 'Mecánicos Auto/Motos', icon: Car, description: 'Servicio y reparación de vehículos.', imageUrl: getImage('cat-mecanica').imageUrl, imageHint: getImage('cat-mecanica').imageHint },
    { id: 69, name: 'Belleza', icon: Palette, description: 'Peluquería, uñas, maquillaje y más.', imageUrl: getImage('cat-belleza').imageUrl, imageHint: getImage('cat-belleza').imageHint },
    { id: 70, name: 'Astrología y Tarot', icon: Moon, description: 'Lectura de carta natal, tarot y más.', imageUrl: getImage('cat-astrologia').imageUrl, imageHint: getImage('cat-astrologia').imageHint },
];

// Este objeto contiene las listas cortas de especialidades para que el profesional elija en su perfil.
export const CATEGORY_SPECIALTIES: CategorySpecialties = {
  11: {
    name: 'Plomería',
    specialties: ['Instalación de grifería', 'Destapaciones', 'Filtraciones', 'Instalación de sanitarios', 'Reparación de cañerías'],
  },
  14: {
    name: 'Electricista',
    specialties: ['Instalaciones eléctricas', 'Reparación de cortocircuitos', 'Tableros eléctricos', 'Iluminación', 'Porteros eléctricos'],
  },
  17: {
    name: 'Pintores',
    specialties: ['Pintura de interiores', 'Pintura de exteriores', 'Impermeabilización', 'Revestimientos', 'Pintura de aberturas'],
  },
  3: {
    name: 'Limpieza',
    specialties: ['Limpieza de obras', 'Limpieza de oficinas', 'Limpieza de consorcios', 'Limpieza de vidrios', 'Limpieza profunda'],
  },
  2: {
    name: 'Jardinería',
    specialties: ['Corte de césped', 'Poda', 'Mantenimiento de jardines', 'Diseño de jardines', 'Sistemas de riego'],
  },
  15: {
    name: 'Carpintería',
    specialties: ['Muebles a medida', 'Restauración de muebles', 'Decks y pérgolas', 'Instalación de puertas', 'Reparaciones de madera'],
  },
  4: { name: 'Mudanzas', specialties: ['Mudanzas locales', 'Fletes', 'Embalaje', 'Peones para descarga', 'Traslado de objetos pesados'] },
  13: { name: 'Albañilería', specialties: ['Construcción en seco (Durlock)', 'Paredes y revoques', 'Colocación de cerámicos', 'Refacciones generales', 'Losas y contrapisos'] },
  16: { name: 'Herrería', specialties: ['Rejas y cerramientos', 'Portones', 'Escaleras metálicas', 'Protección de balcones', 'Soldaduras en general'] },
  5: {
    name: 'Reparaciones',
    specialties: [
      'Reparación de Lavarropas',
      'Pequeños Electrodomésticos',
      'Arreglo de Persianas',
      'Armado de Muebles',
      'Colocación de Cortinas/Cuadros',
      'Mantenimiento General del Hogar',
    ],
  },
  9: { name: 'Fotografía', specialties: ['Fotografía de eventos', 'Sesiones de fotos', 'Fotografía de producto', 'Retratos', 'Video'] },
  6: { name: 'Eventos', specialties: ['DJ', 'Catering', 'Animación', 'Alquiler de livings', 'Organización de eventos'] },
  7: { name: 'Clases', specialties: ['Apoyo escolar', 'Clases de música', 'Clases de idiomas', 'Profesor particular', 'Clases de baile'] },
  58: { name: 'Entrenadores', specialties: ['Personal trainer', 'Funcional', 'Yoga', 'Pilates', 'Preparador físico'] },
  55: { name: 'Mascotas', specialties: ['Paseador de perros', 'Cuidador de mascotas', 'Peluquería canina', 'Adiestramiento', 'Veterinario a domicilio'] },
  38: { name: 'Tecnología', specialties: ['Reparación de PC', 'Reparación de celulares', 'Soporte técnico', 'Instalación de redes', 'Clases de computación'] },
  12: { name: 'Gasista Matriculado', specialties: ['Instalación de artefactos', 'Pruebas de hermeticidad', 'Reparación de fugas', 'Instalación de calefactores', 'Revisión de instalaciones'] },
  64: { name: 'Cerrajería', specialties: ['Apertura de puertas', 'Cambio de cerraduras', 'Urgencias 24hs', 'Copias de llaves', 'Cerrajería automotor'] },
  67: { name: 'Aire Acondicionado', specialties: ['Instalación de equipos', 'Reparación', 'Carga de gas', 'Mantenimiento y limpieza', 'Desinstalación'] },
  65: { name: 'Vidriería', specialties: ['Cambio de vidrios', 'Vidrios a medida', 'Espejos', 'Mamparas de baño', 'Frentes de locales'] },
  66: { name: 'Control de Plagas', specialties: ['Fumigación', 'Desratización', 'Control de insectos', 'Ahuyentamiento de palomas', 'Desinfección'] },
  68: { name: 'Mecánicos Auto/Motos', specialties: ['Mecánica general', 'Cambio de aceite y filtros', 'Frenos', 'Tren delantero', 'Electricidad automotor'] },
  69: { name: 'Belleza', specialties: ['Peluquería', 'Manicura y Pedicura', 'Maquillaje', 'Depilación', 'Estética Facial y Corporal'] },
  70: { name: 'Astrología y Tarot', specialties: ['Lectura de Carta Natal', 'Tarot Evolutivo', 'Revolución Solar', 'Sinastría de Parejas', 'Tránsitos Planetarios'] }
};


// Este objeto contiene las listas enormes de palabras clave para que la IA entienda el lenguaje natural.
export const CATEGORY_KEYWORDS: { [key: number]: { name: string; keywords: string[] } } = {
  11: { name: 'Plomería', keywords: PLOMERIA_KEYWORDS },
  14: { name: 'Electricista', keywords: ELECTRICISTA_KEYWORDS },
  17: { name: 'Pintores', keywords: PINTORES_KEYWORDS },
  3: { name: 'Limpieza', keywords: LIMPIEZA_KEYWORDS },
  2: { name: 'Jardinería', keywords: JARDINERIA_KEYWORDS },
  15: { name: 'Carpintería', keywords: CARPINTERIA_KEYWORDS },
  4: { name: 'Mudanzas', keywords: MUDANZAS_KEYWORDS },
  13: { name: 'Albañilería', keywords: ALBANILERIA_KEYWORDS },
  16: { name: 'Herrería', keywords: HERRERIA_KEYWORDS },
  5: { name: 'Reparaciones', keywords: REPARACIONES_KEYWORDS },
  9: { name: 'Fotografía', keywords: FOTOGRAFIA_KEYWORDS },
  6: { name: 'Eventos', keywords: EVENTOS_KEYWORDS },
  7: { name: 'Clases', keywords: CLASES_KEYWORDS },
  58: { name: 'Entrenadores', keywords: ENTRENADORES_KEYWORDS },
  55: { name: 'Mascotas', keywords: MASCOTAS_KEYWORDS },
  38: { name: 'Tecnología', keywords: TECNOLOGIA_KEYWORDS },
  12: { name: 'Gasista Matriculado', keywords: GASISTA_KEYWORDS },
  64: { name: 'Cerrajería', keywords: CERRAJERIA_KEYWORDS },
  67: { name: 'Aire Acondicionado', keywords: AIRE_ACONDICIONADO_KEYWORDS },
  65: { name: 'Vidriería', keywords: VIDRIERIA_KEYWORDS },
  66: { name: 'Control de Plagas', keywords: CONTROL_DE_PLAGAS_KEYWORDS },
  68: { name: 'Mecánicos Auto/Motos', keywords: MECANICA_KEYWORDS },
  69: { name: 'Belleza', keywords: BELLEZA_KEYWORDS },
  70: { name: 'Astrología y Tarot', keywords: ASTROLOGIA_KEYWORDS }
};

// Diccionario simple para mapear sinónimos comunes a la categoría oficial
export const CATEGORY_SYNONYMS = {
    'plomero': 'Plomería',
    'gasista': 'Gasista Matriculado',
    'electricidad': 'Electricista',
    'pintor': 'Pintores',
    'carpintero': 'Carpintería',
    'limpiar': 'Limpieza',
    'jardinero': 'Jardinería',
    'flete': 'Mudanzas',
    'albañil': 'Albañilería',
    'herrero': 'Herrería',
    'arreglos': 'Reparaciones',
    'fotografo': 'Fotografía',
    'fiesta': 'Eventos',
    'profesor': 'Clases',
    'profe': 'Clases',
    'entrenador': 'Entrenadores',
    'personal trainer': 'Entrenadores',
    'perro': 'Mascotas',
    'gato': 'Mascotas',
    'computacion': 'Tecnología',
    'celulares': 'Tecnología',
    'cerrajero': 'Cerrajería',
    'aire': 'Aire Acondicionado',
    'vidriero': 'Vidriería',
    'fumigador': 'Control de Plagas',
    'mecanico': 'Mecánicos Auto/Motos',
    'persiana': 'Reparaciones',
    'persianista': 'Reparaciones',
    'peluqueria': 'Belleza',
    'uñas': 'Belleza',
    'maquillaje': 'Belleza',
    'estetica': 'Belleza',
    'carta natal': 'Astrología y Tarot',
    'tarot': 'Astrología y Tarot',
    'astrologo': 'Astrología y Tarot',
}

export const PROFESSIONALS: Professional[] = [
  {
    id: '1',
    name: 'Carlos Rodriguez',
    email: 'carlos.rodriguez@oficios.com',
    phone: '2914123456',
    photoUrl: getImage('prof-1').imageUrl,
    photoHint: getImage('prof-1').imageHint,
    specialties: ['Reparación de Fugas', 'Instalación de Grifería', 'Destapaciones'],
    avgRating: 4.8,
    totalReviews: 25,
    categoryIds: [11, 12],
    priceInfo: 'Hora de trabajo desde $2500 ARS. Presupuestos sin cargo.',
    isSubscriptionActive: true,
    subscriptionTier: 'standard',
    registrationDate: subMonths(new Date(), 2),
    lastPaymentDate: subMonths(new Date(), 2),
    isActive: true,
    isVerified: false,
    schedule: defaultSchedule,
    dayAvailability: { "Dom": false, "Lun": true, "Mar": true, "Mie": true, "Jue": true, "Vie": true, "Sab": false },
    testimonials: [
      {
        id: 11,
        clientName: 'Mateo R.',
        clientPhotoUrl: '',
        clientPhotoHint: '',
        rating: 5,
        text: 'La página está re buena... La verdad soy estudiante de afuera y me re salvó, no conocía a ningún plomero de confianza acá en Bahía y todo re bien! Recomendable.',
      },
       {
        id: 12,
        clientName: 'Fernando',
        clientPhotoUrl: '',
        clientPhotoHint: '',
        rating: 5,
        text: 'Me abrió la puerta en 10 minutos sin romper nada. Y encima re buena onda.',
      },
       {
        id: 13,
        clientName: 'Jorge',
        clientPhotoUrl: '',
        clientPhotoHint: '',
        rating: 5,
        text: 'Me levantaron una pared y pusieron cerámicos en la cocina, impecable el laburo y buena gente.',
      },
    ],
    workPhotos: [
      getImage('work-3'),
    ],
  },
];

export const BANNERS: Banner[] = [
  {
    id: 1,
    title: 'Servicios esenciales de tu hogar',
    description: 'Encontrá plomeros, albañiles, gasistas, etc',
    imageUrl: 'https://i.pinimg.com/1200x/e2/41/5e/e2415e5d7e8e6e804e007d4147a9a04b.jpg',
    imageHint: 'plumbing tools',
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
    imageUrl: 'https://i.pinimg.com/1200x/a9/62/f8/a962f83ae2df31290e8d59487cb213f8.jpg',
    imageHint: 'house cleaning',
    buttonText: 'Contratar especialistas en limpieza',
    buttonLink: '/servicios/limpieza',
  },
  {
    id: 4,
    title: 'Servicios de Pintura',
    description: 'Dale un nuevo color a tu vida con pintores expertos.',
    imageUrl: 'https://i.pinimg.com/736x/f5/52/e8/f552e816d5de9860df0af2deb2027b78.jpg',
    imageHint: 'painter working',
    buttonText: 'Ver Pintores',
    buttonLink: '/servicios/pintores',
  },
  {
    id: 5,
    title: 'Servicio de Mudanzas',
    description: 'Trasladamos tus pertenencias con cuidado y eficiencia.',
    imageUrl: 'https://i.pinimg.com/736x/07/fc/75/07fc75b7c6cb7df0b5da234fc4c25810.jpg',
    imageHint: 'moving boxes',
    buttonText: 'Ver Servicios',
    buttonLink: '/servicios/mudanzas',
  },
];

export const AD_BANNERS = [
  {
    id: 'ad1',
    imageUrl: 'https://picsum.photos/seed/ad1/1200/400',
    alt: 'Publicidad de herramientas',
    imageHint: 'construction tools',
  },
  {
    id: 'ad2',
    imageUrl: 'https://picsum.photos/seed/ad2/1200/400',
    alt: 'Publicidad de materiales de construcción',
    imageHint: 'building materials',
  },
  {
    id: 'ad3',
    imageUrl: 'https://picsum.photos/seed/ad3/1200/400',
    alt: 'Publicidad de productos de limpieza',
    imageHint: 'cleaning supplies',
  },
];
    
// src/app/servicios-esenciales/page.tsx
const essentialCategoryNames = [
  'Plomería',
  'Electricista',
  'Gasista Matriculado',
  'Cerrajería',
  'Reparaciones',
  'Albañilería',
  'Pintores',
  'Carpintería',
  'Aire Acondicionado',
  'Vidriería',
  'Limpieza',
  'Herrería',
  'Jardinería',
  'Control de Plagas'
];

export const essentialCategories = CATEGORIES.map(c => {
  if (c.name === 'Plomería') {
      return { ...c, subtitle: 'Reparación de canillas' };
  }
  if (c.name === 'Electricista') {
      return { ...c, subtitle: 'Instalación de enchufes y tareas de electricidad' };
  }
  if (c.name === 'Pintores') {
      return { ...c, subtitle: 'Paredes. techos, pisos' };
  }
  if (c.name === 'Carpintería') {
      return { ...c, subtitle: 'Armado a medida' };
  }
  if (c.name === 'Albañilería') {
      return { ...c, subtitle: 'Obras y reparaciones en general' };
  }
  if (c.name === 'Reparaciones') {
    return { ...c, subtitle: 'Arreglo de persianas y más' };
  }
  if (c.name === 'Gasista Matriculado') {
    return { ...c, subtitle: 'Reparación del sistema de calefacción' };
  }
  if (c.name === 'Cerrajería') {
      return { ...c, subtitle: 'Puertas, copias de llave, etc' };
  }
  if (c.name === 'Vidriería') {
      return { ...c, subtitle: 'Cambio de un paño, Instalación, etc' };
  }
  if (c.name === 'Control de Plagas') {
      return { ...c, subtitle: 'Hormigas, cucarachas, roedores, etc' };
  }
  if (c.name === 'Aire Acondicionado') {
      return { ...c, subtitle: 'Instalación y Limpieza de Aire' };
  }
  if (c.name === 'Herrería') {
      return { ...c, subtitle: 'Colocación de rejas' };
  }
  if (c.name === 'Jardinería') {
      return { ...c, subtitle: 'Limpieza de patios' };
  }
  return c;
}).filter(c => essentialCategoryNames.includes(c.name));
