
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { getAIInsights } from '@/app/actions';
import { Lightbulb, Sparkles, Loader2, ListTree, AreaChart, HelpCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import type { GenerateInsightsOutput } from '@/ai/ai-insights';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';

type PortfolioAnalysisProps = {
    onAnalysisComplete: (data: GenerateInsightsOutput) => void;
}

export function PortfolioAnalysis({ onAnalysisComplete }: PortfolioAnalysisProps) {
  const [portfolioData, setPortfolioData] = React.useState('');
  const [analysisResult, setAnalysisResult] = React.useState<GenerateInsightsOutput | null>(null);
  const [isPending, startTransition] = React.useTransition();
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPortfolioData(e.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  const handleSubmit = async () => {
    if (!portfolioData.trim()) {
       toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Portfolio data cannot be empty.',
      });
      return;
    }

    startTransition(async () => {
      const result = await getAIInsights({ portfolioData });

      if (result.error) {
        toast({
          variant: 'destructive',
          title: 'Analysis Failed',
          description: result.error,
        });
        setAnalysisResult(null);
      } else {
        const structuredResult = result as GenerateInsightsOutput;
        setAnalysisResult(structuredResult);
        onAnalysisComplete(structuredResult);
         toast({
          title: 'Analysis Complete',
          description: 'Your portfolio insights are ready.',
        });
      }
    });
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-2">
            <Sparkles className="text-primary h-6 w-6" />
            <CardTitle>Portfolio Analysis</CardTitle>
        </div>
        <CardDescription>Upload or paste your portfolio data (e.g., CSV, JSON) to get AI-powered insights.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        <div className="grid w-full gap-2">
            <Textarea 
                placeholder="Paste your portfolio data here, or upload a file below." 
                value={portfolioData}
                onChange={(e) => setPortfolioData(e.target.value)}
                rows={8}
            />
             <input 
                id="portfolio-upload"
                type="file" 
                accept=".csv,.json,.txt"
                onChange={handleFileChange}
                className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
            />
        </div>
        <Button onClick={handleSubmit} disabled={isPending || !portfolioData.trim()} className="w-full">
            {isPending ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                </>
            ) : (
                 <>
                    <Lightbulb className="mr-2 h-4 w-4" />
                    Generate Insights
                </>
            )}
        </Button>

        {analysisResult && (
            <div className="space-y-4 pt-4">
                <Separator />
                 <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>
                            <h3 className="font-semibold flex items-center gap-2"><HelpCircle className="h-5 w-5 text-primary" /> Key Questions Answered</h3>
                        </AccordionTrigger>
                        <AccordionContent className="space-y-3 text-sm">
                           <p><strong>Total Value:</strong> {analysisResult.totalValue}</p>
                           <p><strong>Total Investment:</strong> {analysisResult.totalInvestment}</p>
                           <p><strong>Overall Gain/Loss:</strong> {analysisResult.overallGainLoss}</p>
                           <p><strong>Best Performer:</strong> {analysisResult.bestPerformer}</p>
                           <p><strong>Biggest Winner:</strong> {analysisResult.biggestWinner}</p>
                           <p><strong>Asset Allocation:</strong> {analysisResult.assetAllocation}</p>
                           <p><strong>Underperforming Assets:</strong> {analysisResult.underperformingAssets}</p>
                           <p><strong>10% Drop Simulation:</strong> {analysisResult.marketDropSimulation}</p>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
                <div>
                    <h3 className="font-semibold flex items-center gap-2 mb-2"><ListTree className="h-5 w-5 text-primary" /> Key Insights</h3>
                    <ul className="space-y-2 list-disc pl-5 text-sm text-muted-foreground">
                        {analysisResult.insights.map((insight, index) => (
                            <li key={index}>{insight}</li>
                        ))}
                    </ul>
                </div>
                 <div>
                    <h3 className="font-semibold flex items-center gap-2 mb-2"><AreaChart className="h-5 w-5 text-primary" /> Forecast</h3>
                    <p className="text-sm text-muted-foreground">{analysisResult.forecast}</p>
                </div>
            </div>
        )}

      </CardContent>
    </Card>
  );
}
