import React from 'react';
import { Check } from 'lucide-react';

interface FormActionsProps {
  onGenerate: () => void;
  isGenerating?: boolean;
  onPreview?: () => void;
}

export const FormActions: React.FC<FormActionsProps> = ({
  onGenerate,
  isGenerating = false,
}) => {
  return (
    <div className="w-full">
      {/* Generate Certificate Button — Full width primary action */}
      <button
        type="button"
        onClick={onGenerate}
        disabled={isGenerating}
        className="w-full py-3.5 px-4 bg-brand-800 hover:bg-brand-850 active:bg-brand-900 text-white text-xs sm:text-sm font-semibold rounded-xl flex items-center justify-center space-x-2 shadow-btn active:scale-[0.98] transition-all cursor-pointer disabled:opacity-75"
      >
        <Check className="w-4 h-4 text-white stroke-[2.5]" />
        <span>{isGenerating ? 'Processing...' : 'Generate Certificate'}</span>
      </button>
    </div>
  );
};
