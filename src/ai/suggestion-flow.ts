
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const SuggestionInputSchema = z.object({
  query: z.string().describe('The user\'s search query.'),
  categories: z.array(z.string()).describe('The list of available trade categories.'),
});

const SuggestionOutputSchema = z.object({
  suggestedTrades: z.array(z.string()).describe('A list of up to 3 relevant trade categories from the provided list.'),
});

const suggestionPrompt = ai.definePrompt(
  {
    name: 'suggestionPrompt',
    input: { schema: SuggestionInputSchema },
    output: { schema: SuggestionOutputSchema },
    prompt: `You are an expert at understanding user needs for home services and categorizing them. Your goal is to help users find the right type of professional.

A user has searched for: "{{query}}".

Based on their search query, analyze the user's intent and suggest the most relevant trade categories from the provided list. Think about what kind of professional would perform the task described. For example, if the user searches for "leaky faucet", you should suggest "Plomería". If they search for "fix blinds", you should suggest "Reparaciones".

Suggest a maximum of 3 categories. If none of the available categories seem even remotely relevant, return an empty list.

Available Categories:
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

    // Filter the suggestions to ensure they are valid categories
    const validSuggestions = output?.suggestedTrades.filter(trade => 
      input.categories.includes(trade)
    ) || [];

    return { suggestedTrades: validSuggestions };
  }
);

export async function getSuggestions(query: string, categories: string[]): Promise<string[]> {
  const result = await suggestionFlow({ query, categories });
  return result.suggestedTrades;
}
