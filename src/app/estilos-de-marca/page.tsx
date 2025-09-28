
import { Logo } from '@/components/icons/logo';

export default function BrandStylesPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline">
            Guía de Estilos de la Marca
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-muted-foreground md:text-lg">
            Aquí están los detalles de diseño del logo y los colores principales de "Bahia Blanca Oficios".
          </p>
        </div>

        <div className="space-y-10">
          {/* Logo Section */}
          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-headline font-bold mb-4">Logo</h2>
            <div className="p-8 border rounded-lg bg-card">
              <Logo className="h-16 w-auto" />
            </div>
          </div>

          {/* Typography Section */}
          <div>
            <h2 className="text-2xl font-headline font-bold mb-4 text-center">Tipografía</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-card border p-8 rounded-lg">
              <div className="text-center md:text-left">
                <p className="text-lg font-semibold text-foreground">Fuente Principal</p>
                <p className="text-6xl font-bold font-headline text-foreground">PT Sans</p>
              </div>
              <div>
                <p><span className="font-bold">Peso Regular (400):</span> Se usa para el cuerpo de texto y párrafos.</p>
                <p className="mt-2"><span className="font-bold">Peso Bold (700):</span> Se usa para títulos, botones y el texto del logo.</p>
              </div>
            </div>
          </div>

          {/* Colors Section */}
          <div>
            <h2 className="text-2xl font-headline font-bold mb-4 text-center">Paleta de Colores</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="rounded-lg border p-6">
                <div className="w-full h-24 rounded-md bg-primary mb-3"></div>
                <h3 className="font-bold text-lg">Primario (Azul)</h3>
                <p className="text-sm text-muted-foreground">Usado en "BahiaBlanca", botones y enlaces.</p>
                <p className="text-sm font-mono mt-2">HEX: #0055ff</p>
                <p className="text-sm font-mono">HSL: 220 100% 50%</p>
              </div>
              <div className="rounded-lg border p-6">
                <div className="w-full h-24 rounded-md bg-foreground mb-3"></div>
                <h3 className="font-bold text-lg">Foreground (Oscuro)</h3>
                <p className="text-sm text-muted-foreground">Usado en "Oficios" y texto principal.</p>
                <p className="text-sm font-mono mt-2">HEX: #0a121c</p>
                <p className="text-sm font-mono">HSL: 224 71.4% 4.1%</p>
              </div>
              <div className="rounded-lg border p-6">
                <div className="w-full h-24 rounded-md bg-accent mb-3"></div>
                <h3 className="font-bold text-lg">Acento (Verde)</h3>
                <p className="text-sm text-muted-foreground">Usado para resaltar elementos secundarios.</p>
                <p className="text-sm font-mono mt-2">HEX: #2a8a4a</p>
                <p className="text-sm font-mono">HSL: 145 63% 35%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
