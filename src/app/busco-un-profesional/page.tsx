'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { DollarSign, PlusCircle } from 'lucide-react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { JOB_REQUESTS } from '@/lib/data';
import type { JobRequest } from '@/lib/types';
import JobRequestCard from './job-request-card';

const jobRequestSchema = z.object({
  title: z.string().min(10, 'El título debe tener al menos 10 caracteres.'),
  description: z.string().min(20, 'La descripción debe tener al menos 20 caracteres.'),
  budget: z.coerce.number().min(1, 'El presupuesto debe ser mayor a 0.'),
  whatsapp: z.string().min(10, 'Ingresa un número de WhatsApp válido.'),
});

type JobRequestFormValues = z.infer<typeof jobRequestSchema>;

export default function JobRequestsPage() {
  const [jobRequests, setJobRequests] = useState<JobRequest[]>(JOB_REQUESTS.sort((a,b) => b.createdAt.getTime() - a.createdAt.getTime()));
  const [isFormVisible, setIsFormVisible] = useState(false);
  const { toast } = useToast();
  const { user, isProfessional } = useAdminAuth();

  const form = useForm<JobRequestFormValues>({
    resolver: zodResolver(jobRequestSchema),
    defaultValues: {
      title: '',
      description: '',
      budget: 0,
      whatsapp: '',
    },
  });

  const onSubmit: SubmitHandler<JobRequestFormValues> = async (data) => {
    if (!user) return;

    const newRequest: JobRequest = {
        id: Date.now(),
        ...data,
        clientId: 0, // In a real app, this would be user.uid
        clientName: user.displayName || 'Cliente Anónimo',
        clientPhotoUrl: user.photoURL || '',
        createdAt: new Date(),
        status: 'open',
        comments: [],
    };
    
    setJobRequests(prev => [newRequest, ...prev]);

    toast({
      title: '¡Anuncio Publicado!',
      description: 'Tu búsqueda ya está visible para los profesionales.',
    });

    form.reset();
    setIsFormVisible(false);
  };
  
  const isClient = user && !isProfessional;

  return (
    <div className="container mx-auto px-4 py-12 md:px-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline">
          Buscando un Profesional
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-muted-foreground md:text-lg">
          ¿Necesitas ayuda con una tarea? Publica lo que buscas y deja que los profesionales te contacten.
        </p>
      </div>
      
      {isClient && (
        <div className="max-w-3xl mx-auto mb-12">
            {!isFormVisible ? (
                <div className='text-center'>
                    <Button onClick={() => setIsFormVisible(true)}>
                        <PlusCircle className="mr-2" /> Publicar un nuevo trabajo
                    </Button>
                </div>
            ) : (
             <Card>
              <CardHeader>
                <CardTitle>Publica tu necesidad</CardTitle>
                <CardDescription>
                  Describe el trabajo que necesitas, tu presupuesto, y los profesionales se postularán.
                </CardDescription>
              </CardHeader>
               <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardContent className="space-y-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Título del trabajo</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ej: Cortar el pasto, instalar un aire, etc." {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Descripción detallada</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Explica con más detalle qué necesitas, la ubicación, y cualquier otra cosa que consideres importante."
                                        className="min-h-[120px]"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                             <FormField
                                control={form.control}
                                name="budget"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>¿Cuánto pensas gastar? (ARS)</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input type="number" placeholder="5000" className="pl-8" {...field} />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="whatsapp"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Tu WhatsApp de contacto</FormLabel>
                                    <FormControl>
                                        <Input type="tel" placeholder="291..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                         <p className='text-xs text-muted-foreground'>Tu WhatsApp solo será visible para los profesionales que comenten en tu anuncio.</p>
                    </CardContent>
                    <CardFooter className='gap-4'>
                        <Button type="submit">
                           Publicar Anuncio
                        </Button>
                         <Button type="button" variant="ghost" onClick={() => setIsFormVisible(false)}>
                           Cancelar
                        </Button>
                    </CardFooter>
                </form>
              </Form>
            </Card>
            )}
        </div>
      )}
      
      {!user && (
         <Alert className="max-w-3xl mx-auto mb-12 bg-blue-50 border-blue-200 text-blue-800">
            <AlertTitle>Inicia sesión para publicar</AlertTitle>
            <AlertDescription>
              Para publicar tu búsqueda, necesitas tener una cuenta de cliente. Es rápido y gratis.
              <div className='mt-3'>
                <Button asChild variant="link" className='p-0 h-auto text-blue-800'>
                    <Link href="/login">Iniciar Sesión</Link>
                </Button>
                 <span className='mx-2'>o</span>
                 <Button asChild variant="link" className='p-0 h-auto text-blue-800'>
                    <Link href="/signup">Crear Cuenta</Link>
                </Button>
              </div>
            </AlertDescription>
        </Alert>
      )}

      <div className="space-y-6 max-w-4xl mx-auto">
        {jobRequests.map(request => (
          <JobRequestCard key={request.id} request={request} />
        ))}
      </div>

    </div>
  );
}
