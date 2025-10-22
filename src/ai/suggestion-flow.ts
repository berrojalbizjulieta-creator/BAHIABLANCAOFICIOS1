'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { CATEGORY_KEYWORDS } from '@/lib/data'; // <-- CAMBIO: Usar las keywords separadas

const SuggestionInputSchema = z.object({
  query: z.string().describe('La búsqueda del usuario.'),
  categories: z.array(z.string()).describe('La lista de oficios disponibles.'),
});

const SuggestionOutputSchema = z.object({
  suggestedTrades: z.array(z.string()).describe('Una lista de hasta 3 oficios relevantes de la lista proporcionada.'),
});

// 🧩 Tabla de sinónimos comunes (la IA suele devolver estas palabras)
const synonyms: Record<string, string> = {
  plomero: 'Plomería',
  fontanero: 'Plomería',
  electricidad: 'Electricista',
  gasista: 'Gasista Matriculado',
  albañil: 'Albañilería',
  pintor: 'Pintores',
  cerrajero: 'Cerrajería',
  carpintero: 'Carpintería',
  techista: 'Reparaciones', // No hay categoría "Techista"
  jardinero: 'Jardinería',
  herrero: 'Herrería',
  vidriero: 'Vidriería',
  fotografo: 'Fotografía', // Añadido
  durlock: 'Albañilería',
  yesero: 'Albañilería',
  persianas: 'Reparaciones',
  mantenimiento: 'Reparaciones',
  limpieza: 'Limpieza',
};

// 🔤 Función de normalización para comparar texto
const normalize = (text: string) =>
  text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

// 🧱 Construimos un contexto claro para el modelo
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

Tu tarea es analizar la búsqueda del usuario y devolver una lista de los oficios más relevantes
de la lista de 'Oficios Disponibles'. NO inventes nombres nuevos, devuelve exactamente los que están en la lista.

---

Búsqueda del usuario: "{{query}}"

Oficios Disponibles:
{{#each categories}}
- {{this}}
{{/each}}

Lista de palabras clave para ayudarte a asociar:
${keywordsContext}

Ejemplos:
- "canilla que gotea" → Plomería
- "poner enchufe nuevo" → Electricista
- "hacer pared de durlock" → Albañilería
- "persiana trabada" → Reparaciones

IMPORTANTE:
1. Devuelve un máximo de 3 oficios.
2. Usa solo los nombres EXACTOS de la lista.
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
    // Usamos siempre el modelo de IA para obtener las sugerencias iniciales
    const llmResponse = await suggestionPrompt(input);
    const rawOutput = llmResponse.output;

    const rawSuggestions = rawOutput?.suggestedTrades || [];
    
    // Crear un mapa de categorías normalizadas para una búsqueda eficiente
    const categoryMap = new Map(input.categories.map(cat => [normalize(cat), cat]));

    // Añadir la consulta original del usuario a las sugerencias para validar si es un sinónimo directo
    const allPossibleSuggestions = [...new Set([input.query, ...rawSuggestions])];

    // Filtrar y validar las sugerencias de la IA contra las categorías reales
    const validSuggestions = allPossibleSuggestions
      .map(trade => {
        const normalizedTrade = normalize(trade);

        // Primero, buscar si es un sinónimo directo
        if (synonyms[normalizedTrade]) {
          return synonyms[normalizedTrade];
        }

        // Luego, buscar una coincidencia directa en las categorías
        if (categoryMap.has(normalizedTrade)) {
          return categoryMap.get(normalizedTrade);
        }

        // Finalmente, verificar si la sugerencia contiene un sinónimo
        const synonymMatch = Object.keys(synonyms).find(key => normalizedTrade.includes(normalize(key)));
        if (synonymMatch) {
            return synonyms[synonymMatch];
        }

        return undefined; // No se encontró coincidencia
      })
      .filter((trade): trade is string => !!trade); // Filtrar undefined

    return { suggestedTrades: [...new Set(validSuggestions)] }; // Usar Set para evitar duplicados
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
