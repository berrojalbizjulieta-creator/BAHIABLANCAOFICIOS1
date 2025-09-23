'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

export default function HeroSection() {
  const [searchValue, setSearchValue] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const router = useRouter();
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Click fuera para cerrar dropdown
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

  const createCategorySlug = (categoryName: string) => {
    return encodeURIComponent(
      categoryName.toLowerCase().replace(/ y /g, '-').replace(/ /g, '-')
    );
  };

  const fetchSuggestions = async (query: string) => {
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/sugerencia?q=${encodeURIComponent(query)}`);
      if (!res.ok) {
        throw new Error(`Server responded with ${res.status}`);
      }
      const data = await res.json();
      const suggestedTrades = data.suggestedTrades || [];
      setSuggestions(suggestedTrades);
      setIsDropdownOpen(suggestedTrades.length > 0);
    } catch (e: any) {
      console.error('Error fetching suggestions:', e);
      setError('No se pudieron obtener sugerencias. Intenta de nuevo.');
      setSuggestions([]);
      setIsDropdownOpen(true); // Keep open to show error
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      if (value.trim().length < 3) {
        setSuggestions([]);
        setError('');
        setIsDropdownOpen(false);
      } else {
        fetchSuggestions(value);
      }
    }, 300);
  };
  
  const handleSuggestionClick = (suggestion: string) => {
    setSearchValue(suggestion);
    setSuggestions([]);
    setIsDropdownOpen(false);
    router.push(`/servicios/${createCategorySlug(suggestion)}`);
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!searchValue) return;
    setIsDropdownOpen(false);
    router.push(`/servicios?search=${encodeURIComponent(searchValue)}`);
  };
  
  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.split(regex).map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={i} className="font-semibold text-primary">
          {part}
        </span>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  };


  return (
    <section className="relative w-full h-[500px] flex items-center justify-center text-white" style={{ backgroundImage: "url('https://i.pinimg.com/1200x/2e/aa/5c/2eaa5ca96662e74cb7e59c297d9f6dd0.jpg')" , backgroundSize: 'cover', backgroundPosition: 'center' }}>
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      <div ref={containerRef} className="relative z-10 container mx-auto text-center px-4">
        <h1 className="text-4xl font-bold font-headline mb-4">
          Acá está la persona que necesitas hoy!
        </h1>
        <p className="mb-6 text-lg">
          Busca, elegí y contactate ya. Listos para ayudarte con lo que requieras
        </p>

        <form onSubmit={handleSearch} className="flex justify-center gap-2 max-w-xl mx-auto">
          <Input
            type="text"
            value={searchValue}
            onChange={handleInputChange}
            placeholder="Ej: 'plomero', 'electricista' o 'arreglar una canilla'"
            className="flex-1 text-black"
            autoComplete="off"
            onClick={() => setIsDropdownOpen(suggestions.length > 0 || !!error)}
          />
          <Button
            type="submit"
            className="bg-primary hover:bg-primary/90"
            disabled={isLoading && !suggestions.length}
          >
            {isLoading && !suggestions.length ? 'Buscando...' : 'Buscar'}
          </Button>
        </form>

        <AnimatePresence>
            {isDropdownOpen && (
              <motion.ul
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full mt-2 w-full max-w-xl mx-auto border bg-background text-foreground rounded-md shadow-lg max-h-60 overflow-auto z-20 text-left"
              >
                {isLoading && <li className="px-3 py-2 text-muted-foreground">Cargando...</li>}
                {error && <li className="px-3 py-2 text-destructive">{error}</li>}
                {!isLoading && !error && suggestions.map((s) => (
                  <li
                    key={s}
                    className="px-3 py-2 cursor-pointer hover:bg-muted"
                    onClick={() => handleSuggestionClick(s)}
                    role="option"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && handleSuggestionClick(s)}
                  >
                    {highlightMatch(s, searchValue)}
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
      </div>
    </section>
  );
}
