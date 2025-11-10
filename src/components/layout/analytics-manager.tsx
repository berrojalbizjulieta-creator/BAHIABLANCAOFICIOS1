'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

interface AnalyticsManagerProps {
  gaId: string;
}

export default function AnalyticsManager({ gaId }: AnalyticsManagerProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // useEffect for GA and Meta Pixel
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

  // useEffect for internal visit tracking
  useEffect(() => {
    // We track visits in all environments for internal stats
    const trackView = () => {
        fetch('/api/track-view', {
            method: 'POST',
            keepalive: true, // Ensures the request is sent even if the user navigates away
        }).catch(error => {
            console.error('Failed to track page view:', error);
        });
    };

    // Track view on initial load
    trackView();

    // The pathname dependency ensures it runs on every route change
  }, [pathname]);


  return null;
}
