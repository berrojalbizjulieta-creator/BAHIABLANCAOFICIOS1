'use client';

import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { Card } from '../ui/card';
import { AD_BANNERS } from '@/lib/data';
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Skeleton } from '../ui/skeleton';

interface AdBanner {
    id: string;
    imageUrl: string;
    alt: string;
    imageHint: string;
}

export default function AdBanner() {
  const [banners, setBanners] = useState<AdBanner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'adBanners'));
        const bannersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AdBanner));
        setBanners(bannersData);
      } catch (error) {
        console.error("Error fetching banners: ", error);
        // Fallback to static data in case of error
        setBanners(AD_BANNERS);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  if (loading) {
    return (
       <section className="py-8">
            <div className="container mx-auto px-4 md:px-6">
                <Skeleton className="h-40 w-full" />
            </div>
       </section>
    )
  }

  if (banners.length === 0) {
      return null; // Don't render anything if there are no banners
  }

  return (
    <section className="py-8">
      <div className="container mx-auto px-4 md:px-6">
        <Carousel
          plugins={[
            Autoplay({
              delay: 4000,
              stopOnInteraction: true,
            }),
          ]}
          className="w-full"
          opts={{
            loop: true,
          }}
        >
          <CarouselContent>
            {banners.map(banner => (
              <CarouselItem key={banner.id}>
                <Card className="overflow-hidden">
                  <div className="relative aspect-[3/1] w-full">
                    <Image
                      src={banner.imageUrl}
                      alt={banner.alt}
                      fill
                      className="object-cover"
                      data-ai-hint={banner.imageHint}
                    />
                  </div>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}