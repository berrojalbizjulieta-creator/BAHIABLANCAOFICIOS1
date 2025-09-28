'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, Upload, Image as ImageIcon, Loader2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface AdBanner {
  id: string;
  imageUrl: string;
  alt: string;
  imageHint: string;
  storagePath: string;
}

export default function AdManagement() {
  const [banners, setBanners] = useState<AdBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [newBannerFile, setNewBannerFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchBanners = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, 'adBanners'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const bannersData = querySnapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as AdBanner)
        );
        setBanners(bannersData);
      } catch (error) {
          console.error("Error fetching banners:", error);
          toast({ title: 'Error', description: 'No se pudieron cargar los banners.', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, [toast]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewBannerFile(e.target.files[0]);
    } else {
      setNewBannerFile(null);
    }
  };

  const handleAddBanner = async () => {
    if (!newBannerFile) {
      toast({ title: 'Error', description: 'Por favor, selecciona una imagen.', variant: 'destructive' });
      return;
    }

    setIsUploading(true);
    try {
      // 1. Upload to Storage
      const storagePath = `adBanners/${Date.now()}_${newBannerFile.name}`;
      const storageRef = ref(storage, storagePath);
      const uploadResult = await uploadBytes(storageRef, newBannerFile);
      const imageUrl = await getDownloadURL(uploadResult.ref);

      // 2. Add to Firestore
      const docRef = await addDoc(collection(db, 'adBanners'), {
        imageUrl,
        storagePath,
        alt: 'Banner publicitario',
        imageHint: 'advertisement',
        createdAt: serverTimestamp(),
      });
      
      const newBanner = {
          id: docRef.id,
          imageUrl,
          storagePath,
          alt: 'Banner publicitario',
          imageHint: 'advertisement'
      }

      // 3. Update state locally for instant feedback
      setBanners(prev => [newBanner, ...prev]);

      toast({ title: '¡Éxito!', description: 'El nuevo banner ha sido añadido.' });
      
      // 4. Reset file input
      setNewBannerFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

    } catch (error) {
      console.error('Error adding banner:', error);
      toast({ title: 'Error', description: 'No se pudo añadir el banner.', variant: 'destructive' });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteBanner = async (bannerToDelete: AdBanner) => {
    // Optimistically remove from UI
    setBanners(prevBanners => prevBanners.filter(b => b.id !== bannerToDelete.id));

    try {
      // Delete from Firestore
      await deleteDoc(doc(db, 'adBanners', bannerToDelete.id));

      // Delete from Storage
      const storageRef = ref(storage, bannerToDelete.storagePath);
      await deleteObject(storageRef);

      toast({ title: 'Banner Eliminado', description: 'El banner ha sido eliminado correctamente.' });
    } catch (error) {
      console.error('Error deleting banner:', error);
      toast({ title: 'Error', description: 'No se pudo eliminar el banner. Se restaurará la lista.', variant: 'destructive' });
      // Rollback UI change on error
      setBanners(prevBanners => [...prevBanners, bannerToDelete].sort((a,b) => b.id.localeCompare(a.id)));
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Añadir Nuevo Banner</CardTitle>
          <CardDescription>Sube una nueva imagen para el carrusel de publicidad. La imagen debe ser formato JPG y preferentemente de 1200x400 pixeles.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row items-center gap-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="picture">Imagen del Banner (JPG)</Label>
            <Input id="picture" type="file" accept="image/jpeg" onChange={handleFileChange} ref={fileInputRef} />
          </div>
          <Button onClick={handleAddBanner} disabled={isUploading || !newBannerFile} className="w-full sm:w-auto mt-4 sm:mt-0">
            {isUploading ? <><Loader2 className="mr-2 animate-spin" /> Subiendo...</> : <><Upload className="mr-2" /> Subir Banner</>}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Banners Actuales</CardTitle>
          <CardDescription>Estos son los banners que se muestran actualmente en la página de inicio.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className='flex items-center justify-center h-24'>
                <Loader2 className="mr-2 animate-spin" /> Cargando banners...
            </div>
          ) : banners.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {banners.map((banner) => (
                <div key={banner.id} className="relative group border rounded-lg overflow-hidden">
                  <Image
                    src={banner.imageUrl}
                    alt={banner.alt}
                    width={400}
                    height={133}
                    className="object-cover w-full aspect-[3/1]"
                  />
                  <div className="absolute top-2 right-2">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                         <Button variant="destructive" size="icon" className="h-8 w-8">
                            <Trash2 className="h-4 w-4" />
                         </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acción no se puede deshacer. Se eliminará permanentemente el banner.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteBanner(banner)}>Eliminar</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 border-2 border-dashed rounded-lg">
                <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No hay banners</h3>
                <p className="mt-1 text-sm text-muted-foreground">Empieza subiendo tu primer banner publicitario.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
