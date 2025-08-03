'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { addTransaction } from '@/app/actions';


const addTransactionSchema = z.object({
  assetName: z.string().min(1, { message: 'Asset name is required' }),
  type: z.enum(['buy', 'sell']),
  quantity: z.coerce.number().min(0.00001, { message: 'Quantity must be positive' }),
  pricePerUnit: z.coerce.number().min(0.01, { message: 'Price must be positive' }),
  date: z.date(),
});

type AddTransactionFormValues = z.infer<typeof addTransactionSchema>;

export default function AddTransactionPage() {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<AddTransactionFormValues>({
    resolver: zodResolver(addTransactionSchema),
    defaultValues: {
      assetName: '',
      type: 'buy',
      quantity: 0,
      pricePerUnit: 0,
      date: new Date(),
    },
  });

  const onSubmit = async (data: AddTransactionFormValues) => {
    const result = await addTransaction({
        assetId: data.assetName.toLowerCase().replace(/\s/g, '-'), // placeholder
        assetName: data.assetName,
        type: data.type,
        quantity: data.quantity,
        pricePerUnit: data.pricePerUnit,
        totalValue: data.quantity * data.pricePerUnit,
    });

    if (result.success) {
        toast({
        title: 'Transaction Added',
        description: `Successfully added ${data.quantity} of ${data.assetName}.`,
        });
        router.push('/dashboard');
    } else {
         toast({
            variant: 'destructive',
            title: 'Error',
            description: result.message || 'Failed to add transaction.',
        });
    }
  };

  return (
    <>
      <DashboardHeader />
      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <Card className="mx-auto max-w-2xl">
          <CardHeader>
            <CardTitle className="text-2xl">Add Transaction</CardTitle>
            <CardDescription>
              Log a new buy or sell transaction for your portfolio.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
                <FormField
                  control={form.control}
                  name="assetName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Asset Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Bitcoin, Apple Inc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Transaction Type</FormLabel>
                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a transaction type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="buy">Buy</SelectItem>
                          <SelectItem value="sell">Sell</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="quantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantity</FormLabel>
                          <FormControl>
                            <Input type="number" step="any" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="pricePerUnit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price per Unit (USD)</FormLabel>
                          <FormControl>
                            <Input type="number" step="any" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </div>
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Transaction Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={'outline'}
                              className={cn(
                                'w-full pl-3 text-left font-normal',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              {field.value ? (
                                format(field.value, 'PPP')
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date('1900-01-01')
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" asChild>
                        <Link href="/dashboard">Cancel</Link>
                    </Button>
                    <Button type="submit">Add Transaction</Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
