import React, { useState } from 'react';
import { Certificate, PrintType, PhotoFit } from '../../types/certificate';
import { AppHeader } from '../../components/common/AppHeader';
import { TitleBanner } from '../../components/common/TitleBanner';
import { SerialNoField, CustomerNameField, DateField } from '../../components/forms/FormFields';
import { MarkInput } from '../../components/forms/MarkInput';
import { PurityInput } from '../../components/forms/PurityInput';
import { PhotoUpload } from '../../components/forms/PhotoUpload';
import { PrintTypeSelector } from '../../components/forms/PrintTypeSelector';
import { FormActions } from '../../components/forms/FormActions';
import { CompleteCertificate } from '../../components/certificate/CompleteCertificate';
import { convertPurityToWords } from '../../utils/purity';
import * as certificateApi from '../../services/certificateApi';
import { Sparkles } from 'lucide-react';

interface CreateCertificateProps {
  initialData?: Partial<Certificate>;
  onNavigateHistory: () => void;
  onPreview: (cert: Certificate) => void;
  onGenerateSuccess: (cert: Certificate) => void;
  historyCount?: number;
  onOpenMenu?: () => void;
}

export const CreateCertificate: React.FC<CreateCertificateProps> = ({
  initialData,
  onNavigateHistory,
  onPreview,
  onGenerateSuccess,
  historyCount,
  onOpenMenu,
}) => {
  // Today's date formatted as YYYY-MM-DD for input
  const getTodayString = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const [serialNo] = useState<string>(initialData?.serialNo || 'Auto');
  const [customerName, setCustomerName] = useState<string>(initialData?.customerName || '');
  const [namePrefix] = useState<string>(initialData?.namePrefix || 'Mrs.');
  const [markLines, setMarkLines] = useState<string[]>(
    initialData?.markLines || ['', '', '']
  );
  const [date, setDate] = useState<string>(initialData?.date || getTodayString());
  const [purity, setPurity] = useState<string>(initialData?.purity || '');
  const [samplePhotoUrl, setSamplePhotoUrl] = useState<string | undefined>(
    initialData?.samplePhotoUrl
  );
  const [photoFit, setPhotoFit] = useState<PhotoFit>(
    initialData?.photoFit || 'cover'
  );
  const [printType, setPrintType] = useState<PrintType>(
    initialData?.printType || 'complete'
  );

  // Form Validation & Feedback
  const [errors, setErrors] = useState<{ customerName?: string; purity?: string }>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const getFormCertificate = (): Certificate => {
    const purityWords = convertPurityToWords(purity);
    return {
      id: initialData?.id || `cert-${Date.now()}`,
      serialNo: serialNo || '0100',
      customerName: customerName,
      namePrefix,
      markLines: markLines,
      date: date || getTodayString(),
      purity: purity || '',
      purityWords,
      samplePhotoUrl,
      photoFit,
      printType,
      createdAt: new Date().toISOString(),
    };
  };

  const currentCertificate = getFormCertificate();

  const validate = (): boolean => {
    const newErrors: { customerName?: string; purity?: string } = {};
    if (!customerName.trim()) {
      newErrors.customerName = "Please enter the customer's name.";
    }
    const cleanDigits = purity.replace(/[^\d]/g, '');
    if (!cleanDigits) {
      newErrors.purity = 'Please enter purity percentage.';
    } else if (cleanDigits.length < 4) {
      newErrors.purity = 'Please enter all 4 digits (e.g. 89.24).';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePreviewClick = () => {
    const cert = getFormCertificate();
    onPreview(cert);
  };

  const handleGenerateClick = async () => {
    if (!validate()) {
      return;
    }

    setIsGenerating(true);

    try {
      // Call the backend to create the certificate (serial number generated server-side)
      const markLinesFiltered = markLines.filter(Boolean);
      const newCert = await certificateApi.createCertificate({
        customerName,
        namePrefix,
        mark: {
          line1: markLinesFiltered[0] || '',
          line2: markLinesFiltered[1] || '',
          additionalLines: markLinesFiltered.slice(2),
        },
        date: date || getTodayString(),
        fineness: purity,
        printType,
        photoFit,
        samplePhotoUrl: samplePhotoUrl || '',
      });

      // Guarantee samplePhotoUrl is always set on newCert for preview, PDF export & print
      if (samplePhotoUrl) {
        newCert.samplePhotoUrl = samplePhotoUrl;
        newCert.photoFit = photoFit;
      }

      // Image upload (if photo was selected, upload it after certificate creation)
      if (samplePhotoUrl && samplePhotoUrl.startsWith('data:')) {
        try {
          const response = await fetch(samplePhotoUrl);
          const blob = await response.blob();
          const file = new File([blob], 'sample.jpg', { type: blob.type || 'image/jpeg' });
          await certificateApi.uploadCertificateImage(newCert.id, file);
        } catch (imgErr) {
          console.warn('Image upload failed, certificate was still created:', imgErr);
        }
      }

      setShowSuccessToast(true);
      setTimeout(() => {
        setShowSuccessToast(false);
        onGenerateSuccess(newCert);
      }, 1200);
    } catch (error) {
      const apiError = error as Error & { code?: string };
      console.error('Certificate creation failed:', apiError);

      // Show validation errors from backend
      if (apiError.code === 'VALIDATION_ERROR') {
        setErrors({ customerName: apiError.message });
      } else {
        setErrors({ customerName: apiError.message || 'Failed to create certificate. Please try again.' });
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-between min-h-full">
      {/* App Header with Logo and History Nav */}
      <AppHeader
        onNavigateHistory={onNavigateHistory}
        historyCount={historyCount}
        onOpenMenu={onOpenMenu}
      />

      {/* Screen Title Banner */}
      <TitleBanner
        title="Silver Sample Certificate"
        subtitle="A TRUSTED QUALITY IN SILVER"
      />

      {/* Primary Form Surface Card */}
      <main className="w-full max-w-[430px] flex-1 px-3 sm:px-4 pb-6">
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-soft-card p-4 sm:p-5 space-y-4 sm:space-y-4.5">
          {/* Serial Number Row */}
          <SerialNoField value={serialNo} />

          <div className="h-[1px] bg-slate-100" />

          {/* Customer Name Row */}
          <CustomerNameField
            value={customerName}
            onChange={(val) => {
              setCustomerName(val);
              if (errors.customerName) setErrors((prev) => ({ ...prev, customerName: undefined }));
            }}
            error={errors.customerName}
            prefix={`Name (${namePrefix})`}
          />

          <div className="h-[1px] bg-slate-100" />

          {/* Mark Multi-line Input Row */}
          <MarkInput lines={markLines} onChange={setMarkLines} />

          <div className="h-[1px] bg-slate-100" />

          {/* Date Picker Row */}
          <DateField value={date} onChange={setDate} />

          <div className="h-[1px] bg-slate-100" />

          {/* Purity 4-Box Visual Row */}
          <PurityInput
            value={purity}
            onChange={(val) => {
              setPurity(val);
              if (errors.purity) setErrors((prev) => ({ ...prev, purity: undefined }));
            }}
            error={errors.purity}
          />

          <div className="h-[1px] bg-slate-100" />

          {/* Sample Photo Upload Area */}
          <PhotoUpload
            value={samplePhotoUrl}
            onChange={setSamplePhotoUrl}
            photoFit={photoFit}
            onPhotoFitChange={setPhotoFit}
          />

          <div className="h-[1px] bg-slate-100" />

          {/* Print Type Selector */}
          <PrintTypeSelector
            value={printType}
            onChange={setPrintType}
          />

          {/* Live Certificate Preview for Complete or Only Values */}
          <div className="pt-2 flex flex-col space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-[#0c3b47]">
              <span className="flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>
                  {printType === 'complete'
                    ? 'Live Certificate Preview (Complete Design)'
                    : 'Live Certificate Preview (Only Values - Pre-printed Paper)'}
                </span>
              </span>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium border border-emerald-200">
                Live Updating
              </span>
            </div>
            <div className="rounded-xl overflow-hidden border border-slate-300 shadow-sm bg-white">
              <CompleteCertificate
                certificate={currentCertificate}
                id="live-form-certificate-canvas"
                printMode={printType}
              />
            </div>
          </div>

          {/* Brand Footer Slogan */}
          <div className="pt-2 pb-1 flex flex-col items-center justify-center select-none">
            <div className="flex items-center space-x-2 text-brand-800/70">
              <span className="text-[9px]">◆</span>
              <span className="text-[10px] font-bold tracking-[0.25em] uppercase">
                PURITY BUILDS TRUST
              </span>
              <span className="text-[9px]">◆</span>
            </div>
          </div>
        </div>
      </main>

      {/* Sticky Bottom Action Bar — Always stays at the bottom of the screen in mobile */}
      <div
        className="sticky bottom-0 z-30 w-full max-w-[430px] bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-4 pt-3 pb-6 sm:pb-7 sm:rounded-b-[32px] shadow-[0_-4px_20px_rgba(0,0,0,0.08)]"
        style={{
          paddingBottom: 'max(1.5rem, calc(env(safe-area-inset-bottom, 0px) + 0.85rem))',
        }}
      >
        <FormActions
          onPreview={handlePreviewClick}
          onGenerate={handleGenerateClick}
          isGenerating={isGenerating}
        />
      </div>

      {/* Visual Feedback Confirmation Toast */}
      {showSuccessToast && (
        <div className="fixed bottom-6 z-50 px-5 py-3 bg-brand-900 text-white rounded-xl shadow-elevated flex items-center space-x-2 border border-brand-700 animate-bounce">
          <span className="text-emerald-400 font-bold text-sm">✓</span>
          <span className="text-xs font-semibold">Certificate record registered successfully!</span>
        </div>
      )}
    </div>
  );
};
