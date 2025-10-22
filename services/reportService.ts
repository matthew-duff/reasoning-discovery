
import { DiscoveryResult } from '../types';

export const generatePdfReport = (results: DiscoveryResult[], query: string): void => {
  const { jsPDF } = (window as any).jspdf;
  const doc = new jsPDF();

  // Header
  doc.setFont('times', 'bold');
  doc.setFontSize(18);
  doc.text('AI Methodology Report', 14, 22);
  
  doc.setFont('times', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(100);

  // Sub-header
  const date = new Date().toLocaleDateString();
  doc.text(`Report generated on: ${date}`, 14, 30);
  
  // Query
  doc.setFontSize(12);
  doc.setFont('times', 'bold');
  doc.setTextColor(0);
  doc.text('Discovery Query:', 14, 40);
  doc.setFont('times', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(80);
  const splitQuery = doc.splitTextToSize(query, 180);
  doc.text(splitQuery, 14, 46);

  // Summary
  const relevantCount = results.filter(r => r.decision === 'Relevant').length;
  const notRelevantCount = results.filter(r => r.decision === 'Not Relevant').length;
  doc.setFontSize(12);
  doc.setFont('times', 'bold');
  doc.setTextColor(0);
  doc.text('Summary:', 14, 60);
  doc.setFont('times', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(80);
  doc.text(`Total Documents Processed: ${results.length}`, 14, 66);
  doc.text(`Relevant: ${relevantCount}`, 14, 72);
  doc.text(`Not Relevant: ${notRelevantCount}`, 14, 78);

  // Table
  const tableColumn = ["Doc ID", "Filename", "Decision", "Reasoning"];
  const tableRows: (string|undefined)[][] = [];

  results.forEach(result => {
    const resultData = [
      result.docId,
      result.docName,
      result.decision,
      result.reasoning,
    ];
    tableRows.push(resultData);
  });

  doc.autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 85,
    theme: 'striped',
    styles: {
        fontSize: 8,
        font: 'times',
    },
    headStyles: {
        fillColor: [40, 40, 40],
        fontStyle: 'bold',
    },
    columnStyles: {
        3: { cellWidth: 'auto' }, // Reasoning column
    }
  });

  doc.save('AI_Methodology_Report.pdf');
};