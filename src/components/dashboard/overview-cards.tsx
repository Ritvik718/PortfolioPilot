import type { PortfolioData } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, TrendingDown, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

type OverviewCardsProps = {
  data: PortfolioData;
};

export function OverviewCards({ data }: OverviewCardsProps) {
  const { totalValue, change24h, change24hPercentage } = data;

  const topPerformer = [...data.assets].sort(
    (a, b) =>
      b.change24h / (b.value - b.change24h) -
      a.change24h / (a.value - a.change24h)
  )[0];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const topPerformerChange = topPerformer.value - topPerformer.change24h;
  const topPerformerChangePercentage =
    topPerformerChange === 0
      ? 0
      : (topPerformer.change24h / topPerformerChange) * 100;

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
