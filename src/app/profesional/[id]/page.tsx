

'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Star,
  Share2,
  Trophy,
  MapPin,
  Users,
  Clock,
  Briefcase,
  CheckCircle,
  MessageSquare,
  ShieldCheck,
  Shield,
  DollarSign,
  Phone,
  Sparkles as PremiumIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { Professional, Testimonial } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { useParams } from 'next/navigation';
import { CATEGORIES, PROFESSIONALS } from '@/lib/data';
import { Textarea } from '@/components/ui/textarea';
import { useAdminAuth } from '@/hooks/useAdminAuth';

function StarRatingDisplay({
  rating,
  totalReviews,
}: {
  rating: number;
  totalReviews: number;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-5 h-5 ${
              i < Math.round(rating)
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
      <span className="font-bold text-lg">{rating.toFixed(1)}</span>
      <span className="text-sm text-muted-foreground">
        ({totalReviews} reseñas)
      </span>
    </div>
  );
}

interface ReviewFormProps {
  onReviewSubmit: (newReview: Testimonial) => void;
  clientName?: string;
  clientPhotoUrl?: string;
}

function ReviewForm({ onReviewSubmit, clientName = "Cliente Anónimo", clientPhotoUrl = "" }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0 || !reviewText) {
      toast({
        title: 'Error',
        description: 'Por favor, selecciona una calificación y escribe una reseña.',
        variant: 'destructive',
      });
      return;
    }

    const newReview: Testimonial = {
      id: Date.now(),
      clientName: clientName,
      clientPhotoUrl: clientPhotoUrl,
      clientPhotoHint: "client photo",
      rating: rating,
      text: reviewText,
    };
    
    onReviewSubmit(newReview);

    toast({
      title: '¡Reseña Enviada!',
      description: 'Gracias por compartir tu opinión.',
    });

    setRating(0);
    setHover(0);
    setReviewText('');
  };

  return (
    <Card className="shadow-lg mt-8">
      <CardHeader>
        <CardTitle>Deja tu Reseña</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div>
            <p className="font-medium mb-2">Tu calificación:</p>
            <div className="flex items-center">
              {[...Array(5)].map((_, index) => {
                const starValue = index + 1;
                return (
                  <button
                    type="button"
                    key={starValue}
                    className="bg-transparent border-none cursor-pointer"
                    onClick={() => setRating(starValue)}
                    onMouseEnter={() => setHover(starValue)}
                    onMouseLeave={() => setHover(rating)}
                  >
                    <Star
                      className={`w-7 h-7 transition-colors ${
                        starValue <= (hover || rating)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>
          <Textarea
            placeholder="Escribe tu opinión sobre el trabajo de este profesional..."
            value={reviewText}
            onChange={e => setReviewText(e.target.value)}
            rows={4}
          />
        </CardContent>
        <CardFooter>
          <Button type="submit">Publicar Reseña</Button>
        </CardFooter>
      </form>
    </Card>
  );
}

export default function PublicProfilePage() {
  const params = useParams();
  const { user, loading, isProfessional } = useAdminAuth();
  const professionalId = params.id;
  
  // Find the initial professional data
  const initialProfessional = PROFESSIONALS.find(p => p.id === Number(professionalId));

  // Use state to manage professional data, so it can be updated
  const [professional, setProfessional] = useState<Professional | undefined>(initialProfessional);

  const handleNewReview = (newReview: Testimonial) => {
    if (professional) {
      const updatedTestimonials = [newReview, ...professional.testimonials];
      
      // Calculate new average rating
      const totalRating = updatedTestimonials.reduce((sum, t) => sum + t.rating, 0);
      const newAvgRating = totalRating / updatedTestimonials.length;

      setProfessional({
        ...professional,
        testimonials: updatedTestimonials,
        avgRating: newAvgRating,
      });
    }
  };


  if (!professional) {
    return <div className="container py-12 text-center">Profesional no encontrado.</div>;
  }

  const selectedCategory = CATEGORIES.find(
    c => c.id === professional.categoryId
  );
  
  const getWhatsAppLink = (phone?: string) => {
    if (!phone) return '#';
    const cleanedPhone = phone.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(`Hola ${professional.name}, te contacto desde BahiaBlancaOficios por tus servicios de ${selectedCategory?.name}.`);
    return `https://wa.me/${cleanedPhone}?text=${message}`;
  }


  return (
    <>
      <div className="bg-muted/30">
        <div className="container mx-auto px-4 py-12 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Header section */}
              <Card className="overflow-hidden shadow-lg">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row items-start gap-6">
                    <Avatar className="w-24 h-24 border-4 border-background shadow-md">
                      <AvatarImage
                        src={professional.photoUrl}
                        alt={professional.name}
                      />
                      <AvatarFallback>
                        {professional.name ? professional.name.charAt(0) : '?'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h1 className="text-3xl font-bold font-headline">
                          {professional.name}
                        </h1>
                        {professional.isVerified ? (
                          <ShieldCheck className="w-7 h-7 text-blue-500" />
                        ) : (
                          <Shield className="w-7 h-7 text-muted-foreground" />
                        )}
                        {professional.subscriptionTier === 'premium' && (
                          <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">
                            <PremiumIcon className="w-4 h-4 mr-1 text-purple-600" />
                            Premium
                          </Badge>
                        )}
                      </div>
                      {selectedCategory && (
                        <div className="flex items-center gap-2 text-muted-foreground mt-2 text-sm">
                          <Briefcase className="w-4 h-4" />
                          <span>{selectedCategory.name}</span>
                        </div>
                      )}
                      <div className="mt-2">
                        {professional.testimonials.length > 0 ? (
                          <StarRatingDisplay
                            rating={professional.avgRating}
                            totalReviews={professional.testimonials.length}
                          />
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            Aún no hay reseñas.
                          </p>
                        )}
                      </div>
                      {professional.avgRating > 4.5 && (
                        <Badge className="mt-2 bg-blue-100 text-blue-800 hover:bg-blue-200">
                          <Trophy className="w-4 h-4 mr-1" /> Top Pro
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button asChild>
                         <a href={getWhatsAppLink(professional.phone)} target="_blank" rel="noopener noreferrer">
                            <Phone className="mr-2" /> Whatsapp
                        </a>
                      </Button>
                      <Button variant="outline">
                        <Share2 className="mr-2 h-4 w-4" />
                        Compartir
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* About and Details */}
               <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle>Sobre Mí</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                      <p className="text-muted-foreground">
                        {professional.description || 'El profesional aún no ha añadido una descripción.'}
                      </p>
                    <Separator />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3">
                          Información General
                        </h4>
                        <ul className="space-y-3 text-sm">
                           <li className="flex items-center gap-3"><Trophy className="w-4 h-4 text-primary" /> <span>Top Pro actual</span></li>
                           <li className="flex items-center gap-3"><Briefcase className="w-4 h-4 text-primary" /> <span>Contratado 0 veces</span></li>
                           <li className="flex items-center gap-3"><MapPin className="w-4 h-4 text-primary" /> <span>Sirve a Bahía Blanca</span></li>
                           <li className="flex items-center gap-3"><CheckCircle className="w-4 h-4 text-primary" /> <span>Antecedentes no verificados</span></li>
                           <li className="flex items-center gap-3"><Users className="w-4 h-4 text-primary" /> <span>0 empleados</span></li>
                           <li className="flex items-center gap-3"><Clock className="w-4 h-4 text-primary" /> <span>0 años en el negocio</span></li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3">Horarios</h4>
                         <ul className="space-y-2 text-sm text-muted-foreground">
                           <li className="flex justify-between"><span>Dom:</span> <span>Cerrado</span></li>
                           <li className="flex justify-between"><span>Lun:</span> <span>9:00 AM - 6:00 PM</span></li>
                           <li className="flex justify-between"><span>Mar:</span> <span>9:00 AM - 6:00 PM</span></li>
                           <li className="flex justify-between"><span>Mie:</span> <span>9:00 AM - 6:00 PM</span></li>
                           <li className="flex justify-between"><span>Jue:</span> <span>9:00 AM - 6:00 PM</span></li>
                           <li className="flex justify-between"><span>Vie:</span> <span>9:00 AM - 6:00 PM</span></li>
                           <li className="flex justify-between"><span>Sab:</span> <span>Cerrado</span></li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

              {/* Reviews */}
              
                 <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle>
                      Reseñas de Clientes ({professional.testimonials.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {professional.testimonials.length > 0 ? (
                        professional.testimonials.map((t) => (
                        <div key={t.id} className="flex items-start gap-4">
                            <Avatar>
                            <AvatarImage
                                src={t.clientPhotoUrl}
                                alt={t.clientName}
                            />
                            <AvatarFallback>
                                {t.clientName.charAt(0)}
                            </AvatarFallback>
                            </Avatar>
                            <div>
                            <div className="flex items-center gap-2">
                                <h5 className="font-semibold">{t.clientName}</h5>
                            </div>
                            <div className="flex mt-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                        i < t.rating
                                        ? 'text-yellow-400 fill-yellow-400'
                                        : 'text-gray-300'
                                    }`}
                                    />
                                ))}
                                </div>
                            <p className="text-sm text-muted-foreground italic mt-2">
                                &quot;{t.text}&quot;
                            </p>
                            </div>
                        </div>
                        ))
                    ) : (
                        <p className="text-muted-foreground">Aún no hay reseñas. ¡Sé el primero en dejar una!</p>
                    )}
                  </CardContent>
                </Card>
             
              {/* Review Form for clients */}
              {!loading && user && !isProfessional && (
                <ReviewForm 
                    onReviewSubmit={handleNewReview} 
                    clientName={user.displayName || user.email || 'Cliente'}
                    clientPhotoUrl={user.photoURL || ''}
                />
              )}
            </div>

            {/* Right Sidebar */}
            <div className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Galería de Trabajos</CardTitle>
                  </CardHeader>
                  <CardContent>
                     {professional.workPhotos && professional.workPhotos.length > 0 ? (
                      <Carousel
                        opts={{ align: 'start' }}
                        className="w-full"
                      >
                        <CarouselContent>
                          {professional.workPhotos.map((photo, index) => (
                            <CarouselItem key={photo.id}>
                              <div className="p-1">
                                  <div className="relative aspect-video overflow-hidden rounded-lg">
                                    <Image
                                      src={photo.imageUrl}
                                      alt={photo.description}
                                      fill
                                      className="object-cover"
                                      data-ai-hint={photo.imageHint}
                                    />
                                  </div>
                              </div>
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                        <CarouselPrevious className="-ml-2"/>
                        <CarouselNext className="-mr-2"/>
                      </Carousel>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                          El profesional no ha subido fotos de sus trabajos.
                      </p>
                    )}
                  </CardContent>
                </Card>
                <Card>
                <CardHeader>
                    <CardTitle>Precios</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2 text-sm">
                        {professional.priceInfo ? (
                            <p className="text-muted-foreground">{professional.priceInfo}</p>
                        ) : (
                            <p className="text-muted-foreground">Contactar para más detalles de precios.</p>
                        )}
                    </div>
                </CardContent>
                </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
