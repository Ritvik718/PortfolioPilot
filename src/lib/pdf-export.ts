
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export async function exportPortfolioToPdf(element: HTMLElement) {
    if (!element) {
        console.error("Element to export not found.");
        return;
    }

    try {
        const canvas = await html2canvas(element, {
             scale: 2, // Higher scale for better quality
             useCORS: true, // If you have external images
             backgroundColor: '#ffffff', // Force a white background for the PDF
        });

        const imgData = canvas.toDataURL('image/png');
        
        // A4 size in points: 595.28 x 841.89
        const pdf = new jsPDF({
            orientation: 'p',
            unit: 'px',
            format: 'a4'
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const ratio = canvasWidth / canvasHeight;
        
        let imgWidth = pdfWidth - 20; // with some margin
        let imgHeight = imgWidth / ratio;
        
        // If the height is too big for the page, adjust width instead
        if (imgHeight > pdfHeight - 20) {
            imgHeight = pdfHeight - 20;
            imgWidth = imgHeight * ratio;
        }

        const x = (pdfWidth - imgWidth) / 2;
        const y = 10; // top margin
        
        pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
        pdf.save('portfolio_report.pdf');

    } catch (error) {
        console.error("Error exporting PDF:", error);
        alert("Sorry, there was an error creating the PDF.");
    }
}
