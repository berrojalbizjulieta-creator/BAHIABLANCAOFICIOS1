'use client';

import { PT_Sans } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Toaster } from '@/components/ui/toaster';
import { Suspense } from 'react';
import Script from 'next/script';
import AnalyticsManager from '@/components/layout/analytics-manager';


const ptSans = PT_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-pt-sans',
});

// IDs hardcodeados
const GA_MEASUREMENT_ID = "G-C9Z3XLX3WS"; 
const GA_ADS_ID = "AW-16621938550";
const META_PIXEL_ID = "1343716414100500";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      {/* Scripts for Google Analytics and Meta Pixel */}
      {process.env.NODE_ENV === 'production' && (
        <>
          {/* Google Analytics */}
          <Script
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ADS_ID}`}
          />
          <Script id="google-analytics-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              // Configura tanto Google Ads como Google Analytics
              gtag('config', '${GA_ADS_ID}');
              gtag('config', '${GA_MEASUREMENT_ID}', {
                send_page_view: false
              });
            `}
          </Script>

          {/* Meta Pixel */}
          <Script id="meta-pixel-init" strategy="afterInteractive">
              {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${META_PIXEL_ID}');
              // Se elimina el fbq('track', 'PageView') inicial.
              // AnalyticsManager se encargará de todos los PageView.
              `}
          </Script>
          <noscript>
            <img height="1" width="1" style={{display:'none'}}
              src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
            />
          </noscript>
        </>
      )}


      <body className={`${ptSans.variable} font-body antialiased`}>
        {/* Component to manage navigation events */}
        <Suspense fallback={null}>
          <AnalyticsManager gaId={GA_MEASUREMENT_ID} />
        </Suspense>

        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <Toaster />
      </body>
    </html>
  );
}
