import type { LucideIcon } from 'lucide-react';

export interface Testimonial {
  id: number;
  clientName: string;
  clientPhotoUrl: string;
  clientPhotoHint: string;
  rating: number;
  text: string;
}

export interface Review {
  id: string;
  professionalId: string;
  userId: string;
  clientName: string;
  clientPhotoUrl: string;
  rating: number;
  comment: string;
  createdAt: Date;
}


export interface WorkPhoto {
    id: string;
    imageUrl: string;
    description: string;
    imageHint: string;
}

export interface Schedule {
  day: string;
  open: string;
  close: string;
  enabled: boolean;
}

export interface ProfessionalSubscription {
    tier?: 'standard' | 'premium';
    isSubscriptionActive?: boolean;
    lastPaymentDate?: Date;
    nextPaymentDate?: Date;
}


export interface Professional {
  id: string; // <--- MODIFICADO: Cambiado de 'string | number' a solo 'string' para user.uid
  name: string;
  description?: string;
  phone?: string;
  email: string;
  photoUrl: string;
  photoHint: string;
  specialties: string[];
  avgRating: number;
  categoryIds: number[];
  // testimonials: Testimonial[]; // <--- ¡ELIMINADO! Las reseñas ahora van en su propia colección.
  workPhotos?: WorkPhoto[];
  isVerified: boolean;
  priceInfo?: string;
  subscription?: ProfessionalSubscription;
  subscriptionTier?: 'standard' | 'premium'; // Legacy, prefer subscription.tier
  isSubscriptionActive?: boolean; // Legacy, prefer subscription.isSubscriptionActive
  registrationDate: Date;
  lastPaymentDate?: Date;
  isActive: boolean;
  schedule?: Schedule[];
  // --- ¡CAMPOS NUEVOS AÑADIDOS! ---
  totalReviews: number; // <--- NUEVO: Para el conteo de reseñas
  dayAvailability: { [key: string]: boolean }; // <--- NUEVO: Para la disponibilidad por días de la semana
}

export interface Client {
  id: number; // Podrías considerar cambiar esto a 'string' si usas user.uid para clientes también
  name: string;
  email: string;
  photoUrl: string;
  registrationDate: Date;
  isActive: boolean;
}

export interface Category {
  id: number;
  name: string;
  icon: LucideIcon;
  description: string;
  imageUrl?: string;
  imageHint?: string;
}

export interface Banner {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  imageHint: string;
  buttonText?: string;
  buttonLink?: string;
}

export interface JobRequest {
  id: string | number;
  title: string;
  description: string;
  budget: number;
  status: 'open' | 'closed';
  clientId: string;
  clientName: string;
  clientPhotoUrl: string;
  createdAt: Date;
  whatsapp: string;
  comments: JobComment[];
}

export interface JobComment {
    id: number;
    text: string;
    professionalId: number;
    professionalName: string;
    professionalPhotoUrl: string;
    createdAt: Date;
}

export interface CategorySpecialties {
  [categoryId: number]: {
    name: string;
    specialties: string[];
  }
}
