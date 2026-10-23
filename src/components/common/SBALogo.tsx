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
    sm: 'w-16 sm:w-20',
    md: 'w-24 sm:w-28',
    lg: 'w-32 sm:w-36',
    xl: 'w-40 sm:w-48',
  }[size];

  return (
    <div className={`flex flex-col ${isCenter ? 'items-center text-center' : 'items-start text-left'} ${className}`}>
      {showTamil && (
        <span className="font-tamil text-[10.5px] font-semibold text-brand-900 tracking-wider mb-0.5 select-none">
          சூரஜ் புல்லியன் அசையேர்ஸ்
        </span>
      )}
      <img
        src={logoImg}
        alt="SURAJ BULLION ASSAYERS"
        className={`object-contain h-auto ${imgWidth} select-none`}
        loading="eager"
      />
    </div>
  );
};
