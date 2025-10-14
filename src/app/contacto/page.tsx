
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
import { Phone, Mail, Send } from 'lucide-react';

const contactSchema = z.object({
  name: z.string().min(3, 'Tu nombre es requerido.'),
  email: z.string().email('Por favor, ingresa un email válido.'),
  message: z.string().min(10, 'Tu mensaje debe tener al menos 10 caracteres.'),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const whatsappNumber = '5492915088831';
const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hola, me comunico desde el sitio web de Bahia Blanca Oficios.')}`;
const emailAddress = 'bahiablancaoficios@gmail.com';

export default function ContactoPage() {
  const { toast } = useToast();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  const onSubmit: SubmitHandler<ContactFormValues> = async (data) => {
    const subject = encodeURIComponent(`Nuevo mensaje de ${data.name} desde la web`);
    const body = encodeURIComponent(
      `Has recibido un nuevo mensaje de contacto:\n\nNombre: ${data.name}\nEmail: ${data.email}\n\nMensaje:\n${data.message}`
    );
    const mailtoLink = `mailto:${emailAddress}?subject=${subject}&body=${body}`;

    // Abrir el cliente de correo del usuario
    window.location.href = mailtoLink;

    toast({
      title: '¡Abriendo tu correo!',
      description: 'Preparamos un borrador para que nos envíes tu mensaje.',
    });

    form.reset();
  };

  return (
    <div className="container mx-auto px-4 py-12 md:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline">
            Ponte en Contacto
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-muted-foreground md:text-lg">
            ¿Tenés alguna duda o sugerencia? ¡Estamos para ayudarte! Podes contactarnos por WhatsApp, email o llenando el formulario.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          <div className="space-y-6">
             <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="block">
                <Card className="hover:shadow-lg hover:border-primary/50 transition-all">
                    <CardHeader className="flex flex-row items-center gap-4">
                        <Phone className="w-8 h-8 text-primary"/>
                        <div>
                            <CardTitle>WhatsApp</CardTitle>
                            <CardDescription>La forma más rápida de hablar con nosotros.</CardDescription>
                        </div>
                    </CardHeader>
                </Card>
             </a>
            <a href={`mailto:${emailAddress}`} className="block">
                 <Card className="hover:shadow-lg hover:border-primary/50 transition-all">
                    <CardHeader className="flex flex-row items-center gap-4">
                        <Mail className="w-8 h-8 text-primary"/>
                        <div>
                            <CardTitle>Correo Electrónico</CardTitle>
                            <CardDescription>Para consultas menos urgentes.</CardDescription>
                        </div>
                    </CardHeader>
                </Card>
            </a>
            <div className='text-sm text-muted-foreground p-4 bg-muted/50 rounded-lg'>
                <h4 className='font-semibold text-foreground mb-2'>Horarios de atención</h4>
                <p>Lunes a Viernes de 9:00 a 18:00 hs.</p>
                <p>Intentamos responder todos los mensajes dentro de las 24 horas hábiles.</p>
            </div>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>O envíanos un mensaje</CardTitle>
                <CardDescription>
                  Completa el formulario y nos pondremos en contacto.
                </CardDescription>
              </CardHeader>
               <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardContent className="space-y-4">
                        <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Tu Nombre</FormLabel>
                            <FormControl>
                                <Input placeholder="Juan Pérez" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Tu Email</FormLabel>
                            <FormControl>
                                <Input type="email" placeholder="tu@email.com" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Tu Mensaje</FormLabel>
                            <FormControl>
                                <Textarea
                                placeholder="Escribe tu consulta aquí..."
                                className="min-h-[120px]"
                                {...field}
                                />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full">
                            <Send className="mr-2"/> Enviar Mensaje
                        </Button>
                    </CardFooter>
                </form>
              </Form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
