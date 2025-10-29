
'use client';

import type { JobRequest } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Check, MessageSquare, Tag, Phone, PowerOff, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { useState } from 'react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import Image from 'next/image';

interface JobRequestCardProps {
    request: JobRequest;
    onUpdateRequest: (id: string, status: 'open' | 'closed') => void;
    isUpdating: boolean;
}

const normalizeWhatsAppNumber = (phone: string): string => {
    let cleaned = phone.replace(/\D/g, ''); // Remove all non-numeric characters
    
    // Case 1: Already correct format (e.g., 549291...)
    if (cleaned.startsWith('549')) {
        return cleaned;
    }
    
    // Case 2: Starts with 9 (common for mobile) and is 10 digits (e.g., 9291...)
    if (cleaned.startsWith('9') && cleaned.length === 11) { // 9 + 10 digits area code + number
        return `54${cleaned}`;
    }

    // Case 3: Local number (e.g., 291...)
    if (cleaned.length === 10 && cleaned.startsWith('291')) {
        return `549${cleaned}`;
    }

    // Fallback for other cases, assuming it might be a complete number without the 54
     if (cleaned.length > 9) {
        return `54${cleaned}`;
    }
    
    // Default fallback
    return cleaned;
}


export default function JobRequestCard({ request, onUpdateRequest, isUpdating }: JobRequestCardProps) {
    const { user, isProfessional } = useAdminAuth();
    const [showContact, setShowContact] = useState(false);

    const getWhatsAppLink = (phone?: string) => {
        if (!phone) return '#';
        const normalizedPhone = normalizeWhatsAppNumber(phone);
        const message = encodeURIComponent(`Hola ${request.clientName}, te escribo por tu anuncio "${request.title}" en BahiaBlancaOficios.`);
        return `https://wa.me/${normalizedPhone}?text=${message}`;
    }

    const hasComments = request.comments.length > 0;
    
    const canApply = isProfessional && user;
    const isOwner = user && user.uid === request.clientId;

    const handleApply = () => {
        setShowContact(true);
    }
    
    const handleFinalize = () => {
        if (isOwner) {
            onUpdateRequest(request.id.toString(), 'closed');
        }
    }


    return (
        <Card className="w-full overflow-hidden transition-shadow hover:shadow-md">
            <CardHeader className='flex-row items-start gap-4'>
                 <Avatar>
                    <AvatarImage src={request.clientPhotoUrl} alt={request.clientName} />
                    <AvatarFallback>{request.clientName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className='flex-1'>
                    <CardTitle className="text-lg font-headline">
                        {request.title}
                    </CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span>Publicado por {request.clientName}</span>
                        <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            {formatDistanceToNow(request.createdAt, { addSuffix: true, locale: es })}
                        </div>
                    </div>
                </div>
                 <Badge variant={request.status === 'open' ? 'secondary' : 'outline'} className={request.status === 'open' ? 'bg-green-100 text-green-800' : ''}>
                    {request.status === 'open' ? 'Abierto' : 'Finalizado'}
                </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                    {request.description}
                </p>
                {request.imageUrl && (
                    <div className="relative aspect-video w-full max-w-sm mx-auto overflow-hidden rounded-lg">
                        <Image 
                            src={request.imageUrl}
                            alt={`Imagen de referencia para ${request.title}`}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover"
                        />
                    </div>
                )}
            </CardContent>
            <CardFooter className="justify-between items-center bg-muted/50 p-4">
                 <div className="flex items-center gap-2 font-bold text-lg text-primary">
                    <Tag className="w-5 h-5" />
                    <span>${request.budget.toLocaleString('es-AR')}</span>
                 </div>

                <div className="flex items-center gap-3">
                     {hasComments && (
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                            <MessageSquare className="w-4 h-4" />
                           <span>{request.comments.length} {request.comments.length === 1 ? 'interesado' : 'interesados'}</span>
                        </div>
                     )}
                     {request.status === 'open' ? (
                        <>
                            {isOwner && (
                                 <Button onClick={handleFinalize} variant="destructive" size="sm" disabled={isUpdating}>
                                    {isUpdating ? <Loader2 className="mr-2 animate-spin" /> : <PowerOff className="mr-2"/>} 
                                    Finalizar
                                </Button>
                            )}
                            {canApply && (
                                showContact ? (
                                    <Button asChild>
                                        <a href={getWhatsAppLink(request.whatsapp)} target="_blank" rel="noopener noreferrer">
                                            <Phone className="mr-2" /> Ver Contacto
                                        </a>
                                    </Button>
                                ) : (
                                    <Button onClick={handleApply}>
                                        Postularme
                                    </Button>
                                )
                            )}
                        </>
                     ): (
                        <Button disabled variant="outline">
                           <Check className="mr-2" />
                            Trabajo finalizado
                        </Button>
                     )}
                </div>
            </CardFooter>
        </Card>
    );
}
