
import type { LucideIcon } from 'lucide-react';
import type { Timestamp } from 'firebase/firestore';


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
    lastPaymentDate?: Date | Timestamp;
    nextPaymentDate?: Date | Timestamp;
}


export interface Professional {
  id: string;
  name: string;
  description?: string;
  phone?: string;
  email: string;
  photoUrl: string;
  photoHint: string;
  photoPositionX?: number; // Nueva propiedad para la posición X del encuadre
  photoPositionY?: number; // Nueva propiedad para la posición Y del encuadre
  specialties: string[];
  avgRating: number;
  categoryIds: number[];
  workPhotos?: WorkPhoto[];
  isVerified: boolean;
  isFeatured?: boolean; 
  verificationStatus?: 'not_started' | 'pending' | 'verified';
  verificationDocs?: {
    dniFrenteUrl?: string;
    dniDorsoUrl?: string;
    selfieDniUrl?: string;
  };
  priceInfo?: string;
  paymentMethods?: string;
  employees?: number;
  yearsInBusiness?: number;
  subscription?: ProfessionalSubscription;
  subscriptionTier?: 'standard' | 'premium';
  isSubscriptionActive?: boolean;
  registrationDate: Date | Timestamp;
  lastPaymentDate?: Date | Timestamp;
  isActive: boolean;
  schedule?: Schedule[];
  totalReviews: number;
  dayAvailability: { [key: string]: boolean };
  testimonials?: Testimonial[];
  whatsappClicks?: number;
}

// Representa la estructura de un documento en la colección 'users'
export interface User {
  id: string;
  name: string;
  email: string;
  photoUrl?: string;
  role: 'client' | 'professional' | 'admin';
  registrationDate: Date | Timestamp;
  isActive: boolean;
}


export interface Client {
  id: number;
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
  id: number | string;
  title: string;
  description: string;
  imageUrl: string;
  imageHint: string;
  buttonText?: string;
  buttonLink?: string;
}

export interface JobRequest {
  id: string;
  title: string;
  description: string;
  budget: number;
  status: 'open' | 'closed';
  clientId: string;
  clientName: string;
  clientPhotoUrl: string;
  createdAt: Date;
  whatsapp: string;
  imageUrl?: string;
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
