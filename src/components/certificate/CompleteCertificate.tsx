import React, { useRef, useEffect, useState, useLayoutEffect } from 'react';
import { Certificate } from '../../types/certificate';
import { formatDisplayDate } from '../../utils/purity';
import { useStoreSettings } from '../../context/StoreSettingsContext';
import './certificate.css';

interface CompleteCertificateProps {
  certificate: Certificate;
  id?: string;
  className?: string;
  isPdfCapture?: boolean;
  printMode?: 'complete' | 'values';
}

const DIGIT_WORDS = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];

function splitFineness(value: string | undefined) {
  const str = String(value == null ? '' : value).trim();
  const parts = str.split('.');
  return { intPart: parts[0] || '', decPart: parts[1] || '' };
}

function finenessToDigitWords(value: string | undefined): string {
  const { intPart, decPart } = splitFineness(value);
  const digits = (intPart + decPart).split('');
  return digits
    .filter((ch) => ch >= '0' && ch <= '9')
    .map((ch) => DIGIT_WORDS[parseInt(ch, 10)])
    .join(' ');
}

/**
 * CompleteCertificate ? React port of certificate/certificate.html
 *
 * This component produces EXACTLY the same DOM structure and CSS class names
 * as the reference certificate module. The HTML, CSS, and rendering pipeline
 * are a 1:1 match to ensure identical output in UI, PDF, and Print.
 *
 * Class names intentionally match the reference (no 'sba-' prefix) so the
 * ported certificate.css works without modification.
 */
