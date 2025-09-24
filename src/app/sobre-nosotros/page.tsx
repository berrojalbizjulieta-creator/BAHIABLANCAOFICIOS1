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
                    src="https://i.pinimg.com/1200x/c1/f3/f1/c1f3f1e91372a82988138761e389e9f3.jpg"
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
                    Somos Agustín y Julieta, una pareja que llegó a Bahía Blanca con nuestros estudios y terminó encontrando aquí un lugar al que llamar hogar. Con el tiempo nos dimos cuenta de algo que nos pasa a todos: cuando necesitamos un servicio, muchas veces no sabemos a quién acudir, y encontrar un profesional confiable puede ser complicado.
                    </p>
                    <p>
                    Por eso creamos <strong>Bahia Blanca Oficios</strong>: un espacio pensado para que los profesionales puedan presentarse y mostrar con claridad quiénes son y qué hacen, y para que los vecinos puedan encontrar rápidamente a la persona indicada para cada necesidad. Cada perfil incluye reseñas de otros vecinos, para que puedas conocer la experiencia de quienes ya confiaron en ese profesional y tomar decisiones con seguridad.
                    </p>
                    <p>
                    Queremos que esta página sea un puente de confianza: un lugar donde la información sea clara, los profesionales sean visibles y los vecinos puedan tomar decisiones seguras. Bahia Blanca Oficios nació para acercar personas y servicios, y para que todos en la ciudad sepan dónde encontrar lo que buscan, sin vueltas.
                    </p>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
