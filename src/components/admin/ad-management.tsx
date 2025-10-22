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
  deleteObject,
} from 'firebase/storage';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { db, functions, storage } from '@/lib/firebase';
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
import { AD_BANNERS } from '@/lib/data';

const MAX_BANNER_SIZE_MB = 5;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

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
        
        if (bannersData.length > 0) {
          setBanners(bannersData);
        } else {
          // Fallback to static data if firestore is empty, adding a mock storagePath
          const staticBanners = AD_BANNERS.map(b => ({...b, id: String(b.id), storagePath: `static/${b.id}`}));
          setBanners(staticBanners);
        }

      } catch (error) {
          console.error("Error fetching banners:", error);
          toast({ title: 'Error', description: 'No se pudieron cargar los banners. Mostrando datos de ejemplo.', variant: 'destructive' });
          const staticBanners = AD_BANNERS.map(b => ({...b, id: String(b.id), storagePath: `static/${b.id}`}));
          setBanners(staticBanners);
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, [toast]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        toast({ title: 'Formato no permitido', description: 'Por favor, sube una imagen en formato JPG, PNG o WebP.', variant: 'destructive' });
        setNewBannerFile(null);
        e.target.value = ""; // Reset file input
        return;
      }
      if (file.size > MAX_BANNER_SIZE_MB * 1024 * 1024) {
        toast({ title: 'Archivo muy grande', description: `La imagen no puede superar los ${MAX_BANNER_SIZE_MB}MB.`, variant: 'destructive' });
        setNewBannerFile(null);
        e.target.value = ""; // Reset file input
        return;
      }
      setNewBannerFile(file);
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
      const uploadFile = httpsCallable(functions, 'uploadFile');

      // We need to send the file content as a base64 string to the cloud function
      const reader = new FileReader();
      reader.readAsDataURL(newBannerFile);
      reader.onload = async () => {
        try {
          const base64File = reader.result as string;
          
          const result = await uploadFile({ 
            fileContent: base64File,
            fileName: newBannerFile.name,
            contentType: newBannerFile.type,
            destination: 'adBanners' 
          });

          const data = result.data as { downloadURL: string; storagePath: string; };

          const docRef = await addDoc(collection(db, 'adBanners'), {
            imageUrl: data.downloadURL,
            storagePath: data.storagePath,
            alt: 'Banner publicitario',
            imageHint: 'advertisement',
            createdAt: serverTimestamp(),
          });
          
          const newBanner = {
              id: docRef.id,
              imageUrl: data.downloadURL,
              storagePath: data.storagePath,
              alt: 'Banner publicitario',
              imageHint: 'advertisement'
          }

          setBanners(prev => [newBanner, ...prev.filter(b => !b.storagePath.startsWith('static/'))]);
          toast({ title: '¡Éxito!', description: 'El nuevo banner ha sido añadido.' });
          
          setNewBannerFile(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        } catch(e) {
            console.error('Error inside function call:', e);
            toast({ title: 'Error de Subida', description: 'No se pudo procesar el archivo. Revisa los logs de la función.', variant: 'destructive' });
        } finally {
            setIsUploading(false);
        }
      }
      reader.onerror = () => {
        console.error("Error reading file");
        toast({ title: 'Error', description: 'No se pudo leer el archivo seleccionado.', variant: 'destructive' });
        setIsUploading(false);
      }

    } catch (error) {
      console.error('Error adding banner:', error);
      toast({ title: 'Error', description: 'No se pudo añadir el banner. Asegúrate de tener permisos de administrador.', variant: 'destructive' });
      setIsUploading(false);
    }
  };

  const handleDeleteBanner = async (bannerToDelete: AdBanner) => {
    // If it's a static fallback banner, just remove from UI
    if (bannerToDelete.storagePath.startsWith('static/')) {
        setBanners(prevBanners => prevBanners.filter(b => b.id !== bannerToDelete.id));
        toast({ title: 'Banner de Ejemplo Eliminado', description: 'El banner de ejemplo ha sido eliminado de la vista.' });
        return;
    }

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
            <Label htmlFor="picture">Imagen del Banner (JPG, PNG, WebP - Máx {MAX_BANNER_SIZE_MB}MB)</Label>
            <Input id="picture" type="file" accept={ALLOWED_IMAGE_TYPES.join(',')} onChange={handleFileChange} ref={fileInputRef} />
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
