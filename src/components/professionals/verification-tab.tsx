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
import { ShieldCheck, CheckCircle, Clock, Upload } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Checkbox } from '../ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '../ui/scroll-area';

interface VerificationTabProps {
    isVerified?: boolean;
    onVerify: () => void;
    professionalName?: string;
}

const policyText = `
**Política de Documentos Sensibles – BahiaBlancaOficios**

**Objetivo:**
Los PROFESIONALES pueden subir voluntariamente: dorso y anverso de su DNI y una selfie sosteniendo el DNI, con el fin exclusivo de verificar su identidad y aumentar la confianza ante los CLIENTES.

**Alcance:**
Esta política aplica a todos los PROFESIONALES que decidan realizar la verificación. Los CLIENTES no necesitan subir documentos para utilizar la plataforma.

**Acceso a la información:**
Los documentos sensibles serán accesibles únicamente por personal autorizado de BahiaBlancaOficios y no se compartirán con otros USUARIOS ni terceros sin consentimiento expreso, salvo obligación legal.

**Almacenamiento y seguridad:**
Los documentos se almacenarán de manera segura, cifrados en servidores protegidos, y solo por el tiempo necesario para la verificación y habilitación del PROFESIONAL.

**Retención y eliminación:**
Una vez completada la verificación de identidad o si el PROFESIONAL solicita la baja de su perfil, los documentos serán eliminados de manera segura en un plazo razonable.

**Consentimiento:**
Al subir sus documentos, el PROFESIONAL consiente expresamente el tratamiento de sus datos sensibles conforme a la Ley 25.326 de Protección de Datos Personales de Argentina.

**Responsabilidad:**
El PROFESIONAL garantiza que los documentos subidos son auténticos y exactos. Cualquier falsificación será responsabilidad exclusiva del PROFESIONAL y podrá derivar en la baja inmediata de su perfil.
`;


export default function VerificationTab({ isVerified, onVerify, professionalName = "Profesional" }: VerificationTabProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [cuil, setCuil] = useState('');
  const [policyAccepted, setPolicyAccepted] = useState(false);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cuil) {
        toast({
            title: 'Error',
            description: 'Por favor, completa tu número de CUIL.',
            variant: 'destructive',
        });
        return;
    }
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: 'Solicitud Enviada',
      description: 'Hemos recibido tu solicitud de verificación. Te notificaremos cuando el proceso haya finalizado.',
    });

    setIsPending(true);
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

  if (isPending) {
     return (
        <Card className="shadow-lg bg-blue-50 border-blue-200">
            <CardHeader className="text-center">
                 <div className="mx-auto bg-blue-100 rounded-full p-3 w-fit">
                    <Clock className="w-12 h-12 text-blue-600" />
                </div>
                <CardTitle className="text-blue-800 !mt-4">Solicitud en Revisión</CardTitle>
                <CardDescription className="text-blue-700">
                    Hemos recibido tus documentos y los estamos revisando. Te notificaremos por email cuando el proceso haya finalizado. Esto suele tardar entre 24 y 48 horas hábiles.
                </CardDescription>
            </CardHeader>
        </Card>
      )
  }


  return (
    <Dialog>
        <Card className="shadow-lg">
        <form onSubmit={handleSubmit}>
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
        <CardContent className="space-y-6">
            <Alert>
            <AlertTitle>¿Qué necesitas para verificar tu cuenta?</AlertTitle>
            <AlertDescription>
                Para asegurar la autenticidad, te pediremos que adjuntes una foto de tu DNI (frente y dorso) y una selfie tuya sosteniéndolo. Esta información es confidencial y solo se usará para el proceso de verificación.
            </AlertDescription>
            </Alert>

            <div className="space-y-2">
                <Label htmlFor="cuil">Tu Número de CUIL</Label>
                <Input 
                    id="cuil" 
                    type="text" 
                    placeholder="Ej: 20-12345678-9" 
                    required 
                    value={cuil}
                    onChange={(e) => setCuil(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Este dato es necesario para identificarte.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="dniFrente">DNI (Frente)</Label>
                    <Input id="dniFrente" type="file" required className="file:text-primary file:font-medium" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="dniDorso">DNI (Dorso)</Label>
                    <Input id="dniDorso" type="file" required className="file:text-primary file:font-medium"/>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="selfie">Selfie con DNI</Label>
                    <Input id="selfie" type="file" required className="file:text-primary file:font-medium"/>
                </div>
            </div>

            <div className="flex items-start space-x-3 mt-6 pt-4 border-t">
              <Checkbox 
                id="terms" 
                checked={policyAccepted}
                onCheckedChange={(checked) => setPolicyAccepted(checked as boolean)}
              />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  He leído y acepto la{' '}
                  <DialogTrigger asChild>
                     <Button variant="link" className="p-0 h-auto">Política de Documentos Sensibles</Button>
                  </DialogTrigger>
                  .
                </label>
                <p className="text-sm text-muted-foreground">
                  Debes aceptar para poder continuar con la verificación.
                </p>
              </div>
            </div>

        </CardContent>
        <CardFooter>
            <Button type="submit" disabled={isSubmitting || !policyAccepted}>
            {isSubmitting ? "Enviando..." : "Iniciar Verificación"}
            </Button>
        </CardFooter>
        </form>
        </Card>
        
        <DialogContent className="sm:max-w-xl">
            <DialogHeader>
                <DialogTitle>Política de Documentos Sensibles</DialogTitle>
                <DialogDescription>
                    BahiaBlancaOficios se compromete a proteger tu información.
                </DialogDescription>
            </DialogHeader>
            <ScrollArea className="h-72">
                <div className="prose prose-sm dark:prose-invert whitespace-pre-wrap p-4">
                    {policyText}
                </div>
            </ScrollArea>
        </DialogContent>
    </Dialog>
  );
}
