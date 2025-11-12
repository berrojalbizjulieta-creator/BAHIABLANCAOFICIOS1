'use client';

// Esta función se puede llamar desde cualquier parte de la aplicación para reportar una conversión de Google Ads.
export const reportGtagConversion = (url?: string) => {
  // Primero, nos aseguramos de que la función gtag de Google exista en el navegador.
  if (typeof window.gtag === 'function') {
    const callback = () => {
      if (url) {
        window.open(url, '_blank'); // Abrir en una nueva pestaña después de enviar el evento.
      }
    };

    // Llama al evento de conversión de Google Ads.
    // IMPORTANTE: Reemplaza 'AW-TU_ID_DE_ADS/LABEL_DE_LA_CONVERSION' con tus propios valores de Google.
    gtag('event', 'conversion', {
      'send_to': 'AW-16621938550/tDRYCMbXleoZENqg2dM9',
      'event_callback': callback,
      'event_timeout': 2000 // Si Google no responde en 2 segundos, abre la URL de todas formas.
    });
    
    return false; // Previene la navegación por defecto si se usa en un enlace.
  } else {
    // Si gtag no existe (ej. bloqueado por el navegador), simplemente abrimos la URL para no interrumpir al usuario.
    console.warn('Google Tag (gtag.js) no está disponible. Abriendo URL directamente.');
    if (url) {
      window.open(url, '_blank');
    }
  }
};
