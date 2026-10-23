import jsPDF from 'jspdf';
import { renderCertificateCanvas } from './certificateCanvas';

/**
 * PDF generation — exact match to reference certificate.js
 *
 * Renders ONLY the certificate node (#certificate / #complete-certificate-canvas),
 * never the surrounding UI. Resets transform to 'none' for 1:1 capture,
 * then restores it immediately after.
 */

export type PdfOrientation = 'horizontal' | 'vertical';

const A5_PAGE_WIDTH_MM = 210;
const A5_PAGE_HEIGHT_MM = 148;
const HORIZONTAL_MARGIN_MM = 3; // Space after border on left & right (3mm margin)

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
 * Rotates an image data URL by specified angle degrees using a 2D canvas.
 */
async function rotateDataUrl(dataUrl: string, angleDegrees: number = 270): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(dataUrl);
        return;
      }

      if (angleDegrees === 90 || angleDegrees === 270 || angleDegrees === -90) {
        canvas.width = img.naturalHeight || img.height;
        canvas.height = img.naturalWidth || img.width;
      } else {
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
      }

      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((angleDegrees * Math.PI) / 180);
      ctx.drawImage(img, -(img.naturalWidth || img.width) / 2, -(img.naturalHeight || img.height) / 2);
      ctx.restore();

      resolve(canvas.toDataURL('image/jpeg', 0.98));
    };
    img.onerror = (e) => reject(e);
    img.src = dataUrl;
  });
}

/**
 * High-resolution PDF generator for Silver Sample Certificates.
 * Supports:
 * - 'horizontal' (default): True A5 landscape PDF page (210mm x 148mm)
 * - 'vertical': True A5 portrait PDF page (148mm x 210mm)
 * Both orientations preserve aspect ratio and provide space after the border.
 */
export async function generateCertificatePDF(
  elementId: string,
  filename: string = 'Silver-Certificate-0100.pdf',
  orientation: PdfOrientation = 'horizontal'
): Promise<void> {
  const element = findCertificateElement(elementId);

  if (!element) {
    throw new Error(`Target certificate element "${elementId}" not found in DOM.`);
  }

  const imgData = await renderCertificateCanvas(element);

  let doc: jsPDF;
  let xOffsetMm: number;
  let yOffsetMm: number;
  let certWidthMm: number;
  let certHeightMm: number;

  if (orientation === 'vertical') {
    // A5 Portrait: 148mm wide x 210mm high
    doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a5',
      compress: true,
    });

    // Rotate 270° counter-clockwise so the certificate vertically fills the portrait A5 sheet
    const rotatedImgData = await rotateDataUrl(imgData, 270);

    const pageWidthMm = 148;
    const pageHeightMm = 210;
    const topBottomMarginMm = 3; // 3mm margin on top and bottom

    certHeightMm = pageHeightMm - (topBottomMarginMm * 2); // 204mm
    certWidthMm = (665 / 1024) * certHeightMm; // ~132.48mm
    xOffsetMm = (pageWidthMm - certWidthMm) / 2; // ~7.76mm side margins
    yOffsetMm = topBottomMarginMm; // 3mm

    doc.addImage(rotatedImgData, 'JPEG', xOffsetMm, yOffsetMm, certWidthMm, certHeightMm, undefined, 'FAST');
  } else {
    // A5 Landscape: 210mm wide x 148mm high
    doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a5',
      compress: true,
    });

    certWidthMm = A5_PAGE_WIDTH_MM - (HORIZONTAL_MARGIN_MM * 2); // 204mm
    certHeightMm = (665 / 1024) * certWidthMm; // ~132.48mm
    xOffsetMm = HORIZONTAL_MARGIN_MM; // 3mm
    yOffsetMm = (A5_PAGE_HEIGHT_MM - certHeightMm) / 2; // ~7.76mm

    doc.addImage(imgData, 'JPEG', xOffsetMm, yOffsetMm, certWidthMm, certHeightMm, undefined, 'FAST');
  }

  // Trigger universal download via Blob URL
  const blob = doc.output('blob');
  const blobUrl = URL.createObjectURL(blob);
  const downloadLink = document.createElement('a');
  downloadLink.href = blobUrl;

  // Suffix filename with orientation if not already present
  let baseName = filename.replace(/\.pdf$/i, '');
  if (orientation === 'vertical' && !baseName.toLowerCase().includes('vertical')) {
    baseName += '-Vertical';
  } else if (orientation === 'horizontal' && !baseName.toLowerCase().includes('horizontal')) {
    baseName += '-Horizontal';
  }
  downloadLink.download = `${baseName}.pdf`;

  document.body.appendChild(downloadLink);
  downloadLink.click();

  setTimeout(() => {
    if (document.body.contains(downloadLink)) {
      document.body.removeChild(downloadLink);
    }
    URL.revokeObjectURL(blobUrl);
  }, 1500);
}

