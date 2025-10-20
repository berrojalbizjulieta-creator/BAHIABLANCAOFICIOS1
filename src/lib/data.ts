
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
} from 'lucide-react';
import type { Category, Professional, Banner, Client, JobRequest, CategorySpecialties, Schedule } from '@/lib/types';
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
];

export const CATEGORY_SPECIALTIES: CategorySpecialties = {
  11: { // Plomería
    name: 'Plomería',
    specialties: PLOMERIA_KEYWORDS,
  },
  14: { // Electricista
    name: 'Electricista',
    specialties: ELECTRICISTA_KEYWORDS,
  },
  17: { // Pintores
    name: 'Pintores',
    specialties: PINTORES_KEYWORDS,
  },
  3: { // Limpieza
    name: 'Limpieza',
    specialties: LIMPIEZA_KEYWORDS
  },
  2: { // Jardinería
    name: 'Jardinería',
    specialties: JARDINERIA_KEYWORDS,
  },
  15: { // Carpintería
    name: 'Carpintería',
    specialties: CARPINTERIA_KEYWORDS,
  },
  4: { // Mudanzas
    name: 'Mudanzas',
    specialties: MUDANZAS_KEYWORDS
  },
  13: { // Albañilería
    name: 'Albañilería',
    specialties: ALBANILERIA_KEYWORDS
  },
  16: { // Herrería
    name: 'Herrería',
    specialties: HERRERIA_KEYWORDS
  },
  5: { // Reparaciones
    name: 'Reparaciones',
    specialties: [
      'arreglo de persiana',
      'cambio de persiana',
      'colocacion de persiana',
      'Colgar cuadros y estantes',
      'Armado de muebles',
      'Instalación de cortinas',
      'Colocar soporte de TV',
      'Reparación de mosquiteros',
      'Ajuste de puertas/cajones',
      'Cambiar un enchufe',
      'Sellar juntas con silicona',
      'Pequeñas "changas"'
    ]
  },
  9: { // Fotografía
    name: 'Fotografía',
    specialties: FOTOGRAFIA_KEYWORDS,
  },
  6: { // Eventos
    name: 'Eventos',
    specialties: EVENTOS_KEYWORDS,
  },
  7: { // Clases
    name: 'Clases',
    specialties: CLASES_KEYWORDS,
  },
  58: { // Entrenadores
    name: 'Entrenadores',
    specialties: ENTRENADORES_KEYWORDS,
  },
  55: { // Mascotas
    name: 'Mascotas',
    specialties: [
      'Paseo de perros',
      'Cuidado a domicilio',
      'Adiestramiento canino',
      'Peluquería canina',
      'Traslado de mascotas',
      'Cuidado de gatos',
      'Paseos en grupo',
      'Paseos individuales',
      'Guardería de día',
      'Acompañamiento veterinario'
    ]
  },
  38: { // Tecnología
    name: 'Tecnología',
    specialties: [
      'Arreglo de PC',
      'Limpieza de virus',
      'Formateo e instalación',
      'Reparación de notebooks',
      'Cambio de pantalla celu',
      'Armado de PC gamer',
      'Configuración de redes WiFi',
      'Recupero de datos',
      'Clases de computación',
      'Soporte técnico a domicilio'
    ]
  },
  12: { // Gasista Matriculado
    name: 'Gasista Matriculado',
    specialties: GASISTA_KEYWORDS,
  },
  64: { // Cerrajería
    name: 'Cerrajería',
    specialties: [
      'Apertura de puertas',
      'Cambio de combinación',
      'Cerraduras de auto',
      'Copias de llaves',
      'Cerraduras de seguridad',
      'Reparación de cerraduras',
      'Apertura de cajas fuertes',
      'Puertas blindadas',
      'Urgencias 24hs',
      'Cerrojos y pasadores'
    ]
  },
  67: { // Aire Acondicionado
    name: 'Aire Acondicionado',
    specialties: [
      'Instalación de split',
      'Carga de gas',
      'Limpieza de filtros',
      'Reparación de equipos',
      'Mantenimiento preventivo',
      'Desinstalación de equipos',
      'Reparación de plaquetas',
      'Instalación de centrales',
      'Control remoto',
      'Asesoramiento de compra'
    ]
  },
  65: { // Vidriería
    name: 'Vidriería',
    specialties: [
      'Cambio de vidrios rotos',
      'Espejos a medida',
      'Vidrios de seguridad (laminados)',
      'Frentes de locales',
      'Mamparas de baño',
      'Tapas de mesa de vidrio',
      'Vidrios para ventanas',
      'Claraboyas',
      'Policarbonato y acrílico',
      'Urgencias a domicilio'
    ]
  },
  66: { // Control de Plagas
    name: 'Control de Plagas',
    specialties: [
      'Fumigación de cucarachas',
      'Desratización',
      'Control de hormigas',
      'Eliminación de pulgas',
      'Ahuyentamiento de palomas',
      'Control de arañas',
      'Tratamientos para madera (termitas)',
      'Desinfección de tanques',
      'Control de alacranes',
      'Abonos para comercios'
    ]
  },
  68: { // Mecánicos Auto/Motos
    name: 'Mecánicos Auto/Motos',
    specialties: [
      'Cambio de aceite y filtro',
      'Tren delantero',
      'Frenos',
      'Embrague',
      'Afinación de motor',
      'Service de motos',
      'Diagnóstico con scanner',
      'Revisión para VTV',
      'Reparación de motor',
      'Auxilio mecánico ligero'
    ]
  }
};


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
    categoryIds: [11, 12],
    priceInfo: 'Hora de trabajo desde $2500 ARS. Presupuestos sin cargo.',
    isSubscriptionActive: true,
    subscriptionTier: 'standard',
    registrationDate: subMonths(new Date(), 2),
    lastPaymentDate: subMonths(new Date(), 2),
    isActive: true,
    isVerified: false,
    schedule: defaultSchedule,
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
  {
    id: 2,
    name: 'Lucía Fernandez',
    email: 'lucia.fernandez@oficios.com',
    phone: '2914123457',
    photoUrl: getImage('prof-2').imageUrl,
    photoHint: getImage('prof-2').imageHint,
    specialties: ['Instalaciones Eléctricas', 'Tableros', 'Reparación de Cortocircuitos'],
    avgRating: 5.0,
    categoryIds: [14],
    priceInfo: 'Consultar por instalación. Revisiones desde $2000 ARS.',
    isSubscriptionActive: true,
    subscriptionTier: 'premium',
    registrationDate: subDays(new Date(), 15),
    lastPaymentDate: subDays(new Date(), 10),
    isActive: true,
    isVerified: true,
    schedule: alwaysAvailableSchedule, // Always available for testing
    testimonials: [],
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
    categoryIds: [17],
    priceInfo: 'Presupuestos a medida según m2. Incluye materiales.',
    isSubscriptionActive: true,
    subscriptionTier: 'standard',
    registrationDate: subMonths(new Date(), 6),
    lastPaymentDate: subDays(new Date(), 5),
    isActive: true,
    isVerified: false,
    schedule: defaultSchedule,
    testimonials: [],
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
    categoryIds: [15],
    isSubscriptionActive: true,
    subscriptionTier: 'premium',
    registrationDate: subMonths(new Date(), 1),
    lastPaymentDate: subDays(new Date(), 20),
    isActive: false,
    isVerified: true,
    schedule: defaultSchedule,
    testimonials: [],
    workPhotos: [
        getImage('work-4'),
    ]
  },
  // START - Added professionals for pagination simulation
  {
    id: 5,
    name: 'Roberto Gómez',
    email: 'roberto.gomez@oficios.com',
    phone: '2915550001',
    photoUrl: 'https://picsum.photos/seed/prof5/200/200',
    photoHint: 'man portrait',
    specialties: ['Cableado', 'Iluminación LED'],
    avgRating: 4.7,
    categoryIds: [14],
    priceInfo: 'Precios competitivos.',
    isSubscriptionActive: true,
    subscriptionTier: 'standard',
    registrationDate: subDays(new Date(), 45),
    isActive: true,
    isVerified: true,
    schedule: defaultSchedule,
    testimonials: [],
  },
  {
    id: 6,
    name: 'Marta Diaz',
    email: 'marta.diaz@oficios.com',
    phone: '2915550002',
    photoUrl: 'https://picsum.photos/seed/prof6/200/200',
    photoHint: 'woman portrait',
    specialties: ['Tableros eléctricos', 'Emergencias 24hs'],
    avgRating: 4.9,
    categoryIds: [14],
    isSubscriptionActive: true,
    subscriptionTier: 'premium',
    registrationDate: subDays(new Date(), 50),
    isActive: true,
    isVerified: true,
    schedule: alwaysAvailableSchedule, // Always available for testing
    testimonials: [],
  },
  {
    id: 7,
    name: 'Ricardo Peña',
    email: 'ricardo.pena@oficios.com',
    phone: '2915550003',
    photoUrl: 'https://picsum.photos/seed/prof7/200/200',
    photoHint: 'man portrait',
    specialties: ['Porteros eléctricos', 'Luces de emergencia'],
    avgRating: 4.6,
    categoryIds: [14],
    isSubscriptionActive: true,
    subscriptionTier: 'standard',
    registrationDate: subDays(new Date(), 60),
    isActive: true,
    isVerified: false,
    schedule: defaultSchedule,
    testimonials: [],
  },
  {
    id: 8,
    name: 'Valeria Luna',
    email: 'valeria.luna@oficios.com',
    phone: '2915550004',
    photoUrl: 'https://picsum.photos/seed/prof8/200/200',
    photoHint: 'woman portrait',
    specialties: ['Instalación de aires', 'Cortocircuitos'],
    avgRating: 4.8,
    categoryIds: [67, 14],
    isSubscriptionActive: true,
    subscriptionTier: 'premium',
    registrationDate: subDays(new Date(), 70),
    isActive: true,
    isVerified: true,
    schedule: defaultSchedule,
    testimonials: [],
  },
  {
    id: 9,
    name: 'Héctor Campos',
    email: 'hector.campos@oficios.com',
    phone: '2915550005',
    photoUrl: 'https://picsum.photos/seed/prof9/200/200',
    photoHint: 'man portrait',
    specialties: ['Cableado estructurado', 'Redes'],
    avgRating: 4.5,
    categoryIds: [14, 38],
    isSubscriptionActive: false,
    subscriptionTier: 'standard',
    registrationDate: subDays(new Date(), 80),
    isActive: true,
    isVerified: false,
    schedule: defaultSchedule,
    testimonials: [],
  },
  {
    id: 10,
    name: 'Julieta Rios',
    email: 'julieta.rios@oficios.com',
    phone: '2915550006',
    photoUrl: 'https://picsum.photos/seed/prof10/200/200',
    photoHint: 'woman portrait',
    specialties: ['Iluminación de jardines', 'Automatización'],
    avgRating: 5.0,
    categoryIds: [14],
    isSubscriptionActive: true,
    subscriptionTier: 'premium',
    registrationDate: subDays(new Date(), 90),
    isActive: true,
    isVerified: true,
    schedule: defaultSchedule,
    testimonials: [],
  },
  {
    id: 11,
    name: 'Andrés Soto',
    email: 'andres.soto@oficios.com',
    phone: '2915550007',
    photoUrl: 'https://picsum.photos/seed/prof11/200/200',
    photoHint: 'man portrait',
    specialties: ['Reparaciones generales', 'Tomas corrientes'],
    avgRating: 4.4,
    categoryIds: [14],
    isSubscriptionActive: true,
    subscriptionTier: 'standard',
    registrationDate: subDays(new Date(), 100),
    isActive: true,
    isVerified: false,
    schedule: defaultSchedule,
    testimonials: [],
  },
  {
    id: 12,
    name: 'Paula Navarro',
    email: 'paula.navarro@oficios.com',
    phone: '2915550008',
    photoUrl: 'https://picsum.photos/seed/prof12/200/200',
    photoHint: 'woman portrait',
    specialties: ['Instalaciones comerciales', 'Certificados DCI'],
    avgRating: 4.9,
    categoryIds: [14],
    isSubscriptionActive: true,
    subscriptionTier: 'premium',
    registrationDate: subDays(new Date(), 110),
    isActive: true,
    isVerified: true,
    schedule: defaultSchedule,
    testimonials: [],
  },
  {
    id: 13,
    name: 'Diego Vega',
    email: 'diego.vega@oficios.com',
    phone: '2915550009',
    photoUrl: 'https://picsum.photos/seed/prof13/200/200',
    photoHint: 'man portrait',
    specialties: ['Obras nuevas', 'Tableros'],
    avgRating: 4.7,
    categoryIds: [14],
    isSubscriptionActive: false,
    subscriptionTier: 'standard',
    registrationDate: subDays(new Date(), 120),
    isActive: true,
    isVerified: false,
    schedule: defaultSchedule,
    testimonials: [],
  },
  {
    id: 14,
    name: 'Carolina Morales',
    email: 'carolina.morales@oficios.com',
    phone: '2915550010',
    photoUrl: 'https://picsum.photos/seed/prof14/200/200',
    photoHint: 'woman portrait',
    specialties: ['Reparación de cortocircuitos', 'Iluminación'],
    avgRating: 4.8,
    categoryIds: [14],
    isSubscriptionActive: true,
    subscriptionTier: 'standard',
    registrationDate: subDays(new Date(), 130),
    isActive: true,
    isVerified: true,
    schedule: defaultSchedule,
    testimonials: [],
  },
  {
    id: 15,
    name: 'Esteban Rojas',
    email: 'esteban.rojas@oficios.com',
    phone: '2915550011',
    photoUrl: 'https://picsum.photos/seed/prof15/200/200',
    photoHint: 'man portrait',
    specialties: ['Instalaciones eléctricas', 'Baja tensión'],
    avgRating: 4.6,
    categoryIds: [14],
    isSubscriptionActive: true,
    subscriptionTier: 'standard',
    registrationDate: subDays(new Date(), 140),
    isActive: true,
    isVerified: false,
    schedule: defaultSchedule,
    testimonials: [],
  },
  {
    id: 16,
    name: 'Gabriela Ponce',
    email: 'gabriela.ponce@oficios.com',
    phone: '2915550012',
    photoUrl: 'https://picsum.photos/seed/prof16/200/200',
    photoHint: 'woman portrait',
    specialties: ['Urgencias 24hs', 'Tableros'],
    avgRating: 4.9,
    categoryIds: [14],
    isSubscriptionActive: true,
    subscriptionTier: 'premium',
    registrationDate: subDays(new Date(), 150),
    isActive: true,
    isVerified: true,
    schedule: defaultSchedule,
    testimonials: [],
  },
  // END - Added professionals
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
    imageUrl: 'https://i.pinimg.com/1200x/a9/62/f8/a962f83ae2df31290e8d59487cb213f8.jpg',
    imageHint: 'cleaning products',
    buttonText: 'Contratar Jardineros',
    buttonLink: '/servicios/jardineria-y-paisajismo',
  },
  {
    id: 4,
    title: 'Servicios de Pintura',
    description: 'Dale un nuevo color a tu vida con pintores expertos.',
    imageUrl: 'https://picsum.photos/seed/paintwork/600/400',
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
    
export const JOB_REQUESTS: JobRequest[] = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  title: [
    'Cortar el pasto de un terreno 10x20',
    'Instalar 3 estantes en pared de durlock',
    'Pintar una habitación de 4x4',
    'Arreglar una pérdida en el baño',
    'Limpieza profunda de cocina y baños',
    'Mover un sofá y una heladera',
    'Reparar el timbre que no funciona',
    'Instalar un ventilador de techo',
    'Podar un árbol en el frente de casa',
    'Destapar cañería de la cocina',
    'Colocar cerradura nueva en puerta de entrada',
    'Armar un mueble de IKEA',
    'Pasear perro mediano 3 veces por semana',
    'Limpiar vidrios de un local comercial',
    'Formatear una notebook e instalar Windows',
    'Revisar instalación de gas por posible pérdida',
    'Hacer un portón de reja corredizo',
    'Cambiar cuerito de una canilla que gotea',
    'Instalación eléctrica para 5 tomas nuevos',
    'Nivelar y preparar terreno para pileta de lona',
  ][i % 20],
  description: [
    'Necesito cortar el pasto y emprolijar los bordes de un patio trasero. El pasto está un poco alto. Zona centro.',
    'Tengo 3 estantes flotantes y necesito que alguien con las herramientas adecuadas los instale en una pared de durlock. Los estantes ya los tengo.',
    'Busco pintor para una habitación. Incluye techo. Yo pongo la pintura y los materiales, solo necesito la mano de obra. Gracias.',
    'Hay una mancha de humedad en la pared del baño, creo que es una pérdida de la ducha. Necesito un plomero que lo revise y lo arregle.',
    'Quiero una limpieza a fondo de la cocina (horno, azulejos, etc.) y los dos baños de la casa. Productos a convenir.',
    'Necesito ayuda para bajar un sofá de 3 cuerpos por escalera y mover una heladera de un departamento a otro en el mismo edificio.',
    'El timbre de casa dejó de sonar. No sé si es el pulsador o el transformador. Busco electricista para que lo solucione.',
    'Compré un ventilador de techo y necesito que lo instalen. El techo es de losa y ya está el agujero del foco anterior.',
    'El árbol de la vereda está muy grande y las ramas tocan los cables. Necesito que lo poden de forma segura.',
    'La bacha de la cocina no desagota bien, el agua se va muy lento. Probé con productos pero no funcionó.',
    'Quiero cambiar la cerradura de la puerta principal por una más segura. Ya compré la cerradura nueva.',
    'Compré un placard de IKEA y no tengo tiempo ni paciencia para armarlo. Busco a alguien que se dé maña.',
    'Necesito que paseen a mi perro, un Golden Retriever, los lunes, miércoles y viernes por la tarde.',
    'Son 4 paños de vidrio grandes de un local en el centro. Necesito que queden impecables por dentro y por fuera.',
    'Mi notebook anda muy lenta. Quiero hacer un backup de mis archivos, formatearla y reinstalar Windows 10 desde cero.',
    'Siento olor a gas a veces cerca del calefón. Necesito un gasista matriculado que revise toda la instalación y me dé seguridad.',
    'Tengo el espacio para un portón corredizo de auto y necesito que un herrero lo fabrique e instale. Aproximadamente 3 metros de ancho.',
    'La canilla del lavadero no para de gotear y me está volviendo loco. Debe ser el cuerito, necesito que lo cambien.',
    'Estoy haciendo una oficina en una habitación y necesito agregar 5 tomas dobles. La pared es de ladrillo.',
    'Tengo un patio de tierra y quiero poner una pileta de lona de 4x2 mts. Necesito que nivelen el suelo y lo dejen listo.',
  ][i % 20],
  budget: [5000, 8000, 15000, 10000, 12000, 7000, 4000, 9000, 18000, 6000, 7500, 5500, 4500, 9500, 13000, 11000, 25000, 3000, 20000, 14000][i % 20],
  status: i % 4 === 0 ? 'closed' : 'open',
  clientId: (i % 3) + 1,
  clientName: ['Ana Gomez', 'Juan Pérez', 'María López'][(i % 3)],
  clientPhotoUrl: [getImage('client-1').imageUrl, getImage('client-3').imageUrl, getImage('client-2').imageUrl][(i % 3)],
  createdAt: subHours(new Date(), i * 5 + 3),
  whatsapp: `549291${5000000 + i}`,
  comments: i % 2 === 0 ? [] : [
    {
      id: 1,
      text: '¡Hola! Me interesa el trabajo. ¿Podemos coordinar?',
      professionalId: (i % 4) + 1,
      professionalName: ['Carlos Rodriguez', 'Lucía Fernandez', 'Miguel Torres', 'Jorge Herrera'][i % 4],
      professionalPhotoUrl: [getImage('prof-1').imageUrl, getImage('prof-2').imageUrl, getImage('prof-3').imageUrl, getImage('prof-4').imageUrl][i % 4],
      createdAt: subHours(new Date(), i * 5 + 2),
    }
  ],
}));










