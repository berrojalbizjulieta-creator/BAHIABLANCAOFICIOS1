'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Star } from 'lucide-react';

interface SearchResult {
  id: number;
  nombre: string;
  rubro: string;
  photoUrl: string;
  avgRating: number;
}

export default function HeroSection() {
  const [searchValue, setSearchValue] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
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


  const fetchSuggestions = async (query: string) => {
    setIsLoading(true);

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data);
      setIsDropdownOpen(true);
    } catch (e: any) {
      console.error('Error fetching suggestions:', e);
      setResults([]);
      setIsDropdownOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      if (value.trim().length < 2) {
        setResults([]);
        setIsDropdownOpen(false);
      } else {
        fetchSuggestions(value);
      }
    }, 300);
  };
  
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!searchValue) return;
    setIsDropdownOpen(false);
    
    // Check if the search term matches a category and redirect if so
    const categorySlug = encodeURIComponent(searchValue.toLowerCase().replace(/ y /g, '-').replace(/ /g, '-'));
    router.push(`/servicios/${categorySlug}`);
  };

  return (
    <section className="relative w-full h-[500px] flex items-center justify-center text-white" style={{ backgroundImage: "url('https://i.pinimg.com/1200x/2e/aa/5c/2eaa5ca96662e74cb7e59c297d9f6dd0.jpg')" , backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="absolute inset-0 bg-black/50"></div>

      <div ref={containerRef} className="relative z-10 container mx-auto text-center px-4">
        <h1 className="text-4xl font-bold font-headline mb-4">
          Acá está la persona que necesitas hoy!
        </h1>
        <p className="mb-6 text-lg">
          Busca, elegí y contactate ya. Listos para ayudarte con lo que requieras
        </p>

        <form onSubmit={handleSearch} className="flex justify-center gap-2 max-w-2xl mx-auto">
          <Input
            type="text"
            value={searchValue}
            onChange={handleInputChange}
            placeholder="Ej: 'plomero', 'electricista' o 'arreglar una canilla'"
            className="flex-1 text-black"
            autoComplete="off"
            onClick={() => setIsDropdownOpen(results.length > 0)}
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
                className="absolute top-full mt-2 w-full max-w-2xl mx-auto border bg-background text-foreground rounded-md shadow-lg max-h-80 overflow-auto z-20 text-left"
              >
                {isLoading && <li className="px-4 py-3 text-muted-foreground">Buscando...</li>}
                {!isLoading && results.length === 0 && searchValue.length > 1 && (
                    <li className="px-4 py-3 text-muted-foreground">No se encontraron resultados para "{searchValue}".</li>
                )}
                {!isLoading && results.map((r) => (
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
              </motion.ul>
            )}
          </AnimatePresence>
      </div>
    </section>
  );
}
