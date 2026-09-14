import React from 'react';
import { Calendar, Eye, Download, Printer } from 'lucide-react';
import { Certificate } from '../../types/certificate';
import { formatDisplayDate } from '../../utils/purity';
import { CertificateThumbnail } from './CertificateThumbnail';

interface CertificateCardProps {
  certificate: Certificate;
  onView: (cert: Certificate) => void;
  onDownload: (cert: Certificate) => void;
  onPrint?: (cert: Certificate) => void;
}

export const CertificateCard: React.FC<CertificateCardProps> = ({
  certificate,
  onView,
  onDownload,
  onPrint,
}) => {
  // Format purity representation: "89 ◆ 24"
  const clean = certificate.purity.replace(/[^\d.]/g, '');
  const [w = '', d = ''] = clean.split('.');
  const formattedPurity = `${w} ◆ ${d}`;

  return (
    <div className="w-full bg-white border border-slate-200/90 rounded-2xl p-4 shadow-soft-card hover:shadow-elevated transition-all duration-200 flex flex-col space-y-3">
      {/* Top and middle content with thumbnail */}
      <div className="flex items-start justify-between">
        <div className="flex-1 pr-2 space-y-1">
          {/* Header Row: S.No & Date */}
          <div className="flex items-center space-x-3 text-xs">
            <span className="font-bold text-slate-800">
              S.No. :{' '}
              <span className="font-mono text-brand-900 font-bold">
                {certificate.serialNo}
              </span>
            </span>
            <div className="flex items-center space-x-1 text-slate-400 font-medium">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{formatDisplayDate(certificate.date)}</span>
            </div>
          </div>

          {/* Customer Name */}
          <h3
            className="text-base sm:text-[17px] font-serif font-bold text-slate-900 tracking-tight pt-0.5"
            style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
          >
            {certificate.customerName} ({certificate.namePrefix})
          </h3>

          {/* Mark excerpt if present */}
          {certificate.markLines?.[0] && (
            <p className="text-xs text-slate-500 line-clamp-1">
              {certificate.markLines[0]}
            </p>
          )}

          {/* Purity Row */}
          <div className="pt-1 flex flex-wrap items-center gap-1.5 text-xs sm:text-[13px]">
            <span className="font-semibold text-slate-700">Purity :</span>
            <span className="font-bold text-brand-850 tracking-wide font-mono">
              {formattedPurity}
            </span>
            <span className="text-[11px] text-slate-500 italic">
              ({certificate.purityWords})
            </span>
          </div>
        </div>

        {/* Miniature Certificate Thumbnail */}
        <div className="flex-shrink-0 pl-1">
          <CertificateThumbnail serialNo={certificate.serialNo} />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-3 gap-2 pt-1">
        {/* View Action */}
        <button
          type="button"
          onClick={() => onView(certificate)}
          className="py-2 px-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 hover:text-slate-900 text-xs font-semibold rounded-xl flex items-center justify-center space-x-1 transition-colors shadow-2xs active:scale-[0.98] cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5 text-slate-600" />
          <span>View</span>
        </button>

        {/* Print Action */}
        <button
          type="button"
          onClick={() => onPrint?.(certificate)}
          className="py-2 px-2 bg-white hover:bg-slate-50 border border-slate-300 text-brand-800 text-xs font-semibold rounded-xl flex items-center justify-center space-x-1 transition-colors shadow-2xs active:scale-[0.98] cursor-pointer"
        >
          <Printer className="w-3.5 h-3.5 text-brand-800" />
          <span>Print</span>
        </button>

        {/* Download Action */}
        <button
          type="button"
          onClick={() => onDownload(certificate)}
          className="py-2 px-2 bg-brand-800 hover:bg-brand-850 active:bg-brand-900 text-white text-xs font-semibold rounded-xl flex items-center justify-center space-x-1 transition-colors shadow-2xs active:scale-[0.98] cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-white" />
          <span>PDF</span>
        </button>
      </div>
    </div>
  );
};
