import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Certificate } from '../../types/certificate';
import { formatDisplayDate } from '../../utils/purity';
import { useStoreSettings } from '../../context/StoreSettingsContext';
import shivanLogo from '../../assets/shivan.png';
import mobileIcon from '../../assets/mobile.png';
import flowerIcon from '../../assets/flower.png';
import titleDesignImg from '../../assets/title-design.png';
import bgLayoutBorder from '../../assets/bglayout.png';
import './certificate.css';

interface CompleteCertificateProps {
  certificate: Certificate;
  id?: string;
  className?: string;
  isPdfCapture?: boolean;
  printMode?: 'complete' | 'values';
  isTemplate?: boolean;
}

export const CERTIFICATE_WIDTH = 1024;
export const CERTIFICATE_HEIGHT = 665;
const DIGIT_WORDS = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];

function splitFineness(value: string | undefined) {
  const [intPart = '', decPart = ''] = String(value ?? '').trim().split('.');
  return { intPart, decPart };
}

function finenessToDigitWords(value: string | undefined): string {
  return String(value ?? '')
    .replace(/\D/g, '')
    .split('')
    .map((digit) => DIGIT_WORDS[Number(digit)])
    .join(' ');
}

/** Applies the certificate's single numeric typeface to every number run */
function renderCertificateText(value: string | undefined): React.ReactNode {
  return String(value ?? '')
    .split(/(\d+(?:[./-]\d+)*)/g)
    .filter(Boolean)
    .map((part, index) =>
      /^\d/.test(part) ? (
        <span className="certificate-number" key={`${part}-${index}`}>
          {part}
        </span>
      ) : (
        part
      )
    );
}

/**
 * Exact replica of the physical SBA Silver Sample Certificate.
 * Calibrated pixel-for-pixel to the reference artifact (1024 x 665).
 */
