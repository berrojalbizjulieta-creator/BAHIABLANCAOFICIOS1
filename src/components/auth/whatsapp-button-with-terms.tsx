'use client';

import { useState } from 'react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Phone } from 'lucide-react';
import { doc, increment, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface WhatsappButtonWithTermsProps {
  phone?: string;
  professionalName?: string;
  professionalId?: string;
  categoryName?: string;
}

const termsText = `Los presentes Términos y Condiciones establecen el régimen jurídico aplicable al acceso y visualización de información de contacto, incluyendo pero no limitándose a números telefónicos, enlaces a WhatsApp, direcciones de correo electrónico y cualquier otro dato que permita la comunicación con terceros, que se encuentra publicada en la plataforma digital denominada BahiaBlancaOficios. Dicho acceso se otorga a usuarios no registrados, en adelante “el VISITANTE”. La utilización del servicio de visualización implica la aceptación lisa, llana e irrevocable de las cláusulas que se enuncian a continuación.

El VISITANTE reconoce y acepta que la totalidad de los datos de contacto disponibles en la plataforma son proporcionados de manera directa, unilateral y bajo exclusiva responsabilidad de los prestadores de servicios, comercios o trabajadores independientes que allí se publican, en adelante “los PROFESIONALES”. BahiaBlancaOficios no participa en la creación, edición, selección, supervisión, verificación ni validación de dichos datos, ni garantiza su veracidad, integridad, exactitud, actualidad, licitud o pertinencia. El mero acceso a la información no genera relación contractual, societaria, laboral, de representación, intermediación ni vínculo jurídico alguno entre el VISITANTE y la plataforma.

Respecto de los perfiles identificados con un escudo azul dentro de la plataforma, el VISITANTE reconoce expresamente que dicha insignia únicamente indica que el PROFESIONAL ha presentado una imagen de su Documento Nacional de Identidad y una fotografía personal, y que BahiaBlancaOficios ha verificado la coincidencia entre ambos.
Dicha verificación no implica, bajo ninguna circunstancia, certificación de identidad más allá de esa correspondencia visual, ni garantiza idoneidad técnica, profesionalismo, títulos habilitantes, antecedentes, experiencia, calidad del servicio, conducta ética, situación fiscal, cumplimiento normativo o cualquier otro aspecto relativo al PROFESIONAL o a su actividad. La insignia no constituye recomendación, aval, certificación ni garantía de ningún tipo.

BahiaBlancaOficios no asume obligación, responsabilidad, deber de seguridad, deber de vigilancia ni garantía expresa o tácita respecto de los efectos, consecuencias, derivaciones o contingencias que pudieran resultar del contacto, comunicación o eventual contratación entre el VISITANTE y el PROFESIONAL. En tal sentido, el VISITANTE reconoce que cualquier interacción, negociación, acuerdo verbal o escrito, contratación de servicios, ejecución de trabajos, intercambio de información y, en general, toda conducta derivada del uso de los datos obtenidos de la plataforma se desarrolla exclusivamente bajo su propio riesgo y responsabilidad, quedando BahiaBlancaOficios absolutamente eximida de toda intervención, control o participación.

La presente exoneración de responsabilidad comprende, en carácter enunciativo y no taxativo, la totalidad de daños y perjuicios de cualquier tipo y naturaleza que pudieran surgir, incluyendo daños materiales, personales, económicos, morales, indirectos, consecuenciales, lucro cesante, pérdida de chance, trabajos defectuosos o incompletos, incumplimientos contractuales, conductas negligentes, imprudentes, engañosas o ilícitas de los PROFESIONALES o del propio VISITANTE, así como cualquier otro supuesto que derive de la relación entre ambos. BahiaBlancaOficios no garantiza idoneidad técnica, títulos habilitantes, trayectoria, experiencia, antecedentes, cumplimiento normativo, situación fiscal ni la calidad o aptitud de los servicios ofrecidos por los PROFESIONALES, aun en aquellos casos en que cuenten con el mencionado escudo azul.

El VISITANTE se obliga a utilizar los datos de contacto exclusivamente para los fines específicos que motivaron su publicación, es decir, para establecer un contacto inicial orientado a la consulta o eventual contratación de servicios. Queda terminantemente prohibido cualquier uso desviado, abusivo, ilícito, ofensivo o contrario a la moral y buenas costumbres, incluyendo pero no limitado al envío de spam, hostigamiento, amenazas, uso con fines comerciales no autorizados, recopilación sistemática de datos o cualquier práctica que afecte la privacidad, integridad o derechos de los PROFESIONALES. BahiaBlancaOficios se reserva la facultad de limitar, restringir o denegar el acceso a la visualización de datos en caso de verificarse incumplimientos o conductas que pudieren afectar el normal funcionamiento de la plataforma.

A los únicos fines estadísticos, de seguridad operativa o de mejora del servicio, BahiaBlancaOficios podrá registrar datos técnicos vinculados al acceso del VISITANTE, tales como fecha, hora y dispositivo utilizado, sin que ello implique identificación directa ni tratamiento de datos personales sensibles, y sin generar obligación alguna hacia el VISITANTE.

BahiaBlancaOficios se reserva el derecho de modificar, actualizar o sustituir total o parcialmente las cláusulas contenidas en el presente documento en cualquier momento, siendo plenamente aplicables desde el instante mismo de su publicación en la plataforma. La continuidad en la utilización de la función de visualización de contacto implica la aceptación automática de la versión vigente al momento del acceso.

Al seleccionar la opción “Ver contacto”, “Mostrar WhatsApp” o cualquier mecanismo destinado a exhibir los datos proporcionados por los PROFESIONALES, el VISITANTE declara bajo juramento que ha leído íntegramente este documento, que comprende su contenido jurídico y que acepta de manera voluntaria y sin reservas todas sus disposiciones, asumiendo plena responsabilidad por el uso de la información obtenida.`;

const normalizeWhatsAppNumber = (phone: string): string => {
    let cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('549')) return cleaned;
    if (cleaned.startsWith('9') && cleaned.length === 11) return `54${cleaned}`;
    if (cleaned.length === 10 && cleaned.startsWith('291')) return `549${cleaned}`;
    if (cleaned.length > 9) return `54${cleaned}`;
    return cleaned;
}

