import React from 'react';
import { ChevronLeft, Edit, Download, Calendar, Sparkles, Printer } from 'lucide-react';
import { Certificate } from '../../types/certificate';
import { formatDisplayDate } from '../../utils/purity';
import { CompleteCertificate } from './CompleteCertificate';

interface CertificateDetailsProps {
  certificate: Certificate;
  onBack: () => void;
  onEdit: (cert: Certificate) => void;
  onPreview?: (cert: Certificate) => void;
  onDownload: (cert: Certificate) => void;
  onPrint?: (cert: Certificate) => void;
}

export const CertificateDetails: React.FC<CertificateDetailsProps> = ({
  certificate,
  onBack,
  onEdit,
  onDownload,
  onPrint,
}) => {
  const clean = certificate.purity.replace(/[^\d.]/g, '');
  const [w = '', d = ''] = clean.split('.');
  const formattedPurity = `${w} ◆ ${d}`;

  return (
    <div className="flex flex-col space-y-4 px-1 pb-10">
      {/* Top Bar with back button */}
      <div className="flex items-center justify-between pt-1">
        <button
          type="button"
          onClick={onBack}
          className="py-1.5 px-3 bg-white border border-slate-200 text-slate-700 hover:text-brand-850 text-xs font-semibold rounded-lg flex items-center space-x-1.5 shadow-xs transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to List</span>
        </button>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono font-bold text-slate-500">
            Certificate #{certificate.serialNo}
          </span>
        </div>
      </div>

      {/* When printType is complete, show the complete certificate */}
      {certificate.printType === 'complete' && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-brand-900 px-1">
            <span className="flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Complete Certificate (Full Layout)</span>
            </span>
            <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium border border-emerald-200">
              Verified Design
            </span>
          </div>
          <div className="rounded-2xl overflow-hidden border border-slate-300/80 shadow-elevated bg-white">
            <CompleteCertificate
              certificate={certificate}
              id="details-complete-certificate-canvas"
            />
          </div>
        </div>
      )}

      {/* Main Details Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-soft-card p-5 space-y-5">
        {/* Header with Serial and Status */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
              Serial Number
            </span>
            <div className="text-2xl font-bold font-mono text-brand-900">
              {certificate.serialNo}
            </div>
          </div>

          <div className="text-right">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
              Date Tested
            </span>
            <div className="flex items-center space-x-1 text-slate-700 text-xs font-semibold mt-0.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{formatDisplayDate(certificate.date)}</span>
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div className="space-y-1">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
            Customer Name
          </span>
          <div
            className="text-lg font-serif font-bold text-slate-900"
            style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
          >
            {certificate.customerName} ({certificate.namePrefix})
          </div>
        </div>

        {/* Mark / Test Item Lines */}
        <div className="space-y-1.5">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
            Mark / Description
          </span>
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/70 space-y-1">
            {certificate.markLines?.map((line, idx) => (
              <div key={idx} className="flex items-start space-x-2 text-xs text-slate-700">
                <span className="text-brand-700 font-mono font-bold text-[10px] mt-0.5">
                  L{idx + 1}:
                </span>
                <span>{line || '—'}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Purity Highlight Banner */}
        <div className="rounded-xl bg-gradient-to-r from-brand-900 to-brand-800 text-white p-4 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-brand-200 block">
              Fairness (Purity)
            </span>
            <div className="text-2xl font-bold font-mono tracking-wider mt-0.5">
              {formattedPurity}
            </div>
            <div className="text-xs text-slate-200 italic mt-0.5">
              {certificate.purityWords}
            </div>
          </div>

          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
            <Sparkles className="w-6 h-6 text-gold-300" />
          </div>
        </div>

        {/* Sample Photo Section (if not in complete view) */}
        {certificate.printType !== 'complete' && (
          <div className="space-y-2">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
              Sample Photo Evidence
            </span>
            {certificate.samplePhotoUrl ? (
              <div className="w-full h-44 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 relative group">
                <img
                  src={certificate.samplePhotoUrl}
                  alt="Silver Sample"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded">
                  Captured Sample
                </div>
              </div>
            ) : (
              <div className="py-6 border-2 border-dashed border-slate-200 rounded-xl text-center text-xs text-slate-400">
                No sample photo attached
              </div>
            )}
          </div>
        )}

        {/* Print Configuration Details */}
        <div className="flex items-center justify-between pt-2 pb-5 text-xs border-t border-slate-100">
          <span className="text-slate-500">Configured Print Mode:</span>
          <span className="font-semibold text-brand-800 capitalize bg-brand-50 px-2.5 py-1 rounded-md border border-brand-200/50">
            {certificate.printType === 'complete' ? 'Complete Certificate' : 'Only Values'}
          </span>
        </div>
      </div>

      {/* Sticky Bottom Action Bar — Always stays at bottom on mobile */}
      <div
        className="sticky bottom-0 z-30 w-[calc(100%+2rem)] -mx-4 -mb-5 bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-3 pt-3 pb-6 sm:pb-7 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] rounded-b-2xl sm:rounded-b-[32px]"
        style={{
          paddingBottom: 'max(1.5rem, calc(env(safe-area-inset-bottom, 0px) + 0.85rem))',
        }}
      >
        <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
          <button
            type="button"
            onClick={() => onEdit(certificate)}
            className="py-2.5 px-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs sm:text-sm font-semibold rounded-xl flex items-center justify-center space-x-1.5 shadow-2xs active:scale-[0.98] transition-all cursor-pointer"
          >
            <Edit className="w-4 h-4 text-slate-600 shrink-0" />
            <span>Edit</span>
          </button>

          {onPrint && (
            <button
              type="button"
              onClick={() => onPrint(certificate)}
              className="py-2.5 px-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 text-xs sm:text-sm font-semibold rounded-xl flex items-center justify-center space-x-1.5 shadow-2xs active:scale-[0.98] transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4 text-brand-800 shrink-0" />
              <span>Print</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => onDownload(certificate)}
            className="py-2.5 px-2 bg-brand-800 hover:bg-brand-850 active:bg-brand-900 text-white text-xs sm:text-sm font-semibold rounded-xl flex items-center justify-center space-x-1.5 shadow-2xs active:scale-[0.98] transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 text-white shrink-0" />
            <span>Download</span>
          </button>
        </div>
      </div>
    </div>
  );
};
