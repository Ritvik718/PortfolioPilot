'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Transaction } from '@/lib/data';
import { format } from 'date-fns';

type TransactionListProps = {
  transactions: Transaction[];
};

export function TransactionList({ transactions }: TransactionListProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>
          Here are the latest transactions from your portfolio.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Asset</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Total Value</TableHead>
              <TableHead className="text-right">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  <div className="font-medium">{transaction.assetName}</div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={transaction.type === 'buy' ? 'default' : 'secondary'}
                    className={
                      transaction.type === 'buy'
                        ? 'bg-green-500/20 text-green-700 hover:bg-green-500/30'
                        : 'bg-red-500/20 text-red-700 hover:bg-red-500/30'
                    }
                  >
                    {transaction.type}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">{transaction.quantity}</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(transaction.pricePerUnit)}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(transaction.totalValue)}
                </TableCell>
                <TableCell className="text-right">
                  {format(new Date(transaction.date), 'PPP')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
