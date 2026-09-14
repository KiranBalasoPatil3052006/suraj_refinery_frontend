import jsPDF from 'jspdf';
import { renderCertificateCanvas } from './certificateCanvas';

/**
 * PDF generation — exact match to reference certificate.js
 *
 * Renders ONLY the certificate node (#certificate / #complete-certificate-canvas),
 * never the surrounding UI. Resets transform to 'none' for 1:1 capture,
 * then restores it immediately after.
 */

const A5_CERT_WIDTH_MM = 210;    // A5 size certificate width (printed horizontally on A4)
const A5_CERT_HEIGHT_MM = 148.5; // A5 size certificate height (covers exactly half of A4)

function findCertificateElement(elementId: string): HTMLElement | null {
  return (
    document.getElementById(elementId) ||
    document.getElementById('complete-certificate-canvas') ||
    document.getElementById('details-complete-certificate-canvas') ||
    document.getElementById('offscreen-certificate-canvas') ||
    document.getElementById('live-form-certificate-canvas')
  );
}

/**
 * High-resolution PDF generator for Silver Sample Certificates.
 * Generates an A4 portrait page with horizontal A5 certificate (210mm x 148.5mm)
 * occupying the top half of the A4 page.
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

  // Generate A4 portrait sheet containing horizontal A5 certificate on top half
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  doc.addImage(imgData, 'JPEG', 0, 0, A5_CERT_WIDTH_MM, A5_CERT_HEIGHT_MM, undefined, 'FAST');

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
