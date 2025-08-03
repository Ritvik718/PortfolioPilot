
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import type { UserPortfolioData } from '@/components/dashboard/dashboard-client-page';
import type { TextualInsights } from '@/components/dashboard/portfolio-analysis';


// Extend jsPDF with the autoTable plugin
interface jsPDFWithAutoTable extends jsPDF {
    autoTable: (options: any) => jsPDF;
}

export async function exportPortfolioToPdf(
    portfolio: UserPortfolioData, 
    insights: TextualInsights
) {
    if (!portfolio || !insights) {
        alert("Cannot export an empty report.");
        return;
    }
    
    try {
        const doc = new jsPDF() as jsPDFWithAutoTable;
        const { calculated, parsed } = portfolio;
        
        const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
        const formatPercent = (value: number) => `${value.toFixed(2)}%`;

        // Title
        doc.setFontSize(22);
        doc.text('Portfolio Report', 14, 22);
        doc.setFontSize(12);
        doc.text(`Report Generated: ${new Date().toLocaleDateString()}`, 14, 30);
        
        let yPos = 45;

        // Key Metrics Section
        doc.setFontSize(18);
        doc.text('Summary', 14, yPos);
        yPos += 10;
        doc.setFontSize(11);
        doc.text(`Total Value: ${formatCurrency(calculated.totalValue)}`, 14, yPos);
        yPos += 7;
        doc.text(`Total Investment: ${formatCurrency(calculated.totalInvestment)}`, 14, yPos);
        yPos += 7;
        doc.text(`Overall Gain/Loss: ${formatCurrency(calculated.overallGainLossValue)} (${formatPercent(calculated.overallGainLossPercent)})`, 14, yPos);
        yPos += 7;
        doc.text(`Best Performer (Return %): ${calculated.bestPerformer.name} (${formatPercent(calculated.bestPerformer.returnPercentage)})`, 14, yPos);
        yPos += 7;
        doc.text(`Biggest Winner ($): ${calculated.biggestWinner.name} (${formatCurrency(calculated.biggestWinner.gain)})`, 14, yPos);
        yPos += 12;

        // AI Insights Section
        doc.setFontSize(18);
        doc.text('AI Insights', 14, yPos);
        yPos += 8;
        doc.setFontSize(11);
        insights.insights.forEach(insight => {
            // The splitTextToSize function helps with line wrapping
            const lines = doc.splitTextToSize(`- ${insight}`, 180);
            doc.text(lines, 14, yPos);
            yPos += (lines.length * 5) + 2;
        });
        yPos += 5;

        // AI Forecast Section
        doc.setFontSize(18);
        doc.text('AI Forecast', 14, yPos);
        yPos += 8;
        doc.setFontSize(11);
        const forecastLines = doc.splitTextToSize(insights.forecast, 180);
        doc.text(forecastLines, 14, yPos);
        yPos += (forecastLines.length * 5) + 5;


        // Asset Table
        doc.addPage();
        doc.setFontSize(18);
        doc.text('Asset Details', 14, 22);

        const tableColumn = ["Name", "Category", "Quantity", "Purchase Price", "Current Price", "Total Value"];
        const tableRows: (string | number)[][] = [];

        parsed.assets.forEach(asset => {
            const assetData = [
                asset.name,
                asset.category,
                asset.quantity,
                formatCurrency(asset.purchasePrice),
                formatCurrency(asset.currentPrice),
                formatCurrency(asset.quantity * asset.currentPrice)
            ];
            tableRows.push(assetData);
        });

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 30,
        });

        doc.save('portfolio_report.pdf');

    } catch (error) {
        console.error("Error exporting PDF:", error);
        alert("Sorry, there was an error creating the PDF.");
    }
}
