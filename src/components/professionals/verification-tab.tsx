'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ShieldCheck, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

interface VerificationTabProps {
    isVerified?: boolean;
    onVerify: () => void;
}


export default function VerificationTab({ isVerified, onVerify }: VerificationTabProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    // In a real app, you would send the form data to your backend
    // to be reviewed by an administrator.
    
    toast({
      title: 'Solicitud Enviada',
      description: 'Hemos recibido tus documentos. Revisaremos tu información y te notificaremos cuando tu cuenta sea verificada.',
    });
    onVerify(); // Optimistically update the UI
    setIsSubmitting(false);
  };

  if (isVerified) {
      return (
        <Card className="shadow-lg bg-green-50 border-green-200">
            <CardHeader className="text-center">
                 <div className="mx-auto bg-green-100 rounded-full p-3 w-fit">
                    <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
                <CardTitle className="text-green-800 !mt-4">¡Ya eres un Profesional Verificado!</CardTitle>
                <CardDescription className="text-green-700">
                    Tu tilde de verificación ya es visible en tu perfil, lo que genera más confianza en los clientes.
                </CardDescription>
            </CardHeader>
        </Card>
      )
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-blue-500" />
          <CardTitle>Conviértete en Profesional Verificado</CardTitle>
        </div>
        <CardDescription>
          Genera más confianza en tus clientes verificando tu identidad. Al
          hacerlo, obtendrás una tilde azul en tu perfil que te destacará del
          resto. Solo te tomará unos minutos.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
      <CardContent className="space-y-6">
        <Alert>
          <AlertTitle>¿Qué necesitas para verificar tu cuenta?</AlertTitle>
          <AlertDescription>
            Para asegurar la autenticidad, te pediremos una foto de tu DNI (frente y dorso) y una selfie tuya sosteniéndolo. Esta información es confidencial y solo se usará para el proceso de verificación.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="dni-front">DNI (Frente)</Label>
                <Input id="dni-front" type="file" required accept="image/*" />
            </div>
             <div className="space-y-2">
                <Label htmlFor="dni-back">DNI (Dorso)</Label>
                <Input id="dni-back" type="file" required accept="image/*" />
            </div>
        </div>
         <div className="space-y-2">
            <Label htmlFor="selfie">Selfie con tu DNI</Label>
            <Input id="selfie" type="file" required accept="image/*" />
             <p className="text-xs text-muted-foreground">Asegúrate de que tu cara y el DNI se vean con claridad.</p>
        </div>
         <div className="space-y-2">
            <Label htmlFor="cuil">Número de CUIL</Label>
            <Input id="cuil" type="text" placeholder="Ej: 20-12345678-9" required />
        </div>
      </CardContent>
      <CardFooter>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Enviando Solicitud..." : "Verificar mi Cuenta"}
        </Button>
      </CardFooter>
      </form>
    </Card>
  );
}
