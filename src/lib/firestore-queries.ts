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

    // 1. Filtrar solo por profesionales activos y con suscripción activa
     professionalsQuery = query(
        professionalsQuery,
        where('isActive', '==', true),
        where('subscription.isSubscriptionActive', '==', true)
    );


    // 2. Filtrar por CATEGORÍA (si el usuario ha seleccionado alguna)
    if (selectedCategoryIds.length > 0) {
        // 'array-contains-any' busca documentos que tengan CUALQUIERA de las categorías seleccionadas.
        professionalsQuery = query(
            professionalsQuery,
            where('categoryIds', 'array-contains-any', selectedCategoryIds)
        );
    }

    // 3. Filtrar por DISPONIBILIDAD del día actual (si no se pidió incluir los no disponibles)
    if (!includeUnavailable) {
        const today = new Date();
        // Esto obtiene el día de la semana abreviado en español (ej. "Dom", "Lun", "Mar").
        const shortDay = today.toLocaleString('es-ES', { weekday: 'short' }).slice(0, 3);

        // Añadimos el filtro por día si existe en dayAvailability y está en 'true'
        professionalsQuery = query(
            professionalsQuery,
            where(`dayAvailability.${shortDay}`, '==', true) 
        );
    }

    // 4. Ordenar los resultados por PUNTUACIÓN PROMEDIO (avgRating).
    // 'desc' significa descendente, es decir, los profesionales con más estrellas aparecerán primero.
    professionalsQuery = query(
        professionalsQuery,
        orderBy('avgRating', 'desc')
    );

    // 5. Ejecutar la Consulta en Firestore.
    const querySnapshot = await getDocs(professionalsQuery);

    // 6. Mapear (convertir) los resultados a un formato que tu aplicación pueda usar.
    const professionals = querySnapshot.docs.map(doc => {
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
