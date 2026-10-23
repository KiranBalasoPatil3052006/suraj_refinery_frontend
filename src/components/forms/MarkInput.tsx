import React from 'react';
import { AlignLeft, Plus, X } from 'lucide-react';

interface MarkInputProps {
  lines: string[];
  onChange: (lines: string[]) => void;
}

export const MarkInput: React.FC<MarkInputProps> = ({ lines, onChange }) => {
  const updateLine = (index: number, val: string) => {
    const updated = [...lines];
    updated[index] = val;
    onChange(updated);
  };

  const addLine = () => {
    onChange([...lines, '']);
  };

  const removeLine = (index: number) => {
    if (lines.length <= 3) return; // Keep at least 3 lines default
    const updated = lines.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className="flex flex-col space-y-2.5">
      <div className="flex items-start justify-between">
        <label className="text-[13px] font-semibold text-slate-800 pt-2.5">
          Mark
        </label>

        <div className="w-[72%] sm:w-[75%] space-y-2">
          {lines.map((line, idx) => (
            <div key={idx} className="relative flex items-center group">
              <div className="absolute left-3 text-slate-400 pointer-events-none">
                <AlignLeft className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={line}
                onChange={(e) => updateLine(idx, e.target.value)}
                placeholder={`Line ${idx + 1}`}
                className="w-full pl-9 pr-8 py-2.5 bg-white text-slate-800 text-sm border border-slate-300 rounded-lg shadow-sm placeholder:text-slate-400 focus:outline-none focus:border-brand-700 focus:ring-2 focus:ring-brand-700/20 transition-all"
              />

              {idx >= 3 && (
                <button
                  type="button"
                  onClick={() => removeLine(idx)}
                  className="absolute right-2 p-1 text-slate-400 hover:text-red-500 rounded transition-colors"
                  title="Remove line"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}

          {/* Add another line button */}
          <button
            type="button"
            onClick={addLine}
            className="w-full py-2 px-3 border border-slate-300 hover:border-brand-600 bg-slate-50/70 hover:bg-brand-50/40 text-slate-700 hover:text-brand-800 text-xs font-semibold rounded-lg flex items-center justify-center space-x-1.5 transition-colors shadow-xs active:scale-[0.99]"
          >
            <Plus className="w-3.5 h-3.5 text-brand-700" />
            <span>Add another line</span>
          </button>
        </div>
      </div>
    </div>
  );
};
