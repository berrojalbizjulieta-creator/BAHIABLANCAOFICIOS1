import Image from 'next/image';
import { Star } from 'lucide-react';

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
import TestimonialSlider from './testimonial-slider';

interface ProfessionalCardProps {
  professional: Professional;
}

function StarRating({ rating }: { rating: number }) {
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
      <span className="text-sm text-muted-foreground ml-1">{rating.toFixed(1)}</span>
    </div>
  );
}

export default function ProfessionalCard({
  professional,
}: ProfessionalCardProps) {
  return (
    <Card className="flex flex-col md:flex-row items-start w-full overflow-hidden transition-shadow hover:shadow-md">
      <div className="flex-shrink-0 p-6 flex flex-col items-center text-center md:w-1/4">
        <Image
          src={professional.photoUrl}
          alt={professional.name}
          width={80}
          height={80}
          className="rounded-full object-cover border-4 border-background shadow-sm"
          data-ai-hint={professional.photoHint}
        />
        <CardHeader className="p-0 pt-3">
          <CardTitle className="text-lg font-headline">
            {professional.name}
          </CardTitle>
        </CardHeader>
        <div className="mt-1">
          <StarRating rating={professional.avgRating} />
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
          {professional.testimonials.length > 0 && (
            <div>
              <h4 className="font-semibold text-sm mb-2">Testimonios:</h4>
              <TestimonialSlider testimonials={professional.testimonials} />
            </div>
          )}
        </CardContent>
        <CardFooter className="p-0 pt-4">
          <Button>Contactar</Button>
        </CardFooter>
      </div>
    </Card>
  );
}
