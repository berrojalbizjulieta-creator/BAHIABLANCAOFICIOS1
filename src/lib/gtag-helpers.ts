'use client';

import { event } from "./gtag";

export function reportGtagConversion() {
  const hasGtag = typeof window !== "undefined" && typeof window.gtag !== "undefined";

  if (!hasGtag) {
    console.warn("Google Tag (gtag.js) NO está disponible. (No se pudo trackear la conversión de WhatsApp)");
    return false;
  }
  
  // El ID de conversión y la etiqueta deben coincidir con lo que está configurado en Google Ads.
  // Es una buena práctica tener esto también como variable de entorno si cambia con frecuencia.
  const conversionLabel = 'tDRYCMbXleoZENqg2dM9'; 
  const gaAdsId = 'AW-16621938550';
  
  event("conversion", {
    send_to: `${gaAdsId}/${conversionLabel}`,
  });

  return true;
}
