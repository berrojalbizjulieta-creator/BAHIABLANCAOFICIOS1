// Declaración global para que TypeScript no se queje de 'gtag'
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

// Obtener el ID de seguimiento desde las variables de entorno
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || '';

/**
 * Registra una vista de página en Google Analytics.
 * Se asegura de que solo se ejecute en el navegador.
 * @param url La URL de la página a registrar.
 */
export const pageview = (url: string) => {
  if (typeof window !== "undefined" && typeof window.gtag !== "undefined" && GA_TRACKING_ID) {
    window.gtag("config", GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

/**
 * Registra un evento personalizado en Google Analytics.
 * @param action La acción del evento (ej: 'click', 'submit').
 * @param params Un objeto con los parámetros del evento.
 */
export const event = (action: string, params: Record<string, any>) => {
  if (typeof window !== "undefined" && typeof window.gtag !== "undefined" && GA_TRACKING_ID) {
    window.gtag("event", action, params);
  }
};
