
import type { ParsePortfolioOutput } from "@/ai/flows/parse-portfolio";
import type { ParsedPortfolioAsset } from "@/lib/data";

export interface CalculatedInsights {
    totalValue: number;
    totalInvestment: number;
    overallGainLossValue: number;
    overallGainLossPercent: number;
    bestPerformer: { name: string; returnPercentage: number };
    biggestWinner: { name: string; gain: number };
    assetAllocation: Record<string, number>;
    underperformingAssets: ParsedPortfolioAsset[];
    marketDropSimulation: number;
}

export function calculateInsights(portfolio: ParsePortfolioOutput): CalculatedInsights {
    const { assets } = portfolio;

    if (!assets || assets.length === 0) {
        return {
            totalValue: 0,
            totalInvestment: 0,
            overallGainLossValue: 0,
            overallGainLossPercent: 0,
            bestPerformer: { name: 'N/A', returnPercentage: 0 },
            biggestWinner: { name: 'N/A', gain: 0 },
            assetAllocation: {},
            underperformingAssets: [],
            marketDropSimulation: 0,
        };
    }

    const totalValue = assets.reduce((sum, asset) => sum + (asset.currentPrice * asset.quantity), 0);
    const totalInvestment = assets.reduce((sum, asset) => sum + (asset.purchasePrice * asset.quantity), 0);
    const overallGainLossValue = totalValue - totalInvestment;
    const overallGainLossPercent = totalInvestment === 0 ? 0 : (overallGainLossValue / totalInvestment) * 100;

    let bestPerformer = { name: 'N/A', returnPercentage: -Infinity };
    let biggestWinner = { name: 'N/A', gain: -Infinity };
    const assetAllocation: Record<string, number> = {};
    const underperformingAssets: ParsedPortfolioAsset[] = [];

    for (const asset of assets) {
        const investment = asset.purchasePrice * asset.quantity;
        const currentValue = asset.currentPrice * asset.quantity;
        const gain = currentValue - investment;
        const returnPercentage = investment === 0 ? 0 : (gain / investment) * 100;

        if (returnPercentage > bestPerformer.returnPercentage) {
            bestPerformer = { name: asset.name, returnPercentage };
        }

        if (gain > biggestWinner.gain) {
            biggestWinner = { name: asset.name, gain };
        }
        
        const categoryValue = asset.category || 'Other';
        if (!assetAllocation[categoryValue]) {
            assetAllocation[categoryValue] = 0;
        }
        assetAllocation[categoryValue] += currentValue;

        if (returnPercentage <= 0) {
            underperformingAssets.push(asset);
        }
    }
    
    // Convert asset allocation values to percentages
    for(const category in assetAllocation) {
        assetAllocation[category] = totalValue === 0 ? 0 : (assetAllocation[category] / totalValue) * 100;
    }

    const marketDropSimulation = totalValue * 0.9;

    return {
        totalValue,
        totalInvestment,
        overallGainLossValue,
        overallGainLossPercent,
        bestPerformer,
        biggestWinner,
        assetAllocation,
        underperformingAssets,
        marketDropSimulation,
    };
}