/**
 * Draws a sharp, clean vector scissors icon cutting horizontally onto a line.
 * Matches the reference image with circular handles on the left and open crossed blades pointing right.
 */
function drawVectorScissors(doc: jsPDF, startX: number, centerY: number, scale: number = 0.8) {
  doc.saveGraphicsState();
  doc.setDrawColor(130, 130, 130);
  doc.setLineWidth(0.35 * scale);
  doc.setLineDashPattern([], 0); // Solid lines for the scissors

  const handleRadius = 2.0 * scale;
  const handleX = startX + 2.5 * scale;
  const topHandleY = centerY - 2.8 * scale;
  const bottomHandleY = centerY + 2.8 * scale;
  const tipX = startX + 13.0 * scale;
  const tipSpanY = 3.6 * scale;

  // Handles (loops)
  doc.circle(handleX, topHandleY, handleRadius);
  doc.circle(handleX, bottomHandleY, handleRadius);

  // Blade 1: from top handle through pivot to bottom tip
  doc.line(
    handleX + handleRadius * 0.7,
    topHandleY + handleRadius * 0.7,
    tipX,
    centerY + tipSpanY
  );

  // Blade 2: from bottom handle through pivot to top tip
  doc.line(
    handleX + handleRadius * 0.7,
    bottomHandleY - handleRadius * 0.7,
    tipX,
    centerY - tipSpanY
  );

  doc.restoreGraphicsState();
}

/**
 * High-resolution Double Template PDF Generator (A4 Sheet).
 * Places TWO identical blank certificate templates on a single A4 portrait page (210mm x 297mm):
 * - Top form centered in top A5 half (y: 8.01mm to 140.49mm)
 * - Light-grey dashed cut line with scissor indicator at exact center (y: 148.5mm)
 * - Bottom form centered in bottom A5 half (y: 156.51mm to 288.99mm)
 *
 * Each form has exact 3mm side margins and 8.01mm top/bottom margins, matching the A5 certificate layout.
 * When cut along the center dashed line, each sheet becomes a standard A5 pre-printed certificate.
 */
export async function generateDoubleTemplatePDF(
  elementId: string,
  filename: string = 'Silver-Certificate-Template-Double-A4.pdf'
): Promise<void> {
  const element = findCertificateElement(elementId);

  if (!element) {
    throw new Error(`Target certificate element "${elementId}" not found in DOM.`);
  }

  const imgData = await renderCertificateCanvas(element);

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4', // 210mm wide x 297mm high
    compress: true,
  });

  const pageWidthMm = 210;
  const pageHeightMm = 297;
  const halfHeightMm = pageHeightMm / 2; // 148.5mm

  const sideMarginMm = 3;
  const certWidthMm = pageWidthMm - (sideMarginMm * 2); // 204mm
  const certHeightMm = (665 / 1024) * certWidthMm; // ~132.48mm
  const verticalMarginMm = (halfHeightMm - certHeightMm) / 2; // ~8.01mm

  // 1. Top Certificate Form (A5 Top Half)
  const topY = verticalMarginMm; // 8.01mm
  doc.addImage(imgData, 'JPEG', sideMarginMm, topY, certWidthMm, certHeightMm, undefined, 'FAST');

  // 2. Center Cut Line (Exact half-way at 148.5mm)
  const cutY = halfHeightMm;

  // Draw vector scissors on the left cutting into the dashed line
  drawVectorScissors(doc, 4, cutY, 0.75);

  // Light-grey dashed cut line starting right at scissor blades and extending across sheet
  doc.setDrawColor(180, 180, 180);
  doc.setLineDashPattern([2.5, 2], 0);
  doc.setLineWidth(0.25);
  doc.line(15, cutY, pageWidthMm - 5, cutY);

  // 3. Bottom Certificate Form (A5 Bottom Half)
  const bottomY = halfHeightMm + verticalMarginMm; // 156.51mm
  doc.addImage(imgData, 'JPEG', sideMarginMm, bottomY, certWidthMm, certHeightMm, undefined, 'FAST');

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
