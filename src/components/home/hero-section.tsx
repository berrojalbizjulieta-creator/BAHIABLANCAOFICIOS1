
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

export default function HeroSection() {
  const [prompt, setPrompt] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt) return;
    router.push(`/servicios?search=${encodeURIComponent(prompt)}`);
  };

  const createCategorySlug = (categoryName: string) => {
    return encodeURIComponent(
      categoryName.toLowerCase().replace(/ y /g, '-').replace(/ /g, '-')
    );
  };
  
    const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPrompt(value);

    if (value.length < 3) {
      setSuggestions([]);
      setError('');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/sugerencia?q=${encodeURIComponent(value)}`);
      if (!res.ok) {
        throw new Error(`Server responded with ${res.status}`);
      }
      const data = await res.json();
      setSuggestions(data.suggestedTrades || []);
    } catch (e: any) {
      console.error('Error fetching suggestions:', e);
      setError('No se pudieron obtener sugerencias. Intenta de nuevo.');
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="relative w-full h-[500px] flex items-center justify-center text-white" style={{ backgroundImage: "url('https://i.pinimg.com/1200x/2e/aa/5c/2eaa5ca96662e74cb7e59c297d9f6dd0.jpg')" , backgroundSize: 'cover', backgroundPosition: 'center' }}>
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative z-10 container mx-auto text-center px-4">
        <h1 className="text-4xl font-bold font-headline mb-4">
          Acá está la persona que necesitas hoy!
        </h1>
        <p className="mb-6 text-lg">
          Busca, elegí y contactate ya. Listos para ayudarte con lo que necesites
        </p>

        <form onSubmit={handleSearch} className="flex justify-center gap-2 max-w-xl mx-auto">
          <Input
            type="text"
            value={prompt}
            onChange={handleInputChange}
            placeholder="Ej: 'plomero', 'electricista' o 'arreglar una canilla'"
            className="flex-1 text-black"
          />
          <Button
            type="submit"
            className="bg-primary hover:bg-primary/90"
            disabled={isLoading}
          >
            {isLoading ? 'Buscando...' : 'Buscar'}
          </Button>
        </form>

        {/* Resultados */}
        { (isLoading || error || suggestions.length > 0) && (
             <div className="mt-4 text-left text-black bg-white/95 rounded-md p-2 max-w-xl mx-auto shadow-lg">
                {isLoading && <p className="p-2 text-muted-foreground">Cargando sugerencias...</p>}
                {error && <p className="p-2 text-destructive">{error}</p>}
                {!isLoading && suggestions.length > 0 && (
                <ul>
                    {suggestions.map((trade, i) => (
                    <li key={i}>
                        <Link href={`/servicios/${createCategorySlug(trade)}`} className="block p-2 rounded-md hover:bg-muted">
                           {trade}
                        </Link>
                    </li>
                    ))}
                </ul>
                )}
            </div>
        )}

      </div>
    </section>
  );
}
