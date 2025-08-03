import { z } from 'zod';

export const ParsedPortfolioAssetSchema = z.object({
    name: z.string().describe("The name of the asset."),
    symbol: z.string().describe("The stock or crypto ticker symbol."),
    category: z.enum(['Stock', 'Crypto', 'Real Estate']).describe("The category of the asset."),
    quantity: z.number().describe("The quantity of the asset held."),
    purchasePrice: z.number().describe("The price at which the asset was purchased."),
    currentPrice: z.number().describe("The current market price of the asset."),
});
export type ParsedPortfolioAsset = z.infer<typeof ParsedPortfolioAssetSchema>;

export type Asset = {
  id: string;
  name: string;
  symbol: string;
  category: 'Stock' | 'Crypto' | 'Real Estate';
  price: number;
  change24h: number;
  holdings: number;
  value: number;
  icon: string;
};

// Represents an asset as analyzed by the AI from user-uploaded data.
// It's a simpler version of the original Asset type.
export type AnalyzedAsset = {
  name: string;
  symbol: string;
  category: 'Stock' | 'Crypto' | 'Real Estate';
  holdings: number;
  value: number;
  change24h: number;
};


export type PerformanceDataPoint = {
  date: string;
  value: number;
};

export type PortfolioData = {
  totalValue: number;
  change24h: number;
  change24hPercentage: number;
  assets: Asset[];
  performanceHistory: {
    '1D': PerformanceDataPoint[];
    '7D': PerformanceDataPoint[];
    '30D': PerformanceDataPoint[];
    'YTD': PerformanceDataPoint[];
    '1Y': PerformanceDataPoint[];
  };
};
