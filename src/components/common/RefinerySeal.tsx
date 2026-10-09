import React from 'react';
import sealImg from '../../assets/sealIcon.png';

interface RefinerySealProps {
  className?: string;
  size?: number;
}

export const RefinerySeal: React.FC<RefinerySealProps> = ({
  className = '',
  size = 110,
}) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      <img
        src={sealImg}
        alt="SURAJ BULLION ASSAYERS Seal"
        className="w-full h-full object-contain"
        loading="eager"
      />
    </div>
  );
};
