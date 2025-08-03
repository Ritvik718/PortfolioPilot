import type { PortfolioData } from './data';

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

const assets = [
    { id: '1', name: 'Apple Inc.', symbol: 'AAPL', category: 'Stock' as const, price: 172.25, change24h: 1.50, holdings: 50, value: 8612.50, icon: 'https://companieslogo.com/img/orig/AAPL.D-f4803553.png?t=1632599222' },
    { id: '2', name: 'Bitcoin', symbol: 'BTC', category: 'Crypto' as const, price: 68500.00, change24h: -1200.00, holdings: 0.5, value: 34250.00, icon: 'https://companieslogo.com/img/orig/BTC-alt.D-120dfb92.png?t=1699254336' },
    { id: '3', name: 'Ethereum', symbol: 'ETH', category: 'Crypto' as const, price: 3500.00, change24h: 150.00, holdings: 10, value: 35000.00, icon: 'https://companieslogo.com/img/orig/ETH-alt.D-a9b0a88c.png?t=1699254336' },
    { id: '4', name: 'Downtown Condo', symbol: 'RE-01', category: 'Real Estate' as const, price: 450000.00, change24h: 0, holdings: 1, value: 450000.00, icon: 'https://static.thenounproject.com/png/2221084-200.png' },
    { id: '5', name: 'Microsoft Corp.', symbol: 'MSFT', category: 'Stock' as const, price: 427.56, change24h: 2.10, holdings: 30, value: 12826.80, icon: 'https://companieslogo.com/img/orig/MSFT.D-a20af2e8.png?t=1633073277' },
];

const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0);
const change24h = assets.reduce((sum, asset) => sum + asset.change24h * asset.holdings, 0);
const totalValue24hAgo = totalValue - change24h;
const change24hPercentage = totalValue24hAgo === 0 ? 0 : (change24h / totalValue24hAgo) * 100;

export const mockPortfolioData: PortfolioData = {
    totalValue,
    change24h,
    change24hPercentage,
    assets,
    performanceHistory: {
        '1D': generatePerformanceData(24, totalValue24hAgo, 0.002),
        '7D': generatePerformanceData(7, totalValue - (change24h * 7), 0.01),
        '30D': generatePerformanceData(30, totalValue - (change24h * 30), 0.015),
        'YTD': generatePerformanceData(new Date().getMonth() + 1, 425000, 0.02),
        '1Y': generatePerformanceData(12, 320000, 0.025),
    },
};
