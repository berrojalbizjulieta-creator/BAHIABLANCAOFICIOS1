
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, MessageSquare, DollarSign, Phone, ShieldCheck, Sparkles } from 'lucide-react';
import type { Professional } from '@/lib/types';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CATEGORIES } from '@/lib/data';
import { cn } from '@/lib/utils';


interface ProfessionalCardProps {
  professional: Professional;
  isFeatured?: boolean;
}

function StarRating({ rating, count }: { rating: number, count: number }) {
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < Math.round(rating)
              ? 'text-yellow-400 fill-yellow-400'
              : 'text-gray-300'
          }`}
        />
      ))}
      <span className="text-sm text-muted-foreground ml-1">{rating.toFixed(1)} ({count})</span>
    </div>
  );
}

export default function ProfessionalCard({
  professional,
  isFeatured = false,
}: ProfessionalCardProps) {
  const getWhatsAppLink = (phone?: string) => {
    if (!phone) return '#';
    const cleanedPhone = phone.replace(/[^0-9]/g, '');
    const message = encodeURIComponent('Hola, me comunico desde Bahia Blanca Oficios. Estoy interesado en tus servicios.');
    return `https://wa.me/${cleanedPhone}?text=${message}`;
  }
  const primaryCategory = CATEGORIES.find(c => c.id === professional.categoryIds[0]);

  return (
    <>
      <Card className={cn(
        "flex flex-col md:flex-row items-start w-full overflow-hidden transition-shadow hover:shadow-lg relative",
        isFeatured && "border-2 border-primary shadow-lg"
      )}>
        {isFeatured && (
          <Badge className='absolute -top-3 left-4 bg-primary text-primary-foreground flex items-center gap-1.5'>
            <Sparkles className="w-4 h-4"/>
            Recomendado
          </Badge>
        )}
        <div className="flex-shrink-0 p-6 flex flex-col items-center text-center md:w-1/3">
          <Link href={`/profesional/${professional.id}`} passHref>
             <Avatar className="w-36 h-36 cursor-pointer border-4 border-background shadow-md">
                <AvatarImage src={professional.photoUrl} alt={professional.name} data-ai-hint={professional.photoHint} />
                <AvatarFallback>{professional.name.charAt(0)}</AvatarFallback>
             </Avatar>
          </Link>
        
          <CardHeader className="p-0 pt-3">
            <Link href={`/profesional/${professional.id}`} passHref>
              <CardTitle className="text-lg font-headline hover:underline cursor-pointer">
                 <div className='flex items-center justify-center gap-2'>
                    <span>{professional.name}</span>
                    {professional.isVerified && <ShieldCheck className="h-5 w-5 text-blue-500" />}
                 </div>
              </CardTitle>
            </Link>
          </CardHeader>
           <p className="text-sm text-muted-foreground mt-1">{primaryCategory?.name}</p>
          <div className="mt-1">
            <StarRating rating={professional.avgRating} count={professional.totalReviews} />
          </div>
        </div>
        <div className="p-6 pt-0 md:pt-6 border-t md:border-t-0 md:border-l w-full md:w-2/3">
          <CardContent className="p-0">
            <h4 className="font-semibold text-sm mb-2">Especialidades:</h4>
            <div className="flex flex-wrap gap-2 mb-4">
              {professional.specialties.map((spec) => (
                <Badge key={spec} variant="secondary">
                  {spec}
                </Badge>
              ))}
            </div>
            {professional.totalReviews === 0 && (
                 <div className="relative mt-4">
                     <div className="flex items-start gap-3 text-sm text-muted-foreground italic">
                        <MessageSquare className="w-5 h-5 flex-shrink-0" />
                        <p>
                           Aún no tiene reseñas. ¡Sé el primero en dejar una!
                        </p>
                    </div>
                </div>
            )}
          </CardContent>
          <CardFooter className="p-0 pt-4 flex justify-between items-center">
              <div className="flex items-center gap-4">
                  {professional.phone ? (
                    <Button asChild>
                        <a href={getWhatsAppLink(professional.phone)} target="_blank" rel="noopener noreferrer">
                            <Phone className="mr-2" /> Whatsapp
                        </a>
                    </Button>
                  ) : (
                     <Button disabled>Whatsapp</Button>
                  )}
                  {professional.priceInfo && (
                  <Popover>
                      <PopoverTrigger asChild>
                          <Button variant="outline" size="sm">
                              <DollarSign className="mr-2 h-4 w-4" /> Ver Precios
                          </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-60 text-sm">
                          <p>{professional.priceInfo}</p>
                      </PopoverContent>
                  </Popover>
                  )}
              </div>
            {professional.totalReviews > 0 && (
                  <Button variant="link" size="sm" asChild>
                      <Link href={`/profesional/${professional.id}`} target="_blank">Ver más</Link>
                  </Button>
            )}
          </CardFooter>
        </div>
      </Card>
    </>
  );
}
