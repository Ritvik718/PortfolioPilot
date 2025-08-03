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
  portfolioData: z.string().describe('The portfolio data in JSON format.'),
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
  prompt: `You are a financial advisor answering questions about a user's portfolio.

  Use the following portfolio data to answer the question.

  Portfolio Data: {{{portfolioData}}}

  Question: {{{question}}}

  Answer:`,
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
