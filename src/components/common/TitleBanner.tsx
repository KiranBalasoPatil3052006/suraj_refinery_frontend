import React from 'react';

interface TitleBannerProps {
  title: string;
  subtitle: string;
  className?: string;
}

export const TitleBanner: React.FC<TitleBannerProps> = ({
  title,
  subtitle,
  className = '',
}) => {
  return (
    <div className={`text-center my-3 sm:my-4 px-2 select-none ${className}`}>
      <h1
        className="text-2xl sm:text-[28px] font-serif font-bold text-brand-900 tracking-tight leading-tight"
        style={{ fontFamily: '"Playfair Display", "Cinzel", Georgia, serif' }}
      >
        {title}
      </h1>

      <div className="flex items-center justify-center space-x-2 mt-1.5 sm:mt-2">
        <span className="w-7 sm:w-10 h-[1px] bg-slate-300"></span>
        <span className="text-[9px] sm:text-[10px] font-bold tracking-[0.22em] text-slate-500 uppercase">
          {subtitle}
        </span>
        <span className="w-7 sm:w-10 h-[1px] bg-slate-300"></span>
      </div>
    </div>
  );
};
