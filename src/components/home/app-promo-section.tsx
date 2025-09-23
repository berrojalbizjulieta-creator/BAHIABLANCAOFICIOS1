'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function AppPromoSection() {

  const fondoBaldosas = "https://images.unsplash.com/photo-1581788788934-9e32ce7b439c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
  const celularImg = "/phone-mockup.png";

  return (
    <section className="relative py-20 md:py-24 bg-muted/30 overflow-hidden">
      <Image
          src={fondoBaldosas}
          alt="Fondo de baldosas blancas"
          fill
          style={{ objectFit: "cover" }}
          data-ai-hint="white tiles"
        />
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="max-w-md text-left">
                 <h2 className="text-4xl md:text-5xl font-bold font-headline tracking-tighter text-foreground">
                  La app que necesitas para resolverlo <span className="text-primary">todo</span>.
                </h2>
                <p className="mt-4 text-muted-foreground text-lg md:text-xl">
                  Desde guías personalizadas hasta la planificación de proyectos sin esfuerzo, todo está aquí, en una sola aplicación gratuita.
                </p>
                <div className="mt-8 flex justify-start gap-4">
                  <Link href="#" passHref>
                    <Image src="/app-store-badge.svg" alt="Download on the App Store" width={135} height={40} className='opacity-90 hover:opacity-100 transition-opacity'/>
                  </Link>
                  <Link href="#" passHref>
                    <Image src="/google-play-badge.svg" alt="Get it on Google Play" width={135} height={40} className='opacity-90 hover:opacity-100 transition-opacity'/>
                  </Link>
                </div>
            </div>
             <div className="flex justify-center md:justify-end">
                <Image 
                    src={celularImg}
                    alt="Celular con app"
                    width={300}
                    height={600}
                    className="object-contain"
                    data-ai-hint="phone app"
                />
            </div>
        </div>
      </div>
    </section>
  );
}