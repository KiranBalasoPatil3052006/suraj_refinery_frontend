import React, { useState } from 'react';
import { Download, Printer, Loader2, Scissors, FileText } from 'lucide-react';
import { AppHeader } from '../../components/common/AppHeader';
import { TitleBanner } from '../../components/common/TitleBanner';
import { CompleteCertificate } from '../../components/certificate/CompleteCertificate';
import {
  generateCertificatePDF,
  generateDoubleTemplatePDF,
  PdfOrientation,
} from '../../utils/pdfGenerator';
import { printCertificate, printDoubleCertificate } from '../../utils/printCertificate';
import { Certificate } from '../../types/certificate';
import { DownloadPdfModal } from '../../components/common/DownloadPdfModal';

export type TemplateType = 'single' | 'double';

const BLANK_TEMPLATE_RECORD: Certificate = {
  id: 'blank-template',
  serialNo: '',
  date: '',
  customerName: '',
  namePrefix: '',
  markLines: [],
  purity: '',
  purityWords: '',
  samplePhotoUrl: '',
  createdAt: '',
  printType: 'complete',
};

interface TemplateCertificateProps {
  onBack: () => void;
  onOpenMenu?: () => void;
  showToast?: (title: string, desc: string, type?: 'info' | 'success') => void;
}

