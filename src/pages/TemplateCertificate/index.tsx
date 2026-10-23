import React, { useState } from 'react';
import { Download, Printer, ShieldCheck, Loader2 } from 'lucide-react';
import { AppHeader } from '../../components/common/AppHeader';
import { TitleBanner } from '../../components/common/TitleBanner';
import { CompleteCertificate } from '../../components/certificate/CompleteCertificate';
import { generateCertificatePDF } from '../../utils/pdfGenerator';
import { printCertificate } from '../../utils/printCertificate';
import { Certificate } from '../../types/certificate';

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
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    try {
      await generateCertificatePDF(
        'template-certificate-canvas',
        'Silver-Certificate-Template.pdf'
      );
      if (showToast) {
        showToast(
          'Template Exported',
          'Blank printing template PDF downloaded successfully.',
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
    }
  };

  const handlePrint = async () => {
    setIsPrinting(true);
    try {
      await printCertificate('template-certificate-canvas');
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

      <main className="w-full max-w-[430px] px-3 sm:px-4 flex flex-col space-y-4 pb-12">
        {/* Informative Explanation Banner */}
        <div className="px-3.5 py-2.5 bg-amber-50/90 border border-amber-200/80 rounded-2xl flex items-start space-x-2.5 text-xs text-amber-900 shadow-2xs">
          <ShieldCheck className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
          <div className="flex-1 text-[11px] leading-relaxed">
            <span className="font-bold text-amber-950">Blank Official Stationery: </span>
            Borders, header, contact & seal are preserved. Serial number and sample photo placeholder are removed for physical stamping and handwriting.
          </div>
        </div>

        {/* Certificate Scaled Frame */}
        <div className="w-full flex flex-col items-center shadow-elevated rounded-2xl overflow-hidden border border-slate-300/80 bg-white">
          <CompleteCertificate
            certificate={BLANK_TEMPLATE_RECORD}
            id="template-certificate-canvas"
            isTemplate={true}
            printMode="complete"
          />
        </div>

        {/* Sticky Bottom Actions */}
        <div className="sticky bottom-0 z-30 w-[calc(100%+1.5rem)] -mx-3 -mb-12 sm:w-[calc(100%+2rem)] sm:-mx-4 bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
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
                  <span className="truncate">Print Template</span>
                </>
              )}
            </button>

            {/* Download PDF Button */}
            <button
              type="button"
              onClick={handleDownloadPdf}
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
                  <span className="truncate">Download PDF</span>
                </>
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
