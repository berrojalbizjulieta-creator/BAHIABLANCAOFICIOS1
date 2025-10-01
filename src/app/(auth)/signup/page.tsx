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
import { CATEGORIES } from '@/lib/data';
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
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Checkbox } from '@/components/ui/checkbox';
import TermsDialog from '@/components/auth/terms-dialog';

const baseSchema = {
  fullName: z.string().min(3, 'El nombre debe tener al menos 3 caracteres.'),
  email: z.string().email('Email inválido.'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres.'),
  terms: z.boolean().refine(val => val === true, {
    message: 'Debes aceptar los términos y condiciones para continuar.',
  }),
};

const clientSchema = z.object(baseSchema);

const professionalSchema = z.object({
  ...baseSchema,
  category: z.string().min(1, 'Debes seleccionar un oficio.'),
});

type ClientFormValues = z.infer<typeof clientSchema>;
type ProfessionalFormValues = z.infer<typeof professionalSchema>;

export default function SignupPage() {
  const [accountType, setAccountType] = useState('client');
  const [isLoading, setIsLoading] = useState(false);
  const [isTermsDialogOpen, setIsTermsDialogOpen] = useState(false);
  const [termsRead, setTermsRead] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const clientForm = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: { fullName: '', email: '', password: '', terms: false },
  });

  const professionalForm = useForm<ProfessionalFormValues>({
    resolver: zodResolver(professionalSchema),
    defaultValues: { fullName: '', email: '', password: '', category: '', terms: false },
  });

  const activeForm = accountType === 'client' ? clientForm : professionalForm;

  const handleTermsDialogClose = (open: boolean) => {
    setIsTermsDialogOpen(open);
    if (!open) {
      // Only set termsRead to true, don't set it to false when dialog opens.
      setTermsRead(true);
    }
  }


  const onSubmit: SubmitHandler<ClientFormValues | ProfessionalFormValues> = async (data) => {
    setIsLoading(true);
    
    try {
      // 1. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;

      // 2. Prepare user data for Firestore
      const isProfessional = accountType === 'professional';
      const userData = {
        name: data.fullName,
        email: data.email,
        role: isProfessional ? 'professional' : 'client',
        registrationDate: serverTimestamp(),
        isActive: true,
        photoUrl: '', // Default empty photo
      };

      // 3. Save user data to 'users' collection in Firestore
      await setDoc(doc(db, 'users', user.uid), userData);

      // 4. If professional, save additional details
      if (isProfessional) {
        const professionalData = data as ProfessionalFormValues;
        const professionalDetails = {
          name: professionalData.fullName,
          email: professionalData.email,
          description: '',
          specialties: [],
          avgRating: 0,
          categoryIds: [Number(professionalData.category)],
          isVerified: false,
          isSubscriptionActive: false, // For easier querying
          subscription: {
            tier: 'standard',
            isSubscriptionActive: false,
            lastPaymentDate: null,
            nextPaymentDate: null,
          },
          workPhotos: [],
          testimonials: [],
        };
        await setDoc(doc(db, 'professionalsDetails', user.uid), professionalDetails);
      }
      
      toast({
        title: "¡Cuenta Creada!",
        description: `Tu cuenta de ${accountType === 'client' ? 'cliente' : 'profesional'} ha sido creada exitosamente.`,
      });

      // 5. Redirect user after signup
      if (isProfessional) {
        router.push('/dashboard/profile');
      } else {
        router.push('/dashboard');
      }

    } catch (error: any) {
      console.error("Error creating user:", error);
      let errorMessage = "Ocurrió un error al crear la cuenta.";
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Este email ya está registrado. Intenta iniciar sesión.';
      }
      toast({
        title: "Error de Registro",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
    
    activeForm.reset();
  };

  return (
    <>
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
               <FormField
                control={activeForm.control}
                name="terms"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-6">
                    <FormControl>
                        <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={!termsRead}
                        />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                        <FormLabel>
                            Acepto los{' '}
                            <Button
                                type="button"
                                variant="link"
                                className="p-0 h-auto font-medium"
                                onClick={() => setIsTermsDialogOpen(true)}
                            >
                                términos y condiciones
                            </Button>
                            .
                        </FormLabel>
                         {!termsRead && (
                            <p className="text-xs text-muted-foreground">
                                Debes leer los términos para poder aceptar.
                            </p>
                        )}
                        <FormMessage />
                    </div>
                    </FormItem>
                )}
                />
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full" disabled={isLoading || !activeForm.watch('terms')}>
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

    <TermsDialog 
        isOpen={isTermsDialogOpen}
        onOpenChange={handleTermsDialogClose}
    />
    </>
  );
}
