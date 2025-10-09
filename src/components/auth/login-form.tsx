'use client';

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
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { signInWithEmailAndPassword, sendPasswordResetEmail, signOut } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';


export default function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isResetMode, setIsResetMode] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // **NUEVO**: Verificar el estado del usuario en Firestore
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists() && userDocSnap.data().isActive === false) {
          // Si el usuario está inactivo, cerrar sesión y mostrar error
          await signOut(auth);
          toast({
              title: 'Cuenta Desactivada',
              description: 'Tu cuenta ha sido desactivada. Por favor, contacta al administrador.',
              variant: 'destructive',
          });
          setIsLoading(false);
          return;
      }
      
      toast({
        title: '¡Bienvenido de vuelta!',
        description: 'Has iniciado sesión correctamente.',
      });

      router.push('/dashboard');

    } catch (error: any) {
      console.error(error);
      let errorMessage = 'Ocurrió un error al iniciar sesión.';
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'No se encontró una cuenta con este email.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'La contraseña es incorrecta.';
          break;
        case 'auth/invalid-email':
            errorMessage = 'El formato de email no es válido.';
            break;
        case 'auth/invalid-credential':
            errorMessage = 'Las credenciales son incorrectas. Revisa tu email y contraseña.';
            break;
        default:
          errorMessage = 'Error desconocido. Por favor, intenta de nuevo.';
          break;
      }
      toast({
        title: 'Error de inicio de sesión',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: 'Email requerido',
        description: 'Por favor, ingresa tu dirección de email.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      toast({
        title: 'Correo Enviado',
        description: 'Si tu email está registrado, recibirás un enlace para restablecer tu contraseña.',
      });
      setIsResetMode(false);
    } catch (error: any) {
       console.error("Error sending password reset email:", error);
       // We show a generic message to avoid disclosing which emails are registered
       toast({
        title: 'Correo Enviado',
        description: 'Si tu email está registrado, recibirás un enlace para restablecer tu contraseña.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-10rem)] py-12">
      <form onSubmit={isResetMode ? handlePasswordReset : handleLogin} className="w-full max-w-sm">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-headline">
              {isResetMode ? 'Recuperar Contraseña' : 'Iniciar Sesión'}
            </CardTitle>
            <CardDescription>
              {isResetMode ? 'Ingresa tu email para recibir un enlace de recuperación.' : 'Ingresa a tu cuenta para continuar.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {!isResetMode && (
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Contraseña</Label>
                   <Button
                      type="button"
                      variant="link"
                      className="ml-auto p-0 h-auto text-xs"
                      onClick={() => setIsResetMode(true)}
                    >
                      ¿Olvidaste tu contraseña?
                    </Button>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading
                ? isResetMode ? 'Enviando...' : 'Ingresando...'
                : isResetMode ? 'Enviar email de recuperación' : 'Ingresar'}
            </Button>
            {isResetMode ? (
               <Button
                  type="button"
                  variant="link"
                  className="text-xs text-center"
                  onClick={() => setIsResetMode(false)}
                >
                  Volver a Iniciar Sesión
                </Button>
            ) : (
              <p className="text-xs text-center text-muted-foreground">
                ¿No tienes una cuenta?{' '}
                <Link href="/signup" className="underline hover:text-primary">
                  Regístrate
                </Link>
              </p>
            )}
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
