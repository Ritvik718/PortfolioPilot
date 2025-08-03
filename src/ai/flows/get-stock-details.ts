'use server';
/**
 * @fileOverview A flow to retrieve detailed information about a stock symbol.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import {
  getCompanyProfile2,
  getRecommendationTrends,
  getBasicFinancials,
  CompanyProfileSchema,
  RecommendationTrendSchema,
  BasicFinancialsSchema,
} from '@/lib/market-data';
import type { GetStockDetailsInput, GetStockDetailsOutput } from './get-stock-details.types';
import { GetStockDetailsInputSchema, GetStockDetailsOutputSchema } from './get-stock-details.types';


const getCompanyProfileTool = ai.defineTool(
  {
    name: 'getCompanyProfile',
    description: "Get a company's profile information.",
    inputSchema: z.object({ symbol: z.string() }),
    outputSchema: CompanyProfileSchema,
  },
  async ({ symbol }) => {
    return await getCompanyProfile2(symbol);
  }
);

const getRecommendationsTool = ai.defineTool(
  {
    name: 'getRecommendationTrends',
    description: "Get a company's analyst recommendation trends.",
    inputSchema: z.object({ symbol: z.string() }),
    outputSchema: z.array(RecommendationTrendSchema),
  },
  async ({ symbol }) => {
    return await getRecommendationTrends(symbol);
  }
);

const getFinancialsTool = ai.defineTool(
  {
    name: 'getBasicFinancials',
    description: 'Get a company\'s basic financials.',
    inputSchema: z.object({ symbol: z.string() }),
    outputSchema: BasicFinancialsSchema,
  },
  async ({ symbol }) => {
    return await getBasicFinancials(symbol);
  }
);

export async function getStockDetails(
  input: GetStockDetailsInput
): Promise<GetStockDetailsOutput> {
  return await getStockDetailsFlow(input);
}

const getStockDetailsFlow = ai.defineFlow(
  {
    name: 'getStockDetailsFlow',
    inputSchema: GetStockDetailsInputSchema,
    outputSchema: GetStockDetailsOutputSchema,
    tools: [getCompanyProfileTool, getRecommendationsTool, getFinancialsTool],
  },
  async ({ symbol }) => {
    const [profile, recommendations, financials] = await Promise.all([
      getCompanyProfileTool(symbol),
      getRecommendationsTool(symbol),
      getFinancialsTool(symbol),
    ]);

    return {
      profile,
      recommendations,
      financials,
    };
  }
);
