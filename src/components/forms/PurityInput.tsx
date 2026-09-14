import React, { useRef } from 'react';
import { convertPurityToWords, parsePurityDigits } from '../../utils/purity';

interface PurityInputProps {
  value: string; // e.g. "89.24"
  onChange: (value: string) => void;
  error?: string;
}

export const PurityInput: React.FC<PurityInputProps> = ({
  value,
  onChange,
  error,
}) => {
  const digits = parsePurityDigits(value);
  const words = convertPurityToWords(value);

  const input1Ref = useRef<HTMLInputElement>(null);
  const input2Ref = useRef<HTMLInputElement>(null);
  const input3Ref = useRef<HTMLInputElement>(null);
  const input4Ref = useRef<HTMLInputElement>(null);

  const inputs = [input1Ref, input2Ref, input3Ref, input4Ref];

  const updateDigit = (index: number, newChar: string) => {
    // Only accept numbers
    const cleanChar = newChar.replace(/[^\d]/g, '').slice(-1);
    
    const dArray = [digits.d1, digits.d2, digits.d3, digits.d4];
    dArray[index] = cleanChar;

    // Compose new purity string "XX.YY"
    const whole = `${dArray[0] || ''}${dArray[1] || ''}`;
    const dec = `${dArray[2] || ''}${dArray[3] || ''}`;
    
    let result = '';
    if (whole && dec) {
      result = `${whole}.${dec}`;
    } else if (whole) {
      result = `${whole}${dec ? '.' + dec : ''}`;
    } else if (dec) {
      result = `0.${dec}`;
    }

    onChange(result);

    // Auto-advance
    if (cleanChar && index < 3) {
      inputs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      const dArray = [digits.d1, digits.d2, digits.d3, digits.d4];
      if (!dArray[index] && index > 0) {
        inputs[index - 1].current?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputs[index - 1].current?.focus();
    } else if (e.key === 'ArrowRight' && index < 3) {
      inputs[index + 1].current?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text').trim();
    // Check if format is like 89.24 or 8924
    const cleanNumbers = paste.replace(/[^\d.]/g, '');
    if (cleanNumbers) {
      onChange(cleanNumbers);
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-start justify-between">
        <label className="text-[13px] font-semibold text-slate-800 leading-tight">
          Fairness <br />
          <span className="text-slate-500 font-normal text-xs">(Purity)</span>
        </label>

        {/* 4 Digit Box Display */}
        <div className="flex flex-col items-end">
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            {/* Whole Part Digit 1 */}
            <input
              ref={input1Ref}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={digits.d1}
              onChange={(e) => updateDigit(0, e.target.value)}
              onKeyDown={(e) => handleKeyDown(0, e)}
              onPaste={handlePaste}
              className="w-10 h-12 text-center text-lg font-bold text-brand-900 bg-white border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:border-brand-700 focus:ring-2 focus:ring-brand-700/20 transition-all"
            />

            {/* Whole Part Digit 2 */}
            <input
              ref={input2Ref}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={digits.d2}
              onChange={(e) => updateDigit(1, e.target.value)}
              onKeyDown={(e) => handleKeyDown(1, e)}
              onPaste={handlePaste}
              className="w-10 h-12 text-center text-lg font-bold text-brand-900 bg-white border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:border-brand-700 focus:ring-2 focus:ring-brand-700/20 transition-all"
            />

            {/* Diamond Separator ◆ */}
            <div className="px-1 text-brand-850 font-bold text-sm select-none">
              ◆
            </div>

            {/* Decimal Part Digit 1 */}
            <input
              ref={input3Ref}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={digits.d3}
              onChange={(e) => updateDigit(2, e.target.value)}
              onKeyDown={(e) => handleKeyDown(2, e)}
              onPaste={handlePaste}
              className="w-10 h-12 text-center text-lg font-bold text-brand-900 bg-white border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:border-brand-700 focus:ring-2 focus:ring-brand-700/20 transition-all"
            />

            {/* Decimal Part Digit 2 */}
            <input
              ref={input4Ref}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={digits.d4}
              onChange={(e) => updateDigit(3, e.target.value)}
              onKeyDown={(e) => handleKeyDown(3, e)}
              onPaste={handlePaste}
              className="w-10 h-12 text-center text-lg font-bold text-brand-900 bg-white border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:border-brand-700 focus:ring-2 focus:ring-brand-700/20 transition-all"
            />
          </div>

          {/* Real-time Purity in Words */}
          <div className="mt-1.5 text-right min-h-[1.25rem]">
            {words ? (
              <span className="text-[12px] font-medium text-slate-600 italic tracking-tight">
                ({words})
              </span>
            ) : (
              <span className="text-[11px] text-slate-400 italic">
                (Enter 4 digits, e.g. 89.45)
              </span>
            )}
          </div>
        </div>
      </div>

      {error && (
        <p className="text-[11px] text-red-600 text-right mt-0.5">{error}</p>
      )}
    </div>
  );
};
