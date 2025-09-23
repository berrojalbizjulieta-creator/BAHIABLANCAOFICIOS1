
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { esAdmin } from '@/lib/auth';

// En una app real, el rol 'professional' vendría de tu base de datos (Firestore)
// Por ahora, lo simulamos para la demo.
const MOCK_PROFESSIONAL_EMAILS = ['profesional@email.com'];

export function useAdminAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const isAdmin = esAdmin(user?.email ?? undefined);
  // Esta es una simulación. En una app real, deberías consultar tu base de datos
  // para saber si un usuario es profesional o cliente.
  const isProfessional = user && MOCK_PROFESSIONAL_EMAILS.includes(user.email || '');

  return { user, isAdmin, isProfessional, loading };
}
