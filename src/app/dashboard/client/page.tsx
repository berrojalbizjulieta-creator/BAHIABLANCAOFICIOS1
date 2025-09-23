
'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Upload, User, Search, Edit, Save, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

export default function ClientProfilePage() {
  const [name, setName] = useState('Nombre Cliente');
  const [tempName, setTempName] = useState(name);
  const [photoUrl, setPhotoUrl] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

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

  const handleEdit = () => {
    setTempName(name);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = () => {
    setName(tempName);
    setIsEditing(false);
    toast({
      title: '¡Perfil actualizado!',
      description: 'Tu nombre ha sido cambiado con éxito.',
    });
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
            <div className="flex items-center gap-2 w-full justify-center">
              {isEditing ? (
                <Input
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="text-3xl font-bold font-headline h-auto text-center"
                />
              ) : (
                <h2 className="text-3xl font-bold font-headline">{name}</h2>
              )}
            </div>

            {isEditing ? (
              <div className="flex gap-2 mt-2">
                <Button onClick={handleSave} size="sm">
                  <Save className="mr-2 h-4 w-4" /> Guardar
                </Button>
                <Button onClick={handleCancel} variant="outline" size="sm">
                  <X className="mr-2 h-4 w-4" /> Cancelar
                </Button>
              </div>
            ) : (
              <Button onClick={handleEdit} variant="ghost" size="sm" className="mt-2">
                <Edit className="mr-2 h-4 w-4" /> Editar Nombre
              </Button>
            )}
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
