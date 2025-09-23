'use server';

/**
 * @fileOverview This file defines a Genkit flow to create a mailto link for professional verification.
 *
 * - createVerificationMailto - A function that takes verification data and returns a mailto link.
 * - CreateVerificationMailtoInput - The input type for the createVerificationMailto function.
 * - CreateVerificationMailtoOutput - The return type for the createVerificationMailto function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const CreateVerificationMailtoInputSchema = z.object({
  cuil: z.string().describe('The CUIL of the professional.'),
  professionalName: z.string().describe('The name of the professional.'),
});
export type CreateVerificationMailtoInput = z.infer<typeof CreateVerificationMailtoInputSchema>;

const CreateVerificationMailtoOutputSchema = z.object({
  mailto: z.string().describe('The generated mailto link.'),
});
export type CreateVerificationMailtoOutput = z.infer<typeof CreateVerificationMailtoOutputSchema>;

export async function createVerificationMailto(
  input: CreateVerificationMailtoInput
): Promise<CreateVerificationMailtoOutput> {
  return createVerificationMailtoFlow(input);
}

const createVerificationMailtoFlow = ai.defineFlow(
  {
    name: 'createVerificationMailtoFlow',
    inputSchema: CreateVerificationMailtoInputSchema,
    outputSchema: CreateVerificationMailtoOutputSchema,
  },
  async ({ cuil, professionalName }) => {
    const to = 'agustinarturogiardino@gmail.com';
    const subject = `Solicitud de Verificación - ${professionalName}`;
    const body = `Hola,

Adjunto mis documentos para la verificación de mi perfil en OficiosBB.

Nombre: ${professionalName}
CUIL: ${cuil}

Por favor, no olvide adjuntar los siguientes archivos:
1. Foto del DNI (Frente)
2. Foto del DNI (Dorso)
3. Selfie sosteniendo su DNI

Gracias,
${professionalName}
`;

    const mailto = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    return { mailto };
  }
);
