import React, { useState } from 'react';
import { X, FileText, Check, Loader2 } from 'lucide-react';
import { PdfOrientation } from '../../utils/pdfGenerator';

interface DownloadPdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownload: (orientation: PdfOrientation) => Promise<void> | void;
  title?: string;
  isGenerating?: boolean;
}

export const DownloadPdfModal: React.FC<DownloadPdfModalProps> = ({
  isOpen,
  onClose,
  onDownload,
  title = 'Download Certificate PDF',
  isGenerating = false,
}) => {
  const [selected, setSelected] = useState<PdfOrientation>('horizontal');
  const [downloading, setDownloading] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setDownloading(true);
    try {
      await onDownload(selected);
      onClose();
    } finally {
      setDownloading(false);
    }
  };

  const isBusy = isGenerating || downloading;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
      {/* Blurred Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={isBusy ? undefined : onClose}
        aria-hidden="true"
      />

      {/* Modal Surface Card */}
      <div className="relative z-10 w-full max-w-[390px] bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">{title}</h3>
            <p className="text-xs text-slate-500 mt-0.5">Select A5 sheet page alignment:</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isBusy}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors disabled:opacity-50 cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Options Body */}
        <div className="p-5 space-y-3">
          {/* Option 1: Horizontal (Landscape A5) */}
          <button
            type="button"
            onClick={() => setSelected('horizontal')}
            disabled={isBusy}
            className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center space-x-3.5 text-left cursor-pointer ${
              selected === 'horizontal'
                ? 'border-brand-850 bg-brand-50/50 shadow-xs'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            {/* Visual Landscape Icon */}
            <div
              className={`w-12 h-10 rounded-lg flex items-center justify-center border-2 transition-colors shrink-0 ${
                selected === 'horizontal'
                  ? 'border-brand-850 bg-brand-850 text-white'
                  : 'border-slate-300 bg-slate-50 text-slate-400'
              }`}
            >
              <div className="w-7 h-4.5 rounded-xs border border-current flex items-center justify-center">
                <span className="text-[8px] font-bold tracking-tighter">A5</span>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-900">Horizontal</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-100 text-brand-900">
                  210 × 148 mm
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Landscape orientation (Standard certificate layout)
              </p>
            </div>

            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                selected === 'horizontal'
                  ? 'border-brand-850 bg-brand-850 text-white'
                  : 'border-slate-300 bg-white'
              }`}
            >
              {selected === 'horizontal' && <Check className="w-3 h-3 stroke-[3]" />}
            </div>
          </button>

          {/* Option 2: Vertical (Portrait A5) */}
          <button
            type="button"
            onClick={() => setSelected('vertical')}
            disabled={isBusy}
            className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center space-x-3.5 text-left cursor-pointer ${
              selected === 'vertical'
                ? 'border-brand-850 bg-brand-850 text-white'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            {/* Visual Portrait Icon */}
            <div
              className={`w-12 h-10 rounded-lg flex items-center justify-center border-2 transition-colors shrink-0 ${
                selected === 'vertical'
                  ? 'border-brand-850 bg-brand-850 text-white'
                  : 'border-slate-300 bg-slate-50 text-slate-400'
              }`}
            >
              <div className="w-4.5 h-7 rounded-xs border border-current flex items-center justify-center">
                <span className="text-[7px] font-bold tracking-tighter">A5</span>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-900">Vertical</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  148 × 210 mm
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Portrait orientation (Upright A5 page alignment)
              </p>
            </div>

            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                selected === 'vertical'
                  ? 'border-brand-850 bg-brand-850 text-white'
                  : 'border-slate-300 bg-white'
              }`}
            >
              {selected === 'vertical' && <Check className="w-3 h-3 stroke-[3]" />}
            </div>
          </button>
        </div>

        {/* Footer Actions */}
        <div className="p-5 pt-0 flex items-center space-x-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isBusy}
            className="flex-1 py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isBusy}
            className="flex-1 py-2.5 px-4 rounded-xl bg-brand-850 hover:bg-brand-900 text-white font-bold text-xs shadow-btn transition-all active:scale-[0.98] disabled:opacity-75 flex items-center justify-center space-x-2 cursor-pointer"
          >
            {isBusy ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                <span>Exporting...</span>
              </>
            ) : (
              <>
                <FileText className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
