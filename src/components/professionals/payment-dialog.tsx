
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Image from 'next/image';
import { placeholderImages } from '@/lib/placeholder-images';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../ui/card';
import { Check, Sparkles, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaymentDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  professionalName: string;
  onPaymentSuccess?: (plan: 'standard' | 'premium') => void;
}

type View = 'plans' | 'payment';
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

const getImage = (id: string) =>
  placeholderImages.find((img) => img.id === id) || {
    imageUrl: '',
    imageHint: '',
    description: '',
  };

const mercadoPagoQr = getImage('mp-qr-code');

export default function PaymentDialog({ isOpen, onOpenChange, professionalName, onPaymentSuccess }: PaymentDialogProps) {
  const [view, setView] = useState<View>('plans');
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  const handleSelectPlan = (plan: Plan) => {
    setSelectedPlan(plan);
    setView('payment');
  }

  const handlePayment = () => {
    if (!selectedPlan) return;
    
    if(onPaymentSuccess) {
      onPaymentSuccess(selectedPlan.id);
    }
    onOpenChange(false);
    // Reset view for next time
    setTimeout(() => {
        setView('plans');
        setSelectedPlan(null);
    }, 500)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <div className='flex items-center gap-3'>
            {view === 'payment' && <Image src="/mp-logo.svg" alt="Mercado Pago" width={32} height={32} />}
            <DialogTitle className='text-2xl'>
              {view === 'plans' ? `Elige tu Plan, ${professionalName}` : `Pagar Plan ${selectedPlan?.name}`}
            </DialogTitle>
          </div>
          <DialogDescription>
            {view === 'plans' 
              ? 'Selecciona el plan que mejor se adapte a tus necesidades para empezar a recibir clientes.'
              : `Estás a un paso de activar tu perfil. Realiza el pago para que seas visible para miles de clientes.`
            }
          </DialogDescription>
        </DialogHeader>

        {view === 'plans' && (
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
                                <span className='text-2xl font-bold text-foreground'>${plan.price.toLocaleString('es-AR')}</span>
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
                                Seleccionar Plan
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        )}

        {view === 'payment' && selectedPlan && (
        <>
            <Tabs defaultValue="qr" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="qr">Pagar con QR</TabsTrigger>
                <TabsTrigger value="card">Pagar con Tarjeta</TabsTrigger>
            </TabsList>

            <TabsContent value="qr" className='mt-6'>
                <div className="flex flex-col items-center justify-center gap-4">
                    <p className='text-sm text-center text-muted-foreground'>
                        Escanea el código QR con la app de Mercado Pago o tu billetera virtual preferida.
                    </p>
                    <div className='p-2 border rounded-md'>
                        <Image
                            src={mercadoPagoQr.imageUrl}
                            alt={mercadoPagoQr.description}
                            width={256}
                            height={256}
                            data-ai-hint={mercadoPagoQr.imageHint}
                        />
                    </div>
                    <Button variant="outline" className='w-full'>Copiar Código QR</Button>
                </div>
            </TabsContent>

            <TabsContent value="card" className='mt-6'>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">Nombre</Label>
                            <Input id="firstName" placeholder="Juan" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Apellido</Label>
                            <Input id="lastName" placeholder="Pérez" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="cardNumber">Número de tarjeta</Label>
                        <Input id="cardNumber" placeholder="**** **** **** ****" />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="expiry">Vencimiento</Label>
                            <Input id="expiry" placeholder="MM/AA" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="cvc">CVC</Label>
                            <Input id="cvc" placeholder="123" />
                        </div>
                    </div>
                </div>
            </TabsContent>
            </Tabs>

            <Separator />

            <DialogFooter className='sm:justify-between items-center gap-4'>
                <div className='text-sm'>
                    <Button variant="link" className='p-0 h-auto' onClick={() => setView('plans')}>Volver a planes</Button>
                </div>
                <Button onClick={handlePayment} className='w-full sm:w-auto' type="submit">
                    Pagar ${selectedPlan.price.toLocaleString('es-AR')} ARS
                </Button>
            </DialogFooter>
        </>
        )}
      </DialogContent>
    </Dialog>
  );
}
