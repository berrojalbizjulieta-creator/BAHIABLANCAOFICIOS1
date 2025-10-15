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
const specialtiesContext = Object.values(CATEGORY_SPECIALTIES)
  .map(cat => `- ${cat.name}: ${cat.specialties.join(', ')}`)
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

Lista de especialidades para ayudarte:
${specialtiesContext}

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
    const llmResponse = await suggestionPrompt(input);
    const rawOutput = llmResponse.output;

    // console.log('🧠 Respuesta cruda del modelo:', rawOutput);

    const rawSuggestions = rawOutput?.suggestedTrades || [];

    // 1. Mapear sinónimos y normalizar las sugerencias de la IA
    const mappedSuggestions = rawSuggestions.map((s) => {
      const clean = normalize(s);
      // Buscar en sinónimos primero
      const synonymMatch = Object.keys(synonyms).find(key => clean.includes(normalize(key)));
      if (synonymMatch) {
        return synonyms[synonymMatch];
      }
      return s; // Devolver original si no hay sinónimo
    });
    
    // 2. Crear un mapa de categorías normalizadas para una búsqueda eficiente
    const categoryMap = new Map(input.categories.map(cat => [normalize(cat), cat]));

    // 3. Filtrar y validar las sugerencias mapeadas contra las categorías reales
    const validSuggestions = mappedSuggestions
      .map(trade => {
        const normalizedTrade = normalize(trade);
        return categoryMap.get(normalizedTrade);
      })
      .filter((trade): trade is string => !!trade); // Filtrar undefined

    // console.log('✅ Sugerencias finales:', [...new Set(validSuggestions)]);
    
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
