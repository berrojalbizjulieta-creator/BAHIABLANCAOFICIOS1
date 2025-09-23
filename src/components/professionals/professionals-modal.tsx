import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { PROFESSIONALS } from '@/lib/data';
import type { Category } from '@/lib/types';
import ProfessionalCard from './professional-card';
import { ScrollArea } from '../ui/scroll-area';

interface ProfessionalsModalProps {
  category: Category | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfessionalsModal({
  category,
  isOpen,
  onClose,
}: ProfessionalsModalProps) {
  if (!category) return null;

  const filteredProfessionals = PROFESSIONALS.filter(
    (p) => p.categoryId === category.id
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl h-[90vh] flex flex-col">
        <DialogHeader className="pr-6">
          <DialogTitle className="text-2xl font-headline flex items-center gap-3">
            <category.icon className="w-7 h-7 text-primary" />
            {category.name}
          </DialogTitle>
          <DialogDescription>{category.description}</DialogDescription>
        </DialogHeader>
        <div className="flex-1 min-h-0">
        <ScrollArea className="h-full pr-4 -mr-4">
          {filteredProfessionals.length > 0 ? (
            <div className="space-y-4 py-4">
              {filteredProfessionals.map((professional) => (
                <ProfessionalCard
                  key={professional.id}
                  professional={professional}
                />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <p>
                No hay profesionales disponibles en esta categoría por el
                momento.
              </p>
            </div>
          )}
        </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
