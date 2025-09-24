import { Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

export default function AboutUsPage() {
  return (
    <div className="bg-muted/30 py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center">
            <div className="mb-8">
                 <Image
                    src="https://i.pinimg.com/736x/db/f0/57/dbf0577b8b35d18acf0d51b9207b5a70.jpg"
                    alt="Agustín y Julieta"
                    width={150}
                    height={150}
                    className="rounded-full object-cover border-4 border-background shadow-lg"
                 />
            </div>
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline mb-4">
                Sobre Nosotros
            </h1>
            <Card className="max-w-3xl mt-4 shadow-lg">
                <CardContent className="p-8 text-left text-muted-foreground md:text-lg space-y-6">
                   <p>
                    Bahía Blanca Oficios es un espacio creado para conectar a vecinos con profesionales de confianza. La plataforma permite que cada especialista muestre con claridad quién es y qué hace, mientras que los usuarios pueden encontrar rápidamente a la persona indicada para cada necesidad.
                    </p>
                    <p>
                    Cada perfil incluye reseñas verificadas de otros vecinos, ofreciendo transparencia y seguridad al momento de elegir. Nuestro objetivo es ser un puente de confianza: un lugar donde la información sea clara, los profesionales sean visibles y las decisiones más simples. Bahía Blanca Oficios nació para acercar personas y servicios, sin vueltas.
                    </p>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
