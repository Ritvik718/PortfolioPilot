import type { PortfolioData, Asset } from './data';
import fetch from 'node-fetch';

const baseAssets: Omit<Asset, 'price' | 'change24h' | 'value'>[] = [
    { id: '1', name: 'Apple Inc.', symbol: 'AAPL', category: 'Stock' as const, holdings: 50, icon: 'https://companieslogo.com/img/orig/AAPL.D-f4803553.png?t=1632599222' },
    { id: '2', name: 'Bitcoin', symbol: 'BTC', category: 'Crypto' as const, holdings: 0.5, icon: 'https://companieslogo.com/img/orig/BTC-alt.D-120dfb92.png?t=1699254336' },
    { id: '3', name: 'Ethereum', symbol: 'ETH', category: 'Crypto' as const, holdings: 10, icon: 'https://companieslogo.com/img/orig/ETH-alt.D-a9b0a88c.png?t=1699254336' },
    { id: '4', name: 'Downtown Condo', symbol: 'RE-01', category: 'Real Estate' as const, holdings: 1, icon: 'https://static.thenounproject.com/png/2221084-200.png' },
    { id: '5', name: 'Microsoft Corp.', symbol: 'MSFT', category: 'Stock' as const, holdings: 30, icon: 'https://companieslogo.com/img/orig/MSFT.D-a20af2e8.png?t=1633073277' },
];

const mockRealEstateData = {
    price: 450000.00,
    change24h: 0,
};

function generatePerformanceData(days: number, baseValue: number, volatility: number): { date: string, value: number }[] {
    const data = [];
    let currentValue = baseValue;
    for (let i = 0; i < days; i++) {
        const change = (Math.random() - 0.5) * 2 * volatility * currentValue;
        currentValue += change;
        
        let dateLabel;
        if (days === 1) { // 1D
             dateLabel = `${i}:00`;
        } else if (days <= 30) { // 7D, 30D
            const date = new Date();
            date.setDate(date.getDate() - (days - 1 - i));
            dateLabel = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        } else { // YTD, 1Y
             const date = new Date();
             date.setMonth(date.getMonth() - Math.floor(days/30) + 1);
             date.setDate(1);
             date.setMonth(date.getMonth() + Math.floor(i / 30));
             dateLabel = date.toLocaleDateString('en-US', { month: 'short' });
        }

        data.push({ date: dateLabel, value: Math.round(currentValue) });
    }
    return data;
}

const getEmptyPortfolioData = (): PortfolioData => {
    const emptyPerformance = {
        '1D': [], '7D': [], '30D': [], 'YTD': [], '1Y': []
    };
    return {
        totalValue: 0,
        change24h: 0,
        change24hPercentage: 0,
        assets: [],
        performanceHistory: emptyPerformance
    };
};

export async function getPortfolioData(): Promise<PortfolioData> {
    const apiKey = process.env.FINANCIAL_DATA_API_KEY;

    if (!apiKey || apiKey.includes('_placeholder_') || apiKey === 'd27jdqpr01qloarjc24gd27jdqpr01qloarjc250') {
        console.warn("Finnhub API key not found or is a placeholder. Returning empty data.");
        return getEmptyPortfolioData();
    }

    try {
        const updatedAssetsPromises = baseAssets.map(async (asset) => {
            if (asset.category === 'Real Estate') {
                return {
                    ...asset,
                    price: mockRealEstateData.price,
                    change24h: mockRealEstateData.change24h,
                    value: asset.holdings * mockRealEstateData.price,
                };
            }

            try {
                const symbol = asset.category === 'Crypto' ? `BINANCE:${asset.symbol}USDT` : asset.symbol;
                const response = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`);
                
                if (!response.ok) {
                    console.error(`Finnhub API request failed for ${asset.symbol} with status ${response.status}. Skipping this asset.`);
                    return null; // Skip this asset if API call fails
                }

                const data = await response.json() as any;
                
                if (!data || typeof data.c === 'undefined') {
                   console.error(`Invalid data format received from Finnhub for ${asset.symbol}. Skipping this asset.`);
                   return null;
                }
                
                const price = data.c;
                const change24h = data.d;

                return {
                    ...asset,
                    price: price,
                    change24h: change24h,
                    value: asset.holdings * price,
                };
            } catch (assetError) {
                console.error(`Failed to fetch data for ${asset.symbol}:`, assetError, `Skipping this asset.`);
                return null;
            }
        });
        
        const updatedAssetsResults = await Promise.all(updatedAssetsPromises);
        const updatedAssets = updatedAssetsResults.filter((asset): asset is Asset => asset !== null);

        if (updatedAssets.length === 0) {
            return getEmptyPortfolioData();
        }
        
        const totalValue = updatedAssets.reduce((sum, asset) => sum + asset.value, 0);
        const change24h = updatedAssets.reduce((sum, asset) => sum + (asset.change24h || 0) * asset.holdings, 0);
        const totalValue24hAgo = totalValue - change24h;
        const change24hPercentage = totalValue24hAgo === 0 ? 0 : (change24h / totalValue24hAgo) * 100;

        return {
            totalValue,
            change24h,
            change24hPercentage,
            assets: updatedAssets,
            performanceHistory: {
                '1D': generatePerformanceData(24, totalValue24hAgo, 0.002),
                '7D': generatePerformanceData(7, totalValue - (change24h * 7), 0.01),
                '30D': generatePerformanceData(30, totalValue - (change24h * 30), 0.015),
                'YTD': generatePerformanceData(new Date().getMonth() + 1, totalValue * 0.95, 0.02),
                '1Y': generatePerformanceData(12, totalValue * 0.8, 0.025),
            },
        };

    } catch (error) {
        console.error("A critical error occurred while fetching portfolio data. Returning empty data.", error);
        return getEmptyPortfolioData();
    }
}
