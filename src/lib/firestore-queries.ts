// src/lib/firestore-queries.ts

import { collection, query, where, orderBy, getDocs, Firestore, Query, DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Professional, Testimonial, Review } from '@/lib/types';


/**
 * Obtiene profesionales, opcionalmente filtrados por si son destacados o no.
 *
 * @param firestore La instancia de Firestore.
 * @param categoryId El ID de la categoría para filtrar.
 * @param featured `true` para obtener solo destacados, `false` para no destacados, `undefined` para todos.
 * @returns Una promesa que resuelve con un array de objetos Professional.
 */
export async function getFeaturedProfessionalsForCategory(
    firestore: Firestore,
    categoryId: number,
    featured: boolean
): Promise<Professional[]> {
    let professionalsQuery: Query<DocumentData> = collection(firestore, 'professionalsDetails');

    const constraints = [
        where('categoryIds', 'array-contains', categoryId),
        where('isActive', '==', true),
        where('subscription.isSubscriptionActive', '==', true),
        where('isFeatured', '==', featured)
    ];

    professionalsQuery = query(professionalsQuery, ...constraints);

    const querySnapshot = await getDocs(professionalsQuery);

    const professionals = querySnapshot.docs.map(doc => {
        const data = doc.data();
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
    });

    return professionals;
}


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
    const constraints = [
        where('isActive', '==', true),
        where('subscription.isSubscriptionActive', '==', true)
    ];
    if (selectedCategoryIds.length > 0) {
        constraints.push(where('categoryIds', 'array-contains-any', selectedCategoryIds));
    }
    
    professionalsQuery = query(professionalsQuery, ...constraints);

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

    // Se ordena manually en el lado del cliente (servidor de Next.js en este caso).
    reviews.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return reviews;
}
