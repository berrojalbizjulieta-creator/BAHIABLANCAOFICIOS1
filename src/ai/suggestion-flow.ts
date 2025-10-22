'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { CATEGORIES, CATEGORY_KEYWORDS, CATEGORY_SYNONYMS } from '@/lib/data';
import Fuse from 'fuse.js';

const SuggestionInputSchema = z.object({
  query: z.string().describe('La búsqueda del usuario.'),
  categories: z.array(z.string()).describe('La lista de oficios disponibles.'),
});

const SuggestionOutputSchema = z.object({
  suggestedTrades: z.array(z.string()).describe('Una lista de 1 a 3 oficios relevantes de la lista proporcionada.'),
});

const keywordsContext = Object.values(CATEGORY_KEYWORDS)
  .map(cat => `- ${cat.name}: ${cat.keywords.join(', ')}`)
  .join('\n');

const suggestionPrompt = ai.definePrompt(
  {
    name: 'suggestionPrompt',
    input: { schema: SuggestionInputSchema },
    output: { schema: SuggestionOutputSchema },
    prompt: `
Eres un asistente experto en categorizar necesidades de servicios para el hogar. Tu tarea es analizar la búsqueda del usuario ("{{query}}") y devolver una lista de los oficios más relevantes de la lista de 'Oficios Disponibles'.

Considera herramientas (ej: "martillo"), problemas (ej: "canilla que gotea") y verbos (ej: "arreglar", "instalar") para deducir la categoría correcta.

Usa la siguiente lista de palabras clave como contexto principal:
${keywordsContext}

Oficios Disponibles:
{{#each categories}}
- {{this}}
{{/each}}

IMPORTANTE:
1. Tu objetivo principal es entender la INTENCIÓN del usuario, no solo buscar coincidencias literales.
2. Devuelve entre 1 y 3 oficios. Si hay varias opciones relevantes, devuelve hasta 3.
3. Si no estás seguro, devuelve el oficio que consideres más probable. Tu respuesta nunca debe estar vacía; siempre debe contener al menos una sugerencia.
4. Usa solo los nombres EXACTOS de la lista de Oficios Disponibles.
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
    return llmResponse.output || { suggestedTrades: [] };
  }
);

// Configuración de Fuse.js para búsqueda "fuzzy"
const fuse = new Fuse(CATEGORIES, {
  keys: ['name'],
  threshold: 0.3, // Umbral más estricto para coincidencias más precisas
});


export async function getSuggestions(query: string, categories: string[]): Promise<string[]> {
  const normalizedQuery = query.trim().toLowerCase();
  if (normalizedQuery.length < 3) return [];

  const suggestions = new Set<string>();

  // 1. Búsqueda por sinónimos directos (muy rápido y preciso)
  for (const synonym in CATEGORY_SYNONYMS) {
    if (normalizedQuery.includes(synonym)) {
      const categoryName = CATEGORY_SYNONYMS[synonym as keyof typeof CATEGORY_SYNONYMS];
      if (categories.includes(categoryName)) {
        suggestions.add(categoryName);
      }
    }
  }

  // 2. Búsqueda "Fuzzy" en las categorías (para errores de tipeo)
  const fuseResults = fuse.search(normalizedQuery);
  fuseResults.forEach(result => {
    if (categories.includes(result.item.name)) {
      suggestions.add(result.item.name);
    }
  });

  // 3. Consulta a la IA para una comprensión más profunda
  try {
    const aiResult = await suggestionFlow({ query: normalizedQuery, categories });
    if (aiResult.suggestedTrades && aiResult.suggestedTrades.length > 0) {
      aiResult.suggestedTrades.forEach(trade => {
        // Validar que la sugerencia de la IA realmente existe
        if (categories.includes(trade)) {
          suggestions.add(trade);
        }
      });
    }
  } catch (error) {
    console.error('❌ Error en el flujo de IA para sugerencias:', error);
    // No hacer nada, la búsqueda continúa con los resultados de sinónimos/fuzzy
  }

  // Si después de todo no hay resultados, y la consulta es una sola palabra,
  // se hace una última búsqueda con umbral más flexible.
  if (suggestions.size === 0 && !normalizedQuery.includes(' ')) {
      const relaxedFuse = new Fuse(CATEGORIES, { keys: ['name'], threshold: 0.4 });
      const relaxedResults = relaxedFuse.search(normalizedQuery);
      if (relaxedResults.length > 0) {
          suggestions.add(relaxedResults[0].item.name);
      }
  }


  return Array.from(suggestions);
}
