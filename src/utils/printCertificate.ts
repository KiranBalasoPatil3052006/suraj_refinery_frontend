import { renderCertificateCanvas } from './certificateCanvas';

/**
 * Print utility — optimized for both Desktop and Mobile Chrome/Safari
 *
 * Uses the same renderCertificateCanvas approach as PDF generation,
 * formatting the certificate on a true A5 landscape sheet.
 */

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

export async function printCertificate(elementId: string): Promise<void> {
  const element = findCertificateElement(elementId);

  if (!element) {
    throw new Error(`Target certificate element "${elementId}" not found in DOM.`);
  }

  const imgData = await renderCertificateCanvas(element);
  return printCertificateDocument(imgData, false);
}

export async function printDoubleCertificate(elementId: string): Promise<void> {
  const element = findCertificateElement(elementId);

  if (!element) {
    throw new Error(`Target certificate element "${elementId}" not found in DOM.`);
  }

  const imgData = await renderCertificateCanvas(element);
  return printCertificateDocument(imgData, true);
}

function generatePrintHtml(imgData: string): string {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>SBA Silver Certificate</title>
<style>
@page {
  size: 210mm 148mm;
  margin: 0;
}
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
html, body {
  width: 210mm !important;
  height: 148mm !important;
  margin: 0 !important;
  padding: 0 !important;
  background: #ffffff !important;
  overflow: hidden !important;
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
}
.a5-sheet {
  width: 210mm !important;
  height: 148mm !important;
  box-sizing: border-box !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  padding: 7.76mm 3mm !important;
  background: #ffffff !important;
  margin: 0 !important;
  overflow: hidden !important;
}
.cert-print-img {
  width: 204mm !important;
  height: 132.48mm !important;
  max-width: 204mm !important;
  max-height: 132.48mm !important;
  display: block !important;
  margin: auto !important;
  padding: 0 !important;
  border: none !important;
  object-fit: contain !important;
}
</style>
</head>
<body>
<div class="a5-sheet">
  <img id="certPrintImg" class="cert-print-img" src="${imgData}" alt="Certificate">
</div>
</body>
</html>`;
}

function generateDoublePrintHtml(imgData: string): string {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>SBA Silver Certificate - Double Template (A4)</title>
<style>
@page {
  size: 210mm 297mm portrait;
  margin: 0;
}
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
html, body {
  width: 210mm !important;
  height: 297mm !important;
  margin: 0 !important;
  padding: 0 !important;
  background: #ffffff !important;
  overflow: hidden !important;
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
}
.a4-container {
  width: 210mm !important;
  height: 297mm !important;
  position: relative !important;
  background: #ffffff !important;
  margin: 0 !important;
  overflow: hidden !important;
}
.a5-half {
  width: 210mm !important;
  height: 148.5mm !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  padding: 8.01mm 3mm !important;
  box-sizing: border-box !important;
}
.cert-print-img {
  width: 204mm !important;
  height: 132.48mm !important;
  max-width: 204mm !important;
  max-height: 132.48mm !important;
  display: block !important;
  margin: auto !important;
  padding: 0 !important;
  border: none !important;
  object-fit: contain !important;
}
.cut-line-wrapper {
  position: absolute !important;
  top: 148.5mm !important;
  left: 0 !important;
  width: 210mm !important;
  height: 0 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  z-index: 10 !important;
}
.cut-line {
  width: 100% !important;
  display: flex !important;
  align-items: center !important;
  padding: 0 4mm !important;
  box-sizing: border-box !important;
}
.cut-scissors-svg {
  flex-shrink: 0 !important;
  margin-right: 2mm !important;
  width: 22px !important;
  height: 15px !important;
}
.cut-rule {
  flex: 1 !important;
  border-top: 1px dashed #b8b8b8 !important;
  height: 0 !important;
}
</style>
</head>
<body>
<div class="a4-container">
  <div class="a5-half top-half">
    <img id="certPrintImg1" class="cert-print-img" src="${imgData}" alt="Certificate Top">
  </div>
  <div class="cut-line-wrapper">
    <div class="cut-line">
      <svg class="cut-scissors-svg" viewBox="0 0 48 32">
        <g fill="none" stroke="#777777" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="9" cy="9" r="5"/>
          <circle cx="9" cy="23" r="5"/>
          <path d="M13 11 L36 26"/>
          <path d="M13 21 L36 6"/>
        </g>
      </svg>
      <div class="cut-rule"></div>
    </div>
  </div>
  <div class="a5-half bottom-half">
    <img id="certPrintImg2" class="cert-print-img" src="${imgData}" alt="Certificate Bottom">
  </div>
</div>
</body>
</html>`;
}

function printCertificateDocument(imgData: string, isDoubleA4: boolean = false): Promise<void> {
  const isMobile =
    typeof navigator !== 'undefined' &&
    /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  const htmlContent = isDoubleA4 ? generateDoublePrintHtml(imgData) : generatePrintHtml(imgData);

  // On mobile browsers, window.open is the most reliable way to invoke Android/iOS print spooler
  if (isMobile) {
    return new Promise((resolve) => {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.open();
        printWindow.document.write(htmlContent);
        printWindow.document.close();

        const printImg = (printWindow.document.getElementById('certPrintImg') ||
          printWindow.document.getElementById('certPrintImg1')) as HTMLImageElement | null;
        const trigger = () => {
          setTimeout(() => {
            try {
              printWindow.focus();
              printWindow.print();
            } catch (e) {
              console.warn('Print window print failed:', e);
            }
            resolve();
          }, 300);
        };

        if (printImg && printImg.complete) {
          trigger();
        } else if (printImg) {
          printImg.onload = trigger;
          printImg.onerror = trigger;
        } else {
          trigger();
        }
        return;
      }
      // If popup blocked on mobile, fall through to iframe method
      printViaIframe(htmlContent).then(resolve);
    });
  }

  // On desktop browsers, iframe printing is completely silent and clean
  return printViaIframe(htmlContent);
}

function printViaIframe(htmlContent: string): Promise<void> {
  return new Promise((resolve) => {
    let frame = document.getElementById('sbaCertificateHiddenPrintFrame') as HTMLIFrameElement | null;
    if (frame) {
      frame.remove();
    }

    frame = document.createElement('iframe');
    frame.id = 'sbaCertificateHiddenPrintFrame';
    frame.setAttribute('aria-hidden', 'true');
    frame.style.position = 'fixed';
    frame.style.right = '0';
    frame.style.bottom = '0';
    frame.style.width = '0';
    frame.style.height = '0';
    frame.style.border = '0';
    frame.style.margin = '0';
    frame.style.padding = '0';
    document.body.appendChild(frame);

    const frameDoc = frame.contentWindow?.document;
    if (!frameDoc) {
      window.print();
      resolve();
      return;
    }

    frameDoc.open();
    frameDoc.write(htmlContent);
    frameDoc.close();

    const printImg = (frameDoc.getElementById('certPrintImg') ||
      frameDoc.getElementById('certPrintImg1')) as HTMLImageElement | null;
    const currentFrame = frame;

    const triggerPrint = () => {
      setTimeout(() => {
        try {
          currentFrame.contentWindow?.focus();
          currentFrame.contentWindow?.print();
        } catch (err) {
          console.warn('Iframe print failed, falling back to window.print():', err);
          window.print();
        }
        resolve();
      }, 250);
    };

    if (printImg && printImg.complete) {
      triggerPrint();
    } else if (printImg) {
      printImg.onload = triggerPrint;
      printImg.onerror = triggerPrint;
    } else {
      triggerPrint();
    }
  });
}
