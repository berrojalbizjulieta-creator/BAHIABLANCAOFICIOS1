
'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Upload, User, Search } from 'lucide-react';

export default function ClientProfilePage() {
  const [name, setName] = useState('Nombre Cliente');
  const [photoUrl, setPhotoUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 md:px-6">
      <div className="max-w-md mx-auto text-center">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">¡Bienvenido!</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <div className="relative group">
              <Avatar
                className="w-28 h-28 border-4 border-background shadow-lg cursor-pointer"
                onClick={handleAvatarClick}
              >
                <AvatarImage src={photoUrl} alt={name} />
                <AvatarFallback>
                  <User className="w-12 h-12 text-muted-foreground" />
                </AvatarFallback>
              </Avatar>
              <div
                className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                onClick={handleAvatarClick}
              >
                <Upload className="h-8 w-8 text-white" />
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />
            </div>
            <h2 className="text-3xl font-bold font-headline">{name}</h2>
          </CardContent>
        </Card>
        
        <div className="mt-8">
            <p className="text-muted-foreground mb-4">¿Listo para solucionar ese problema en casa?</p>
            <Button asChild size="lg" className="h-14 text-lg w-full shadow-lg hover:shadow-xl transition-shadow duration-300">
                <Link href="/servicios">
                    <Search className="mr-3 h-6 w-6" />
                    Encontrar un Profesional Ahora
                </Link>
            </Button>
        </div>

      </div>
    </div>
  );
}
