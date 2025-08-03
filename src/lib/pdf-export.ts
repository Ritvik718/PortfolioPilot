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
}
