import jsPDF from 'jspdf';
import { renderCertificateCanvas } from './certificateCanvas';

/**
 * PDF generation — exact match to reference certificate.js
 *
 * Renders ONLY the certificate node (#certificate / #complete-certificate-canvas),
 * never the surrounding UI. Resets transform to 'none' for 1:1 capture,
 * then restores it immediately after.
 */

const A5_PAGE_WIDTH_MM = 210;
const A5_PAGE_HEIGHT_MM = 148;
const HORIZONTAL_MARGIN_MM = 3; // Reduced space after border on left & right (3mm margin)

function findCertificateElement(elementId: string): HTMLElement | null {
  return (
    document.getElementById(elementId) ||
    document.getElementById('template-certificate-canvas') ||
    document.getElementById('complete-certificate-canvas') ||
    document.getElementById('details-complete-certificate-canvas') ||
    document.getElementById('offscreen-certificate-canvas') ||
    document.getElementById('live-form-certificate-canvas')
  );
}

/**
 * High-resolution PDF generator for Silver Sample Certificates.
 * Generates a true A5 landscape PDF page (210mm x 148mm) with proper space
 * after the certificate border so the complete form fits cleanly without clipping.
 */
export async function generateCertificatePDF(
  elementId: string,
  filename: string = 'Silver-Certificate-0100.pdf'
): Promise<void> {
  const element = findCertificateElement(elementId);

  if (!element) {
    throw new Error(`Target certificate element "${elementId}" not found in DOM.`);
  }

  const imgData = await renderCertificateCanvas(element);

  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a5',
    compress: true,
  });

  // Calculate dimensions with proper margins (space after border)
  const certWidthMm = A5_PAGE_WIDTH_MM - (HORIZONTAL_MARGIN_MM * 2); // 198mm
  const certHeightMm = (665 / 1024) * certWidthMm; // ~128.58mm
  const xOffsetMm = HORIZONTAL_MARGIN_MM; // 6mm space on left
  const yOffsetMm = (A5_PAGE_HEIGHT_MM - certHeightMm) / 2; // ~9.71mm space on top/bottom

  doc.addImage(imgData, 'JPEG', xOffsetMm, yOffsetMm, certWidthMm, certHeightMm, undefined, 'FAST');

  // Trigger universal download via Blob URL
  const blob = doc.output('blob');
  const blobUrl = URL.createObjectURL(blob);
  const downloadLink = document.createElement('a');
  downloadLink.href = blobUrl;
  downloadLink.download = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
  document.body.appendChild(downloadLink);
  downloadLink.click();

  setTimeout(() => {
    if (document.body.contains(downloadLink)) {
      document.body.removeChild(downloadLink);
    }
    URL.revokeObjectURL(blobUrl);
  }, 1500);
}
