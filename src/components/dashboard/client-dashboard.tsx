'use client';

import type { User } from 'firebase/auth';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '../ui/button';
import Link from 'next/link';
import { useRef, useState, useEffect } from 'react';
import { Input } from '../ui/input';
import { Edit, Save, X, Upload, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '@/lib/firebase';

interface ClientDashboardProps {
  user: User;
}

export default function ClientDashboard({ user }: ClientDashboardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user.displayName || '');
  const [photoURL, setPhotoURL] = useState(user.photoURL || '');
  const [isLoading, setIsLoading] = useState(false);

  const avatarFileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Update state if user prop changes (e.g., after a re-fetch)
    setDisplayName(user.displayName || '');
    setPhotoURL(user.photoURL || '');
  }, [user]);

  const handleAvatarClick = () => {
    if (isEditing && avatarFileInputRef.current) {
      avatarFileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoURL(reader.result as string); // Show preview immediately
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      let finalPhotoURL = user.photoURL;

      // 1. If photo has changed, upload it to Storage
      if (photoURL !== user.photoURL && photoURL) {
        const storageRef = ref(storage, `user-avatars/${user.uid}`);
        // uploadString is used because photoURL is a data URL (base64)
        const uploadTask = await uploadString(storageRef, photoURL, 'data_url');
        finalPhotoURL = await getDownloadURL(uploadTask.ref);
      }

      // 2. Update Firebase Auth user profile
      if(auth.currentUser) {
        await updateProfile(auth.currentUser, {
            displayName: displayName,
            photoURL: finalPhotoURL,
        });
      }


      // 3. Update user document in Firestore
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        name: displayName,
        photoUrl: finalPhotoURL,
      });

      toast({
        title: '¡Perfil Actualizado!',
        description: 'Tus cambios han sido guardados con éxito.',
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron guardar los cambios. Intenta de nuevo.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setDisplayName(user.displayName || '');
    setPhotoURL(user.photoURL || '');
    setIsEditing(false);
  };

  return (
    <div className="container mx-auto px-4 py-12 md:px-6">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center relative">
            <div className="relative group w-24 h-24 mx-auto">
              <Avatar
                className="w-24 h-24 mx-auto mb-4 border-2 border-primary"
              >
                <AvatarImage src={photoURL || undefined} alt={displayName || 'Usuario'} />
                <AvatarFallback>{displayName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}</AvatarFallback>
              </Avatar>
                {isEditing && (
                    <div 
                        className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        onClick={handleAvatarClick}
                    >
                        <Upload className="h-8 w-8 text-white" />
                    </div>
                )}
            </div>
            <input
              type="file"
              ref={avatarFileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />
            
            {isEditing ? (
              <Input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="text-2xl font-headline text-center max-w-sm mx-auto"
                placeholder="Tu nombre"
              />
            ) : (
              <CardTitle className="text-2xl font-headline">¡Bienvenido, {displayName || user.email}!</CardTitle>
            )}

            <CardDescription>Este es tu panel de control de cliente.</CardDescription>
             {!isEditing && (
              <Button variant="ghost" size="icon" className="absolute top-4 right-4" onClick={() => setIsEditing(true)}>
                <Edit className="h-5 w-5" />
              </Button>
            )}
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-6">
              Desde aquí podrás gestionar tus solicitudes y ver tus profesionales contactados próximamente.
            </p>
            <Button asChild>
              <Link href="/servicios">Buscar un Profesional</Link>
            </Button>
          </CardContent>
          {isEditing && (
            <CardFooter className="justify-center gap-4">
              <Button onClick={handleSave} disabled={isLoading}>
                {isLoading ? 'Guardando...' : <><Save className="mr-2 h-4 w-4" /> Guardar Cambios</>}
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                <X className="mr-2 h-4 w-4" /> Cancelar
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}
