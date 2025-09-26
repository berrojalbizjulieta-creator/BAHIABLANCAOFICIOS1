'use client';

import type { JobRequest } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Check, MessageSquare, Tag, Phone } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { useState } from 'react';
import Link from 'next/link';
import { useAdminAuth } from '@/hooks/useAdminAuth';

interface JobRequestCardProps {
    request: JobRequest;
}

export default function JobRequestCard({ request }: JobRequestCardProps) {
    const { user, isProfessional } = useAdminAuth();
    const [showContact, setShowContact] = useState(false);

    const getWhatsAppLink = (phone?: string) => {
        if (!phone) return '#';
        const cleanedPhone = phone.replace(/[^0-9]/g, '');
        const message = encodeURIComponent(`Hola ${request.clientName}, te escribo por tu anuncio "${request.title}" en BahiaBlancaOficios.`);
        return `https://wa.me/${cleanedPhone}?text=${message}`;
    }

    const hasComments = request.comments.length > 0;
    
    // A professional can apply if they are logged in and it's a professional account
    const canApply = isProfessional && user;

    // A professional should be able to see the contact info if they have applied.
    // For now, we simulate this with the local `showContact` state.
    // A real implementation would check if the professional has already commented or "applied".
    const handleApply = () => {
        // In a real app, this would probably open a comment modal or save an application to the DB.
        // For now, we'll just toggle the contact visibility directly to simulate the flow.
        setShowContact(true);
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
            <CardContent>
                <p className="text-muted-foreground">
                    {request.description}
                </p>
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
                        canApply ? (
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
                        ) : null
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
