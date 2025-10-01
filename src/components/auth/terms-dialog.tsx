'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TermsDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const termsContent = `
TÉRMINOS Y CONDICIONES DE USO

Aceptación de los Términos

Al registrarse en BahiaBlancaOficios, los USUARIOS aceptan estos Términos y Condiciones, que regulan el uso de la plataforma, los servicios ofrecidos y la relación entre CLIENTES y PROFESIONALES.

El uso de la plataforma implica la aceptación de todas las cláusulas, sin perjuicio de lo dispuesto por la legislación argentina vigente.

Registro y Contratación

La inscripción de USUARIOS PROFESIONALES, locales o empresas podrá ser de pago después de un período inicial de prueba de 6 meses o, posteriormente, desde el inicio según la modalidad vigente.

El registro implica la aceptación de estos Términos y Condiciones.

Los USUARIOS PROFESIONALES, locales o empresas serán responsables de mantener sus datos y contenidos actualizados y verídicos.

El registro de USUARIOS CLIENTES es totalmente gratuito, sin ningún costo para acceder a los datos de contacto de los PROFESIONALES.

Los USUARIOS PROFESIONALES podrán contratar servicios opcionales de publicidad o destacación, que permitirán aparecer como recomendados o resaltados dentro de la plataforma. La activación de estos servicios será voluntaria y exclusiva para PROFESIONALES, sin generar ningún cargo a los USUARIOS CLIENTES.

BahiaBlancaOficios podrá rechazar o eliminar perfiles de USUARIOS sin expresión de causa, sin generar derecho a reclamo.

Responsabilidad de los USUARIOS

Los USUARIOS PROFESIONALES son responsables frente a BahiaBlancaOficios y terceros por todos los contenidos que incluyan en su perfil, información de contacto, imágenes, descripción de servicios y cualquier otro contenido.

Deben garantizar que los contenidos no sean ilícitos, ofensivos, discriminatorios o contrarios a la moral y buenas costumbres.

Los USUARIOS PROFESIONALES deberán mantener indemne a BahiaBlancaOficios frente a cualquier reclamo, gasto o acción legal derivada del contenido de sus perfiles o de la relación con USUARIOS CLIENTES.

BahiaBlancaOficios no será responsable de ningún daño directo o indirecto, lucro cesante o pérdida de oportunidad que pudiera surgir de la interacción entre USUARIOS CLIENTES y PROFESIONALES.

Publicidad y Destacados

Los USUARIOS PROFESIONALES podrán contratar servicios opcionales de publicidad dentro de la plataforma para aparecer como recomendados o resaltados.

El orden o visibilidad de los perfiles destacados podrá determinarse mediante criterios objetivos definidos por la plataforma, incluyendo la inversión realizada en publicidad.

No se generarán cargos a los USUARIOS PROFESIONALES que no contraten servicios de destacación ni a los USUARIOS CLIENTES.

Protección de Datos

Los datos personales de los USUARIOS CLIENTES y PROFESIONALES serán tratados conforme a la normativa argentina vigente de protección de datos.

Los USUARIOS PROFESIONALES solo recibirán los datos de contacto de USUARIOS CLIENTES que soliciten información sobre sus servicios, y deberán utilizarlos únicamente con fines de contacto y contratación directa.

BahiaBlancaOficios adoptará medidas técnicas y operativas adecuadas para proteger los datos personales de todos los USUARIOS.

Pagos e Impuestos

Los USUARIOS PROFESIONALES son responsables de abonar los impuestos que pudieran corresponder por la inscripción o contratación de servicios pagos dentro de la plataforma.

El registro y acceso de USUARIOS CLIENTES es gratuito y no genera obligación tributaria alguna.

Cancelación y Suspensión

BahiaBlancaOficios podrá suspender, eliminar o bloquear perfiles de USUARIOS PROFESIONALES en caso de incumplimiento de estos Términos y Condiciones, o de comportamientos ilícitos o que afecten a otros USUARIOS.

Los USUARIOS PROFESIONALES no tendrán derecho a reclamo por la suspensión o eliminación de sus perfiles, salvo que medie error atribuible a la plataforma.

Propiedad Intelectual

Todos los contenidos de la plataforma, incluyendo logos, diseño, códigos, textos e imágenes, son propiedad de BahiaBlancaOficios o de terceros que han autorizado su uso.

Los USUARIOS PROFESIONALES y CLIENTES se comprometen a no reproducir, distribuir ni modificar ningún contenido sin autorización expresa.

Ley Aplicable y Jurisdicción

Estos Términos y Condiciones se rigen por las leyes de la República Argentina.

Cualquier conflicto o disputa será sometido a los tribunales ordinarios de Bahía Blanca, renunciando a cualquier otro fuero o jurisdicción.
`;

export default function TermsDialog({ isOpen, onOpenChange }: TermsDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Términos y Condiciones</DialogTitle>
          <DialogDescription>
            Lee atentamente los términos y condiciones de uso de la plataforma.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-96 pr-6">
            <div className="prose prose-sm dark:prose-invert whitespace-pre-wrap">
                {termsContent.replace(/\[Nombre de la plataforma]/g, 'BahiaBlancaOficios')}
            </div>
        </ScrollArea>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>He leído y acepto</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