export const CompleteCertificate: React.FC<CompleteCertificateProps> = ({
  certificate,
  id = 'complete-certificate-canvas',
  className = '',
  isPdfCapture = false,
  printMode,
  isTemplate = false,
}) => {
  const { settings } = useStoreSettings();
  const isValuesOnly = (printMode || certificate.printType) === 'values';
  const viewportRef = useRef<HTMLDivElement>(null);
  const certificateRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLSpanElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (isPdfCapture) {
      setScale(1);
      return;
    }

    const updateScale = () => {
      const availableWidth = viewportRef.current?.clientWidth ?? 0;
      if (availableWidth > 0) {
        setScale(Math.min(1, availableWidth / CERTIFICATE_WIDTH));
      }
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    if (viewportRef.current) observer.observe(viewportRef.current);
    window.addEventListener('resize', updateScale);
    window.addEventListener('orientationchange', updateScale);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateScale);
      window.removeEventListener('orientationchange', updateScale);
    };
  }, [isPdfCapture]);

  const fontScale = (settings.overallFontScale || 100) / 100;
  const fieldValueSize = Math.round(22 * fontScale);

  useLayoutEffect(() => {
    const elements = certificateRef.current?.querySelectorAll<HTMLElement>(
      '.field-value:not(.mark-value)'
    );
    elements?.forEach((element) => {
      let size = fieldValueSize;
      element.style.fontSize = `${size}px`;
      while (element.scrollWidth > element.clientWidth && size > 13) {
        size -= 1;
        element.style.fontSize = `${size}px`;
      }
    });
  }, [certificate.customerName, certificate.serialNo, certificate.date, certificate.markLines, fieldValueSize]);

  const markLines = isTemplate ? [] : certificate.markLines ?? [];
  const displayedMarkLines = [...markLines];
  while (displayedMarkLines.length < 2) displayedMarkLines.push('');
  const purity = isTemplate ? '' : certificate.purity || '';
  const { intPart, decPart } = splitFineness(purity);
  const purityWords = purity ? certificate.purityWords || finenessToDigitWords(purity) : '';
  const registrationNumber = settings.regdNo
    .replace(/^Regd\.?\s*No\.?\s*:?\s*/i, '')
    .trim();
  const address = [settings.addressLine1, settings.addressLine2].filter(Boolean).join(' ');

  return (
    <div ref={viewportRef} className={`certificate-viewport ${className}`}>
      <div
        className="certificate-scaler"
        style={{
          width: isPdfCapture ? CERTIFICATE_WIDTH : CERTIFICATE_WIDTH * scale,
          height: isPdfCapture ? CERTIFICATE_HEIGHT : CERTIFICATE_HEIGHT * scale,
        }}
      >
        <div
          ref={certificateRef}
          id={id}
          className={`certificate ${isValuesOnly ? 'print-values-only' : ''} ${isTemplate ? 'is-template-mode' : ''}`}
          style={{
            transform: isPdfCapture ? 'none' : `scale(${scale})`,
            transformOrigin: 'top left',
          }}
        >
          {/* Double border background image */}
          <img
            className="cert-bg-border"
            src={bgLayoutBorder}
            alt=""
            aria-hidden="true"
            crossOrigin="anonymous"
          />

          {/* Top Registration Number */}
          <div className="cert-registration">
            Regd. No. <span className="certificate-number">{renderCertificateText(registrationNumber)}</span>
          </div>

          {/* Top Phone with Mobile Icon */}
          <div className="cert-phone">
            <img
              className="cert-phone-icon"
              src={mobileIcon}
              alt=""
              aria-hidden="true"
              crossOrigin="anonymous"
            />
            <span className="certificate-number">{renderCertificateText(settings.phone)}</span>
          </div>

          {/* Shivan Seal Logo */}
          <img
            className="cert-logo"
            src={shivanLogo}
            alt="Suraj Bullion Assayers Seal"
            crossOrigin="anonymous"
          />

          {/* Company Title — Large & Bold */}
          <div className="cert-company-name">
            {renderCertificateText(settings.englishTitle)}
          </div>

          {/* Address */}
          <div className="cert-address">
            {address}
          </div>

          {/* Subtitle Design Banner */}
          <div className="cert-subtitle">
            <img
              className="cert-subtitle-image"
              src={titleDesignImg}
              alt="Silver Sample Certificate"
              crossOrigin="anonymous"
            />
          </div>

          {/* M/s. field */}
          <div className="cert-field-row ms-row">
            <span className="field-label">M/s.</span>
            <span ref={nameRef} className="field-value">
              {isTemplate ? '' : renderCertificateText(certificate.customerName)}
            </span>
          </div>

          {/* Mark line 1 */}
          <div className="cert-field-row mark-row">
            <span className="field-label">Mark</span>
            <span className="field-value mark-value">
              {renderCertificateText(displayedMarkLines[0])}
            </span>
          </div>

          {/* Mark line 2 (second underline) */}
          <div className="cert-field-row mark-line-2-row">
            <span className="field-value mark-value mark-line-2">
              {renderCertificateText(displayedMarkLines[1])}
            </span>
          </div>

          {/* Sample photo evidence (when attached) */}
          {!isTemplate && certificate.samplePhotoUrl && (
            <div className="sample-box sample-rectangle-box">
              <div className="sample-image-frame">
                <img
                  src={certificate.samplePhotoUrl}
                  alt="Silver sample"
                  className={`sample-image sample-vertical-image ${certificate.photoFit === 'contain' ? 'is-contain' : 'is-cover'}`}
                  crossOrigin="anonymous"
                />
              </div>
            </div>
          )}

          {/* S.No. field — precisely aligned at x = 698px */}
          <div className="cert-field-row sno-row">
            <span className="field-label">S.No.</span>
            <span className="field-value num-value">
              {isTemplate ? '' : renderCertificateText(certificate.serialNo)}
            </span>
          </div>

          {/* Date field — precisely aligned at x = 698px directly beneath S.No. */}
          <div className="cert-field-row date-row">
            <span className="field-label">Date</span>
            <span className="field-value num-value">
              {isTemplate ? '' : renderCertificateText(formatDisplayDate(certificate.date))}
            </span>
          </div>

          {/* Fineness Box Section */}
          <div className="fineness-section">
            <div className="fineness-label">Fineness</div>
            <div className="fineness-box">
              {isTemplate || !purity ? (
                <img
                  className="fineness-flower-icon"
                  src={flowerIcon}
                  alt="Decorative Flower"
                  crossOrigin="anonymous"
                />
              ) : (
                <>
                  <div className="fineness-value">
                    <span className="certificate-number">{intPart}</span>
                    {decPart && <span className="diamond">◆</span>}
                    {decPart && <span className="certificate-number">{decPart}</span>}
                  </div>
                  <div className="fineness-words">{purityWords}</div>
                </>
              )}
            </div>
          </div>

          {/* For Company Block — starts at left edge of Fineness box */}
          <div className="for-company">
            For <strong>{renderCertificateText(settings.englishTitle)}</strong>
          </div>

          {/* Proprietor Block — positioned under the signature area on right */}
          <div className="proprietor-label">
            {settings.proprietorLabel}
          </div>
        </div>
      </div>
    </div>
  );
};
