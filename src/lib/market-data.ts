
import fetch from 'node-fetch';

export type StockQuote = {
    symbol: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
};

export type MarketNews = {
    id: number;
    headline: string;
    image: string;
    source: string;
    summary: string;
    url: string;
    datetime: number;
}

const MAG_SEVEN_STOCKS = [
    { symbol: 'AAPL', name: 'Apple' },
    { symbol: 'MSFT', name: 'Microsoft' },
    { symbol: 'GOOGL', name: 'Alphabet' },
    { symbol: 'AMZN', name: 'Amazon' },
    { symbol: 'NVDA', name: 'Nvidia' },
    { symbol: 'META', name: 'Meta' },
    { symbol: 'TSLA', name: 'Tesla' },
];

const getApiKey = () => {
    const apiKey = process.env.FINANCIAL_DATA_API_KEY;
    if (!apiKey || apiKey.includes('_placeholder_') || apiKey === 'd27jdqpr01qloarjc24gd27jdqpr01qloarjc250') {
        console.warn("Finnhub API key not found or is a placeholder.");
        return null;
    }
    return apiKey;
}

export async function getMagSevenData(): Promise<StockQuote[]> {
    const apiKey = getApiKey();
    if (!apiKey) {
        return MAG_SEVEN_STOCKS.map(stock => ({ ...stock, price: 0, change: 0, changePercent: 0 }));
    }

    try {
        const quotePromises = MAG_SEVEN_STOCKS.map(async (stock) => {
             try {
                const response = await fetch(`https://finnhub.io/api/v1/quote?symbol=${stock.symbol}&token=${apiKey}`);

                if (!response.ok) {
                    console.error(`Finnhub API request failed for ${stock.symbol} with status ${response.status}.`);
                    return { ...stock, price: 0, change: 0, changePercent: 0 };
                }

                const data = await response.json() as any;

                if (!data || typeof data.c === 'undefined') {
                   console.error(`Invalid data format received from Finnhub for ${stock.symbol}.`);
                   return { ...stock, price: 0, change: 0, changePercent: 0 };
                }

                return {
                    symbol: stock.symbol,
                    name: stock.name,
                    price: data.c,
                    change: data.d,
                    changePercent: data.dp,
                };
            } catch (assetError) {
                console.error(`Failed to fetch data for ${stock.symbol}:`, assetError);
                return { ...stock, price: 0, change: 0, changePercent: 0 };
            }
        });

        const quotes = await Promise.all(quotePromises);
        return quotes;

    } catch (error) {
        console.error("A critical error occurred while fetching market data.", error);
        return MAG_SEVEN_STOCKS.map(stock => ({ ...stock, price: 0, change: 0, changePercent: 0 }));
    }
}


export async function getMarketNews(): Promise<MarketNews[]> {
    const apiKey = getApiKey();
    if (!apiKey) {
        return [];
    }
    
    try {
        const response = await fetch(`https://finnhub.io/api/v1/news?category=general&token=${apiKey}`);
         if (!response.ok) {
            console.error(`Finnhub API request for news failed with status ${response.status}.`);
            return [];
        }

        const data = await response.json() as any[];

        if (!data || !Array.isArray(data)) {
            console.error(`Invalid data format received from Finnhub for news.`);
            return [];
        }

        return data.slice(0, 5).map(article => ({
            id: article.id,
            headline: article.headline,
            image: article.image || `https://placehold.co/600x400.png`,
            source: article.source,
            summary: article.summary,
            url: article.url,
            datetime: article.datetime,
        }));

    } catch (error) {
        console.error("A critical error occurred while fetching market news.", error);
        return [];
    }
}