export default function WhatsappButtonWithTerms({
  phone,
  professionalName,
  professionalId,
  categoryName,
}: WhatsappButtonWithTermsProps) {
  const { user, loading } = useAdminAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpenWhatsApp = () => {
    if (!phone) return;
    const defaultCategory = 'profesional';
    const message = encodeURIComponent(`Hola ${professionalName}, te contacto desde BahiaBlancaOficios por tus servicios de ${categoryName || defaultCategory}.`);
    const normalizedPhone = normalizeWhatsAppNumber(phone);
    const url = `https://wa.me/${normalizedPhone}?text=${message}`;
    
    window.open(url, '_blank');

    if (professionalId) {
      try {
        fetch("/api/increment-whatsapp-click", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ professionalId }),
          
          // ---- Compatibilidad máxima ----
          mode: "no-cors",     // Evita bloqueos de Google Ads / Safari / iOS
          cache: "no-store",    // Evita que se lo coma la caché
          credentials: "omit",  // Evita cookies bloqueadas
          keepalive: true       // Asegura envío incluso si navegan o cierran
        });

      } catch (error) {
        // No mostramos nada al usuario
        console.log("Click count request failed silently:", error);
      }
    }
  };

  const handleButtonClick = () => {
    // If user is logged in, open WhatsApp directly.
    if (user) {
      handleOpenWhatsApp();
      return;
    }
    // If user is not logged in, open the terms dialog.
    setIsDialogOpen(true);
  };

  const handleAcceptAndContinue = () => {
    setIsDialogOpen(false);
    handleOpenWhatsApp();
  };

  if (loading) {
    return <Button disabled><Phone className="mr-2" /> Whatsapp</Button>;
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <Button onClick={handleButtonClick} disabled={!phone}>
        <Phone className="mr-2" /> Whatsapp
      </Button>

      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Términos y Condiciones de Contacto</DialogTitle>
          <DialogDescription>
            Antes de continuar, por favor lee y acepta los siguientes términos sobre el uso de la información de contacto.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-72 pr-6">
          <div className="prose prose-sm dark:prose-invert whitespace-pre-wrap">
            {termsText}
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button onClick={handleAcceptAndContinue} className='bg-blue-600 hover:bg-blue-700'>Aceptar y Ver Contacto</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
