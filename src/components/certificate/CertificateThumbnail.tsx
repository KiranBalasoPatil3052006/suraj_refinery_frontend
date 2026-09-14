import React from 'react';

interface CertificateThumbnailProps {
  serialNo?: string;
  className?: string;
}

export const CertificateThumbnail: React.FC<CertificateThumbnailProps> = ({
  serialNo,
  className = '',
}) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Background soft botanical leaves motif */}
      <div className="absolute -right-2 -bottom-2 w-14 h-14 pointer-events-none opacity-20 text-brand-700">
        <svg viewBox="0 0 100 100" fill="currentColor">
          <path d="M70,90 Q90,50 60,30 Q40,60 70,90 Z" />
          <path d="M50,95 Q70,70 45,50 Q30,75 50,95 Z" />
          <path d="M85,80 Q95,65 80,45 Q70,60 85,80 Z" />
        </svg>
      </div>

      {/* Mini Certificate Card */}
      <div className="relative w-16 h-20 bg-white rounded-md border border-brand-800/20 shadow-sm p-1.5 flex flex-col items-center justify-between overflow-hidden">
        {/* Subtle decorative top border */}
        <div className="w-full h-0.5 bg-brand-800/30 rounded-full" />

        {/* SBA Logo text */}
        <div className="text-[7px] font-serif font-bold tracking-tighter text-brand-850 mt-0.5">
          SBA
        </div>

        {/* Faux certificate lines */}
        <div className="w-full space-y-1 my-auto px-1">
          <div className="h-0.5 bg-slate-200 rounded w-full" />
          <div className="h-0.5 bg-slate-200 rounded w-4/5 mx-auto" />
          <div className="h-0.5 bg-slate-200 rounded w-3/4 mx-auto" />
          <div className="h-0.5 bg-brand-600/30 rounded w-2/3 mx-auto" />
        </div>

        {/* Serial number indicator at bottom */}
        <div className="text-[6px] font-mono text-slate-400 font-medium tracking-tight">
          #{serialNo || '0100'}
        </div>

        {/* Micro seal badge */}
        <div className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full border border-gold-500/40 bg-gold-100/50" />
      </div>
    </div>
  );
};
