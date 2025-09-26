import type { LucideIcon } from 'lucide-react';

export interface Testimonial {
  id: number;
  clientName: string;
  clientPhotoUrl: string;
  clientPhotoHint: string;
  rating: number;
  text: string;
}

export interface WorkPhoto {
    id: string;
    imageUrl: string;
    description: string;
    imageHint: string;
}

export interface Professional {
  id: string | number; // Can be string from firestore doc id
  name: string;
  description?: string;
  phone?: string;
  email: string;
  photoUrl: string;
  photoHint: string;
  specialties: string[];
  avgRating: number;
  categoryId: number;
  testimonials: Testimonial[];
  workPhotos?: WorkPhoto[];
  isVerified: boolean;
  priceInfo?: string;
  isSubscriptionActive?: boolean;
  subscriptionTier?: 'standard' | 'premium';
  registrationDate: Date;
  lastPaymentDate?: Date;
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
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  imageHint: string;
  buttonText?: string;
  buttonLink?: string;
}

export interface JobRequest {
  id: number;
  title: string;
  description: string;
  budget: number;
  status: 'open' | 'closed';
  clientId: number;
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
