import { z } from 'zod';
import {
  CompanyProfileSchema,
  RecommendationTrendSchema,
  BasicFinancialsSchema,
} from '@/lib/market-data';

export const GetStockDetailsInputSchema = z.object({
  symbol: z.string().describe('The stock ticker symbol.'),
});
export type GetStockDetailsInput = z.infer<typeof GetStockDetailsInputSchema>;

export const GetStockDetailsOutputSchema = z.object({
  profile: CompanyProfileSchema.optional(),
  recommendations: z.array(RecommendationTrendSchema).optional(),
  financials: BasicFinancialsSchema.optional(),
});
export type GetStockDetailsOutput = z.infer<
  typeof GetStockDetailsOutputSchema
>;
