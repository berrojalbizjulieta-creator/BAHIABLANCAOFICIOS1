
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { esAdmin } from '@/lib/auth';
import { doc, getDoc } from 'firebase/firestore';


export function useAdminAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isProfessional, setIsProfessional] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        // Check admin status from email
        const adminStatus = esAdmin(user.email ?? undefined);
        setIsAdmin(adminStatus);
        
        // Check role from Firestore
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setIsProfessional(userData.role === 'professional');
        } else {
            // This might happen for the admin user if not in DB
            // or if there's a delay in DB creation
            setIsProfessional(false);
        }

      } else {
        setIsAdmin(false);
        setIsProfessional(false);
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);


  return { user, isAdmin, isProfessional, loading };
}
