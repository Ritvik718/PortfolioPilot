import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Asset } from '@/lib/data';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

type AssetListProps = {
  assets: Asset[];
};

export function AssetList({ assets }: AssetListProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Assets</CardTitle>
        <CardDescription>
          An overview of your current investments.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Asset</TableHead>
              <TableHead className="text-right">Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assets.map((asset) => {
              const changeValue = asset.value - (asset.holdings * asset.change24h);
              const percentageChange = changeValue === 0 ? 0 : (asset.holdings * asset.change24h / changeValue) * 100;
              return (
              <TableRow key={asset.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Image
                      src={asset.icon}
                      alt={asset.name}
                      width={32}
                      height={32}
                      className="rounded-full bg-muted p-1 object-contain"
                      unoptimized
                    />
                    <div>
                      <div className="font-medium">{asset.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {asset.symbol}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="font-medium">{formatCurrency(asset.value)}</div>
                  <div
                    className={cn(
                      'text-sm flex items-center justify-end gap-1',
                      asset.change24h >= 0 ? 'text-green-500' : 'text-red-500'
                    )}
                  >
                    {asset.change24h >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    <span>
                      {percentageChange.toFixed(2)}%
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            )})}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
