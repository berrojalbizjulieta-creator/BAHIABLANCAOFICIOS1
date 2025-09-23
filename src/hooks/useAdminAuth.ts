
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// MOCK: En una app real, esto vendría de Firebase Auth
const MOCK_USER = {
  isLoggedIn: true,
  role: 'admin', // Cambiar a 'user' o 'professional' para probar el acceso denegado
};

// En una aplicación real con Firebase, usarías algo como:
// import { getAuth, onIdTokenChanged } from "firebase/auth";
//
// const auth = getAuth();
// onIdTokenChanged(auth, async (user) => {
//   if (user) {
//     const idTokenResult = await user.getIdTokenResult();
//     const userRole = idTokenResult.claims.role;
//     // ...lógica para guardar el rol
//   }
// });

export function useAdminAuth() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      // Simulamos una llamada a un servicio de autenticación
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const { isLoggedIn, role } = MOCK_USER;

      if (isLoggedIn && role === 'admin') {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
        // Si no es admin, lo redirigimos a la página de inicio.
        router.replace('/');
      }
      setLoading(false);
    };

    checkAuth();
  }, [router]);

  return { isAdmin, loading };
}
