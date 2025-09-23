
'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Upload, User } from 'lucide-react';

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
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <CardTitle className="font-headline">Mi Perfil</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="relative group">
              <Avatar
                className="w-24 h-24 border-4 border-background shadow-md cursor-pointer"
                onClick={handleAvatarClick}
              >
                <AvatarImage src={photoUrl} alt={name} />
                <AvatarFallback>
                  <User className="w-10 h-10 text-muted-foreground" />
                </AvatarFallback>
              </Avatar>
              <div
                className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
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
            <h2 className="text-2xl font-bold">{name}</h2>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
