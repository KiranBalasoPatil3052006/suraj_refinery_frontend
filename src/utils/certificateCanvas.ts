import html2canvas from 'html2canvas';

export const CERTIFICATE_WIDTH = 1200;
export const CERTIFICATE_HEIGHT = 800;
export const CERTIFICATE_RENDER_SCALE = 3;

const EXPORT_MIRROR_ID = 'sba-certificate-export-mirror';

async function waitForCertificateAssets(element: HTMLElement): Promise<void> {
  if (typeof document !== 'undefined' && 'fonts' in document) {
    try {
      await Promise.all([
        document.fonts.load('700 48px Outfit'),
        document.fonts.load('700 14px Outfit'),
        document.fonts.load('600 19px "Playfair Display"'),
      ]);
      await document.fonts.ready;
    } catch {
      // The browser will use an available fallback if a custom font is absent.
    }
  }

  await Promise.all(
    Array.from(element.querySelectorAll('img')).map(async (image) => {
      if (!image.complete) {
        await new Promise<void>((resolve) => {
          image.addEventListener('load', () => resolve(), { once: true });
          image.addEventListener('error', () => resolve(), { once: true });
        });
      }

      if (typeof image.decode === 'function') {
        try {
          await image.decode();
        } catch {
          // An image decode error is handled by the normal image fallback.
        }
      }
    })
  );
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

/**
 * A foreignObject canvas uses the browser's own text layout, so glyphs keep
 * the exact same baseline as their adjacent SVG/image icons. It cannot safely
 * load external image URLs from its serialized SVG, therefore every loaded
 * certificate image is embedded before the export mirror is captured.
 */
async function imageToEmbeddedSource(image: HTMLImageElement): Promise<string> {
  const source = image.currentSrc || image.src;
  if (!source || source.startsWith('data:')) {
    return source;
  }

  try {
    const response = await fetch(source, { mode: 'cors' });
    if (!response.ok) {
      return source;
    }

    return await blobToDataUrl(await response.blob());
  } catch {
    // Keep the original source as a fallback. This matches the existing
    // html2canvas behavior for an image served without CORS permission.
    return source;
  }
}

async function createExportMirror(certEl: HTMLElement): Promise<HTMLElement> {
  document.getElementById(EXPORT_MIRROR_ID)?.remove();

  const originalImages = Array.from(certEl.querySelectorAll('img'));
  const embeddedSources = await Promise.all(originalImages.map(imageToEmbeddedSource));

  const mirror = certEl.cloneNode(true) as HTMLElement;
  mirror.id = EXPORT_MIRROR_ID;
  mirror.setAttribute('aria-hidden', 'true');

  // The mirror must remain in the document for foreignObject rendering, but
  // it stays behind the app so users never see an export-only frame flash.
  mirror.style.setProperty('position', 'fixed', 'important');
  mirror.style.setProperty('left', '0', 'important');
  mirror.style.setProperty('top', '0', 'important');
  mirror.style.setProperty('z-index', '-1', 'important');
  mirror.style.setProperty('width', `${CERTIFICATE_WIDTH}px`, 'important');
  mirror.style.setProperty('height', `${CERTIFICATE_HEIGHT}px`, 'important');
  mirror.style.setProperty('transform', 'none', 'important');
  mirror.style.setProperty('transform-origin', 'top left', 'important');
  mirror.style.setProperty('margin', '0', 'important');
  mirror.style.setProperty('pointer-events', 'none', 'important');

  const mirrorImages = Array.from(mirror.querySelectorAll('img'));
  mirrorImages.forEach((image, index) => {
    const source = embeddedSources[index];
    if (source) {
      image.src = source;
    }
  });

  document.body.appendChild(mirror);

  await Promise.all(
    mirrorImages.map(async (image) => {
      if (typeof image.decode === 'function') {
        try {
          await image.decode();
        } catch {
          // The visible image state is still usable if decode is unsupported.
        }
      }
    })
  );

  // Commit the mirror's asset and font layout before html2canvas serializes it.
  await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
  return mirror;
}

/**
 * Builds the PDF/print bitmap using the browser's native HTML layout engine.
 * Unlike html2canvas's CanvasRenderer, foreignObject rendering does not
 * recalculate font baselines, which prevents export-only downward text drift.
 */
export async function renderCertificateCanvas(certEl: HTMLElement): Promise<string> {
  await waitForCertificateAssets(certEl);

  const mirror = await createExportMirror(certEl);

  try {
    const canvas = await html2canvas(mirror, {
      scale: CERTIFICATE_RENDER_SCALE,
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#ffffff',
      logging: false,
      foreignObjectRendering: true,
      width: CERTIFICATE_WIDTH,
      height: CERTIFICATE_HEIGHT,
      windowWidth: CERTIFICATE_WIDTH,
      windowHeight: CERTIFICATE_HEIGHT,
      scrollX: 0,
      scrollY: 0,
    });

    return canvas.toDataURL('image/jpeg', 0.98);
  } finally {
    mirror.remove();
  }
}
