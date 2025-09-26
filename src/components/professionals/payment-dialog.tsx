'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
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
    isPopular?: boolean;
}

const plans: Plan[] = [
    {
        id: 'standard',
        name: 'Plan Estándar',
        price: 9000,
        features: [
            'Perfil público y visible',
            'Hasta 3 fotos en tu galería',
            'Recibe reseñas de clientes',
            'Soporte por email'
        ]
    },
    {
        id: 'premium',
        name: 'Plan Premium',
        price: 15000,
        features: [
            'Todo lo del plan Estándar',
            'Fotos ilimitadas en tu galería',
            'Prioridad en listados (Destacado)',
            'Insignia Premium en tu perfil',
            'Soporte prioritario 24/7'
        ],
        isPopular: true
    }
]

export default function PaymentDialog({ isOpen, onOpenChange, professionalName, onPaymentSuccess }: PaymentDialogProps) {
  
  const handleSelectPlan = (plan: Plan) => {
    if(onPaymentSuccess) {
      onPaymentSuccess(plan.id);
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className='text-2xl'>
            ¡Elige tu Plan Gratuito, {professionalName}!
          </DialogTitle>
          <DialogDescription>
            Selecciona un plan para activar tu perfil al instante y empezar a recibir clientes. ¡Hoy es gratis!
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            {plans.map(plan => (
                <Card key={plan.id} className={cn(
                    'flex flex-col',
                    plan.isPopular ? 'border-primary shadow-lg' : ''
                )}>
                    <CardHeader>
                        {plan.isPopular && <p className='text-sm font-bold text-primary mb-2'>MÁS POPULAR</p>}
                        <CardTitle className='flex items-center gap-2'>
                            {plan.id === 'premium' && <Sparkles className='w-6 h-6 text-purple-500'/>}
                            {plan.name}
                        </CardTitle>
                        <CardDescription>
                            <div className='flex items-baseline gap-2'>
                                <span className='text-2xl font-bold text-foreground'>$0</span>
                                <span className='text-lg font-normal text-muted-foreground line-through'>${plan.price.toLocaleString('es-AR')}</span>
                            </div>
                             <span className='text-muted-foreground'>/mes</span>
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                        <ul className='space-y-3 text-sm'>
                            {plan.features.map(feature => (
                                <li key={feature} className='flex items-start gap-2'>
                                    <Check className='w-4 h-4 mt-0.5 text-green-500 flex-shrink-0'/>
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button 
                            onClick={() => handleSelectPlan(plan)} 
                            className='w-full'
                            variant={plan.isPopular ? 'default' : 'outline'}
                        >
                            Elegir Plan Gratis
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
