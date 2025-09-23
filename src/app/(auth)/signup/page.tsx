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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CATEGORIES, PROFESSIONALS, CLIENTS } from '@/lib/data';
import Link from 'next/link';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import type { Client, Professional } from '@/lib/types';


const clientSchema = z.object({
  fullName: z.string().min(3, 'El nombre debe tener al menos 3 caracteres.'),
  email: z.string().email('Email inválido.'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres.'),
});

const professionalSchema = z.object({
  fullName: z.string().min(3, 'El nombre debe tener al menos 3 caracteres.'),
  email: z.string().email('Email inválido.'),
  category: z.string().min(1, 'Debes seleccionar un oficio.'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres.'),
});

type ClientFormValues = z.infer<typeof clientSchema>;
type ProfessionalFormValues = z.infer<typeof professionalSchema>;

export default function SignupPage() {
  const [accountType, setAccountType] = useState('client');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const clientForm = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: { fullName: '', email: '', password: '' },
  });

  const professionalForm = useForm<ProfessionalFormValues>({
    resolver: zodResolver(professionalSchema),
    defaultValues: { fullName: '', email: '', password: '', category: '' },
  });

  const activeForm = accountType === 'client' ? clientForm : professionalForm;

  const onSubmit: SubmitHandler<ClientFormValues | ProfessionalFormValues> = async (data) => {
    setIsLoading(true);
    console.log('Submitting data for', accountType, data);
    
    // Simulate saving to our mock database
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (accountType === 'client') {
        const newClient: Client = {
            id: CLIENTS.length + 1,
            name: data.fullName,
            email: data.email,
            photoUrl: '', // Default photo
            registrationDate: new Date(),
            isActive: true,
        };
        CLIENTS.push(newClient);
        console.log("New Client added:", newClient);
        console.log("All Clients:", CLIENTS);
        // Redirect client to home page after signup
        router.push('/');

    } else {
        const professionalData = data as ProfessionalFormValues;
        const newProfessional: Professional = {
            id: PROFESSIONALS.length + 1,
            name: professionalData.fullName,
            email: professionalData.email,
            phone: '',
            photoUrl: '',
            photoHint: '',
            specialties: [],
            avgRating: 0,
            categoryId: Number(professionalData.category),
            testimonials: [],
            subscriptionTier: 'standard',
            isSubscriptionActive: false,
            registrationDate: new Date(),
            isActive: true,
        };
        PROFESSIONALS.push(newProfessional);
        console.log("New Professional added:", newProfessional);
        console.log("All Professionals:", PROFESSIONALS);
        router.push('/dashboard/profile');
    }
    
    toast({
        title: "¡Cuenta Creada!",
        description: `Tu cuenta de ${accountType === 'client' ? 'cliente' : 'profesional'} ha sido creada exitosamente.`,
    })

    setIsLoading(false);
    activeForm.reset();
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-10rem)] py-12">
      <Form {...activeForm}>
        <form onSubmit={activeForm.handleSubmit(onSubmit)} className="w-full max-w-md">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-headline">Crear una Cuenta</CardTitle>
              <CardDescription>
                Únete a nuestra comunidad. Elige tu tipo de cuenta.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs
                defaultValue="client"
                className="w-full"
                onValueChange={(newType) => {
                  setAccountType(newType)
                  // Reset forms when changing tabs
                  clientForm.reset();
                  professionalForm.reset();
                }}
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="client">Soy Cliente</TabsTrigger>
                  <TabsTrigger value="professional">Soy Profesional</TabsTrigger>
                </TabsList>
                <TabsContent value="client" className="mt-6">
                  <div className="space-y-4">
                    <FormField
                      control={clientForm.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre completo</FormLabel>
                          <FormControl>
                            <Input placeholder="Juan Pérez" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={clientForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="tu@email.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={clientForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contraseña</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>
                <TabsContent value="professional" className="mt-6">
                   <div className="space-y-4">
                      <FormField
                        control={professionalForm.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nombre completo</FormLabel>
                            <FormControl>
                              <Input placeholder="María Gomez" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={professionalForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="tu@email.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={professionalForm.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Oficio principal</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecciona tu oficio" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {CATEGORIES.map((category) => (
                                  <SelectItem key={category.id} value={String(category.id)}>
                                    {category.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={professionalForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contraseña</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                ¿Ya tienes una cuenta?{' '}
                <Link href="/login" className="underline hover:text-primary">
                  Inicia sesión
                </Link>
              </p>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}
