
'use client';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { PROFESSIONALS } from '@/lib/data';
import {
    Star,
    Share2,
    Trophy,
    ShieldCheck,
    Shield,
  } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import TestimonialSlider from '@/components/professionals/testimonial-slider';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';


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
        ({totalReviews} reviews)
      </span>
    </div>
  );
}

function ReviewForm() {
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
                variant: 'destructive'
            })
            return;
        }
        
        // Simulate API call
        console.log({ rating, reviewText });

        toast({
            title: '¡Reseña Enviada!',
            description: 'Gracias por compartir tu opinión.',
        });

        // Reset form
        setRating(0);
        setHover(0);
        setReviewText('');
    }

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
                        onChange={(e) => setReviewText(e.target.value)}
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


export default function ProfessionalProfilePage() {
    const params = useParams();
    const professionalId = params.id;
    const professional = PROFESSIONALS.find((p) => p.id === Number(professionalId));

  if (!professional) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold">Profesional no encontrado</h1>
        <p className="text-muted-foreground mt-2">
          No pudimos encontrar el perfil que estás buscando.
        </p>
      </div>
    );
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
                                {professional.isVerified ? <ShieldCheck className="w-7 h-7 text-blue-500" /> : <Shield className="w-7 h-7 text-muted-foreground" />}
                            </div>

                            <div className="mt-1">
                            {professional.testimonials.length > 0 ? (
                                <StarRatingDisplay
                                rating={professional.avgRating}
                                totalReviews={professional.testimonials.length}
                                />
                            ) : (
                                <p className="text-sm text-muted-foreground">Aún no hay reseñas.</p>
                            )}
                            </div>
                            {professional.avgRating > 4.5 && (
                                <Badge className="mt-2 bg-blue-100 text-blue-800 hover:bg-blue-200">
                                <Trophy className="w-4 h-4 mr-1" /> Top Pro
                                </Badge>
                            )}
                        </div>
                        <div className="flex gap-2">
                           <Button>
                                Contactar
                            </Button>
                            <Button variant="outline">
                                <Share2 className="mr-2 h-4 w-4" />
                                Compartir
                            </Button>
                        </div>
                        </div>
                    </CardContent>
                    </Card>
                    
                    {/* This would be conditionally rendered for logged-in clients */}
                    <ReviewForm />

                </div>
                <div className="space-y-8">
                     <Card>
                        <CardHeader>
                            <CardTitle>Testimonios de Clientes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {professional.testimonials.length > 0 ? (
                                <TestimonialSlider testimonials={professional.testimonials} />
                            ) : (
                                <p className="text-sm text-muted-foreground">No hay testimonios todavía.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    </div>
    </>
  );
}
