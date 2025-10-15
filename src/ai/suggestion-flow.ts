
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { CATEGORY_SPECIALTIES } from '@/lib/data';

const SuggestionInputSchema = z.object({
  query: z.string().describe('La búsqueda del usuario.'),
  categories: z.array(z.string()).describe('La lista de oficios disponibles.'),
});

const SuggestionOutputSchema = z.object({
  suggestedTrades: z.array(z.string()).describe('Una lista de hasta 3 oficios relevantes de la lista proporcionada.'),
});

// Construir una lista de especialidades para el prompt
const specialtiesContext = Object.values(CATEGORY_SPECIALTIES)
  .map(cat => `- ${cat.name}: ${cat.specialties.join(', ')}`)
  .join('\n');

const suggestionPrompt = ai.definePrompt(
  {
    name: 'suggestionPrompt',
    input: { schema: SuggestionInputSchema },
    output: { schema: SuggestionOutputSchema },
    prompt: `Eres un experto en entender las necesidades de servicios para el hogar y categorizarlas. Tu objetivo es ayudar a los usuarios a encontrar el tipo de profesional correcto, incluso si no usan el término exacto.

Un usuario ha buscado: "{{query}}".

Basándote en su búsqueda, analiza la intención y sugiere los oficios más relevantes de la lista de 'Oficios Disponibles'. Piensa conceptualmente: ¿qué tipo de profesional haría esta tarea?

Para ayudarte a decidir, aquí tienes una lista de especialidades asociadas a cada oficio:
${specialtiesContext}

Por ejemplo:
- Si la búsqueda es "canilla que gotea", sugiere "Plomería".
- Si es "arreglar persiana", sugiere "Reparaciones".
- Si es "poner durlock", sugiere "Albañilería".

Sugiere un máximo de 3 oficios. Si ninguno de los oficios disponibles parece remotamente relevante, devuelve una lista vacía.

Oficios Disponibles:
{{#each categories}}
- {{this}}
{{/each}}
`,
  },
);

const suggestionFlow = ai.defineFlow(
  {
    name: 'suggestionFlow',
    inputSchema: SuggestionInputSchema,
    outputSchema: SuggestionOutputSchema,
  },
  async (input) => {
    const llmResponse = await suggestionPrompt(input);
    const output = llmResponse.output;

    // Normaliza el texto para hacer la comparación más flexible (ignora mayúsculas/minúsculas y acentos)
    const normalize = (text: string) =>
        text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    // Mapea categorías normalizadas a su nombre original
    const categoryMap = new Map(input.categories.map(cat => [normalize(cat), cat]));

    const validSuggestions = output?.suggestedTrades
        .map(trade => {
            const normalizedTrade = normalize(trade);
            // Devuelve el nombre original de la categoría si hay una coincidencia normalizada
            return categoryMap.get(normalizedTrade);
        })
        .filter((trade): trade is string => !!trade) || []; // Filtra los undefined y asegura el tipo

    return { suggestedTrades: [...new Set(validSuggestions)] }; // Usa un Set para evitar duplicados
  }
);

export async function getSuggestions(query: string, categories: string[]): Promise<string[]> {
  const result = await suggestionFlow({ query, categories });
  return result.suggestedTrades;
}
