'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Skeleton } from '../ui/skeleton';

const SearchForm = dynamic(() => import('./search-form'), {
  ssr: false,
  loading: () => (
     <div className="flex justify-center gap-2 max-w-2xl mx-auto">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-24" />
     </div>
  ),
});

export default function HeroSection() {
  return (
    <section 
      className="relative w-full h-[400px] md:h-[500px] flex items-center justify-center text-white" 
      style={{ 
        backgroundImage: "url('https://i.pinimg.com/1200x/2e/aa/5c/2eaa5ca96662e74cb7e59c297d9f6dd0.jpg')", 
        backgroundSize: 'cover', 
        backgroundPosition: 'center' 
      }}
    >
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative z-10 container mx-auto text-center px-4">
        <h1 className="text-3xl md:text-4xl font-bold font-headline mb-4">
          Acá está la persona que necesitas hoy!
        </h1>
        <p className="mb-6 text-base md:text-lg">
          Busca, elegí y contactate ya. Listos para ayudarte con lo que requieras
        </p>

        <SearchForm />

      </div>
    </section>
  );
}
