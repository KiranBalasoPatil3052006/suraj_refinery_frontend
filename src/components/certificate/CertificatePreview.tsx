import React, { useState, useEffect } from 'react';
import { ChevronLeft, Edit3, Download, ShieldCheck, Loader2, Printer } from 'lucide-react';
import { Certificate } from '../../types/certificate';
import { CompleteCertificate } from './CompleteCertificate';
import { formatDisplayDate } from '../../utils/purity';
import { generateCertificatePDF } from '../../utils/pdfGenerator';
import { printCertificate } from '../../utils/printCertificate';

interface CertificatePreviewProps {
  certificate: Certificate;
  onBack: () => void;
  onEdit?: () => void;
  onDownload?: (cert: Certificate) => void;
  onPrint?: (cert: Certificate) => void;
  onPdfGenerated?: () => void;
}

export const CertificatePreview: React.FC<CertificatePreviewProps> = ({
  certificate,
  onBack,
  onEdit,
  onDownload,
  onPrint,
  onPdfGenerated,
}) => {
  const [activeMode, setActiveMode] = useState<'complete' | 'values'>(
    certificate.printType || 'complete'
  );
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    if (certificate.printType) {
      setActiveMode(certificate.printType);
    }
  }, [certificate.printType]);

  const clean = (certificate.purity || '').replace(/[^\d.]/g, '');
  const [w = '', d = ''] = clean.split('.');
  const formattedPurity = w || d ? `${w} ◆ ${d}` : '';

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    try {
      if (onDownload) {
        await onDownload(certificate);
      } else {
        const fileName = `Silver-Certificate-${certificate.serialNo || '0100'}.pdf`;
        await generateCertificatePDF('complete-certificate-canvas', fileName);
      }
      if (onPdfGenerated) onPdfGenerated();
    } catch (err) {
      console.error('PDF generation failed:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handlePrintClick = async () => {
    setIsPrinting(true);
    try {
      if (onPrint) {
        await onPrint(certificate);
      } else {
        await printCertificate('complete-certificate-canvas');
      }
    } catch (err) {
      console.error('Print failed:', err);
    } finally {
      setIsPrinting(false);
    }
  };

  return (
    <div className="flex flex-col space-y-4 pb-12 w-full">
      {/* Top Preview Control Bar */}
      <div className="flex items-center justify-between px-2 pt-1 gap-2">
        <button
          type="button"
          onClick={onBack}
          className="py-1.5 px-3 bg-white border border-slate-200 text-slate-700 hover:text-brand-850 text-xs font-semibold rounded-lg flex items-center space-x-1.5 shadow-xs transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        {/* View Mode Switcher */}
        <div className="flex items-center bg-slate-200/80 p-0.5 rounded-lg text-[11px] font-semibold">
          <button
            type="button"
            onClick={() => setActiveMode('complete')}
            className={`py-1 px-2.5 rounded-md transition-all cursor-pointer ${
              activeMode === 'complete'
                ? 'bg-white text-brand-850 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Complete View
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('values')}
            className={`py-1 px-2.5 rounded-md transition-all cursor-pointer ${
              activeMode === 'values'
                ? 'bg-white text-brand-850 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Only Values View
          </button>
        </div>

        {/* Edit Button */}
        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="py-1.5 px-2.5 bg-white border border-slate-200 text-brand-800 text-xs font-semibold rounded-lg flex items-center space-x-1 shadow-xs hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Edit</span>
          </button>
        )}
      </div>

      {/* Mode Informational Banner */}
      <div className="mx-2 px-3 py-2 bg-brand-50 border border-brand-200/60 rounded-xl flex items-center justify-between text-xs text-brand-900">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-brand-700 flex-shrink-0" />
          <span className="text-[11px] font-medium">
            {activeMode === 'complete'
              ? 'Official Complete Certificate Format (SBA Assets & Border)'
              : 'Values-only format aligned for physical pre-printed stationery'}
          </span>
        </div>
      </div>

      {/* Main Preview Container */}
      <div className="w-full flex flex-col items-center">
        {activeMode === 'complete' ? (
          <div className="w-full flex flex-col items-center shadow-elevated rounded-2xl overflow-hidden border border-slate-300/80 bg-white">
            <CompleteCertificate
              certificate={certificate}
              id="complete-certificate-canvas"
            />
          </div>
        ) : (
          <>
            {/* Background canvas for PDF/Print while in Values view */}
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '1200px',
                height: '800px',
                pointerEvents: 'none',
                zIndex: -9999,
                opacity: 0,
                overflow: 'hidden',
              }}
            >
              <CompleteCertificate
                certificate={certificate}
                id="complete-certificate-canvas"
                isPdfCapture={true}
              />
            </div>

            {/* "Only Values" view representing physical pre-printed sheet alignment */}
            <div className="w-full max-w-[420px] bg-white rounded-2xl border border-dashed border-slate-300 p-6 min-h-[460px] shadow-sm relative text-[#0c3b3e]">
              <div className="text-center text-[10px] font-mono text-amber-800 bg-amber-50 py-1.5 px-2 rounded-md mb-6 border border-amber-200/60">
                [PRINT PREVIEW: Pre-printed stationery layout - only dynamic values rendered]
              </div>

            <div className="space-y-6 text-xs">
              <div className="flex justify-between items-center font-mono">
                <div>
                  <span className="text-slate-400 text-[10px] block">S.No:</span>
                  <span className="font-bold text-slate-900 text-base">
                    {certificate.serialNo}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 text-[10px] block">Date:</span>
                  <span className="font-bold text-slate-900">
                    {formatDisplayDate(certificate.date)}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <span className="text-slate-400 text-[10px] block">Customer:</span>
                <span className="font-bold text-slate-900 text-sm font-serif">
                  {certificate.customerName} ({certificate.namePrefix || 'Mrs.'})
                </span>
              </div>

              <div className="pt-2">
                <span className="text-slate-400 text-[10px] block">Mark:</span>
                <div className="font-semibold text-slate-800 text-xs">
                  {certificate.markLines?.filter(Boolean).join(' • ') || '—'}
                </div>
              </div>

              <div className="pt-6 text-center">
                <span className="text-slate-400 text-[10px] block">Fairness (Purity):</span>
                <div className="text-2xl font-bold font-mono text-brand-900 mt-1">
                  {formattedPurity}
                </div>
                <div className="text-xs uppercase font-serif tracking-wider text-slate-600 mt-1">
                  {certificate.purityWords}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>

      {/* Dual Action Buttons: Print Certificate & Download PDF — Sticky Bottom Bar on Mobile */}
      <div className="sticky bottom-0 z-30 w-[calc(100%+1.5rem)] -mx-3 -mb-12 sm:w-[calc(100%+2rem)] sm:-mx-4 bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3 w-full max-w-[430px] mx-auto">
          <button
            type="button"
            onClick={handlePrintClick}
            disabled={isPrinting}
            className="w-full py-3 px-2 sm:px-3 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-semibold text-xs sm:text-sm rounded-xl flex items-center justify-center space-x-1.5 sm:space-x-2 shadow-xs transition-all active:scale-[0.98] cursor-pointer"
          >
            {isPrinting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-slate-600 shrink-0" />
                <span className="truncate">Opening Print...</span>
              </>
            ) : (
              <>
                <Printer className="w-4 h-4 text-brand-800 shrink-0" />
                <span className="truncate">Print Certificate</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="w-full py-3 px-2 sm:px-3 bg-brand-800 hover:bg-brand-850 active:bg-brand-900 disabled:opacity-75 text-white font-semibold text-xs sm:text-sm rounded-xl flex items-center justify-center space-x-1.5 sm:space-x-2 shadow-btn transition-all active:scale-[0.98] cursor-pointer"
          >
            {isGeneratingPdf ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white shrink-0" />
                <span className="truncate">Exporting PDF...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 text-white shrink-0" />
                <span className="truncate">Download PDF</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
