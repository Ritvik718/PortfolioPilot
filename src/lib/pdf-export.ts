<<<<<<< HEAD

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
=======
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { UserPortfolioData, TextualInsights } from '@/components/dashboard/dashboard-client-page';

function formatCurrency(value: number) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(value);
}

function formatPercent(value: number) {
    return `${value.toFixed(2)}%`;
}

export async function generatePdf(
    portfolioData: UserPortfolioData,
    textualInsights: TextualInsights
) {
    const { calculated } = portfolioData;
    const { insights, forecast } = textualInsights;

    const doc = new jsPDF();

    // Title
    doc.setFontSize(22);
    doc.text("PortfolioPilot Analysis Report", 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text(new Date().toLocaleDateString(), 105, 28, { align: 'center' });

    // Summary
    doc.setFontSize(18);
    doc.text("Key Metrics", 14, 45);
    doc.setFontSize(12);

    const summaryData = [
        ["Total Portfolio Value:", formatCurrency(calculated.totalValue)],
        ["Total Investment:", formatCurrency(calculated.totalInvestment)],
        ["Overall Gain/Loss:", `${formatCurrency(calculated.overallGainLossValue)} (${formatPercent(calculated.overallGainLossPercent)}%)`],
        ["Best Performer:", `${calculated.bestPerformer.name} (${formatPercent(calculated.bestPerformer.returnPercentage)})`],
        ["Biggest Winner (by value):", `${calculated.biggestWinner.name} (${formatCurrency(calculated.biggestWinner.gain)})`],
        ["10% Market Drop Simulation:", `Portfolio would be ${formatCurrency(calculated.marketDropSimulation)}`],
    ];

    let yPos = 55;
    summaryData.forEach(([label, value]) => {
        doc.setFont('helvetica', 'bold');
        doc.text(label, 14, yPos);
        doc.setFont('helvetica', 'normal');
        doc.text(value, 80, yPos);
        yPos += 8;
    });

    // Asset Allocation
    yPos += 5;
    doc.setFontSize(18);
    doc.text("Asset Allocation", 14, yPos);
    yPos += 10;
    doc.setFontSize(12);
    Object.entries(calculated.assetAllocation).forEach(([category, percentage]) => {
        doc.setFont('helvetica', 'bold');
        doc.text(`${category}:`, 14, yPos);
        doc.setFont('helvetica', 'normal');
        doc.text(formatPercent(percentage), 80, yPos);
        yPos += 8;
    });

    // AI Insights
    yPos += 5;
    doc.setFontSize(18);
    doc.text("AI Insights", 14, yPos);
    yPos += 10;
    doc.setFontSize(12);
    const splitInsights = doc.splitTextToSize(insights.join('\n\n'), 180);
    doc.text(splitInsights, 14, yPos);
    yPos += (splitInsights.length * 5) + 5;


    // Forecast
    doc.setFontSize(18);
    doc.text("AI Forecast", 14, yPos);
    yPos += 10;
    doc.setFontSize(12);
    const splitForecast = doc.splitTextToSize(forecast, 180);
    doc.text(splitForecast, 14, yPos);

    // Save the PDF
    doc.save('PortfolioPilot_Report.pdf');
>>>>>>> 9759cfc0c8d8b76ef37fbbf311e46f9c3ae33b2b
}