export const TemplateCertificate: React.FC<TemplateCertificateProps> = ({
  onBack,
  onOpenMenu,
  showToast,
}) => {
  const [templateType, setTemplateType] = useState<TemplateType>('single');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  // Single Template PDF Download (A5)
  const handleSingleDownloadPdf = async (orientation: PdfOrientation = 'horizontal') => {
    setIsGeneratingPdf(true);
    try {
      await generateCertificatePDF(
        'template-certificate-canvas',
        'Silver-Certificate-Template-Single-A5.pdf',
        orientation
      );
      if (showToast) {
        showToast(
          'Single Template Exported',
          `Blank A5 template PDF (${orientation}) downloaded successfully.`,
          'success'
        );
      }
    } catch (err) {
      console.error('PDF generation failed:', err);
      if (showToast) {
        showToast(
          'Export Failed',
          'Failed to export template PDF. Please try again.',
          'info'
        );
      }
    } finally {
      setIsGeneratingPdf(false);
      setIsDownloadModalOpen(false);
    }
  };

  // Double Template PDF Download (A4)
  const handleDoubleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    try {
      await generateDoubleTemplatePDF(
        'template-certificate-canvas',
        'Silver-Certificate-Template-Double-A4.pdf'
      );
      if (showToast) {
        showToast(
          'Double Template Exported',
          'Blank A4 template PDF (2 × A5 sheets with cut line) downloaded successfully.',
          'success'
        );
      }
    } catch (err) {
      console.error('PDF generation failed:', err);
      if (showToast) {
        showToast(
          'Export Failed',
          'Failed to export double template PDF. Please try again.',
          'info'
        );
      }
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handlePrint = async () => {
    setIsPrinting(true);
    try {
      if (templateType === 'double') {
        await printDoubleCertificate('template-certificate-canvas');
      } else {
        await printCertificate('template-certificate-canvas');
      }
    } catch (err) {
      console.error('Print failed:', err);
      if (showToast) {
        showToast(
          'Print Failed',
          'Failed to open print dialog. Please try again.',
          'info'
        );
      }
    } finally {
      setIsPrinting(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <AppHeader
        showBack={true}
        onBack={onBack}
        showHistoryButton={false}
        onOpenMenu={onOpenMenu}
      />

      <TitleBanner
        title="Certificate Template"
        subtitle="OFFICIAL BLANK PRINTING STATIONERY"
      />

      <main className="w-full max-w-[440px] px-3 sm:px-4 flex flex-col space-y-4 pb-16">
        {/* Template Type Segmented Selector */}
        <div className="w-full bg-slate-100 p-1 rounded-2xl flex items-center border border-slate-200/90 shadow-2xs">
          <button
            type="button"
            onClick={() => setTemplateType('single')}
            className={`flex-1 py-2.5 px-3 rounded-xl flex items-center justify-center space-x-2 text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              templateType === 'single'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4 text-brand-700 flex-shrink-0" />
            <div className="flex flex-col items-start text-left leading-tight">
              <span>Single Template</span>
              <span className="text-[10px] font-normal text-slate-500">A5 Sheet (210×148mm)</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setTemplateType('double')}
            className={`flex-1 py-2.5 px-3 rounded-xl flex items-center justify-center space-x-2 text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              templateType === 'double'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Scissors className="w-4 h-4 text-brand-700 flex-shrink-0" />
            <div className="flex flex-col items-start text-left leading-tight">
              <span>Double Template</span>
              <span className="text-[10px] font-normal text-slate-500">A4 Sheet (2 × A5 Forms)</span>
            </div>
          </button>
        </div>

        {/* Preview Container */}
        {templateType === 'single' ? (
          <div className="w-full flex flex-col items-center shadow-elevated rounded-2xl overflow-hidden border border-slate-300/80 bg-white">
            <CompleteCertificate
              certificate={BLANK_TEMPLATE_RECORD}
              id="template-certificate-canvas"
              isTemplate={true}
              printMode="complete"
            />
          </div>
        ) : (
          <div className="w-full flex flex-col items-center shadow-elevated rounded-2xl p-2.5 border border-slate-300/80 bg-slate-100/60">
            <div className="w-full bg-white rounded-xl shadow-xs border border-slate-200 p-2 flex flex-col items-center">
              {/* Form 1 (Top Half of A4) */}
              <div className="w-full rounded-lg overflow-hidden border border-slate-200/80">
                <CompleteCertificate
                  certificate={BLANK_TEMPLATE_RECORD}
                  id="template-certificate-canvas"
                  isTemplate={true}
                  printMode="complete"
                />
              </div>

              {/* Single Light-Grey Cut Line with Scissors Indicator matching user reference image */}
              <div className="w-full relative flex items-center my-4 select-none px-1">
                <div className="flex items-center space-x-2 w-full">
                  <div className="flex items-center flex-shrink-0 text-slate-500">
                    <svg
                      className="w-6 h-4 text-slate-600 flex-shrink-0"
                      viewBox="0 0 48 32"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="9" cy="9" r="5" />
                      <circle cx="9" cy="23" r="5" />
                      <path d="M13 11 L36 26" />
                      <path d="M13 21 L36 6" />
                    </svg>
                  </div>
                  <div className="flex-1 border-t-2 border-dashed border-slate-300"></div>
                </div>
              </div>

              {/* Form 2 (Bottom Half of A4) */}
              <div className="w-full rounded-lg overflow-hidden border border-slate-200/80">
                <CompleteCertificate
                  certificate={BLANK_TEMPLATE_RECORD}
                  id="template-certificate-canvas-2"
                  isTemplate={true}
                  printMode="complete"
                />
              </div>
            </div>
          </div>
        )}

        {/* Sticky Bottom Actions */}
        <div className="sticky bottom-0 z-30 w-[calc(100%+1.5rem)] -mx-3 -mb-16 sm:w-[calc(100%+2rem)] sm:-mx-4 bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3 w-full max-w-[430px] mx-auto">
            {/* Print Button */}
            <button
              type="button"
              onClick={handlePrint}
              disabled={isPrinting}
              className="w-full py-3 px-2 sm:px-3 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-semibold text-xs sm:text-sm rounded-xl flex items-center justify-center space-x-1.5 sm:space-x-2 shadow-xs transition-all active:scale-[0.98] cursor-pointer"
            >
              {isPrinting ? (
                <>
                  <Loader2 className="w-4 h-4 text-slate-600 animate-spin" />
                  <span>Preparing...</span>
                </>
              ) : (
                <>
                  <Printer className="w-4 h-4 text-amber-700" />
                  <span className="truncate">
                    {templateType === 'double' ? 'Print Double (A4)' : 'Print Single (A5)'}
                  </span>
                </>
              )}
            </button>

            {/* Download PDF Button */}
            <button
              type="button"
              onClick={() => {
                if (templateType === 'double') {
                  handleDoubleDownloadPdf();
                } else {
                  setIsDownloadModalOpen(true);
                }
              }}
              disabled={isGeneratingPdf}
              className="w-full py-3 px-2 sm:px-3 bg-brand-850 hover:bg-brand-900 text-white font-semibold text-xs sm:text-sm rounded-xl flex items-center justify-center space-x-1.5 sm:space-x-2 shadow-sm transition-all active:scale-[0.98] cursor-pointer"
            >
              {isGeneratingPdf ? (
                <>
                  <Loader2 className="w-4 h-4 text-white animate-spin" />
                  <span className="truncate">Exporting PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-white" />
                  <span className="truncate">
                    {templateType === 'double' ? 'Download A4 PDF' : 'Download A5 PDF'}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </main>

      {/* A5 Template PDF Download Orientation Modal (for Single Template) */}
      <DownloadPdfModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
        onDownload={handleSingleDownloadPdf}
        title="Download Blank Single Template PDF"
        isGenerating={isGeneratingPdf}
      />
    </div>
  );
};
