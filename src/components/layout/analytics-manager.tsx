'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

interface AnalyticsManagerProps {
  gaId: string;
}

export default function AnalyticsManager({ gaId }: AnalyticsManagerProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Only run analytics in production
    if (process.env.NODE_ENV !== 'production' || !gaId || gaId.startsWith('TU_ID')) {
      return;
    }

    const url = pathname + searchParams.toString();

    // Google Analytics Event
    if (typeof window.gtag === 'function') {
      window.gtag('config', gaId, {
        page_path: url,
      });
    }

    // Meta Pixel Event
    if (typeof window.fbq === 'function') {
        window.fbq('track', 'PageView');
    }

  }, [pathname, searchParams, gaId]);

  return null;
}
