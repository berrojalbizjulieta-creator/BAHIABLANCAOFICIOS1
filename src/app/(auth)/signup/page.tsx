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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CATEGORIES } from '@/lib/data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import Link from 'next/link';

function ClientForm() {
    return (
        <div className="space-y-4">
             <div className="grid gap-2">
                <Label htmlFor="client-name">Nombre completo</Label>
                <Input id="client-name" placeholder="Juan Pérez" required />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="client-email">Email</Label>
                <Input id="client-email" type="email" placeholder="tu@email.com" required />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="client-password">Contraseña</Label>
                <Input id="client-password" type="password" required />
            </div>
        </div>
    )
}

function ProfessionalForm() {
    return (
        <div className="space-y-4">
            <div className="grid gap-2">
                <Label htmlFor="prof-name">Nombre completo</Label>
                <Input id="prof-name" placeholder="María Gomez" required />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="prof-email">Email</Label>
                <Input id="prof-email" type="email" placeholder="tu@email.com" required />
            </div>
             <div className="grid gap-2">
                <Label htmlFor="prof-category">Oficio principal</Label>
                <Select>
                  <SelectTrigger id="prof-category">
                    <SelectValue placeholder="Selecciona tu oficio" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(category => (
                         <SelectItem key={category.id} value={String(category.id)}>{category.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
            </div>
            <div className="grid gap-2">
                <Label htmlFor="prof-password">Contraseña</Label>
                <Input id="prof-password" type="password" required />
            </div>
        </div>
    )
}


export default function SignupPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-10rem)] py-12">
        <Card className="w-full max-w-md">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl font-headline">Crear una Cuenta</CardTitle>
                <CardDescription>
                    Únete a nuestra comunidad. Elige tu tipo de cuenta.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="client" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="client">Soy Cliente</TabsTrigger>
                        <TabsTrigger value="professional">Soy Profesional</TabsTrigger>
                    </TabsList>
                    <TabsContent value="client" className="mt-6">
                        <ClientForm />
                    </TabsContent>
                    <TabsContent value="professional" className="mt-6">
                        <ProfessionalForm />
                    </TabsContent>
                </Tabs>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
                 <Button className="w-full">Crear Cuenta</Button>
                 <p className="text-xs text-center text-muted-foreground">
                    ¿Ya tienes una cuenta?{' '}
                    <Link href="/login" className="underline hover:text-primary">
                        Inicia sesión
                    </Link>
                </p>
            </CardFooter>
        </Card>
    </div>
  );
}
