'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { CATEGORIES } from '@/lib/data';
import Link from 'next/link';
import { Search } from 'lucide-react';

export default function ServicesPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCategories = CATEGORIES.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-12 md:px-6">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">
          Todos Nuestros Servicios
        </h1>
        <p className="mt-3 max-w-2xl mx-auto text-muted-foreground md:text-lg">
          Explora la lista completa de oficios y encuentra lo que necesitas.
        </p>
      </div>

      <div className="max-w-xl mx-auto mb-10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="¿Qué estás buscando? Ej: Plomería, Electricidad..."
            className="w-full pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredCategories.map((category) => (
          <Link
            key={category.id}
            href={`/servicios/${encodeURIComponent(
              category.name.toLowerCase().replace(/ y /g, '-').replace(/ /g, '-')
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer group"
          >
            <Card className="hover:shadow-lg transition-all">
              <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                <div className="bg-primary/10 p-3 rounded-full group-hover:bg-accent/20 transition-colors">
                  <category.icon className="h-6 w-6 text-primary group-hover:text-accent-foreground" />
                </div>
                <CardTitle className="font-headline text-base">
                  {category.name}
                </CardTitle>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
       {filteredCategories.length === 0 && (
        <div className="text-center col-span-full py-16">
          <p className="text-lg font-medium text-muted-foreground">
            No se encontraron oficios que coincidan con tu búsqueda.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Intenta con otro término o explora la lista completa.
          </p>
        </div>
      )}
    </div>
  );
}
