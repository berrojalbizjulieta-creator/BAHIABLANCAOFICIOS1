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
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const adminStatus = esAdmin(currentUser.email ?? undefined);
        setIsAdmin(adminStatus);
        
        // If user is admin, we don't need to check firestore for professional role
        if (adminStatus) {
            setIsProfessional(false);
            setLoading(false);
            return;
        }

        try {
            const userDocRef = doc(db, 'users', currentUser.uid);
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists()) {
              const userData = userDocSnap.data();
              setIsProfessional(userData.role === 'professional');
            } else {
              setIsProfessional(false);
            }
        } catch (error) {
            console.error("Error fetching user role from Firestore:", error);
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
