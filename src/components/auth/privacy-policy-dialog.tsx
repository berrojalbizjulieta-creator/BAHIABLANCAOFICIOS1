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

interface PrivacyPolicyDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const privacyContent = `
POLÍTICA DE PRIVACIDAD DE BAHIABLANCAOFICIOS

Fecha de última actualización: 28 de julio de 2024

En BahiaBlancaOficios, respetamos su privacidad y nos comprometemos a proteger sus datos personales. Esta política de privacidad le informará sobre cómo cuidamos sus datos personales cuando visita nuestro sitio web (independientemente de dónde lo visite) y le informará sobre sus derechos de privacidad y cómo la ley lo protege.

1. Información que recopilamos

Podemos recopilar, usar, almacenar y transferir diferentes tipos de datos personales sobre usted, que hemos agrupado de la siguiente manera:

* Datos de Identidad: incluye nombre, apellido, nombre de usuario o identificador similar.
* Datos de Contacto: incluye dirección de correo electrónico y números de teléfono.
* Datos Técnicos: incluye la dirección del protocolo de Internet (IP), sus datos de inicio de sesión, el tipo y la versión del navegador, la configuración y ubicación de la zona horaria, los tipos y versiones de los complementos del navegador, el sistema operativo y la plataforma, y ​​otra tecnología en los dispositivos que utiliza para acceder a este sitio web.
* Datos de Perfil: incluye su nombre de usuario y contraseña, compras o pedidos realizados por usted, sus intereses, preferencias, comentarios y respuestas a encuestas.
* Datos de Uso: incluye información sobre cómo utiliza nuestro sitio web, productos y servicios.

2. Cómo se recopilan sus datos personales

Utilizamos diferentes métodos para recopilar datos de y sobre usted, que incluyen:

* Interacciones directas: Puede darnos su identidad y datos de contacto al completar formularios o al comunicarse con nosotros por correo postal, teléfono, correo electrónico u otro medio.
* Tecnologías o interacciones automatizadas: A medida que interactúa con nuestro sitio web, podemos recopilar automáticamente Datos técnicos sobre su equipo, acciones de navegación y patrones.

3. Cómo usamos sus datos personales

Usaremos sus datos personales solo cuando la ley nos lo permita. Más comúnmente, usaremos sus datos personales en las siguientes circunstancias:

* Para registrarlo como un nuevo cliente o profesional.
* Para administrar nuestra relación con usted, lo que incluirá notificarle sobre cambios en nuestros términos o política de privacidad.
* Para permitirle participar en sorteos, concursos o completar una encuesta.
* Para administrar y proteger nuestro negocio y este sitio web (incluida la resolución de problemas, el análisis de datos, las pruebas, el mantenimiento del sistema, el soporte, la generación de informes y el alojamiento de datos).

4. Divulgación de sus datos personales

Es posible que tengamos que compartir sus datos personales con las partes que se establecen a continuación para los fines establecidos en la tabla del párrafo 3 anterior.

* Proveedores de servicios que brindan servicios de TI y administración de sistemas.
* Asesores profesionales que incluyen abogados, banqueros, auditores y aseguradores que brindan servicios de consultoría, banca, legales, de seguros y contables.
* Autoridades reguladoras y otras autoridades que exigen la presentación de informes de actividades de procesamiento en determinadas circunstancias.

5. Seguridad de los datos

Hemos implementado medidas de seguridad apropiadas para evitar que sus datos personales se pierdan, usen o accedan de forma no autorizada, se alteren o se divulguen accidentalmente.

6. Sus derechos legales

Según las leyes de protección de datos, usted tiene derechos en relación con sus datos personales, incluido el derecho a solicitar acceso, corrección, eliminación, restricción, transferencia, y de oponerse al procesamiento, a la portabilidad de los datos y (donde el fundamento legal del procesamiento es el consentimiento) a retirar el consentimiento.

Si desea ejercer alguno de los derechos establecidos anteriormente, contáctenos.

`;

export default function PrivacyPolicyDialog({ isOpen, onOpenChange }: PrivacyPolicyDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Política de Privacidad</DialogTitle>
          <DialogDescription>
            Tu privacidad es importante para nosotros. Aquí te explicamos cómo manejamos tus datos.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-96 pr-6">
            <div className="prose prose-sm dark:prose-invert whitespace-pre-wrap">
                {privacyContent}
            </div>
        </ScrollArea>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Entendido</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
