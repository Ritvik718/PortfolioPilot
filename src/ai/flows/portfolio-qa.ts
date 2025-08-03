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
  prompt: `You are a sophisticated AI financial advisor. Your role is to provide clear, insightful, and accurate answers to questions about a user's investment portfolio.

  Use the following portfolio data (in JSON format) to answer the user's question. The data includes total portfolio value, 24-hour performance changes, a list of assets with their individual details, and performance history over various timeframes.

  When answering, adopt a helpful and professional tone. If the question is ambiguous, ask for clarification. If the data doesn't support a definitive answer, say so. Your primary goal is to help the user understand their investments better.

  Portfolio Data:
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
