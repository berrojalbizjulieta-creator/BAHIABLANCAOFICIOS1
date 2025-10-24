'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Input } from '../ui/input';
import { useToast } from '@/hooks/use-toast';
import { Plus } from 'lucide-react';

interface SpecialtiesDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  categoryName: string;
  availableSpecialties: string[];
  selectedSpecialties: string[];
  onSave: (newSpecialties: string[]) => void;
}

export default function SpecialtiesDialog({
  isOpen,
  onOpenChange,
  categoryName,
  availableSpecialties,
  selectedSpecialties,
  onSave,
}: SpecialtiesDialogProps) {
  const [currentSelection, setCurrentSelection] = useState<string[]>([]);
  const [customSpecialty, setCustomSpecialty] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      setCurrentSelection(selectedSpecialties);
    }
  }, [isOpen, selectedSpecialties]);

  const toggleSpecialty = (specialty: string) => {
    setCurrentSelection((prev) => {
      if (prev.includes(specialty)) {
        return prev.filter((s) => s !== specialty);
      }
      if (prev.length >= 10) {
        toast({
          title: 'Límite alcanzado',
          description: 'Puedes seleccionar hasta 10 especialidades.',
          variant: 'destructive',
        });
        return prev;
      }
      return [...prev, specialty];
    });
  };

  const handleAddCustom = () => {
      const newSpecialty = customSpecialty.trim();
      if (newSpecialty && !currentSelection.includes(newSpecialty)) {
        if (currentSelection.length >= 10) {
            toast({
                title: 'Límite alcanzado',
                description: 'Puedes seleccionar hasta 10 especialidades.',
                variant: 'destructive',
            });
            return;
        }
        setCurrentSelection(prev => [...prev, newSpecialty]);
        setCustomSpecialty('');
      }
  }
  
  const handleCustomInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCustom();
    }
  };


  const handleSave = () => {
    onSave(currentSelection);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Especialidades de {categoryName}
          </DialogTitle>
          <DialogDescription>
            Selecciona hasta 10 etiquetas que describan mejor tu trabajo. También puedes añadir las tuyas.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-6">
            <div>
                <h4 className="text-sm font-semibold mb-3 text-muted-foreground">Sugerencias</h4>
                <div className="flex flex-wrap gap-3">
                    {availableSpecialties.map((specialty) => (
                        <Badge
                            key={specialty}
                            onClick={() => toggleSpecialty(specialty)}
                            variant={currentSelection.includes(specialty) ? 'default' : 'secondary'}
                            className={cn(
                                'cursor-pointer text-base py-1 px-3',
                                currentSelection.includes(specialty) && 'bg-primary hover:bg-primary/90'
                            )}
                        >
                            {specialty}
                        </Badge>
                    ))}
                </div>
            </div>
             <div>
                <h4 className="text-sm font-semibold mb-3 text-muted-foreground">Añadir especialidad personalizada</h4>
                 <div className="flex w-full max-w-sm items-center space-x-2">
                    <Input 
                        type="text" 
                        placeholder="Ej: Trabajos en altura"
                        value={customSpecialty}
                        onChange={(e) => setCustomSpecialty(e.target.value)}
                        onKeyDown={handleCustomInputKeyDown}
                    />
                    <Button type="button" onClick={handleAddCustom}>
                        <Plus className="mr-2"/> Añadir
                    </Button>
                </div>
            </div>
             <div>
                <h4 className="text-sm font-semibold mb-3 text-muted-foreground">Tus Especialidades ({currentSelection.length}/10)</h4>
                 {currentSelection.length > 0 ? (
                    <div className="flex flex-wrap gap-3">
                        {currentSelection.map((specialty) => (
                            <Badge
                                key={specialty}
                                variant="default"
                                className="text-base py-1 pl-3 pr-2 bg-primary/20 text-primary-foreground border-primary/50"
                            >
                                {specialty}
                                <button onClick={() => toggleSpecialty(specialty)} className="ml-2 rounded-full hover:bg-black/20 p-0.5">
                                    <X className="h-3 w-3" />
                                </button>
                            </Badge>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground italic">Aún no has seleccionado ninguna especialidad.</p>
                )}
            </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Guardar Especialidades</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
