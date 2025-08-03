
import fetch from 'node-fetch';
import { z } from 'zod';

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

// Schema for Company Profile
export const CompanyProfileSchema = z.object({
  country: z.string().optional(),
  currency: z.string().optional(),
  exchange: z.string().optional(),
  ipo: z.string().optional(),
  marketCapitalization: z.number().optional(),
  name: z.string().optional(),
  phone: z.string().optional(),
  shareOutstanding: z.number().optional(),
  ticker: z.string().optional(),
  weburl: z.string().url().optional(),
  logo: z.string().url().optional(),
  finnhubIndustry: z.string().optional(),
});
export type CompanyProfile = z.infer<typeof CompanyProfileSchema>;


// Schema for Recommendation Trends
export const RecommendationTrendSchema = z.object({
  buy: z.number(),
  hold: z.number(),
  period: z.string(),
  sell: z.number(),
  strongBuy: z.number(),
  strongSell: z.number(),
  symbol: z.string(),
});
export type RecommendationTrend = z.infer<typeof RecommendationTrendSchema>;

// Schema for Basic Financials
export const BasicFinancialsSchema = z.object({
    "10DayAverageTradingVolume": z.number().optional(),
    "52WeekHigh": z.number().optional(),
    "52WeekLow": z.number().optional(),
    "beta": z.number().optional(),
    "marketCapitalization": z.number().optional(),
    "peRatio": z.number().optional(),
    "eps": z.number().optional(),
    "dividendYield": z.number().optional(),
}).passthrough();
export type BasicFinancials = z.infer<typeof BasicFinancialsSchema>;


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

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function finnhubFetch(endpoint: string) {
    const apiKey = getApiKey();
    if (!apiKey) return null;

    await delay(1000); // Respect rate limits
    const response = await fetch(`https://finnhub.io/api/v1${endpoint}&token=${apiKey}`);
    if (!response.ok) {
        console.error(`Finnhub API request for ${endpoint} failed with status ${response.status}.`);
        return null;
    }
    return response.json();
}

export async function getMagSevenData(): Promise<StockQuote[]> {
    const quotes: StockQuote[] = [];
    for (const stock of MAG_SEVEN_STOCKS) {
        const data: any = await finnhubFetch(`/quote?symbol=${stock.symbol}`);
        if (data && typeof data.c !== 'undefined') {
            quotes.push({
                symbol: stock.symbol,
                name: stock.name,
                price: data.c,
                change: data.d,
                changePercent: data.dp,
            });
        } else {
             quotes.push({ ...stock, price: 0, change: 0, changePercent: 0 });
        }
    }
    return quotes;
}


export async function getMarketNews(): Promise<MarketNews[]> {
    const data: any = await finnhubFetch('/news?category=general');
    if (!data || !Array.isArray(data)) return [];
    
    return data.slice(0, 5).map((article: any) => ({
        id: article.id,
        headline: article.headline,
        image: article.image || `https://placehold.co/600x400.png`,
        source: article.source,
        summary: article.summary,
        url: article.url,
        datetime: article.datetime,
    }));
}

export async function getCompanyProfile2(symbol: string): Promise<CompanyProfile | null> {
    const data: any = await finnhubFetch(`/stock/profile2?symbol=${symbol}`);
    if (!data) return null;
    return CompanyProfileSchema.parse(data);
}

export async function getRecommendationTrends(symbol: string): Promise<RecommendationTrend[]> {
    const data: any = await finnhubFetch(`/stock/recommendation?symbol=${symbol}`);
     if (!data || !Array.isArray(data)) return [];
    return z.array(RecommendationTrendSchema).parse(data);
}

export async function getBasicFinancials(symbol: string): Promise<BasicFinancials | null> {
    const data: any = await finnhubFetch(`/stock/metric?symbol=${symbol}&metric=all`);
    if (!data || !data.metric) return null;
    
    const financials = {
        "10DayAverageTradingVolume": data.metric['10DayAverageTradingVolume'],
        "52WeekHigh": data.metric['52WeekHigh'],
        "52WeekLow": data.metric['52WeekLow'],
        "beta": data.metric['beta'],
        "marketCapitalization": data.metric['marketCapitalization'],
        "peRatio": data.metric.peNormalizedAnnual,
        "eps": data.metric.epsGrowth3Y,
        "dividendYield": data.metric.dividendYieldIndicatedAnnual,
    };
    
    return BasicFinancialsSchema.parse(financials);
}
