
'use client';

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
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';

interface PaymentDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  professionalName: string;
  onPaymentSuccess?: () => void;
}

const getImage = (id: string) =>
  PlaceHolderImages.find((img) => img.id === id) || {
    imageUrl: '',
    imageHint: '',
    description: '',
  };

const mercadoPagoQr = getImage('mp-qr-code');

export default function PaymentDialog({ isOpen, onOpenChange, professionalName, onPaymentSuccess }: PaymentDialogProps) {

  const handlePayment = () => {
    // In a real app, you would handle the payment logic here.
    // For this simulation, we'll just call the success callback.
    if(onPaymentSuccess) {
      onPaymentSuccess();
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <div className='flex items-center gap-3'>
            <Image src="/mp-logo.svg" alt="Mercado Pago" width={32} height={32} />
            <DialogTitle className='text-2xl'>Publicar Perfil de {professionalName}</DialogTitle>
          </div>
          <DialogDescription>
            Realiza el pago para que tu perfil sea visible para miles de clientes.
          </DialogDescription>
        </DialogHeader>

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
            <p className='text-xs text-muted-foreground'>
                Al pagar, aceptas los Términos y Condiciones de Mercado Pago.
            </p>
            <Button onClick={handlePayment} className='w-full sm:w-auto' type="submit">
                Pagar $5.000 ARS
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
