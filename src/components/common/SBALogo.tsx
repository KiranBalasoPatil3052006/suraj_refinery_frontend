import React from 'react';
import logoImg from '../../assets/logo.png';

interface SBALogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTamil?: boolean;
  align?: 'center' | 'left';
}

export const SBALogo: React.FC<SBALogoProps> = ({
  className = '',
  size = 'md',
  showTamil = false,
  align = 'center',
}) => {
  const isCenter = align === 'center';

  const imgWidth = {
    sm: 'w-14 sm:w-16',
    md: 'w-20 sm:w-24',
    lg: 'w-28 sm:w-32',
    xl: 'w-36 sm:w-44',
  }[size];

  return (
    <div className={`flex flex-col ${isCenter ? 'items-center text-center' : 'items-start text-left'} ${className}`}>
      {showTamil && (
        <span className="font-tamil text-[10.5px] font-semibold text-brand-900 tracking-wider mb-0.5 select-none">
          சூராஜ் புல்லியன் அசெசரீஸ்
        </span>
      )}
      <img
        src={logoImg}
        alt="SURAJ BULLION ACCESSORIES"
        className={`object-contain h-auto ${imgWidth} select-none`}
        loading="eager"
      />
    </div>
  );
};
