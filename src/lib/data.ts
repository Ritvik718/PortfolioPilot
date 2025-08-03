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
