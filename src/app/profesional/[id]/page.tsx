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
  Loader2, // Importar Loader2 para el spinner de carga
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { Professional, Review, WorkPhoto } from '@/lib/types';
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
import { CATEGORIES } from '@/lib/data';
import { Textarea } from '@/components/ui/textarea';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

// IMPORTACIONES DE FIRESTORE
import { doc, getDoc, collection, addDoc, serverTimestamp, DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getReviewsForProfessional } from '@/lib/firestore-queries';

// --- Funciones auxiliares (mantener sin cambios) ---
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
  onReviewSubmit: (rating: number, text: string) => Promise<void>;
  isSubmitting: boolean;
}

function ReviewForm({ onReviewSubmit, isSubmitting }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0 || !reviewText) {
      toast({
        title: 'Error',
        description: 'Por favor, selecciona una calificación y escribe una reseña.',
        variant: 'destructive',
      });
      return;
    }

    await onReviewSubmit(rating, reviewText);

    // Reset form after submission
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
                    disabled={isSubmitting}
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
            disabled={isSubmitting}
          />
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isSubmitting}>
             {isSubmitting ? <><Loader2 className='mr-2 animate-spin' /> Enviando...</> : 'Publicar Reseña'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

const ReviewCard = ({ review }: { review: Review }) => {
  return (
    <div className="flex gap-4">
      <Avatar>
        <AvatarImage src={review.clientPhotoUrl} alt={review.clientName} />
        <AvatarFallback>{review.clientName?.charAt(0) || 'U'}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold">{review.clientName}</p>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(review.createdAt, { addSuffix: true, locale: es })}
            </p>
          </div>
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
            ))}
          </div>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">{review.comment}</p>
      </div>
    </div>
  )
}
// --- Fin funciones auxiliares ---


