import React from 'react';
import { Printer, Check } from 'lucide-react';
import { PrintType } from '../../types/certificate';

interface PrintTypeSelectorProps {
  value: PrintType;
  onChange: (value: PrintType) => void;
}

export const PrintTypeSelector: React.FC<PrintTypeSelectorProps> = ({
  value,
  onChange,
}) => {
  return (
    <div className="flex flex-col space-y-2.5">
      <div className="flex items-center space-x-2 text-slate-800">
        <Printer className="w-4 h-4 text-brand-800" />
        <span className="text-[13px] font-semibold">Print Type</span>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        {/* Complete Certificate Option */}
        <button
          type="button"
          onClick={() => onChange('complete')}
          className={`py-2.5 px-3 rounded-full border text-xs font-semibold flex items-center justify-center space-x-2 transition-all ${
            value === 'complete'
              ? 'border-brand-800 bg-brand-50/50 text-brand-900 shadow-xs ring-1 ring-brand-800/30'
              : 'border-slate-300 bg-white text-slate-600 hover:border-slate-400'
          }`}
        >
          <div
            className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors ${
              value === 'complete'
                ? 'bg-brand-800 text-white'
                : 'border border-slate-400 bg-white'
            }`}
          >
            {value === 'complete' && <Check className="w-3 h-3 stroke-[3]" />}
          </div>
          <span>Complete Certificate</span>
        </button>

        {/* Only Values Option */}
        <button
          type="button"
          onClick={() => onChange('values')}
          className={`py-2.5 px-3 rounded-full border text-xs font-semibold flex items-center justify-center space-x-2 transition-all ${
            value === 'values'
              ? 'border-brand-800 bg-brand-50/50 text-brand-900 shadow-xs ring-1 ring-brand-800/30'
              : 'border-slate-300 bg-white text-slate-600 hover:border-slate-400'
          }`}
        >
          <div
            className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors ${
              value === 'values'
                ? 'bg-brand-800 text-white'
                : 'border border-slate-400 bg-white'
            }`}
          >
            {value === 'values' && <Check className="w-3 h-3 stroke-[3]" />}
          </div>
          <span>Only Values</span>
        </button>
      </div>
    </div>
  );
};
