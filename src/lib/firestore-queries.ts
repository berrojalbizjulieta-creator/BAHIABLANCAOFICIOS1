// src/lib/firestore-queries.ts

import { collection, query, where, orderBy, getDocs, Firestore, Query, DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Professional } from '@/lib/types';


/**
 * Busca profesionales en Firestore, filtrando por categoría, disponibilidad del día actual
 * y ordenándolos por su puntuación promedio (avgRating).
 *
 * @param firestore La instancia de Firestore (normalmente `db`).
 * @param selectedCategoryIds Un array de IDs de categoría para filtrar.
 * @param includeUnavailable Si es true, ignora el filtro de disponibilidad por día.
 * @returns Una promesa que resuelve con un array de objetos Professional.
 */
export async function getProfessionalsFilteredAndSorted(
    firestore: Firestore,
    selectedCategoryIds: number[] = [], // Por ejemplo, si el usuario selecciona "Plomeros" (ID 14)
    includeUnavailable: boolean = false  // Si queremos mostrar TODOS los profesionales sin importar el día
): Promise<Professional[]> {
    let professionalsQuery: Query<DocumentData> = collection(firestore, 'professionalsDetails');

    // 1. Filtrar por CATEGORÍA (si el usuario ha seleccionado alguna)
    if (selectedCategoryIds.length > 0) {
        // 'array-contains-any' busca documentos que tengan CUALQUIERA de las categorías seleccionadas.
        professionalsQuery = query(
            professionalsQuery,
            where('categoryIds', 'array-contains-any', selectedCategoryIds)
        );
    }
    
    // 3. Ordenar los resultados por PUNTUACIÓN PROMEDIO (avgRating).
    // 'desc' significa descendente, es decir, los profesionales con más estrellas aparecerán primero.
    professionalsQuery = query(
        professionalsQuery,
        orderBy('avgRating', 'desc')
    );

    // 4. Ejecutar la Consulta en Firestore.
    const querySnapshot = await getDocs(professionalsQuery);

    // 5. Mapear (convertir) los resultados y filtrar en el cliente.
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
            // Filtrado por activo y suscripción
            const isActiveAndSubscribed = prof.isActive && prof.subscription?.isSubscriptionActive;
            if (!isActiveAndSubscribed) return false;

            // Filtrado por disponibilidad del día (si es necesario)
            if (!includeUnavailable) {
                const today = new Date();
                const shortDay = today.toLocaleString('es-ES', { weekday: 'short' }).slice(0, 3);
                return prof.dayAvailability?.[shortDay] === true;
            }

            return true;
        });

    return professionals;
}
