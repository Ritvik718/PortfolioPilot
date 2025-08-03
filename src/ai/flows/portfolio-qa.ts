'use server';
/**
 * @fileOverview A portfolio question answering AI agent.
 *
 * - portfolioQA - A function that answers questions about a user's portfolio.
 * - PortfolioQAInput - The input type for the portfolioQA function.
 * - PortfolioQAOutput - The return type for the portfolioQA function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PortfolioQAInputSchema = z.object({
  question: z.string().describe('The question about the portfolio.'),
  portfolioData: z.string().describe('A JSON string containing both the parsed assets and the calculated insights of the portfolio.'),
});
export type PortfolioQAInput = z.infer<typeof PortfolioQAInputSchema>;

const PortfolioQAOutputSchema = z.object({
  answer: z.string().describe('The answer to the question about the portfolio.'),
});
export type PortfolioQAOutput = z.infer<typeof PortfolioQAOutputSchema>;

export async function portfolioQA(input: PortfolioQAInput): Promise<PortfolioQAOutput> {
  return portfolioQAFlow(input);
}

const prompt = ai.definePrompt({
  name: 'portfolioQAPrompt',
  input: {schema: PortfolioQAInputSchema},
  output: {schema: PortfolioQAOutputSchema},
  prompt: `You are a sophisticated AI financial advisor and helpful assistant. Your primary role is to provide clear, insightful, and accurate answers to questions about a user's investment portfolio. However, you can also answer general knowledge questions.

  If the user's question is about their portfolio, use the following portfolio data (in JSON format) to answer. This data includes pre-calculated insights (like total value, gains, etc.) and a detailed list of assets.

  IMPORTANT: When the user asks for a calculated value (like total value, gain/loss, etc.), ALWAYS use the pre-calculated value from the JSON data. Do NOT perform the calculation yourself. Your primary goal is to provide answers based *only* on the data provided.

  If the question is NOT about the portfolio, answer it as a general helpful assistant.

  If the portfolio data doesn't support a definitive answer to a finance question, say so. Adopt a helpful and professional tone.

  Portfolio Data (if applicable):
  {{{portfolioData}}}

  User's Question:
  "{{{question}}}"

  Your Answer:`,
});

const portfolioQAFlow = ai.defineFlow(
  {
    name: 'portfolioQAFlow',
    inputSchema: PortfolioQAInputSchema,
    outputSchema: PortfolioQAOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
