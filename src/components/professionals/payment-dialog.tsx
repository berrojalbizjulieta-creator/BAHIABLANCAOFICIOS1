'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../ui/card';
import { Check, Sparkles, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaymentDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  professionalName: string;
  onPaymentSuccess?: (plan: 'standard' | 'premium') => void;
}

type Plan = {
    id: 'standard' | 'premium';
    name: string;
    features: string[];
}

const plan: Plan = {
    id: 'standard',
    name: 'Plan Profesional',
    features: [
        'Perfil público y visible para clientes',
        'Hasta 10 fotos en tu galería de trabajos',
        'Recibe reseñas y gana confianza',
        'Soporte por mail o WhatsApp 24/7'
    ]
}

export default function PaymentDialog({ isOpen, onOpenChange, professionalName, onPaymentSuccess }: PaymentDialogProps) {
  
  const handleSelectPlan = () => {
    // 1. Activar la cuenta (funcionalidad existente)
    if(onPaymentSuccess) {
      onPaymentSuccess('standard');
    }

    // 2. Preparar y abrir el enlace de WhatsApp
    const whatsappNumber = '5492915276388';
    const message = encodeURIComponent(`Hola, acabo de registrar mi perfil como ${professionalName} y quiero activar mi plan gratuito.`);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');

    // 3. Cerrar el diálogo
    onOpenChange(false);
  }

  const renderContent = () => {
    return (
        <Card className='border-primary shadow-lg'>
            <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                    {plan.name}
                </CardTitle>
                <CardDescription>
                    <div className='flex items-baseline gap-2'>
                        <span className='text-3xl font-bold text-foreground'>$0</span>
                    </div>
                     <span className='text-muted-foreground'>/ el primer mes</span>
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
                <ul className='space-y-3 text-sm'>
                    {plan.features.map(feature => (
                        <li key={feature} className='flex items-start gap-3'>
                            <Check className='w-5 h-5 mt-0.5 text-green-500 flex-shrink-0'/>
                            <span>{feature}</span>
                        </li>
                    ))}
                </ul>
            </CardContent>
            <CardFooter className="flex flex-col items-center gap-2 pt-6">
                <Button 
                    onClick={handleSelectPlan} 
                    className='w-full'
                >
                    Contactate por WhatsApp y activá tu plan gratis por un mes
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                    Tranquilo, vas a poder editar tu perfil las veces que quieras.
                </p>
            </CardFooter>
        </Card>
    )
  }


  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent 
        className="sm:max-w-md"
        onInteractOutside={(e) => e.preventDefault()}
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle className='text-2xl'>
            ¡Último paso, {professionalName}!
          </DialogTitle>
          <DialogDescription>
            Activá tu perfil con nuestro Plan Profesional y empezá a recibir clientes. ¡El primer mes es gratis!
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
            {renderContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
}
