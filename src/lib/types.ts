import type { LucideIcon } from 'lucide-react';

export interface Testimonial {
  id: number;
  clientName: string;
  clientPhotoUrl: string;
  clientPhotoHint: string;
  rating: number;
  text: string;
}

export interface Professional {
  id: number;
  name: string;
  description?: string;
  phone?: string;
  photoUrl: string;
  photoHint: string;
  specialties: string[];
  avgRating: number;
  categoryId: number;
  testimonials: Testimonial[];
  isVerified?: boolean;
  priceInfo?: string;
  isSubscriptionActive?: boolean;
  subscriptionTier?: 'standard' | 'premium';
}

export interface Category {
  id: number;
  name: string;
  icon: LucideIcon;
  description: string;
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
