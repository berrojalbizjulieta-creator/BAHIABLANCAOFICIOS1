
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, MessageSquare, DollarSign, Phone } from 'lucide-react';
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
import PaymentDialog from './payment-dialog';

interface ProfessionalCardProps {
  professional: Professional;
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
}: ProfessionalCardProps) {
  const firstTestimonial = professional.testimonials[0];

  const getWhatsAppLink = (phone?: string) => {
    if (!phone) return '#';
    // Remove non-numeric characters
    const cleanedPhone = phone.replace(/[^0-9]/g, '');
    return `https://wa.me/${cleanedPhone}`;
  }

  return (
    <>
      <Card className="flex flex-col md:flex-row items-start w-full overflow-hidden transition-shadow hover:shadow-md">
        <div className="flex-shrink-0 p-6 flex flex-col items-center text-center md:w-1/4">
          <Avatar className="w-20 h-20 border-4 border-background shadow-sm relative">
             <div className="relative w-full h-full rounded-full overflow-hidden">
                {professional.photoUrl && (
                    <Image
                    src={professional.photoUrl}
                    alt={professional.name}
                    fill
                    className="object-cover"
                    data-ai-hint={professional.photoHint}
                    />
                )}
             </div>
              <AvatarFallback>{professional.name.charAt(0)}</AvatarFallback>
          </Avatar>
        
          <CardHeader className="p-0 pt-3">
            <CardTitle className="text-lg font-headline">
              {professional.name}
            </CardTitle>
          </CardHeader>
          <div className="mt-1">
            <StarRating rating={professional.avgRating} count={professional.testimonials.length} />
          </div>
        </div>
        <div className="p-6 pt-0 md:pt-6 border-t md:border-t-0 md:border-l w-full md:w-3/4">
          <CardContent className="p-0">
            <h4 className="font-semibold text-sm mb-2">Especialidades:</h4>
            <div className="flex flex-wrap gap-2 mb-4">
              {professional.specialties.map((spec) => (
                <Badge key={spec} variant="secondary">
                  {spec}
                </Badge>
              ))}
            </div>
            {firstTestimonial && (
              <div className="relative mt-4">
                <div className="flex items-start gap-3 text-sm text-muted-foreground italic">
                  <MessageSquare className="w-5 h-5 flex-shrink-0" />
                  <p>
                      &quot;{firstTestimonial.text}&quot;
                      <span className="font-semibold not-italic"> - {firstTestimonial.clientName}</span>
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
                            <Phone className="mr-2" /> Contactar
                        </a>
                    </Button>
                  ) : (
                     <Button disabled>Contactar</Button>
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
            {professional.testimonials.length > 0 && (
                  <Button variant="link" size="sm" asChild>
                      <Link href={`/servicios/profil/${professional.id}`} target="_blank">Ver más</Link>
                  </Button>
            )}
          </CardFooter>
        </div>
      </Card>
    </>
  );
}
