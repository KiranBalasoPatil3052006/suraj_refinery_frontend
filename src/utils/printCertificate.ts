import { renderCertificateCanvas } from './certificateCanvas';

/**
 * Print utility — optimized for both Desktop and Mobile Chrome/Safari
 *
 * Uses the same renderCertificateCanvas approach as PDF generation,
 * formatting the certificate for A4 sheet with A5 top-half alignment.
 */

function findCertificateElement(elementId: string): HTMLElement | null {
  return (
    document.getElementById(elementId) ||
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
  return printCertificateDocument(imgData);
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
  size: A4 portrait;
  margin: 0;
}
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
html, body {
  margin: 0 !important;
  padding: 0 !important;
  width: 100% !important;
  height: 100% !important;
  background: #ffffff !important;
  overflow: hidden !important;
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
}
.a4-sheet {
  width: 100% !important;
  max-width: 100% !important;
  height: 100% !important;
  position: relative !important;
  background: #ffffff !important;
  margin: 0 !important;
  padding: 0 !important;
  overflow: hidden !important;
}
.cert-print-img {
  width: 100% !important;
  min-width: 100% !important;
  max-width: 100% !important;
  height: 148.5mm !important;
  display: block !important;
  margin: 0 !important;
  padding: 0 !important;
  border: none !important;
  object-fit: fill !important;
}
</style>
</head>
<body>
<div class="a4-sheet">
  <img id="certPrintImg" class="cert-print-img" src="${imgData}" alt="Certificate">
</div>
</body>
</html>`;
}

function printCertificateDocument(imgData: string): Promise<void> {
  const isMobile =
    typeof navigator !== 'undefined' &&
    /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  // On mobile browsers, window.open is the most reliable way to invoke Android/iOS print spooler
  if (isMobile) {
    return new Promise((resolve) => {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.open();
        printWindow.document.write(generatePrintHtml(imgData));
        printWindow.document.close();

        const printImg = printWindow.document.getElementById('certPrintImg') as HTMLImageElement | null;
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
      printViaIframe(imgData).then(resolve);
    });
  }

  // On desktop browsers, iframe printing is completely silent and clean
  return printViaIframe(imgData);
}

function printViaIframe(imgData: string): Promise<void> {
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
    frameDoc.write(generatePrintHtml(imgData));
    frameDoc.close();

    const printImg = frameDoc.getElementById('certPrintImg') as HTMLImageElement | null;
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