export const CompleteCertificate: React.FC<CompleteCertificateProps> = ({
  certificate,
  id = 'complete-certificate-canvas',
  className = '',
  isPdfCapture = false,
  printMode,
}) => {
  const { settings } = useStoreSettings();
  const isValuesOnly = (printMode || certificate.printType) === 'values';
  const viewportRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLSpanElement>(null);
  const [scale, setScale] = useState<number>(1);

  // Responsive scaling — matches reference certificate.js scaleCertificate()
  useEffect(() => {
    if (isPdfCapture) {
      setScale(1);
      return;
    }

    const updateScale = () => {
      if (viewportRef.current) {
        const availableWidth = viewportRef.current.clientWidth;
        if (availableWidth > 0) {
          const newScale = Math.min(1, availableWidth / 1200);
          setScale(newScale);
        }
      }
    };

    updateScale();

    const ro = new ResizeObserver(updateScale);
    if (viewportRef.current) {
      ro.observe(viewportRef.current);
    }
    window.addEventListener('resize', updateScale);
    window.addEventListener('orientationchange', updateScale);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updateScale);
      window.removeEventListener('orientationchange', updateScale);
    };
  }, [isPdfCapture]);

  const fontScale = (settings.overallFontScale || 100) / 100;
  const tamilFontSize = Math.round((settings.tamilTitleFontSize || 28) * fontScale);
  const englishFontSize = Math.round((settings.englishTitleFontSize || 26) * fontScale);
  const subtitleFontSize = Math.round((settings.subtitleFontSize || 15) * fontScale);
  const contactFontSize = Math.round((settings.contactFontSize || 17) * fontScale);
  const fieldValuesFontSize = Math.round((settings.fieldValuesFontSize || 18) * fontScale);

  // Fit customer name on a single line — matches reference fitSingleLine()
  useLayoutEffect(() => {
    const el = nameRef.current;
    if (!el) return;
    el.style.fontSize = `${fieldValuesFontSize}px`;
    let size = fieldValuesFontSize;
    let guard = 0;
    while (el.scrollWidth > el.clientWidth && size > 12 && guard < 40) {
      size -= 1;
      el.style.fontSize = `${size}px`;
      guard += 1;
    }
  }, [certificate.customerName, fieldValuesFontSize]);

  const { intPart, decPart } = splitFineness(certificate.purity);
  const words = certificate.purityWords || finenessToDigitWords(certificate.purity);
  const displayDate = formatDisplayDate(certificate.date);

  const markLines = certificate.markLines && certificate.markLines.length > 0
    ? certificate.markLines
    : ['Silver Chain', ''];

  const markLine1 = markLines[0] || '';
  const remainingMarkLines = markLines.slice(1);

  return (
    <div
      ref={viewportRef}
      className={`certificate-viewport ${className}`}
    >
      <div
        className="certificate-scaler"
        style={{
          width: isPdfCapture ? 1200 : 1200 * scale,
          height: isPdfCapture ? 800 : 800 * scale,
        }}
      >
        <div
          id={id}
          className={`certificate ${isValuesOnly ? 'print-values-only' : ''}`}
          style={{
            transform: isPdfCapture ? 'none' : `scale(${scale})`,
            transformOrigin: 'top left',
          }}
        >
          {/* Ornate certificate background image */}
          <img
            src="/assets/bglayout.png"
            alt=""
            className="cert-bg-img"
            aria-hidden="true"
            crossOrigin="anonymous"
          />

          <div className="cert-content">
            {/* Header: Contact Block (Left) + Title (Center) + Spacer (Right) */}
            <div className="cert-header">
              <div className="cert-contact">
                <div className="contact-row contact-phone" style={{ fontSize: `${contactFontSize}px` }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 5 5L14 13l5 2v3a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2Z" />
                  </svg>
                  <span>{settings.phone}</span>
                </div>
                <div className="contact-row contact-address" style={{ fontSize: `${contactFontSize}px` }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11Z" />
                    <circle cx="12" cy="10" r="2.4" />
                  </svg>
                  <span>
                    {settings.addressLine1}
                    <br />
                    {settings.addressLine2}
                  </span>
                </div>
              </div>

              <div className="cert-title-block">
                <div className="cert-tamil-title" style={{ fontSize: `${tamilFontSize}px` }}>
                  {settings.tamilTitle}
                </div>
                <div className="cert-english-title" style={{ fontSize: `${englishFontSize}px` }}>
                  {settings.englishTitle}
                </div>
                <div className="cert-subtitle">
                  <svg className="rule cert-subtitle-line" width="46" height="18" viewBox="0 0 46 18" aria-hidden="true">
                    <line x1="0" y1="9" x2="46" y2="9" stroke="#C9A227" strokeWidth="1.5" />
                  </svg>
                  <span className="cert-subtitle-text" style={{ fontSize: `${subtitleFontSize}px` }}>
                    {settings.subtitle}
                  </span>
                  <svg className="rule cert-subtitle-line" width="46" height="18" viewBox="0 0 46 18" aria-hidden="true">
                    <line x1="0" y1="9" x2="46" y2="9" stroke="#C9A227" strokeWidth="1.5" />
                  </svg>
                </div>
              </div>

              <div className="cert-header-spacer" />
            </div>

            {/* Centered Seal */}
            <div className="cert-seal-row">
              <div className="cert-seal">
                <img
                  src="/assets/sba-seal.png"
                  alt="Suraj Bullion Assayers Seal"
                  crossOrigin="anonymous"
                />
              </div>
            </div>

            {/* Two-Column Body Split by Vertical Rule */}
            <div className="cert-body-columns" style={{ fontSize: `${fieldValuesFontSize}px` }}>
              {/* Left Column: Name, Mark, Sample Image Box */}
              <div className="cert-col cert-col-left">
                <div className="field-row">
                  <span className="field-label">{settings.nameLabel}</span>
                  <span className="field-colon">:</span>
                  <span ref={nameRef} className="field-value">
                    {certificate.customerName || 'Customer Name'}
                  </span>
                </div>

                <div className="mark-block">
                  <div className="field-row">
                    <span className="field-label">{settings.markLabel}</span>
                    <span className="field-colon">:</span>
                    <span className="field-value">
                      {markLine1}
                    </span>
                  </div>
                  {remainingMarkLines.map((line, idx) => (
                    <div key={idx} className="mark-line2-row">
                      <span className="mark-line2-value">
                        {line}
                      </span>
                    </div>
                  ))}
                  {remainingMarkLines.length === 0 && (
                    <div className="mark-line2-row">
                      <span className="mark-line2-value" />
                    </div>
                  )}
                </div>

                <div className="sample-box">
                  {certificate.samplePhotoUrl ? (
                    <img
                      src={certificate.samplePhotoUrl}
                      alt="Silver sample"
                      className="sample-image"
                      crossOrigin="anonymous"
                    />
                  ) : (
                    <div className="sample-placeholder">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                        <rect x="3" y="5" width="18" height="14" rx="2" />
                        <circle cx="8.5" cy="10" r="1.5" />
                        <path d="m21 16-5-4-4 3-3-2.5-5 4" />
                      </svg>
                      <span>(Image)</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: S.No., Date, Fineness, Proprietor */}
              <div className="cert-col cert-col-right">
                <div className="field-row">
                  <span className="field-label">{settings.serialNoLabel}</span>
                  <span className="field-colon">:</span>
                  <span className="field-value num-value">
                    {certificate.serialNo || '0100'}
                  </span>
                </div>
                <div className="field-row">
                  <span className="field-label">{settings.dateLabel}</span>
                  <span className="field-colon">:</span>
                  <span className="field-value num-value">
                    {displayDate}
                  </span>
                </div>

                <div className="cert-spacer" />

                {/* FINENESS BOX — exact match to reference certificate.html line 193-199 */}
                <div className="side-label">{settings.finenessLabel}</div>
                <div className="fineness-box">
                  <div className="fineness-value">
                    <span>{intPart}</span>
                    {decPart && (
                      <span className="diamond">&#9670;</span>
                    )}
                    {decPart && (
                      <span>{decPart}</span>
                    )}
                  </div>
                  <div className="fineness-words">
                    {words}
                  </div>
                </div>

                <div className="proprietor-block">
                  <div className="signature-space" />
                  <div className="signature-line" />
                  <div className="signature-label">{settings.proprietorLabel}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
