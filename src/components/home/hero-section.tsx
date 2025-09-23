'use client';
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import Image from 'next/image';
import { placeholderImages } from '@/lib/placeholder-images';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '../ui/card';

let debounceTimeout: NodeJS.Timeout;

export default function HeroSection() {
  const [prompt, setPrompt] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSuggestionsLoading, setIsSuggestionsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const heroImage = placeholderImages.find(
    (img) => img.id === 'hero-background-parque-de-mayo'
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPrompt = e.target.value;
    setPrompt(newPrompt);

    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    if (newPrompt.length < 3) {
      setSuggestions([]);
      setError('');
      return;
    }

    setIsSuggestionsLoading(true);
    setError('');

    debounceTimeout = setTimeout(async () => {
      try {
        const res = await fetch(`/api/sugerencia?q=${newPrompt}`);
        if (!res.ok) {
          throw new Error(`Server responded with ${res.status}`);
        }
        const data = await res.json();
        setSuggestions(data.suggestions || []);
      } catch (e: any) {
        console.error('Error fetching suggestions:', e);
        setError('No se pudieron obtener sugerencias. Intenta de nuevo.');
        setSuggestions([]);
      } finally {
        setIsSuggestionsLoading(false);
      }
    }, 500);
  };

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

  return (
    <section className="relative w-full py-20 md:py-32 lg:py-40 overflow-hidden">
      {heroImage && (
        <Image
          src={heroImage.imageUrl}
          alt={heroImage.description}
          fill
          className="object-cover"
          data-ai-hint={heroImage.imageHint}
          priority
        />
      )}
      <div className="absolute inset-0 bg-black/60"></div>
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tighter text-white sm:text-5xl md:text-6xl font-headline">
            Encuentra al profesional que necesitas
          </h1>
          <p className="mt-4 text-lg text-gray-200 md:text-xl">
            Desde plomeros hasta electricistas, conecta con los mejores oficios
            de Bahía Blanca.
          </p>
          <div
            className="relative w-full max-w-xl mx-auto"
          >
            <form
              onSubmit={handleSearch}
              className="mt-8 flex w-full items-center space-x-2 rounded-full bg-white/90 p-2 shadow-lg"
            >
              <Input
                type="text"
                value={prompt}
                onChange={handleInputChange}
                placeholder="¿Qué servicio estás buscando? Ej: 'arreglar una canilla'"
                className="flex-1 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-base text-gray-800 placeholder:text-gray-500"
              />
              <Button
                type="submit"
                size="icon"
                className="rounded-full flex-shrink-0 w-12 h-12"
                disabled={isSuggestionsLoading}
              >
                {isSuggestionsLoading ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  <Search className="h-6 w-6" />
                )}
                <span className="sr-only">Buscar</span>
              </Button>
            </form>
            { (isSuggestionsLoading || error || suggestions.length > 0) && (
              <Card className="absolute top-full mt-2 w-full text-left shadow-lg z-20">
                <CardContent className="p-2">
                  {isSuggestionsLoading && (
                    <div className="px-4 py-2 text-sm text-muted-foreground">
                      Buscando sugerencias...
                    </div>
                  )}
                  {error && (
                    <div className="px-4 py-2 text-sm text-destructive">
                      {error}
                    </div>
                  )}
                  {!isSuggestionsLoading && !error && suggestions.length > 0 && (
                    <ul>
                      {suggestions.map((trade) => (
                        <li key={trade}>
                          <Link
                            href={`/servicios/${createCategorySlug(trade)}`}
                            className="block px-4 py-2 text-sm rounded-md hover:bg-muted"
                          >
                            {trade}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                  {!isSuggestionsLoading && !error &&
                    suggestions.length === 0 &&
                    prompt.length > 2 && (
                      <div className="px-4 py-2 text-sm text-muted-foreground">
                        No se encontraron sugerencias. Intenta con otro término.
                      </div>
                    )}
                </CardContent>
              </Card>
            )}
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <span className="text-sm text-white/80 font-medium mr-2">
              Búsquedas populares:
            </span>
            {['Plomero', 'Electricista', 'Pintor'].map((trade) => (
              <Button
                key={trade}
                variant="secondary"
                size="sm"
                asChild
                className="h-auto bg-white/20 text-white hover:bg-white/30 transition-colors"
              >
                <Link href={`/servicios/${createCategorySlug(trade)}`}>
                  {trade}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
