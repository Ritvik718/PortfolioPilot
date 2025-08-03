
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { StockQuote } from '@/lib/market-data';
import { cn } from '@/lib/utils';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { StockDetailsDialog } from './stock-details-dialog';

type MarketOverviewProps = {
  quotes: StockQuote[];
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.3,
    },
  }),
};

export function MarketOverview({ quotes }: MarketOverviewProps) {
  const [selectedSymbol, setSelectedSymbol] = React.useState<string | null>(null);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Market Overview: Magnificent Seven</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4 text-center">
              {quotes.map((stock, index) => (
                  <motion.div 
                    key={stock.symbol} 
                    className="p-2 rounded-lg bg-muted/50 cursor-pointer hover:bg-muted transition-colors"
                    custom={index}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    onClick={() => setSelectedSymbol(stock.symbol)}
                  >
                      <p className="font-bold text-lg">{stock.symbol}</p>
                      <p className="text-sm font-mono">{formatCurrency(stock.price)}</p>
                      <div
                          className={cn(
                          'text-xs flex items-center justify-center gap-1',
                          stock.change >= 0 ? 'text-green-500' : 'text-red-500'
                          )}
                      >
                          {stock.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                          <span>
                              {stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                          </span>
                      </div>
                  </motion.div>
              ))}
          </div>
        </CardContent>
      </Card>
      {selectedSymbol && (
        <StockDetailsDialog 
          symbol={selectedSymbol} 
          open={!!selectedSymbol}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedSymbol(null);
            }
          }}
        />
      )}
    </>
  );
}
