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
    YTD: PerformanceDataPoint[];
    '1Y': PerformanceDataPoint[];
  };
};

function generatePerformanceData(days: number, initialValue: number, volatility: number) {
  const data: PerformanceDataPoint[] = [];
  let currentValue = initialValue;
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    currentValue *= 1 + (Math.random() - 0.5) * volatility;
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: Math.round(currentValue),
    });
  }
  return data;
}

const mockAssets: Asset[] = [
  {
    id: '1',
    name: 'Apple Inc.',
    symbol: 'AAPL',
    category: 'Stock',
    price: 172.25,
    change24h: 1.5,
    holdings: 50,
    value: 8612.5,
    icon: 'https://companieslogo.com/img/orig/AAPL.D-f4803553.png?t=1632599222',
  },
  {
    id: '2',
    name: 'Bitcoin',
    symbol: 'BTC',
    category: 'Crypto',
    price: 68500.0,
    change24h: -1200.0,
    holdings: 0.5,
    value: 34250.0,
    icon: 'https://companieslogo.com/img/orig/BTC-alt.D-120dfb92.png?t=1699254336',
  },
  {
    id: '3',
    name: 'Ethereum',
    symbol: 'ETH',
    category: 'Crypto',
    price: 3500.0,
    change24h: 150.0,
    holdings: 10,
    value: 35000.0,
    icon: 'https://companieslogo.com/img/orig/ETH-alt.D-a9b0a88c.png?t=1699254336',
  },
  {
    id: '4',
    name: 'Downtown Condo',
    symbol: 'RE-01',
    category: 'Real Estate',
    price: 450000.0,
    change24h: 0,
    holdings: 1,
    value: 450000.0,
    icon: 'https://static.thenounproject.com/png/2221084-200.png',
  },
  {
    id: '5',
    name: 'Microsoft Corp.',
    symbol: 'MSFT',
    category: 'Stock',
    price: 427.56,
    change24h: 2.1,
    holdings: 30,
    value: 12826.8,
    icon: 'https://companieslogo.com/img/orig/MSFT.D-a20af2e8.png?t=1633073277',
  },
];

const totalValue = mockAssets.reduce((sum, asset) => sum + asset.value, 0);
const change24h = mockAssets.reduce((sum, asset) => sum + asset.change24h * asset.holdings, 0);
const change24hPercentage = (change24h / (totalValue - change24h)) * 100;

const portfolioData: PortfolioData = {
  totalValue,
  change24h,
  change24hPercentage,
  assets: mockAssets,
  performanceHistory: {
    '1D': generatePerformanceData(24, totalValue - change24h, 0.005).map((d, i) => ({...d, date: `${i}:00`})),
    '7D': generatePerformanceData(7, totalValue - (change24h*3.5), 0.02),
    '30D': generatePerformanceData(30, totalValue - (change24h*15), 0.05),
    YTD: generatePerformanceData(new Date().getMonth() * 30, totalValue * 0.8, 0.1),
    '1Y': generatePerformanceData(365, totalValue * 0.6, 0.1),
  },
};

export function getPortfolioData(): PortfolioData {
  return portfolioData;
}
