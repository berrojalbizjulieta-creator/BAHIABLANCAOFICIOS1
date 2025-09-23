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
  id: number;
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
  isVerified?: boolean;
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

    

    
