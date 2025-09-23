import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';

function ProfessionalDashboard() {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="font-headline">Panel de Profesional</CardTitle>
            <CardDescription>
              Gestiona tu perfil y membresía.
            </CardDescription>
          </div>
          <Button variant="outline" size="sm">
            <Pencil className="mr-2 h-4 w-4" />
            Editar Perfil
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-semibold">Estado de Membresía</h3>
          <div className="flex items-center gap-4 mt-2">
            <Badge variant="default" className="bg-green-600">Activa</Badge>
            <p className="text-sm text-muted-foreground">
              Tu membresía vence el 31 de Diciembre, 2024.
            </p>
            <Button variant="secondary" size="sm">Renovar ahora</Button>
          </div>
        </div>
        <div>
          <h3 className="font-semibold">Estadísticas Rápidas</h3>
           <div className="grid grid-cols-3 gap-4 mt-2">
              <Card className="p-4">
                <p className="text-sm text-muted-foreground">Vistas de perfil</p>
                <p className="text-2xl font-bold">1,250</p>
              </Card>
              <Card className="p-4">
                <p className="text-sm text-muted-foreground">Contactos</p>
                <p className="text-2xl font-bold">82</p>
              </Card>
               <Card className="p-4">
                <p className="text-sm text-muted-foreground">Valoración media</p>
                <p className="text-2xl font-bold">4.9 ★</p>
              </Card>
           </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ClientDashboard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Panel de Cliente</CardTitle>
        <CardDescription>
          Revisa tu actividad reciente y testimonios.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-semibold">Profesionales Contactados Recientemente</h3>
          <ul className="mt-2 space-y-2">
            <li className="flex justify-between items-center text-sm p-2 rounded-md bg-muted/50"><span>Carlos Rodriguez (Plomería)</span> <span className="text-muted-foreground">15/07/2024</span></li>
            <li className="flex justify-between items-center text-sm p-2 rounded-md bg-muted/50"><span>Lucía Fernandez (Electricidad)</span> <span className="text-muted-foreground">02/07/2024</span></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold">Mis Testimonios</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Aún no has dejado ningún testimonio.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:px-6">
      <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline mb-8">
        Mi Panel
      </h1>
      <Tabs defaultValue="professional" className="w-full">
        <TabsList>
          <TabsTrigger value="professional">Vista Profesional</TabsTrigger>
          <TabsTrigger value="client">Vista Cliente</TabsTrigger>
        </TabsList>
        <TabsContent value="professional" className="mt-6">
          <ProfessionalDashboard />
        </TabsContent>
        <TabsContent value="client" className="mt-6">
          <ClientDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
}
