'use client';

import * as React from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltipContent,
  ChartConfig,
} from '@/components/ui/chart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { PerformanceDataPoint } from '@/lib/data';

type PerformanceChartProps = {
  data: {
    '1D': PerformanceDataPoint[];
    '7D': PerformanceDataPoint[];
    '30D': PerformanceDataPoint[];
    YTD: PerformanceDataPoint[];
    '1Y': PerformanceDataPoint[];
  };
};

const chartConfig = {
  value: {
    label: 'Value',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

export function PerformanceChart({ data }: PerformanceChartProps) {
  const [activeTab, setActiveTab] = React.useState<keyof typeof data>('30D');
  const activeData = data[activeTab];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
    }).format(value);
  };
  
  const yAxisDomain = [
    Math.min(...activeData.map(d => d.value)) * 0.98,
    Math.max(...activeData.map(d => d.value)) * 1.02,
  ]

  return (
    <Card>
      <CardHeader className="flex flex-col items-start space-y-0 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="grid gap-1">
          <CardTitle>Portfolio Performance</CardTitle>
          <CardDescription>
            Showing performance for the last {activeTab}
          </CardDescription>
        </div>
        <Tabs
          defaultValue="30D"
          onValueChange={(value) =>
            setActiveTab(value as keyof typeof data)
          }
        >
          <TabsList>
            <TabsTrigger value="1D">1D</TabsTrigger>
            <TabsTrigger value="7D">7D</TabsTrigger>
            <TabsTrigger value="30D">30D</TabsTrigger>
            <TabsTrigger value="YTD">YTD</TabsTrigger>
            <TabsTrigger value="1Y">1Y</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <AreaChart
            data={activeData}
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
          >
            <defs>
              <linearGradient id="fillValue" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="hsl(var(--primary))"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(var(--primary))"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value}
            />
            <YAxis
              tickFormatter={formatCurrency}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              domain={yAxisDomain}
            />
            <Tooltip
              cursor
              content={
                <ChartTooltipContent
                  formatter={(value) => formatCurrency(value as number)}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="value"
              type="natural"
              fill="url(#fillValue)"
              stroke="hsl(var(--primary))"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
