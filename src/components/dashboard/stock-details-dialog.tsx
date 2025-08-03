
'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { getStockDetailsAction } from '@/app/actions';
import type { GetStockDetailsOutput } from '@/ai/flows/get-stock-details.types';
import { Loader2, Building, BarChart, TrendingUp, TrendingDown, Star, Minus } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Bar, BarChart as RechartsBarChart, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';


type StockDetailsDialogProps = {
  symbol: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const AnalystRatingsChart = ({ data }: { data: any[] }) => {
  return (
    <ChartContainer config={{}} className="h-[250px] w-full">
        <RechartsBarChart data={data} layout="vertical" margin={{ left: 20 }}>
             <CartesianGrid horizontal={false} />
            <XAxis type="number" hide />
            <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} />
            <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} content={<ChartTooltipContent />} />
            <Legend />
            <Bar dataKey="strongBuy" stackId="a" fill="var(--color-green-500)" name="Strong Buy" />
            <Bar dataKey="buy" stackId="a" fill="var(--color-green-400)" name="Buy" />
            <Bar dataKey="hold" stackId="a" fill="var(--color-yellow-400)" name="Hold" />
            <Bar dataKey="sell" stackId="a" fill="var(--color-red-400)" name="Sell" />
            <Bar dataKey="strongSell" stackId="a" fill="var(--color-red-500)" name="Strong Sell" />
        </RechartsBarChart>
    </ChartContainer>
  );
};

export function StockDetailsDialog({ symbol, open, onOpenChange }: StockDetailsDialogProps) {
  const [details, setDetails] = React.useState<GetStockDetailsOutput | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (open && symbol) {
      setIsLoading(true);
      setError(null);
      getStockDetailsAction({ symbol })
        .then((result) => {
          if ('error' in result) {
            setError(result.error);
          } else {
            setDetails(result);
          }
        })
        .finally(() => setIsLoading(false));
    }
  }, [open, symbol]);

  const formatCurrency = (value: number | undefined) => {
    if(typeof value !== 'number') return 'N/A';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact' }).format(value);
  }
  
  const chartData = details?.recommendations?.map(rec => ({
      name: rec.period,
      strongBuy: rec.strongBuy,
      buy: rec.buy,
      hold: rec.hold,
      sell: rec.sell,
      strongSell: rec.strongSell,
  }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isLoading ? <Skeleton className="h-8 w-48" /> : `Details for ${details?.profile?.name || symbol}`}
          </DialogTitle>
          <DialogDescription asChild>
            {isLoading ? (
                <div><Skeleton className="h-4 w-full" /></div>
            ) : (
                <p>{`Ticker: ${symbol} | Industry: ${details?.profile?.finnhubIndustry || 'N/A'}`}</p>
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-6 max-h-[70vh] overflow-y-auto pr-4">
          {isLoading ? (
            <div className="text-center"><Loader2 className="h-8 w-8 animate-spin mx-auto" /></div>
          ) : error ? (
            <p className="text-destructive text-center">{error}</p>
          ) : details ? (
            <div className="space-y-6">
               <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Building /> Company Profile</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                   <div><p className="font-semibold">Name</p><p>{details.profile?.name}</p></div>
                   <div><p className="font-semibold">Exchange</p><p>{details.profile?.exchange}</p></div>
                   <div><p className="font-semibold">Market Cap</p><p>{formatCurrency((details.profile?.marketCapitalization || 0) * 1e6)}</p></div>
                   <div><p className="font-semibold">Shares</p><p>{details.profile?.shareOutstanding?.toFixed(2)}M</p></div>
                   <div><p className="font-semibold">IPO Date</p><p>{details.profile?.ipo}</p></div>
                   <div><p className="font-semibold">Website</p><a href={details.profile?.weburl} target="_blank" rel="noreferrer" className="text-primary hover:underline truncate block">{details.profile?.weburl}</a></div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><BarChart /> Key Financials</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div><p className="font-semibold">52 Week High</p><p className="flex items-center gap-1 text-green-500"><TrendingUp size={16}/> {formatCurrency(details.financials?.['52WeekHigh'])}</p></div>
                    <div><p className="font-semibold">52 Week Low</p><p className="flex items-center gap-1 text-red-500"><TrendingDown size={16}/> {formatCurrency(details.financials?.['52WeekLow'])}</p></div>
                    <div><p className="font-semibold">P/E Ratio</p><p className="flex items-center gap-1"><Minus size={16}/> {details.financials?.peRatio?.toFixed(2) || 'N/A'}</p></div>
                    <div><p className="font-semibold">EPS</p><p className="flex items-center gap-1"><Minus size={16}/> {details.financials?.eps?.toFixed(2) || 'N/A'}</p></div>
                    <div><p className="font-semibold">Beta</p><p className="flex items-center gap-1"><Minus size={16}/> {details.financials?.beta?.toFixed(2) || 'N/A'}</p></div>
                    <div><p className="font-semibold">Dividend Yield</p><p className="flex items-center gap-1"><Minus size={16}/> {details.financials?.dividendYield?.toFixed(2) || 'N/A'}%</p></div>
                    <div><p className="font-semibold">Avg. Volume</p><p className="flex items-center gap-1"><Minus size={16}/> {formatCurrency(details.financials?.['10DayAverageTradingVolume'])}</p></div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Star /> Analyst Ratings</CardTitle></CardHeader>
                <CardContent>
                   {chartData && chartData.length > 0 ? (
                       <AnalystRatingsChart data={chartData} />
                   ) : <p className="text-muted-foreground text-center">No analyst rating data available.</p>}
                </CardContent>
              </Card>
            </div>
          ) : (
            <p className="text-center text-muted-foreground">No details found for {symbol}.</p>          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
