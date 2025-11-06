'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function AnalyticsManager() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Only run analytics in production
    if (process.env.NODE_ENV !== 'production') {
      return;
    }

    const url = pathname + searchParams.toString();

    // Google Analytics Event
    if (process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && typeof window.gtag === 'function') {
      window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, {
        page_path: url,
      });
    }

    // Meta Pixel Event
    if (process.env.NEXT_PUBLIC_META_PIXEL_ID && typeof window.fbq === 'function') {
        window.fbq('track', 'PageView');
    }

  }, [pathname, searchParams]);

  return null;
}
