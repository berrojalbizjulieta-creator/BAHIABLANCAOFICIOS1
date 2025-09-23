
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { esAdmin } from '@/lib/auth';


export function useAdminAuth() {
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in.
        if (esAdmin(user.email ?? undefined)) {
          setIsAdminUser(true);
        } else {
          // User is not an admin, redirect.
          router.replace('/');
        }
      } else {
        // User is signed out, redirect to login.
        router.replace('/login');
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [router]);

  return { isAdmin: isAdminUser, loading };
}
