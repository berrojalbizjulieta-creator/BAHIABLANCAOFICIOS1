'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { suggestTradesFromPrompt } from '@/ai/flows/suggest-trades-from-prompt';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '../ui/badge';

export default function HeroSection() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>(['Plomero', 'Electricista', 'Pintor']);
  const { toast } = useToast();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt) return;

    setLoading(true);
    try {
      const result = await suggestTradesFromPrompt({ prompt });
      if (result.suggestedTrades && result.suggestedTrades.length > 0) {
        setSuggestions(result.suggestedTrades);
      }
    } catch (error) {
      console.error('Error suggesting trades:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron obtener sugerencias. Intente de nuevo.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative w-full py-20 md:py-32 lg:py-40 bg-cover bg-center bg-no-repeat">
       <div className="absolute inset-0 bg-background/80 backdrop-blur-sm"></div>
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tighter text-foreground sm:text-5xl md:text-6xl font-headline">
            Encuentra al profesional que necesitas
          </h1>
          <p className="mt-4 text-lg text-muted-foreground md:text-xl">
            Desde plomeros hasta electricistas, conecta con los mejores oficios
            de Bahía Blanca.
          </p>
          <form
            onSubmit={handleSearch}
            className="mt-8 flex w-full max-w-xl mx-auto items-center space-x-2 rounded-full bg-card p-2 shadow-lg"
          >
            <Input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="¿Qué servicio estás buscando? Ej: 'arreglar una canilla'"
              className="flex-1 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
            />
            <Button
              type="submit"
              size="icon"
              className="rounded-full flex-shrink-0 w-12 h-12"
              disabled={loading}
            >
              {loading ? (
                 <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
              ) : (
                <Search className="h-6 w-6" />
              )}
              <span className="sr-only">Buscar</span>
            </Button>
          </form>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <span className="text-sm text-muted-foreground font-medium mr-2">
              Sugerencias:
            </span>
            {suggestions.map((trade) => (
              <Badge key={trade} variant="secondary" className="cursor-pointer hover:bg-accent transition-colors">
                {trade}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
