'use server';

/**
 * @fileOverview This file defines a Genkit flow to suggest relevant trade categories based on a free-form text prompt.
 *
 * - suggestTradesFromPrompt - A function that takes a user's text prompt and returns a list of suggested trade categories.
 * - SuggestTradesFromPromptInput - The input type for the suggestTradesFromPrompt function.
 * - SuggestTradesFromPromptOutput - The return type for the suggestTradesFromPrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestTradesFromPromptInputSchema = z.object({
  prompt: z.string().describe('A free-form text prompt describing the service needed.'),
});
export type SuggestTradesFromPromptInput = z.infer<typeof SuggestTradesFromPromptInputSchema>;

const SuggestTradesFromPromptOutputSchema = z.object({
  suggestedTrades: z
    .array(z.string())
    .describe('A list of suggested trade categories based on the prompt.'),
});
export type SuggestTradesFromPromptOutput = z.infer<typeof SuggestTradesFromPromptOutputSchema>;

export async function suggestTradesFromPrompt(input: SuggestTradesFromPromptInput): Promise<SuggestTradesFromPromptOutput> {
  return suggestTradesFromPromptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestTradesFromPromptPrompt',
  input: {schema: SuggestTradesFromPromptInputSchema},
  output: {schema: SuggestTradesFromPromptOutputSchema},
  prompt: `Analyze the user's prompt and suggest relevant trade categories (oficios).
  User Prompt: {{{prompt}}}
  Your response MUST be ONLY a JSON array of strings. Each string should be a trade category.
  Example of a valid response: ["Electricista", "Fontanero", "Gasista"]
  If no relevant trades are found, return an empty array: []
  Do not include any other text, explanation, or markdown.`,
});

const suggestTradesFromPromptFlow = ai.defineFlow(
  {
    name: 'suggestTradesFromPromptFlow',
    inputSchema: SuggestTradesFromPromptInputSchema,
    outputSchema: SuggestTradesFromPromptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
