

'use client';

import React, {useRef, useState, useEffect} from 'react';
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
  PartyPopper,
  Phone,
  Sparkles as PremiumIcon,
  XCircle,
  Tag,
  Loader2,
  Trash2,
  Move,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog"
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {Badge} from '@/components/ui/badge';
import {Separator} from '@/components/ui/separator';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Textarea} from '@/components/ui/textarea';
import type { Professional, WorkPhoto, Schedule, Review } from '@/lib/types';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {useToast} from '@/hooks/use-toast';
import {Switch} from '@/components/ui/switch';
import VerificationTab from '@/components/professionals/verification-tab';
import { placeholderImages } from '@/lib/placeholder-images';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import PaymentDialog from '@/components/professionals/payment-dialog';
import { subMonths, formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CATEGORIES, CATEGORY_SPECIALTIES, defaultSchedule } from '@/lib/data';
import SpecialtiesDialog from '@/components/professionals/specialties-dialog';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { storage, db } from '@/lib/firebase';
import { ref, uploadString, getDownloadURL, deleteObject } from 'firebase/storage';
import { doc, getDoc, setDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { getReviewsForProfessional } from '@/lib/firestore-queries';
import { cn } from '@/lib/utils';


const MAX_AVATAR_SIZE_MB = 5;
const MAX_WORK_PHOTOS = 10;
const MAX_WORK_PHOTO_SIZE_MB = 5;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));


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
        ({totalReviews} reseñas)
      </span>
    </div>
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

const initialProfessionalData: Professional = {
    id: '', 
    name: "Nombre del Profesional",
    description: "",
    phone: "",
    email: "profesional@email.com",
    photoUrl: "",
    photoHint: "",
    photoPositionX: 50,
    photoPositionY: 50,
    specialties: [],
    avgRating: 0,
    categoryIds: [],
    workPhotos: placeholderImages.filter(p => p.id.startsWith('work-')),
    isVerified: false,
    verificationStatus: 'not_started',
    subscriptionTier: 'standard',
    registrationDate: new Date(),
    isActive: true,
    schedule: defaultSchedule,
    totalReviews: 0,
    employees: 0,
    yearsInBusiness: 0,
    paymentMethods: '',
    dayAvailability: {
        "Dom": false,
        "Lun": false,
        "Mar": false,
        "Mie": false,
        "Jue": false,
        "Vie": false,
        "Sab": false
    }
};


