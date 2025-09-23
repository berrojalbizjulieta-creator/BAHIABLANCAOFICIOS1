'use client';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Badge } from '../ui/badge';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { suggestTradesFromPrompt } from '@/ai/flows/suggest-trades-from-prompt';
import { Card, CardContent } from '../ui/card';

const heroImages = PlaceHolderImages.filter(img =>
  img.id.startsWith('promo-banner-')
);

export default function HeroSection() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSuggestionsLoading, setIsSuggestionsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const router = useRouter();
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const plugin = useRef(
    Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true })
  );

  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

   useEffect(() => {
    if (prompt.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsSuggestionsLoading(true);
    setShowSuggestions(true);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(async () => {
      try {
        const response = await suggestTradesFromPrompt({ prompt });
        setSuggestions(response.suggestedTrades || []);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      } finally {
        setIsSuggestionsLoading(false);
      }
    }, 500);

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [prompt]);

    useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt) return;
    setShowSuggestions(false);
    router.push(`/servicios?search=${encodeURIComponent(prompt)}`);
  };

  const createCategorySlug = (categoryName: string) => {
    return encodeURIComponent(
      categoryName.toLowerCase().replace(/ y /g, '-').replace(/ /g, '-')
    );
  };

  return (
    <section className="relative w-full py-20 md:py-32 lg:py-40 overflow-hidden">
      <Carousel
        opts={{ loop: true }}
        plugins={[plugin.current]}
        className="absolute inset-0 w-full h-full embla-fade"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent className="h-full">
          {heroImages.map((image, index) => (
            <CarouselItem key={image.id} className="h-full">
              <Image
                src={image.imageUrl}
                alt={image.description}
                fill
                className="object-cover"
                data-ai-hint={image.imageHint}
                priority={index === 0}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
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
          <div className="relative w-full max-w-xl mx-auto" ref={searchContainerRef}>
            <form
              onSubmit={handleSearch}
              className="mt-8 flex w-full items-center space-x-2 rounded-full bg-white/90 p-2 shadow-lg"
            >
              <Input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                placeholder="¿Qué servicio estás buscando? Ej: 'arreglar una canilla'"
                className="flex-1 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-base text-gray-800 placeholder:text-gray-500"
              />
              <Button
                type="submit"
                size="icon"
                className="rounded-full flex-shrink-0 w-12 h-12"
                disabled={loading}
              >
                {loading ? (
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
            {showSuggestions && (
              <Card className="absolute top-full mt-2 w-full text-left shadow-lg z-20">
                <CardContent className="p-2">
                  {isSuggestionsLoading && (
                    <div className="px-4 py-2 text-sm text-muted-foreground">
                      Buscando sugerencias...
                    </div>
                  )}
                  {!isSuggestionsLoading && suggestions.length > 0 && (
                    <ul>
                      {suggestions.map((trade) => (
                        <li key={trade}>
                          <Link
                            href={`/servicios/${createCategorySlug(trade)}`}
                            className="block px-4 py-2 text-sm rounded-md hover:bg-muted"
                            onClick={() => setShowSuggestions(false)}
                          >
                            {trade}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                  {!isSuggestionsLoading && suggestions.length === 0 && prompt.length > 2 && (
                     <div className="px-4 py-2 text-sm text-muted-foreground">
                      No se encontraron sugerencias.
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
