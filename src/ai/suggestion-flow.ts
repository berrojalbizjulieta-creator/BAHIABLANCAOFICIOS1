'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { CATEGORY_KEYWORDS } from '@/lib/data';

const SuggestionInputSchema = z.object({
  query: z.string().describe('La búsqueda del usuario.'),
  categories: z.array(z.string()).describe('La lista de oficios disponibles.'),
});

const SuggestionOutputSchema = z.object({
  suggestedTrades: z.array(z.string()).describe('Una lista de hasta 3 oficios relevantes de la lista proporcionada.'),
});

// Construimos un contexto claro para el modelo con las palabras clave
const keywordsContext = Object.values(CATEGORY_KEYWORDS)
  .map(cat => `- ${cat.name}: ${cat.keywords.join(', ')}`)
  .join('\n');

const suggestionPrompt = ai.definePrompt(
  {
    name: 'suggestionPrompt',
    input: { schema: SuggestionInputSchema },
    output: { schema: SuggestionOutputSchema },
    prompt: `
Eres un asistente experto en categorizar necesidades de servicios del hogar.

Tu tarea es analizar la búsqueda del usuario ("{{query}}") y devolver una lista de los oficios más relevantes
de la lista de 'Oficios Disponibles'. NO inventes nombres nuevos, devuelve exactamente los que están en la lista.

Usa la siguiente lista de palabras clave para ayudarte a asociar la búsqueda del usuario con un oficio:
${keywordsContext}

Oficios Disponibles:
{{#each categories}}
- {{this}}
{{/each}}

IMPORTANTE:
1. Devuelve un máximo de 3 oficios.
2. Usa solo los nombres EXACTOS de la lista de Oficios Disponibles.
3. Si no hay coincidencias claras, devuelve una lista vacía.

Tu respuesta debe ser una lista JSON válida con los nombres exactos de los oficios.
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
    // Siempre usar el modelo de IA para obtener las sugerencias
    const llmResponse = await suggestionPrompt(input);
    const suggestedTrades = llmResponse.output?.suggestedTrades || [];
    
    // Devolver un array único de sugerencias válidas
    return { suggestedTrades: [...new Set(suggestedTrades)] };
  }
);

export async function getSuggestions(query: string, categories: string[]): Promise<string[]> {
  try {
    const result = await suggestionFlow({ query, categories });
    return result.suggestedTrades;
  } catch (error) {
    console.error('❌ Error ejecutando getSuggestions:', error);
    return [];
  }
}
