'use client';

import React, {useRef, useState} from 'react';
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
  Edit,
  Save,
  X,
  Upload,
  ShieldCheck,
  Shield,
  PlusCircle,
  DollarSign,
} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {Badge} from '@/components/ui/badge';
import {Separator} from '@/components/ui/separator';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Textarea} from '@/components/ui/textarea';
import type { Professional } from '@/lib/types';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {useToast} from '@/hooks/use-toast';
import {Switch} from '@/components/ui/switch';
import VerificationTab from '@/components/professionals/verification-tab';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

function StarRating({
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

const getImage = (id: string) =>
  PlaceHolderImages.find((img) => img.id === id) || {
    imageUrl: '',
    imageHint: '',
  };

const initialProfessionalData: Professional = {
    id: 0,
    name: "Nombre del Profesional",
    photoUrl: "",
    photoHint: "",
    specialties: [],
    avgRating: 0,
    categoryId: 0,
    testimonials: [],
    isVerified: false,
}

const workPhotos = PlaceHolderImages.filter(p => p.id.startsWith('work-'));

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(true);
  const [professional, setProfessional] = useState<Professional | null>(initialProfessionalData);
  const [paymentMethods, setPaymentMethods] = useState('');
  const [price, setPrice] = useState({ type: 'Por Hora', amount: '', details: '' });
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!professional) {
    return <div>Profesional no encontrado.</div>;
  }

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setProfessional(prev => (prev ? {...prev, [field]: value} : null));
  };
  
  const handleScheduleChange = (day: string, field: 'open' | 'close' | 'enabled', value: string | boolean) => {
     // This is a mock implementation. In a real app, you would update the state properly.
  }

  const handleSave = () => {
    // Here you would typically save the data to your backend
    console.log("Saving data:", professional, paymentMethods, price);
    toast({
        title: "Perfil Actualizado",
        description: "Tus cambios han sido guardados con éxito."
    })
    setIsEditing(false);
  }

  const handleAvatarClick = () => {
      if(isEditing && fileInputRef.current) {
          fileInputRef.current.click();
      }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && professional) {
          const reader = new FileReader();
          reader.onloadend = () => {
              setProfessional({...professional, photoUrl: reader.result as string});
          }
          reader.readAsDataURL(file);
      }
  }


  return (
    <div className="bg-muted/30">
      <div className="container mx-auto px-4 py-12 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Header section */}
            <Card className="overflow-hidden shadow-lg">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-start gap-6">
                  <div className="relative group">
                    <Avatar 
                        className={`w-24 h-24 border-4 border-background shadow-md ${isEditing ? 'cursor-pointer' : ''}`}
                        onClick={handleAvatarClick}
                    >
                        <AvatarImage
                        src={professional.photoUrl}
                        alt={professional.name}
                        />
                        <AvatarFallback>
                        {professional.name ? professional.name.charAt(0) : '?'}
                        </AvatarFallback>
                    </Avatar>
                     {isEditing && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity" onClick={handleAvatarClick}>
                            <Upload className="h-8 w-8 text-white"/>
                        </div>
                    )}
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange}
                        className="hidden" 
                        accept="image/*"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                        {isEditing ? (
                        <Input
                            value={professional.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            className="text-3xl font-bold font-headline h-auto p-0 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                        ) : (
                        <h1 className="text-3xl font-bold font-headline">
                            {professional.name}
                        </h1>
                        )}
                        {professional.isVerified ? <ShieldCheck className="w-7 h-7 text-blue-500" /> : <Shield className="w-7 h-7 text-muted-foreground" />}
                    </div>

                    <div className="mt-1">
                      {professional.testimonials.length > 0 ? (
                        <StarRating
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
                    {isEditing ? (
                        <>
                            <Button onClick={handleSave}><Save className="mr-2" /> Guardar</Button>
                            <Button variant="outline" onClick={() => setIsEditing(false)}><X className="mr-2"/> Cancelar</Button>
                        </>
                    ) : (
                        <Button onClick={() => setIsEditing(true)}><Edit className="mr-2" /> Editar Perfil</Button>
                    )}
                    <Button variant="outline">
                        <Share2 className="mr-2 h-4 w-4" />
                        Compartir
                    </Button>
                   </div>
                </div>
              </CardContent>
            </Card>

            {/* About and Details */}
            <Tabs defaultValue="about" className="w-full">
              <TabsList>
                <TabsTrigger value="about">Sobre Mí</TabsTrigger>
                <TabsTrigger value="reviews">Reseñas</TabsTrigger>
                <TabsTrigger value="photos">Fotos</TabsTrigger>
                <TabsTrigger value="credentials">Credenciales</TabsTrigger>
                <TabsTrigger value="verification">Verificación</TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="mt-6">
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle>Sobre Mí</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {isEditing ? (
                      <Textarea 
                        value="" 
                        placeholder="Describe tu trabajo, tu experiencia y lo que te diferencia del resto..."
                        className="min-h-[100px]"
                      />
                    ) : (
                      <p className="text-muted-foreground">
                        Aún no has añadido una descripción.
                      </p>
                    )}
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
                           <li className="flex items-center gap-3"><Users className="w-4 h-4 text-primary" /> 
                            {isEditing ? <div className="flex items-center gap-2"><Input type="number" placeholder="0" className="w-16 h-8"/> <span>empleados</span></div> : <span>0 empleados</span>}
                           </li>
                           <li className="flex items-center gap-3"><Clock className="w-4 h-4 text-primary" /> 
                            {isEditing ? <div className="flex items-center gap-2"><Input type="number" placeholder="0" className="w-16 h-8"/> <span>años en el negocio</span></div> : <span>0 años en el negocio</span>}
                           </li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3">Horarios</h4>
                        {isEditing ? (
                            <div className="space-y-2 text-sm">
                                {['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'].map(day => (
                                    <div key={day} className="flex items-center justify-between gap-2">
                                        <span className="w-8">{day}:</span>
                                        <Input type="time" defaultValue="09:00" className="h-8 w-24"/>
                                        <span>-</span>
                                        <Input type="time" defaultValue="18:00" className="h-8 w-24"/>
                                        <Switch defaultChecked={day !== 'Sab' && day !== 'Dom'}/>
                                    </div>
                                ))}
                            </div>
                        ) : (
                             <ul className="space-y-2 text-sm text-muted-foreground">
                               <li className="flex justify-between"><span>Dom:</span> <span>Cerrado</span></li>
                               <li className="flex justify-between"><span>Lun:</span> <span>9:00 AM - 6:00 PM</span></li>
                               <li className="flex justify-between"><span>Mar:</span> <span>9:00 AM - 6:00 PM</span></li>
                               <li className="flex justify-between"><span>Mie:</span> <span>9:00 AM - 6:00 PM</span></li>
                               <li className="flex justify-between"><span>Jue:</span> <span>9:00 AM - 6:00 PM</span></li>
                               <li className="flex justify-between"><span>Vie:</span> <span>9:00 AM - 6:00 PM</span></li>
                               <li className="flex justify-between"><span>Sab:</span> <span>Cerrado</span></li>
                            </ul>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="mt-6">
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle>
                      Reseñas ({professional.testimonials.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
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
                                <div className="flex">
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
                              </div>
                              <p className="text-sm text-muted-foreground italic mt-1">
                                &quot;{t.text}&quot;
                              </p>
                            </div>
                          </div>
                        ))
                    ) : (
                      <p className="text-muted-foreground">Aún no hay reseñas.</p>
                    )
                    }
                  </CardContent>
                </Card>
              </TabsContent>
               <TabsContent value="photos" className="mt-6">
                <Card className="shadow-lg">
                  <CardHeader className="flex-row items-center justify-between">
                    <CardTitle>Galería de Trabajos</CardTitle>
                    {isEditing && (
                      <Button variant="outline">
                        <PlusCircle className="mr-2" /> Añadir Foto
                      </Button>
                    )}
                  </CardHeader>
                  <CardContent>
                    {workPhotos.length > 0 ? (
                      <Carousel
                        opts={{
                          align: 'start',
                        }}
                        className="w-full"
                      >
                        <CarouselContent>
                          {workPhotos.map((photo, index) => (
                            <CarouselItem
                              key={index}
                              className="md:basis-1/2 lg:basis-1/3"
                            >
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
                        <CarouselPrevious className="ml-12" />
                        <CarouselNext className="mr-12" />
                      </Carousel>
                    ) : (
                      <div className="text-center py-10">
                        <p className="text-muted-foreground">
                          Aún no has subido fotos de tus trabajos.
                        </p>
                        {isEditing && (
                          <Button className="mt-4">
                            <Upload className="mr-2" /> Subir mi primer trabajo
                          </Button>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="verification" className="mt-6">
                <VerificationTab 
                  isVerified={professional.isVerified}
                  onVerify={() => handleInputChange('isVerified', true)}
                />
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Métodos de Pago</CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <Textarea
                    value={paymentMethods}
                    onChange={(e) => setPaymentMethods(e.target.value)}
                    className="min-h-[100px]"
                    placeholder="Efectivo, Mercado Pago, Tarjeta de Crédito, etc."
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {paymentMethods || 'Aún no se han especificado métodos de pago.'}
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Precios</CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <div className="space-y-4">
                     <Tabs 
                        value={price.type} 
                        onValueChange={(value) => setPrice(prev => ({ ...prev, type: value }))} 
                        className="w-full"
                    >
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="Por Hora">Por Hora</TabsTrigger>
                        <TabsTrigger value="Por Trabajo">Por Trabajo</TabsTrigger>
                        <TabsTrigger value="Por Mes">Por Mes</TabsTrigger>
                      </TabsList>
                    </Tabs>
                    <div className="relative">
                       <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                       <Input 
                            type="number"
                            placeholder="Monto"
                            className="pl-8"
                            value={price.amount}
                            onChange={(e) => setPrice(prev => ({ ...prev, amount: e.target.value }))}
                        />
                    </div>
                     <Textarea
                        value={price.details}
                        onChange={(e) => setPrice(prev => ({ ...prev, details: e.target.value }))}
                        placeholder="Añade detalles sobre tus precios, por ejemplo: 'El precio por hora no incluye materiales.' o 'Presupuestos sin cargo.'"
                        className="min-h-[80px]"
                     />
                  </div>
                ) : (
                  <div className="space-y-2 text-sm">
                    {price.amount ? (
                        <>
                            <p className="font-semibold text-lg flex items-center">
                                ${price.amount}
                                <span className="text-sm font-normal text-muted-foreground ml-2">({price.type})</span>
                            </p>
                            <p className="text-muted-foreground">{price.details || 'Contactar para más detalles.'}</p>
                        </>
                    ) : (
                        <p className="text-muted-foreground">Aún no se ha especificado un precio.</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