export default function PublicProfilePage() {
  const params = useParams();
  const { user, loading: userLoading, isProfessional } = useAdminAuth();
  const professionalId = params.id as string;

  const [professional, setProfessional] = useState<Professional | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activePhoto, setActivePhoto] = useState<WorkPhoto | null>(null);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfessionalData = async () => {
      if (!professionalId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const professionalDocRef = doc(db, 'professionalsDetails', professionalId);
        
        const [profDocSnap, reviewsData] = await Promise.all([
          getDoc(professionalDocRef),
          getReviewsForProfessional(db, professionalId)
        ]);
        
        setReviews(reviewsData);

        if (profDocSnap.exists()) {
          const data = profDocSnap.data() as DocumentData;

          if (data.registrationDate && data.registrationDate.toDate) {
              data.registrationDate = data.registrationDate.toDate();
          }
          if (data.lastPaymentDate && data.lastPaymentDate.toDate) {
              data.lastPaymentDate = data.lastPaymentDate.toDate();
          }
          if (data.subscription?.lastPaymentDate && data.subscription.lastPaymentDate.toDate) {
              data.subscription.lastPaymentDate = data.subscription.lastPaymentDate.toDate();
          }
          if (data.subscription?.nextPaymentDate && data.subscription.nextPaymentDate.toDate) {
              data.subscription.nextPaymentDate = data.subscription.nextPaymentDate.toDate();
          }

          const finalProfessionalData: Professional = {
            id: profDocSnap.id,
            ...data,
            totalReviews: data.totalReviews ?? reviewsData.length,
            avgRating: data.avgRating ?? 0,
            phone: data.phone || '',
          };

          setProfessional(finalProfessionalData);
        } else {
          setProfessional(null);
        }
      } catch (err: any) {
        console.error("Error al obtener el profesional:", err);
        setError('Error al cargar el perfil. Por favor, intenta de nuevo.');
        setProfessional(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfessionalData();
  }, [professionalId]);
  
  const handleNewReview = async (rating: number, comment: string) => {
    if (!user || !professional) {
      toast({ title: 'Error', description: 'Debes iniciar sesión para dejar una reseña.', variant: 'destructive' });
      return;
    }

    setIsSubmittingReview(true);
    
    try {
        const newReviewData = {
            professionalId: professional.id,
            rating: rating,
            comment: comment,
            userId: user.uid,
            clientName: user.displayName || 'Anónimo',
            clientPhotoUrl: user.photoURL || '',
            createdAt: serverTimestamp() 
        };

        const docRef = await addDoc(collection(db, 'reviews'), newReviewData);
        
        const localNewReview = {
            ...newReviewData,
            id: docRef.id,
            createdAt: new Date(),
        }
        
        // Optimistically update the UI
        setReviews(prev => [localNewReview, ...prev]);

        toast({
            title: '¡Reseña Enviada!',
            description: 'Gracias por tu opinión. Tu reseña ayudará a la comunidad.',
        });
        
    } catch (error) {
        console.error('Error al enviar la reseña:', error);
        toast({
            title: 'Error',
            description: 'No se pudo guardar tu reseña. Inténtalo de nuevo.',
            variant: 'destructive',
        });
    } finally {
        setIsSubmittingReview(false);
    }
  };

  const handleShare = async () => {
    if (!professional) return;

    const shareData = {
      title: `Perfil de ${professional.name} en BahiaBlancaOficios`,
      text: `¡Mirá el perfil de este profesional en BahiaBlancaOficios!`,
      url: window.location.href, // La URL actual es la del perfil público
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.error('Error al usar Web Share API:', error);
        // No se muestra error si el usuario cancela la acción
      }
    } else {
      // Fallback para escritorio: copiar al portapapeles
      try {
        await navigator.clipboard.writeText(shareData.url);
        toast({
          title: '¡Enlace Copiado!',
          description: 'El enlace al perfil se ha copiado a tu portapapeles.',
        });
      } catch (err) {
        console.error('Error al copiar al portapapeles:', err);
        toast({
          title: 'Error',
          description: 'No se pudo copiar el enlace. Inténtalo manualmente.',
          variant: 'destructive',
        });
      }
    }
  };

  if (loading || userLoading) {
    return (
      <div className="container py-12 text-center flex justify-center items-center h-64">
        <Loader2 className="mr-2 h-8 w-8 animate-spin" />
        Cargando perfil...
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-12 text-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  if (!professional) {
    return <div className="container py-12 text-center">Profesional no encontrado.</div>;
  }
  
  const getWhatsAppLink = (phone?: string, categoryName?: string) => {
    if (!phone) return '#';
    const cleanedPhone = phone.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(`Hola ${professional.name}, te contacto desde BahiaBlancaOficios por tus servicios de ${categoryName || 'profesional'}.`);
    return `https://wa.me/${cleanedPhone}?text=${message}`;
  }


  return (
    <>
      <div className="bg-muted/30">
        <div className="container mx-auto px-4 py-12 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Card className="overflow-hidden shadow-lg">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row items-start gap-6">
                     <Avatar className="w-24 h-24 sm:w-36 sm:h-36 border-4 border-background shadow-md">
                        <AvatarImage src={professional.photoUrl} alt={professional.name} />
                        <AvatarFallback>{professional.name.charAt(0)}</AvatarFallback>
                     </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h1 className="text-2xl sm:text-3xl font-bold font-headline">
                          {professional.name}
                        </h1>
                        {professional.isVerified ? (
                          <ShieldCheck className="w-6 h-6 sm:w-7 sm:h-7 text-blue-500" />
                        ) : (
                          <Shield className="w-6 h-6 sm:w-7 sm:h-7 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-muted-foreground mt-2 text-sm">
                          <Briefcase className="w-4 h-4" />
                          {professional.categoryIds.map((catId, index) => {
                              const category = CATEGORIES.find(c => c.id === catId);
                              return category ? <span key={catId}>{category.name}{index < professional.categoryIds.length - 1 ? ' • ' : ''}</span> : null;
                          })}
                      </div>
                      <div className="mt-2">
                        {professional.totalReviews > 0 ? (
                          <StarRatingDisplay
                            rating={professional.avgRating}
                            totalReviews={professional.totalReviews}
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
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                      <Button asChild className="w-full sm:w-auto">
                         <a href={getWhatsAppLink(professional.phone, CATEGORIES.find(c => c.id === professional.categoryIds[0])?.name)} target="_blank" rel="noopener noreferrer">
                            <Phone className="mr-2" /> Whatsapp
                        </a>
                      </Button>
                      <Button variant="outline" className="w-full sm:w-auto" onClick={handleShare}>
                        <Share2 className="mr-2 h-4 w-4" />
                        Compartir
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

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
                           <li className="flex items-center gap-3"><MapPin className="w-4 h-4 text-primary" /> <span>Sirve a Bahía Blanca</span></li>
                           <li className="flex items-center gap-3">
                                <CheckCircle className="w-4 h-4 text-primary" /> 
                                <span>{professional.isVerified ? "Antecedentes verificados" : "Antecedentes no verificados"}</span>
                           </li>
                           <li className="flex items-center gap-3"><Users className="w-4 h-4 text-primary" /> <span>{(professional as any).employees || 0} empleados</span></li> 
                           <li className="flex items-center gap-3"><Clock className="w-4 h-4 text-primary" /> <span>{(professional as any).yearsInBusiness || 0} años en el negocio</span></li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3">Horarios</h4>
                         <ul className="space-y-2 text-sm text-muted-foreground">
                           {professional.schedule && professional.schedule.length > 0 ? (
                                professional.schedule.map((s, index) => (
                                    <li key={index} className="flex justify-between">
                                        <span>{s.day}:</span>
                                        <span>{s.enabled ? `${s.open} - ${s.close}` : 'Cerrado'}</span>
                                    </li>
                                ))
                           ) : (
                               <li className="text-sm text-muted-foreground">Horarios no disponibles.</li>
                           )}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                 <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle>
                      Reseñas de Clientes ({reviews.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                     {reviews.length > 0 ? (
                        reviews.map((review, index) => (
                           <React.Fragment key={review.id}>
                             <ReviewCard review={review} />
                             {index < reviews.length - 1 && <Separator />}
                          </React.Fragment>
                        ))
                    ) : (
                      <p className="text-muted-foreground">Aún no hay reseñas. ¡Sé el primero en dejar una!</p>
                    )}
                  </CardContent>
                </Card>
             
              {!userLoading && user && !isProfessional && (
                <ReviewForm 
                    onReviewSubmit={handleNewReview} 
                    isSubmitting={isSubmittingReview}
                />
              )}
            </div>

            <div className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Galería de Trabajos</CardTitle>
                  </CardHeader>
                  <CardContent>
                     {professional.workPhotos && professional.workPhotos.length > 0 ? (
                      <Dialog>
                        <Carousel opts={{ align: 'start' }} className="w-full">
                            <CarouselContent>
                            {professional.workPhotos.map((photo) => (
                                <CarouselItem key={photo.id} className="basis-full sm:basis-1/2">
                                <DialogTrigger asChild onClick={() => setActivePhoto(photo)}>
                                    <div className="p-1 cursor-pointer">
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
                                </DialogTrigger>
                                </CarouselItem>
                            ))}
                            </CarouselContent>
                            <CarouselPrevious className="-ml-2 hidden sm:flex"/>
                            <CarouselNext className="-mr-2 hidden sm:flex"/>
                        </Carousel>
                        <DialogContent className="max-w-3xl p-2">
                            <DialogTitle className="sr-only">Imagen de trabajo</DialogTitle>
                           {activePhoto && (
                            <div className="relative aspect-video">
                                <Image
                                src={activePhoto.imageUrl}
                                alt={activePhoto.description}
                                fill
                                className="object-contain rounded-md"
                                />
                            </div>
                           )}
                        </DialogContent>
                      </Dialog>
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
