// src/lib/firestore-queries.ts

import { collection, query, where, orderBy, getDocs, Firestore, Query, DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Professional, Testimonial, Review } from '@/lib/types';


/**
 * Busca profesionales en Firestore, filtrando por categoría.
 * La ordenación y filtrados adicionales (como disponibilidad) se deben hacer en el cliente.
 *
 * @param firestore La instancia de Firestore (normalmente `db`).
 * @param selectedCategoryIds Un array de IDs de categoría para filtrar.
 * @returns Una promesa que resuelve con un array de objetos Professional.
 */
export async function getProfessionalsFilteredAndSorted(
    firestore: Firestore,
    selectedCategoryIds: number[] = []
): Promise<Professional[]> {
    let professionalsQuery: Query<DocumentData> = collection(firestore, 'professionalsDetails');

    // 1. Filtrar por CATEGORÍA (si el usuario ha seleccionado alguna)
    if (selectedCategoryIds.length > 0) {
        professionalsQuery = query(
            professionalsQuery,
            where('categoryIds', 'array-contains-any', selectedCategoryIds)
        );
    }
    
    // NOTA: Se elimina la ordenación por 'avgRating' y el filtro por 'dayAvailability'
    // para evitar la necesidad de un índice compuesto. Estos se aplicarán en el cliente.

    // 2. Ejecutar la Consulta en Firestore.
    const querySnapshot = await getDocs(professionalsQuery);

    // 3. Mapear (convertir) los resultados y filtrar solo por estado activo/suscripción.
    const professionals = querySnapshot.docs
        .map(doc => {
            const data = doc.data();
            // Es importante convertir los Timestamps de Firestore a objetos Date de JS
            if (data.registrationDate && data.registrationDate.toDate) {
                data.registrationDate = data.registrationDate.toDate();
            }
            if (data.lastPaymentDate && data.lastPaymentDate.toDate) {
                data.lastPaymentDate = data.lastPaymentDate.toDate();
            }
            return {
                id: doc.id,
                ...data
            } as Professional;
        })
        .filter(prof => {
            // Filtrado básico por activo y suscripción en el lado del servidor/función
            return prof.isActive && prof.subscription?.isSubscriptionActive;
        });

    return professionals;
}


/**
 * Obtiene todas las reseñas para un profesional específico.
 * @param firestore La instancia de Firestore.
 * @param professionalId El ID del profesional.
 * @returns Una promesa que resuelve con un array de objetos de reseña (Review).
 */
export async function getReviewsForProfessional(firestore: Firestore, professionalId: string): Promise<Review[]> {
    if (!professionalId) {
        return [];
    }

    const reviewsRef = collection(firestore, 'reviews');
    // Se elimina el orderBy para evitar la necesidad de un índice compuesto mientras se construye.
    const q = query(
        reviewsRef,
        where('professionalId', '==', professionalId)
    );

    const querySnapshot = await getDocs(q);

    const reviews = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
        } as Review;
    });

    // Se ordena manualmente en el lado del cliente (servidor de Next.js en este caso).
    reviews.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return reviews;
}
