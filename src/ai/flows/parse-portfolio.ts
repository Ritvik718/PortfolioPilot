
'use server';
/**
 * @fileOverview An AI flow for parsing unstructured portfolio data.
 *
 * - parsePortfolio - Parses a raw data string into a structured list of assets.
 * - ParsePortfolioInput - The input type for the parsePortfolio function.
 * - ParsePortfolioOutput - The return type for the parsePortfolio function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { ParsedPortfolioAssetSchema } from '@/lib/data';

const ParsePortfolioInputSchema = z.object({
  portfolioData: z
    .string()
    .describe('A string containing the user\'s portfolio data, typically in CSV or JSON format. This data should include details like asset names, quantities, purchase prices, and current prices to enable calculations.'),
});
export type ParsePortfolioInput = z.infer<typeof ParsePortfolioInputSchema>;

const ParsePortfolioOutputSchema = z.object({
  assets: z.array(ParsedPortfolioAssetSchema).describe("An array of assets parsed from the user's data."),
});
export type ParsePortfolioOutput = z.infer<typeof ParsePortfolioOutputSchema>;


export async function parsePortfolio(input: ParsePortfolioInput): Promise<ParsePortfolioOutput> {
  return parsePortfolioFlow(input);
}

const prompt = ai.definePrompt({
  name: 'parsePortfolioPrompt',
  input: {schema: ParsePortfolioInputSchema},
  output: {schema: ParsePortfolioOutputSchema},
  config: {
    temperature: 0,
  },
  prompt: `You are a data extraction AI. Your only task is to parse the user's raw portfolio data into a structured JSON format.

Portfolio Data:
{{{portfolioData}}}

Instructions:
1.  Carefully analyze the provided portfolio data. The data contains asset names, quantities, purchase prices (cost basis), and current market prices.
2.  Extract every asset and represent it in the specified JSON output format.
3.  Do not perform any calculations, aggregations, or analysis. Your only job is to parse the data provided into the structured format.
4.  Ensure all fields in the output schema are populated correctly based on the source data.`,
});

const parsePortfolioFlow = ai.defineFlow(
  {
    name: 'parsePortfolioFlow',
    inputSchema: ParsePortfolioInputSchema,
    outputSchema: ParsePortfolioOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);

    if (!output) {
      throw new Error("AI failed to parse portfolio data.");
    }

    return output;
  }
);
