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
import { X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
  const [currentSelection, setCurrentSelection] = useState<string[]>(selectedSpecialties);
  const { toast } = useToast();

  useEffect(() => {
    // Reset selection when dialog opens with new props
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
            Selecciona hasta 10 etiquetas que describan mejor tu trabajo. Esto
            ayudará a los clientes a encontrarte.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
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
