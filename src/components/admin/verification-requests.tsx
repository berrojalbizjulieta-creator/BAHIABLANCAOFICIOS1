'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, User, Loader2, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
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
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Professional } from '@/lib/types';


export default function VerificationRequests() {
  const [requests, setRequests] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
      const fetchRequests = async () => {
          setLoading(true);
          try {
            const q = query(collection(db, 'professionalsDetails'), where('verificationStatus', '==', 'pending'));
            const querySnapshot = await getDocs(q);
            const pendingRequests = querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()} as Professional));
            setRequests(pendingRequests);
          } catch(error) {
              console.error("Error fetching verification requests:", error);
              toast({ title: 'Error', description: 'No se pudieron cargar las solicitudes.'});
          } finally {
              setLoading(false);
          }
      }
      fetchRequests();
  }, [toast]);

  const handleApprove = async (id: string) => {
    // Optimistic update
    setRequests(prev => prev.filter(req => req.id !== id));
    
    try {
        const profDocRef = doc(db, 'professionalsDetails', id);
        await updateDoc(profDocRef, { 
          isVerified: true,
          verificationStatus: 'verified' 
        });
        toast({
        title: 'Verificación Aprobada',
        description: 'El profesional ha sido verificado y ahora tiene la insignia.',
        });
    } catch(error) {
        console.error("Error approving verification:", error);
        toast({ title: 'Error', description: 'No se pudo aprobar la solicitud.', variant: 'destructive'});
        // TODO: Rollback UI on error
    }
  };

  const handleReject = async (id: string) => {
    setRequests(prev => prev.filter(req => req.id !== id));
     try {
        const profDocRef = doc(db, 'professionalsDetails', id);
        await updateDoc(profDocRef, { 
          verificationStatus: 'not_started' 
        });
        toast({
          title: 'Verificación Rechazada',
          description: 'La solicitud ha sido rechazada y el profesional fue notificado (simulado).',
          variant: 'destructive',
        });
     } catch(error) {
        console.error("Error rejecting verification:", error);
        toast({ title: 'Error', description: 'No se pudo rechazar la solicitud.', variant: 'destructive'});
        // TODO: Rollback UI on error
    }
  };

  if (loading) {
    return (
         <Card>
            <CardHeader>
                <CardTitle>Verificaciones Pendientes</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center items-center h-40">
                <Loader2 className="animate-spin h-8 w-8 text-primary" />
            </CardContent>
        </Card>
    )
  }

  if (requests.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Verificaciones Pendientes</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center text-center h-40">
          <Info className="w-10 h-10 text-muted-foreground mb-3" />
          <p className="text-muted-foreground">No hay solicitudes de verificación pendientes.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Verificaciones Pendientes ({requests.length})</CardTitle>
        <CardDescription>
          Revisa y aprueba las solicitudes de verificación de identidad de los profesionales.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        {requests.map(pro => (
          <div key={pro.id} className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-4">
              <User className="h-8 w-8 text-muted-foreground" />
              <div>
                <p className="font-semibold">{pro.name}</p>
                <p className="text-sm text-muted-foreground">{pro.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
               <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm">Ver Documentos</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Documentos de {pro.name}</AlertDialogTitle>
                    <AlertDialogDescription>
                        Revisa que los documentos sean legibles y coincidan. (Imágenes de prueba)
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto p-4">
                        <div className="flex flex-col items-center gap-2">
                            <h4 className="font-medium">DNI Frente</h4>
                            <Image src="https://picsum.photos/seed/dni-frente/400/250" width={400} height={250} alt="DNI Frente" data-ai-hint="id card" className="rounded-lg border"/>
                        </div>
                         <div className="flex flex-col items-center gap-2">
                            <h4 className="font-medium">DNI Dorso</h4>
                            <Image src="https://picsum.photos/seed/dni-dorso/400/250" width={400} height={250} alt="DNI Dorso" data-ai-hint="id card back" className="rounded-lg border"/>
                        </div>
                         <div className="flex flex-col items-center gap-2 md:col-span-2">
                            <h4 className="font-medium">Selfie con DNI</h4>
                            <Image src="https://picsum.photos/seed/selfie-dni/300/400" width={300} height={400} alt="Selfie con DNI" data-ai-hint="person holding id" className="rounded-lg border"/>
                        </div>
                    </div>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cerrar</AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
                </AlertDialog>


              <Button variant="ghost" size="icon" onClick={() => handleApprove(pro.id as string)} className="text-green-600 hover:text-green-700">
                <CheckCircle className="h-6 w-6" />
                <span className="sr-only">Aprobar</span>
              </Button>
               <Button variant="ghost" size="icon" onClick={() => handleReject(pro.id as string)} className="text-red-600 hover:text-red-700">
                <XCircle className="h-6 w-6" />
                 <span className="sr-only">Rechazar</span>
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
