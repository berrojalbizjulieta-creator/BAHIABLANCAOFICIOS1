
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Star } from 'lucide-react';
import { Separator } from '../ui/separator';

interface SearchResult {
  id: number;
  nombre: string;
  rubro: string;
  photoUrl: string;
  avgRating: number;
}

export default function SearchForm() {
  const [searchValue, setSearchValue] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const router = useRouter();
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  const fetchData = async (query: string) => {
    setIsLoading(true);

    try {
      // Fetch both professionals and AI suggestions in parallel
      const [profResults, suggResults] = await Promise.all([
        fetch(`/api/search?q=${encodeURIComponent(query)}`),
        fetch(`/api/sugerencia?q=${encodeURIComponent(query)}`)
      ]);

      const professionals: SearchResult[] = await profResults.json();
      setResults(professionals);
      
      const aiSuggestions: { suggestedTrades: string[] } = await suggResults.json();

      // Combine AI suggestions with unique categories from professional results
      const professionalCategories = Array.from(new Set(professionals.map(p => p.rubro)));
      const combinedSuggestions = Array.from(new Set([...(aiSuggestions.suggestedTrades || []), ...professionalCategories]));

      setSuggestions(combinedSuggestions.slice(0, 3)); // show max 3 suggestions

      setIsDropdownOpen(true);
    } catch (e: any) {
      console.error('Error fetching data:', e);
      setResults([]);
      setSuggestions([]);
      setIsDropdownOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (value.trim().length < 3) {
      setResults([]);
      setSuggestions([]);
      setIsDropdownOpen(false);
      return;
    }

    debounceRef.current = setTimeout(() => {
        fetchData(value);
    }, 300);
  };
  
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!searchValue) return;
    setIsDropdownOpen(false);
    
    router.push(`/servicios?search=${encodeURIComponent(searchValue)}`);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchValue(suggestion);
    setIsDropdownOpen(false);
    const categorySlug = encodeURIComponent(suggestion.toLowerCase().replace(/ y /g, '-').replace(/ /g, '-'));
    router.push(`/servicios/${categorySlug}`);
  }

  return (
    <div ref={containerRef} className="relative max-w-2xl mx-auto">
        <form onSubmit={handleSearch} className="flex justify-center gap-2">
          <Input
            type="text"
            value={searchValue}
            onChange={handleInputChange}
            placeholder="Ej: 'plomero', 'electricista' o 'arreglar una canilla'"
            className="flex-1 text-black"
            autoComplete="off"
            onFocus={() => {
              if (searchValue.length > 2) setIsDropdownOpen(true);
            }}
          />
          <Button
            type="submit"
            className="bg-primary hover:bg-primary/90"
          >
            Buscar
          </Button>
        </form>

        <AnimatePresence>
            {isDropdownOpen && (
              <motion.ul
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full mt-2 w-full border bg-background text-foreground rounded-md shadow-lg max-h-96 overflow-auto z-20 text-left"
              >
                {isLoading && <li className="px-4 py-3 text-muted-foreground">Buscando...</li>}
                
                {!isLoading && suggestions.length > 0 && (
                   <>
                    <li className="px-4 pt-3 pb-1 text-xs font-semibold text-muted-foreground uppercase">Sugerencias de Oficios</li>
                    {suggestions.map((suggestion) => (
                      <li 
                        key={suggestion} 
                        className="px-4 py-2 cursor-pointer hover:bg-muted font-medium"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        en <span className='text-primary'>{suggestion}</span>
                      </li>
                    ))}
                    {results.length > 0 && <Separator />}
                  </>
                )}

                {!isLoading && results.length > 0 && (
                  <>
                  <li className="px-4 pt-3 pb-1 text-xs font-semibold text-muted-foreground uppercase">Profesionales</li>
                  {results.map((r) => (
                    <li key={r.id}>
                        <Link href={`/profesional/${r.id}`} className="flex items-center gap-4 px-4 py-3 cursor-pointer hover:bg-muted" onClick={() => setIsDropdownOpen(false)}>
                            <Avatar>
                                <AvatarImage src={r.photoUrl} alt={r.nombre} />
                                <AvatarFallback>{r.nombre.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <p className="font-semibold">{r.nombre}</p>
                                <p className="text-sm text-muted-foreground">{r.rubro}</p>
                            </div>
                             <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400"/>
                                <span>{r.avgRating.toFixed(1)}</span>
                            </div>
                        </Link>
                    </li>
                  ))}
                 </>
                )}

                {!isLoading && results.length === 0 && suggestions.length === 0 && searchValue.length > 2 && (
                    <li className="px-4 py-3 text-muted-foreground">No se encontraron resultados para "{searchValue}".</li>
                )}
              </motion.ul>
            )}
          </AnimatePresence>
    </div>
  );
}
