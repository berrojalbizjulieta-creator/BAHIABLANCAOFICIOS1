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
  prompt: `You are an expert in matching user needs to trade categories.

  Based on the following user prompt, suggest a list of relevant trade categories (oficios) that would help them find the right professional.

  Prompt: {{{prompt}}}

  Your response should be a list of trade categories that best match the user's needs.
  Each item in the list should be short and to the point. Do not respond with full sentences, only the list of trade categories.
  Example: ["Electricista", "Fontanero", "Gasista"]
  `,
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
