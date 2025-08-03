
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { getParsedPortfolio, getInsights } from '@/app/actions';
import { Lightbulb, Sparkles, Loader2, HelpCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import type { ParsePortfolioOutput } from '@/ai/flows/parse-portfolio';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { calculateInsights, type CalculatedInsights } from '@/lib/calculations';
import type { UserPortfolioData } from './dashboard-client-page';

export type TextualInsights = {
    insights: string[];
    forecast: string;
}

type PortfolioAnalysisProps = {
    onAnalysisComplete: (data: { portfolio: UserPortfolioData, insights: TextualInsights | null }) => void;
}

export const PortfolioAnalysis = React.forwardRef<HTMLDivElement, PortfolioAnalysisProps>(({ onAnalysisComplete }, ref) => {
  const [portfolioData, setPortfolioData] = React.useState('');
  const [analysisResult, setAnalysisResult] = React.useState<CalculatedInsights | null>(null);
  const [textualInsights, setTextualInsights] = React.useState<TextualInsights | null>(null);
  const [isParsing, setIsParsing] = React.useState(false);
  const [isGeneratingInsights, setIsGeneratingInsights] = React.useState(false);
  const { toast } = useToast();
  const analysisContentRef = React.useRef<HTMLDivElement>(null);

  React.useImperativeHandle(ref, () => analysisContentRef.current as HTMLDivElement);

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

    setIsParsing(true);
    setAnalysisResult(null);
    setTextualInsights(null);

    const parseResult = await getParsedPortfolio({ portfolioData });

    if (parseResult.error) {
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: parseResult.error,
      });
      setIsParsing(false);
      return;
    }
    
    setIsParsing(false);
    const parsedData = parseResult as ParsePortfolioOutput;
    const calculated = calculateInsights(parsedData);
    setAnalysisResult(calculated);
    
    toast({
      title: 'Analysis Complete',
      description: 'Your portfolio insights are ready.',
    });

    setIsGeneratingInsights(true);
    const textualResult = await getInsights({ calculatedInsights: JSON.stringify(calculated) });
    let finalInsights: TextualInsights | null = null;
    
    if (textualResult.error) {
        toast({
            variant: 'destructive',
            title: 'Insight Generation Failed',
            description: textualResult.error,
        });
    } else {
        finalInsights = textualResult as TextualInsights;
        setTextualInsights(finalInsights);
    }
    setIsGeneratingInsights(false);
    
    onAnalysisComplete({ 
        portfolio: { parsed: parsedData, calculated: calculated },
        insights: finalInsights 
    });
  };
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };
  
  const formatPercent = (value: number) => {
      return `${value.toFixed(2)}%`;
  }
  
  const isPending = isParsing || isGeneratingInsights;

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
                    {isParsing ? 'Parsing Data...' : 'Generating Insights...'}
                </>
            ) : (
                 <>
                    <Lightbulb className="mr-2 h-4 w-4" />
                    Generate Insights
                </>
            )}
        </Button>

        {analysisResult && (
            <div className="space-y-4 pt-4" ref={analysisContentRef}>
                <Separator />
                 <Accordion type="single" collapsible className="w-full" defaultValue='item-1'>
                    <AccordionItem value="item-1">
                        <AccordionTrigger>
                            <h3 className="font-semibold flex items-center gap-2"><HelpCircle className="h-5 w-5 text-primary" /> Key Questions Answered</h3>
                        </AccordionTrigger>
                        <AccordionContent className="space-y-3 text-sm">
                           <p><strong>Total Value:</strong> {formatCurrency(analysisResult.totalValue)}</p>
                           <p><strong>Total Investment:</strong> {formatCurrency(analysisResult.totalInvestment)}</p>
                           <p><strong>Overall Gain/Loss:</strong> {formatCurrency(analysisResult.overallGainLossValue)} ({formatPercent(analysisResult.overallGainLossPercent)}%)</p>
                           <p><strong>Best Performer:</strong> {analysisResult.bestPerformer.name} ({formatPercent(analysisResult.bestPerformer.returnPercentage)}%)</p>
                           <p><strong>Biggest Winner:</strong> {analysisResult.biggestWinner.name} ({formatCurrency(analysisResult.biggestWinner.gain)})</p>
                           <div>
                                <strong>Asset Allocation:</strong>
                                <ul className="list-disc pl-5">
                                    {Object.entries(analysisResult.assetAllocation).map(([category, percentage]) => (
                                        <li key={category}>{category}: {formatPercent(percentage)}%</li>
                                    ))}
                                </ul>
                           </div>
                           <p><strong>Underperforming Assets:</strong> {analysisResult.underperformingAssets.map(a => a.name).join(', ') || 'None'}</p>
                           <p><strong>10% Drop Simulation:</strong> {formatCurrency(analysisResult.marketDropSimulation)}</p>
                        </AccordionContent>
                    </AccordionItem>
                    {(isGeneratingInsights || textualInsights) && (
                         <AccordionItem value="item-2">
                             <AccordionTrigger>
                                 <h3 className="font-semibold flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" /> AI Insights &amp; Forecast</h3>
                             </AccordionTrigger>
                             <AccordionContent className="space-y-4 text-sm">
                                {isGeneratingInsights && <Loader2 className="h-5 w-5 animate-spin" />}
                                {textualInsights && (
                                    <>
                                        <div>
                                            <h4 className="font-semibold mb-2">Key Insights:</h4>
                                            <ul className="list-disc pl-5 space-y-1">
                                                {textualInsights.insights.map((insight, index) => (
                                                    <li key={index}>{insight}</li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold mb-2">Future Forecast:</h4>
                                            <p>{textualInsights.forecast}</p>
                                        </div>
                                    </>
                                )}
                             </AccordionContent>
                         </AccordionItem>
                    )}
                </Accordion>
            </div>
        )}

      </CardContent>
    </Card>
  );
});
PortfolioAnalysis.displayName = "PortfolioAnalysis";
