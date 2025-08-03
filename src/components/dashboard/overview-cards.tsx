import type { PortfolioData, AnalyzedAsset } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, TrendingDown, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

// This component can now accept either the original mock PortfolioData or the AI-generated data.
type OverviewCardsProps = {
  data: (PortfolioData & { assets: (PortfolioData['assets'][0] | AnalyzedAsset)[] });
};

export function OverviewCards({ data }: OverviewCardsProps) {
  const { totalValue, change24h, change24hPercentage, assets } = data;

  // Handle case where there might be no assets
  if (!assets || assets.length === 0) {
    return null;
  }

  const topPerformer = [...assets].sort(
    (a, b) => {
        const aPreviousValue = a.value - a.change24h;
        const bPreviousValue = b.value - b.change24h;
        const aPercentage = aPreviousValue === 0 ? 0 : (a.change24h / aPreviousValue) * 100;
        const bPercentage = bPreviousValue === 0 ? 0 : (b.change24h / bPreviousValue) * 100;
        return bPercentage - aPercentage;
    }
  )[0];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const topPerformerPreviousValue = topPerformer.value - topPerformer.change24h;
  const topPerformerChangePercentage =
    topPerformerPreviousValue === 0
      ? 0
      : (topPerformer.change24h / topPerformerPreviousValue) * 100;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Value</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalValue)}</div>
          <p className="text-xs text-muted-foreground">
            Your entire portfolio worth
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">24h Change</CardTitle>
          {change24h >= 0 ? (
            <TrendingUp className="h-4 w-4 text-green-500" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-500" />
          )}
        </CardHeader>
        <CardContent>
          <div
            className={cn(
              'text-2xl font-bold',
              change24h >= 0 ? 'text-green-500' : 'text-red-500'
            )}
          >
            {change24h >= 0 ? '+' : ''}
            {formatCurrency(change24h)} ({change24hPercentage.toFixed(2)}%)
          </div>
          <p className="text-xs text-muted-foreground">Since yesterday</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Top Performer (24h)
          </CardTitle>
          <Star className="h-4 w-4 text-yellow-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{topPerformer.name}</div>
          <p
            className={cn(
              'text-xs',
              topPerformerChangePercentage >= 0
                ? 'text-green-500'
                : 'text-red-500'
            )}
          >
            {topPerformerChangePercentage >= 0 ? '+' : ''}
            {topPerformerChangePercentage.toFixed(2)}%
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
