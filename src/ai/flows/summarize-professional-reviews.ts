// SummarizeProfessionalReviews.ts
'use server';

/**
 * @fileOverview Summarizes professional reviews using Genkit.
 *
 * - summarizeProfessionalReviews - A function that summarizes reviews for a given professional.
 * - SummarizeProfessionalReviewsInput - The input type for the summarizeProfessionalReviews function.
 * - SummarizeProfessionalReviewsOutput - The return type for the summarizeProfessionalReviews function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeProfessionalReviewsInputSchema = z.object({
  reviews: z.array(z.string()).describe('An array of customer reviews for a professional.'),
  professionalName: z.string().describe('The name of the professional.'),
});
export type SummarizeProfessionalReviewsInput = z.infer<typeof SummarizeProfessionalReviewsInputSchema>;

const SummarizeProfessionalReviewsOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the reviews.'),
});
export type SummarizeProfessionalReviewsOutput = z.infer<typeof SummarizeProfessionalReviewsOutputSchema>;

export async function summarizeProfessionalReviews(input: SummarizeProfessionalReviewsInput): Promise<SummarizeProfessionalReviewsOutput> {
  return summarizeProfessionalReviewsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeProfessionalReviewsPrompt',
  input: {schema: SummarizeProfessionalReviewsInputSchema},
  output: {schema: SummarizeProfessionalReviewsOutputSchema},
  prompt: `You are an AI assistant specializing in summarizing customer reviews for professionals.

  Please provide a concise summary of the following reviews for {{professionalName}}. Focus on the overall sentiment and key feedback points.

  Reviews:
  {{#each reviews}}
  - {{{this}}}
  {{/each}}
  `,
});

const summarizeProfessionalReviewsFlow = ai.defineFlow(
  {
    name: 'summarizeProfessionalReviewsFlow',
    inputSchema: SummarizeProfessionalReviewsInputSchema,
    outputSchema: SummarizeProfessionalReviewsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