export default function ProfilePage() {
  const { user, loading } = useAdminAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [professional, setProfessional] = useState<Professional | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [paymentMethods, setPaymentMethods] = useState('');
  const [price, setPrice] = useState({ type: 'Por Hora', amount: '', details: '' });
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [isSpecialtiesDialogOpen, setIsSpecialtiesDialogOpen] = useState(false);
  const [currentCategoryForSpecialties, setCurrentCategoryForSpecialties] = useState<number | null>(null);
  const [activePhoto, setActivePhoto] = useState<WorkPhoto | null>(null);
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);
  const [schedule, setSchedule] = useState<Schedule[]>([]);

  // State for image panning
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [startImgPos, setStartImgPos] = useState({ x: 50, y: 50 });
  const avatarContainerRef = useRef<HTMLDivElement>(null);


  const { toast } = useToast();
  const avatarFileInputRef = useRef<HTMLInputElement>(null);
  const workPhotoInputRef = useRef<HTMLInputElement>(null);


  useEffect(() => {
    if (loading) return;
    if (!user) {
        // Handle case where user is not logged in if necessary, e.g., redirect.
        return;
    }

    const unsub = onSnapshot(doc(db, "professionalsDetails", user.uid), (docSnap) => {
        if (docSnap.exists()) {
            const data = docSnap.data() as Professional;
            if (data.lastPaymentDate && (data.lastPaymentDate as any).toDate) {
                data.lastPaymentDate = (data.lastPaymentDate as any).toDate();
            }
            if (data.registrationDate && (data.registrationDate.toDate)) {
                data.registrationDate = (data.registrationDate.toDate() as Date);
            }
            
            const fetchedProfessional: Professional = {
                ...initialProfessionalData,
                ...data,
                id: docSnap.id,
                totalReviews: data.totalReviews ?? reviews.length,
                avgRating: data.avgRating ?? 0,
                photoPositionX: data.photoPositionX || 50,
                photoPositionY: data.photoPositionY || 50,
            };

            setProfessional(fetchedProfessional);
            setStartImgPos({x: fetchedProfessional.photoPositionX, y: fetchedProfessional.photoPositionY});
            setSchedule(data.schedule || defaultSchedule);
            setPaymentMethods(data.paymentMethods || '');
            if (data.priceInfo) {
                const [typePart, amountPart] = data.priceInfo.split(': $');
                const type = typePart?.trim();
                const amount = amountPart ? amountPart.split(' ')[0] : '';
                setPrice({ type: type || 'Por Hora', amount: amount || '', details: '' });
            }
        } else if (user) {
            const newProfessional: Professional = {
                ...initialProfessionalData,
                id: user.uid,
                name: user.displayName || 'Nuevo Profesional',
                email: user.email || '',
                photoUrl: user.photoURL || '',
                registrationDate: new Date(),
                avgRating: 0,
                totalReviews: 0,
                photoPositionX: 50,
                photoPositionY: 50,
                dayAvailability: initialProfessionalData.dayAvailability,
            };
            setProfessional(newProfessional);
            setStartImgPos({x: 50, y: 50});
            setSchedule(newProfessional.schedule || defaultSchedule);
            setIsEditing(true); 
        }
    });

    const fetchReviews = async () => {
        if (!user) return;
        const reviewsData = await getReviewsForProfessional(db, user.uid);
        setReviews(reviewsData);
    };

    fetchReviews();
    
    return () => unsub();
  }, [user, loading, reviews.length]);
  
  const handleCategoryChange = (index: number, newCategoryId: string) => {
    const categoryIdNum = Number(newCategoryId);
    setProfessional(prev => {
        if (!prev) return null;
        const newCategoryIds = [...prev.categoryIds];
        newCategoryIds[index] = categoryIdNum;
        return { ...prev, categoryIds: newCategoryIds };
    });
    if (CATEGORY_SPECIALTIES[categoryIdNum]) {
        setCurrentCategoryForSpecialties(categoryIdNum);
        setIsSpecialtiesDialogOpen(true);
    }
  };

  const addCategory = () => {
    setProfessional(prev => {
        if (!prev || prev.categoryIds.length >= 3) return prev;
        return { ...prev, categoryIds: [...prev.categoryIds, 0] };
    });
  };

  const removeCategory = (index: number) => {
    setProfessional(prev => {
        if (!prev) return null;
        const newCategoryIds = prev.categoryIds.filter((_, i) => i !== index);
        return { ...prev, categoryIds: newCategoryIds };
    });
  };

  const handleInputChange = (field: keyof Professional, value: any) => {
    setProfessional(prev => (prev ? {...prev, [field]: value} : null));
  };
  
  const handleScheduleChange = (day: string, field: 'open' | 'close' | 'enabled', value: string | boolean) => {
      setSchedule(prev => prev.map(s => s.day === day ? { ...s, [field]: value } : s));
  };

  const uploadImage = async (fileDataUrl: string, path: string): Promise<string> => {
    if (fileDataUrl.startsWith('http')) return fileDataUrl; 
    const storageRef = ref(storage, path);
    const uploadTask = await uploadString(storageRef, fileDataUrl, 'data_url');
    return await getDownloadURL(uploadTask.ref);
  };

  const handleSave = async () => {
    if (!professional || !user) {
        toast({ title: "Error", description: "No se pudieron guardar los cambios.", variant: "destructive" });
        return;
    }
    
    setIsSaving(true);
    const wasFirstEdit = !professional.subscription?.isSubscriptionActive;

    try {
        let finalAvatarUrl = professional.photoUrl;
        if (professional.photoUrl && !professional.photoUrl.startsWith('http')) {
            finalAvatarUrl = await uploadImage(professional.photoUrl, `professional-avatars/${user.uid}`);
        }

        const uploadedWorkPhotos = await Promise.all(
            (professional.workPhotos || []).map(async (photo) => {
                if (photo.imageUrl && !photo.imageUrl.startsWith('http')) {
                    const newUrl = await uploadImage(photo.imageUrl, `professional-work-photos/${user.uid}/${Date.now()}`);
                    return { ...photo, imageUrl: newUrl };
                }
                return photo;
            })
        );

        const newDayAvailability: { [key: string]: boolean } = {};
        schedule.forEach(dayEntry => {
            if (dayEntry.day && typeof dayEntry.enabled === 'boolean') {
                newDayAvailability[dayEntry.day] = dayEntry.enabled;
            }
        });
        
        const { avgRating, totalReviews, ...dataToSave } = professional;

        const finalProfessionalData = {
            ...dataToSave,
            photoUrl: finalAvatarUrl || '',
            workPhotos: uploadedWorkPhotos,
            priceInfo: `${price.type}: $${price.amount}`, 
            paymentMethods: paymentMethods,
            schedule,
            isActive: true,
            dayAvailability: newDayAvailability,
        };
        
        const professionalDocRef = doc(db, 'professionalsDetails', user.uid);
        await setDoc(professionalDocRef, finalProfessionalData, { merge: true });

        const userDocRef = doc(db, 'users', user.uid);
        await updateDoc(userDocRef, {
            name: professional.name,
            photoUrl: finalAvatarUrl,
        });

        setIsEditing(false);
        
        toast({
            title: "Perfil Actualizado",
            description: "Tus cambios han sido guardados."
        });

        if (wasFirstEdit) {
            setTimeout(() => setIsPaymentDialogOpen(true), 300);
        }

    } catch (error: any) {
        console.error("Error al guardar el perfil:", error);
        toast({
            title: "Error al Guardar",
            description: error.message || "No se pudieron guardar los datos.",
            variant: "destructive"
        });
    } finally {
        setIsSaving(false);
    }
}
  
  const handleSpecialtiesSave = (newSpecialties: string[]) => {
    setProfessional(prev => {
        if (!prev) return null;
        // No need to check for uniqueness here as the dialog and removal logic should handle it
        return { ...prev, specialties: newSpecialties };
    });
  };
  
  const removeSpecialty = (specialtyToRemove: string) => {
    handleSpecialtiesSave(professional?.specialties.filter(s => s !== specialtyToRemove) || []);
  };


  const handlePaymentSuccess = async (plan: 'standard' | 'premium') => {
    if (!professional || !user) return;
    
    const updatedData = {
        subscriptionTier: plan,
        subscription: {
            isSubscriptionActive: true,
            lastPaymentDate: new Date(),
        },
    };
    
    try {
        const professionalDocRef = doc(db, 'professionalsDetails', user.uid);
        await setDoc(professionalDocRef, updatedData, { merge: true });

        setIsPaymentDialogOpen(false);

        toast({
            title: "¡Suscripción Activada!",
            description: `Tu perfil ahora está visible para nuevos clientes.`,
        });

    } catch(error) {
        console.error("Error al activar la suscripción:", error);
        toast({ title: "Error", description: "No se pudo actualizar tu plan.", variant: "destructive" });
    }
  }

  const handleAvatarClick = () => {
    if (isEditing) {
      if (avatarFileInputRef.current) {
        avatarFileInputRef.current.click();
      }
    } else {
      setIsAvatarDialogOpen(true);
    }
  };
  
  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && professional) {
          if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
              toast({ title: "Formato no permitido", description: "Por favor, sube una imagen en formato JPG, PNG o WebP.", variant: "destructive" });
              return;
          }
          if (file.size > MAX_AVATAR_SIZE_MB * 1024 * 1024) {
              toast({ title: "Archivo muy grande", description: `La imagen no puede superar los ${MAX_AVATAR_SIZE_MB}MB. Elegí una más liviana.`, variant: "destructive" });
              return;
          }

          const reader = new FileReader();
          reader.onloadend = () => {
              setProfessional({...professional, photoUrl: reader.result as string, photoPositionX: 50, photoPositionY: 50});
              setStartImgPos({x: 50, y: 50});
          }
          reader.readAsDataURL(file);
      }
  }

  const handleAddWorkPhotoClick = () => {
    if (isEditing && workPhotoInputRef.current) {
      workPhotoInputRef.current.click();
    }
  };

  const handleDeleteWorkPhoto = (photoId: string) => {
    if (professional) {
      const updatedPhotos = professional.workPhotos?.filter(photo => photo.id !== photoId);
      setProfessional({ ...professional, workPhotos: updatedPhotos });
      toast({
        title: "Foto eliminada",
        description: "La foto se quitará de tu galería cuando guardes los cambios.",
      });
    }
  };

  const handleWorkPhotoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && professional) {
      const currentPhotoCount = professional.workPhotos?.length || 0;
      if (files.length + currentPhotoCount > MAX_WORK_PHOTOS) {
        toast({
            title: `Límite de ${MAX_WORK_PHOTOS} fotos alcanzado`,
            description: `Solo puedes tener un total de ${MAX_WORK_PHOTOS} fotos en tu galería.`,
            variant: "destructive"
        });
        return;
      }
      
      const newPhotos: WorkPhoto[] = [];
      const filesArray = Array.from(files);

      let validFilesCount = 0;
      for (const file of filesArray) {
         if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
            toast({ title: "Formato no permitido", description: `El archivo '${file.name}' no es un formato de imagen válido (JPG, PNG, WebP).`, variant: "destructive" });
            continue;
        }
        if (file.size > MAX_WORK_PHOTO_SIZE_MB * 1024 * 1024) {
            toast({ title: "Archivo muy grande", description: `La foto '${file.name}' supera el límite de ${MAX_WORK_PHOTO_SIZE_MB}MB.`, variant: "destructive" });
            continue;
        }
        validFilesCount++;

        const reader = new FileReader();
        reader.onloadend = () => {
          newPhotos.push({
            id: `work-${Date.now()}-${Math.random()}`,
            imageUrl: reader.result as string,
            description: "Trabajo realizado",
            imageHint: "professional work"
          });

          if (newPhotos.length === validFilesCount) {
            setProfessional(prev => prev ? { ...prev, workPhotos: [...(prev.workPhotos || []), ...newPhotos] } : null);
             if (newPhotos.length > 0) {
                 toast({
                    title: `${newPhotos.length} foto(s) añadida(s)`,
                    description: "Tus nuevas fotos de trabajo ahora están en la galería."
                })
             }
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };
  
    const handleEditSpecialties = () => {
        if (professional?.categoryIds.length > 0) {
            const firstCategoryId = professional.categoryIds[0];
            if (CATEGORY_SPECIALTIES[firstCategoryId]) {
                setCurrentCategoryForSpecialties(firstCategoryId);
                setIsSpecialtiesDialogOpen(true);
            } else {
                toast({
                    title: 'Sin Especialidades',
                    description: 'La categoría principal seleccionada no tiene especialidades para elegir.',
                    variant: 'destructive',
                });
            }
        }
    };
    
    const handleShare = async () => {
        if (!professional) return;
    
        const shareData = {
          title: `Perfil de ${professional.name} en BahiaBlancaOficios`,
          text: `¡Mirá el perfil de este profesional en BahiaBlancaOficios!`,
          url: `${window.location.origin}/profesional/${professional.id}`,
        };
    
        if (navigator.share) {
          try {
            await navigator.share(shareData);
          } catch (error) {
            console.error('Error al compartir:', error);
          }
        } else {
          try {
            await navigator.clipboard.writeText(shareData.url);
            toast({
              title: '¡Enlace Copiado!',
              description: 'El enlace al perfil ha sido copiado a tu portapapeles.',
            });
          } catch (err) {
            console.error('Error al copiar el enlace:', err);
            toast({
              title: 'Error al Copiar',
              description: 'No se pudo copiar el enlace. Inténtalo manualmente.',
              variant: 'destructive',
            });
          }
        }
      };

    const whatsappNumber = '2915276388';
    const whatsappMessage = encodeURIComponent(`¡Hola! Soy ${professional?.name} y me gustaría destacar mi perfil en BahiaBlancaOficios.`);
    const recommendationWAppLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

    // --- Image Panning Logic ---
    const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isEditing || !professional) return;
        e.preventDefault();
        setIsDragging(true);
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        setStartPos({ x: clientX, y: clientY });
        setStartImgPos({ x: professional.photoPositionX || 50, y: professional.photoPositionY || 50 });
    };

    const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDragging || !avatarContainerRef.current || !professional) return;
        e.preventDefault();
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

        const deltaX = clientX - startPos.x;
        const deltaY = clientY - startPos.y;

        const containerWidth = avatarContainerRef.current.offsetWidth;
        const containerHeight = avatarContainerRef.current.offsetHeight;

        const percentDeltaX = (deltaX / containerWidth) * 100;
        const percentDeltaY = (deltaY / containerHeight) * 100;

        const newX = clamp(startImgPos.x + percentDeltaX, 0, 100);
        const newY = clamp(startImgPos.y + percentDeltaY, 0, 100);
        
        handleInputChange('photoPositionX', newX);
        handleInputChange('photoPositionY', newY);
    };

    const handleDragEnd = () => {
        setIsDragging(false);
    };

    const handleWorkPhotoNavigation = (direction: 'next' | 'prev') => {
        if (!activePhoto || !professional?.workPhotos) return;
        const currentIndex = professional.workPhotos.findIndex(p => p.id === activePhoto.id);
        if (currentIndex === -1) return;

        let nextIndex;
        if (direction === 'next') {
            nextIndex = (currentIndex + 1) % professional.workPhotos.length;
        } else {
            nextIndex = (currentIndex - 1 + professional.workPhotos.length) % professional.workPhotos.length;
        }
        setActivePhoto(professional.workPhotos[nextIndex]);
    };

    useEffect(() => {
        const container = avatarContainerRef.current;
        const moveHandler = (e: MouseEvent | TouchEvent) => handleDragMove(e as any);
        const endHandler = () => handleDragEnd();

        if (isDragging && container) {
            window.addEventListener('mousemove', moveHandler);
            window.addEventListener('mouseup', endHandler);
            window.addEventListener('touchmove', moveHandler);
            window.addEventListener('touchend', endHandler);
        
            return () => {
                window.removeEventListener('mousemove', moveHandler);
                window.removeEventListener('mouseup', endHandler);
                window.removeEventListener('touchmove', moveHandler);
                window.removeEventListener('touchend', endHandler);
            };
        }
    }, [isDragging, handleDragMove, handleDragEnd]);
    // --- End Image Panning Logic ---

    if (loading || !professional) {
      return (
          <div className='flex items-center justify-center h-screen'>
              <Loader2 className='w-12 h-12 animate-spin text-primary' />
              <p className='ml-4 text-lg'>Cargando tu perfil...</p>
          </div>
      );
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
                  <Dialog open={isAvatarDialogOpen} onOpenChange={setIsAvatarDialogOpen}>
                    <div className="relative group" ref={avatarContainerRef}>
                      <DialogTrigger asChild>
                        <Avatar 
                            className="w-36 h-36 border-4 border-background shadow-md cursor-pointer"
                            onClick={handleAvatarClick}
                        >
                            <AvatarImage 
                              src={professional.photoUrl} 
                              alt={professional.name} 
                              className="object-cover"
                              style={{ objectPosition: `${professional.photoPositionX || 50}% ${professional.photoPositionY || 50}%` }}
                              onMouseDown={handleDragStart}
                              onTouchStart={handleDragStart}
                            />
                            <AvatarFallback className="text-4xl">
                                {professional.name ? professional.name.charAt(0) : '?'}
                            </AvatarFallback>
                        </Avatar>
                      </DialogTrigger>
                      {isEditing && (
                          <div 
                            className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                          >
                            <div className='text-center text-white text-xs p-2 bg-black/50 rounded-md'>
                                {professional.photoUrl ? <><Move className="h-6 w-6 mx-auto mb-1"/><p>Arrastrá para reencuadrar</p></> : <><Upload className="h-8 w-8 mx-auto mb-1"/> <p>Subir foto</p></>}
                            </div>
                          </div>
                      )}
                      <Button 
                          variant="outline" size="icon" 
                          className="absolute bottom-1 right-1 h-8 w-8 rounded-full bg-background/80" 
                          onClick={handleAvatarClick}
                          style={{ display: isEditing ? 'flex' : 'none' }}
                          type='button'
                        >
                          <Upload className="h-4 w-4 text-foreground"/>
                        </Button>
                      <input 
                          type="file" 
                          ref={avatarFileInputRef} 
                          onChange={handleAvatarFileChange}
                          className="hidden" 
                          accept={ALLOWED_IMAGE_TYPES.join(',')}
                      />
                    </div>
                    <DialogContent className="max-w-md p-2">
                        <DialogTitle className="sr-only">Foto de Perfil de {professional.name}</DialogTitle>
                        <div className="relative aspect-square">
                        <Image
                            src={professional.photoUrl}
                            alt={professional.name}
                            fill
                            className="object-contain rounded-md"
                        />
                        </div>
                    </DialogContent>
                  </Dialog>

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
                     <div className="mt-2 text-sm space-y-2">
                      {isEditing ? (
                         <div className="space-y-2">
                            {professional.categoryIds.map((catId, index) => (
                                <div key={index} className="flex items-center gap-2">
                                     <Briefcase className="w-4 h-4 text-muted-foreground" />
                                     <Select 
                                        value={String(catId)}
                                        onValueChange={(value) => handleCategoryChange(index, value)}
                                     >
                                        <SelectTrigger className="w-fit h-auto p-1 border-dashed">
                                          <SelectValue placeholder={`Oficio ${index + 1}`} />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {CATEGORIES.map((category) => (
                                            <SelectItem 
                                                key={category.id} 
                                                value={String(category.id)}
                                                disabled={professional.categoryIds.includes(category.id) && professional.categoryIds[index] !== category.id}
                                            >
                                              {category.name}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                      {index > 0 && (
                                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeCategory(index)}>
                                            <XCircle className="w-4 h-4 text-red-500" />
                                        </Button>
                                      )}
                                </div>
                            ))}
                            {professional.categoryIds.length < 3 && (
                                <Button variant="link" size="sm" onClick={addCategory} className="p-0 h-auto">
                                    <PlusCircle className="mr-2" /> Añadir otro oficio
                                </Button>
                            )}
                         </div>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                            {professional.categoryIds.map(catId => {
                                const category = CATEGORIES.find(c => c.id === catId);
                                return category ? <Badge key={catId} variant="secondary">{category.name}</Badge> : null;
                            })}
                        </div>
                      )}
                    </div>
                    <div className="mt-2">
                      {reviews.length > 0 ? (
                        <StarRating
                          rating={professional.avgRating}
                          totalReviews={reviews.length}
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
                            <Button onClick={handleSave} disabled={isSaving}>
                              {isSaving ? <><Loader2 className="mr-2 animate-spin" /> Guardando...</> : <><Save className="mr-2" /> Guardar Cambios</>}
                            </Button>
                            {professional.subscription?.isSubscriptionActive && (
                                <Button variant="outline" onClick={() => setIsEditing(false)}><X className="mr-2"/> Cancelar</Button>
                            )}
                        </>
                    ) : (
                        <Button onClick={() => setIsEditing(true)}>
                            <Edit className="mr-2" /> {professional.subscription?.isSubscriptionActive ? 'Editar Perfil' : 'Rellena tu Perfil'}
                        </Button>
                    )}
                    <Button variant="outline" onClick={handleShare}>
                        <Share2 className="mr-2 h-4 w-4" />
                        Compartir
                    </Button>
                   </div>
                </div>
              </CardContent>
            </Card>

            {isEditing && (
              <Card>
                <CardHeader>
                  <CardTitle>Tu Teléfono de Contacto</CardTitle>
                  <CardDescription>
                    Este es el número que verán los clientes para contactarte por WhatsApp. Asegúrate de que sea correcto.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                   <div className="relative max-w-sm">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        type="tel"
                        placeholder="Ej: 2914123456"
                        className="pl-10 text-lg"
                        value={professional.phone || ''}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                      />
                    </div>
                </CardContent>
              </Card>
            )}

            <Tabs defaultValue="about" className="w-full">
              <TabsList>
                <TabsTrigger value="about">Sobre Mí</TabsTrigger>
                <TabsTrigger value="reviews">Reseñas ({reviews.length})</TabsTrigger>
                <TabsTrigger value="photos">Fotos</TabsTrigger>
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
                        value={professional.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        placeholder="Describe tu trabajo, tu experiencia y lo que te diferencia del resto..."
                        className="min-h-[100px]"
                      />
                    ) : (
                      <p className="text-muted-foreground whitespace-pre-wrap">
                        {professional.description || 'Aún no has añadido una descripción.'}
                      </p>
                    )}
                    <Separator />
                    
                    <div>
                         <div className="flex items-center gap-4 mb-3">
                            <h4 className="font-semibold">Especialidades</h4>
                            {isEditing && professional.categoryIds.length > 0 && (
                                <Button variant="outline" size="sm" onClick={handleEditSpecialties}>
                                    <Edit className="mr-2 h-3 w-3" /> Editar
                                </Button>
                            )}
                        </div>
                         {professional.specialties.length > 0 ? (
                             <div className="flex flex-wrap gap-2">
                                {professional.specialties.map(spec => (
                                    <Badge key={spec} variant="secondary" className="text-sm py-1 pl-3 pr-2">
                                        <Tag className="mr-2 h-3 w-3"/>
                                        {spec}
                                        {isEditing && (
                                            <button onClick={() => removeSpecialty(spec)} className="ml-2 rounded-full hover:bg-black/20 p-0.5">
                                                <X className="h-3 w-3"/>
                                            </button>
                                        )}
                                    </Badge>
                                ))}
                             </div>
                         ) : (
                            <p className="text-sm text-muted-foreground">
                                {isEditing ? 'Haz clic en "Editar" para añadir o crear tus especialidades.' : 'Aún no se han especificado especialidades.'}
                            </p>
                         )}
                    </div>
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
                           <li className="flex items-center gap-3"><Users className="w-4 h-4 text-primary" /> 
                            {isEditing ? <div className="flex items-center gap-2"><Input type="number" value={professional.employees || 0} onChange={e => handleInputChange('employees', Number(e.target.value))} placeholder="0" className="w-16 h-8"/> <span>empleados</span></div> : <span>{professional.employees || 0} empleados</span>}
                           </li>
                           <li className="flex items-center gap-3"><Clock className="w-4 h-4 text-primary" /> 
                            {isEditing ? <div className="flex items-center gap-2"><Input type="number" value={professional.yearsInBusiness || 0} onChange={e => handleInputChange('yearsInBusiness', Number(e.target.value))} placeholder="0" className="w-16 h-8"/> <span>años en el negocio</span></div> : <span>{professional.yearsInBusiness || 0} años en el negocio</span>}
                           </li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3">Horarios</h4>
                        {isEditing ? (
                            <div className="space-y-2 text-sm">
                                {schedule.map((s, i) => (
                                    <div key={i} className="flex items-center justify-between gap-2">
                                        <span className="w-8">{s.day}:</span>
                                        <Input type="time" value={s.open} onChange={e => handleScheduleChange(s.day, 'open', e.target.value)} disabled={!s.enabled} className="h-8 w-24"/>
                                        <span>-</span>
                                        <Input type="time" value={s.close} onChange={e => handleScheduleChange(s.day, 'close', e.target.value)} disabled={!s.enabled} className="h-8 w-24"/>
                                        <Switch checked={s.enabled} onCheckedChange={value => handleScheduleChange(s.day, 'enabled', value)}/>
                                    </div>
                                ))}
                            </div>
                        ) : (
                             <ul className="space-y-2 text-sm text-muted-foreground">
                                {schedule.map(s => (
                                     <li key={s.day} className="flex justify-between">
                                        <span>{s.day}:</span> 
                                        <span>{s.enabled ? `${s.open} - ${s.close}` : 'Cerrado'}</span>
                                    </li>
                                ))}
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
                      <p className="text-muted-foreground">Aún no hay reseñas.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
               <TabsContent value="photos" className="mt-6">
                <Card className="shadow-lg">
                  <CardHeader className="flex-row items-center justify-between">
                    <CardTitle>Galería de Trabajos ({professional.workPhotos?.length || 0}/{MAX_WORK_PHOTOS})</CardTitle>
                    {isEditing && (
                      <>
                        <Button variant="outline" onClick={handleAddWorkPhotoClick} disabled={(professional.workPhotos?.length || 0) >= MAX_WORK_PHOTOS}>
                          <PlusCircle className="mr-2" /> Añadir Foto
                        </Button>
                        <input
                          type="file"
                          ref={workPhotoInputRef}
                          onChange={handleWorkPhotoFileChange}
                          className="hidden"
                          accept={ALLOWED_IMAGE_TYPES.join(',')}
                          multiple
                        />
                      </>
                    )}
                  </CardHeader>
                  <CardContent>
                    {professional.workPhotos && professional.workPhotos.length > 0 ? (
                      <Dialog>
                        <Carousel opts={{ align: 'start' }} className="w-full">
                          <CarouselContent>
                            {professional.workPhotos.map((photo) => (
                              <CarouselItem
                                key={photo.id}
                                className="md:basis-1/2 lg:basis-1/3"
                              >
                                <div className="p-1 group relative">
                                  <DialogTrigger asChild onClick={() => setActivePhoto(photo)}>
                                      <div className="cursor-pointer">
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
                                  {isEditing && (
                                    <Button
                                      variant="destructive"
                                      size="icon"
                                      className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                                      onClick={() => handleDeleteWorkPhoto(photo.id)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                      <span className="sr-only">Eliminar foto</span>
                                    </Button>
                                  )}
                                </div>
                              </CarouselItem>
                            ))}
                          </CarouselContent>
                          <CarouselPrevious className="ml-12" />
                          <CarouselNext className="mr-12" />
                        </Carousel>
                          <DialogContent className="max-w-3xl p-0 bg-transparent border-none shadow-none">
                            {activePhoto && (
                                <div className="relative aspect-video">
                                    <Image
                                        src={activePhoto.imageUrl}
                                        alt={activePhoto.description}
                                        fill
                                        className="object-contain rounded-md"
                                    />
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleWorkPhotoNavigation('prev')}
                                        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 text-white hover:bg-black/70 hover:text-white"
                                    >
                                        <ChevronLeft className="h-6 w-6" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleWorkPhotoNavigation('next')}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 text-white hover:bg-black/70 hover:text-white"
                                    >
                                        <ChevronRight className="h-6 w-6" />
                                    </Button>
                                </div>
                            )}
                        </DialogContent>
                      </Dialog>
                    ) : (
                      <div className="text-center py-10">
                        <p className="text-muted-foreground">
                          Aún no has subido fotos de tus trabajos.
                        </p>
                        {isEditing && (
                          <Button className="mt-4" onClick={handleAddWorkPhotoClick}>
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
                  verificationStatus={professional.verificationStatus}
                  professionalId={professional.id}
                />
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-8">
            {!professional.isFeatured && (
              <Card className="bg-blue-50 border-blue-200 text-blue-900 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PremiumIcon className="text-blue-500" />
                    ¡Destacá tu Perfil!
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    Aparecé primero en las búsquedas de tu rubro y conseguí más clientes. ¡Contactanos para saber cómo!
                  </p>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                    <a href={recommendationWAppLink} target="_blank" rel="noopener noreferrer">
                      <Phone className="mr-2" /> Quiero ser recomendado
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            )}

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
                        <TabsTrigger value="Por Distancia">Por Distancia</TabsTrigger>
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
                    {professional.priceInfo ? (
                        <>
                            <p className="font-semibold text-lg flex items-center">
                                {professional.priceInfo}
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
     <PaymentDialog
        isOpen={isPaymentDialogOpen}
        onOpenChange={setIsPaymentDialogOpen}
        professionalName={professional.name}
        onPaymentSuccess={handlePaymentSuccess}
      />
      
      {currentCategoryForSpecialties !== null && CATEGORY_SPECIALTIES[currentCategoryForSpecialties] && (
        <SpecialtiesDialog
            isOpen={isSpecialtiesDialogOpen}
            onOpenChange={setIsSpecialtiesDialogOpen}
            categoryName={CATEGORY_SPECIALTIES[currentCategoryForSpecialties].name}
            availableSpecialties={CATEGORY_SPECIALTIES[currentCategoryForSpecialties].specialties}
            selectedSpecialties={professional.specialties}
            onSave={handleSpecialtiesSave}
        />
     )}
    </>
  );
}
