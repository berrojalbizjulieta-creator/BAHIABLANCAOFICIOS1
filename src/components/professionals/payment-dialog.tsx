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
import { Check, Sparkles } from 'lucide-react';
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
    price: number;
    features: string[];
}

const plan: Plan = {
    id: 'standard', // Usamos 'standard' como id base
    name: 'Plan Profesional',
    price: 15800,
    features: [
        'Perfil público y visible para clientes',
        'Hasta 10 fotos en tu galería de trabajos',
        'Recibe reseñas y gana confianza',
        'Soporte por mail o WhatsApp 24/7'
    ]
}

export default function PaymentDialog({ isOpen, onOpenChange, professionalName, onPaymentSuccess }: PaymentDialogProps) {
  
  const handleSelectPlan = () => {
    if(onPaymentSuccess) {
      // Pasamos 'standard' ya que es el único plan ahora
      onPaymentSuccess('standard');
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className='text-2xl'>
            ¡Último paso, {professionalName}!
          </DialogTitle>
          <DialogDescription>
            Activá tu perfil con nuestro Plan Profesional y empezá a recibir clientes. ¡Los primeros 3 meses son gratis!
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
            <Card className='border-primary shadow-lg'>
                <CardHeader>
                    <CardTitle className='flex items-center gap-2'>
                        {plan.name}
                    </CardTitle>
                    <CardDescription>
                        <div className='flex items-baseline gap-2'>
                            <span className='text-3xl font-bold text-foreground'>$0</span>
                            <span className='text-xl font-normal text-muted-foreground line-through'>${plan.price.toLocaleString('es-AR')}</span>
                        </div>
                         <span className='text-muted-foreground'>/ primeros 3 meses</span>
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
                <CardFooter>
                    <Button 
                        onClick={handleSelectPlan} 
                        className='w-full'
                    >
                        Activar Plan GRATIS por 3 meses
                    </Button>
                </CardFooter>
            </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
