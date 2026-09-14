import React from 'react';
import { Settings, User } from 'lucide-react';

interface SerialNoFieldProps {
  value: string;
}

export const SerialNoField: React.FC<SerialNoFieldProps> = ({ value }) => {
  return (
    <div className="flex items-center justify-between">
      <label className="text-[13px] font-semibold text-slate-800">
        S.No.
      </label>

      <div className="w-[72%] sm:w-[75%] flex items-center space-x-2">
        {/* Read only field */}
        <div className="flex-1 py-2 px-3 bg-slate-100/90 border border-slate-200 rounded-lg text-slate-700 font-mono font-semibold text-sm tracking-wider text-center">
          {value}
        </div>

        {/* Auto generated indicator */}
        <div className="py-2 px-2.5 bg-white border border-slate-200 rounded-lg flex items-center space-x-1 text-slate-500 shadow-2xs">
          <Settings className="w-3.5 h-3.5 text-slate-400 animate-[spin_10s_linear_infinite]" />
          <span className="text-[10.5px] font-medium text-slate-600 whitespace-nowrap">
            Auto-generated
          </span>
        </div>
      </div>
    </div>
  );
};

interface CustomerNameFieldProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  prefix?: string;
}

export const CustomerNameField: React.FC<CustomerNameFieldProps> = ({
  value,
  onChange,
  error,
  prefix = 'Name (Mrs.)',
}) => {
  return (
    <div className="flex flex-col space-y-1">
      <div className="flex items-center justify-between">
        <label className="text-[13px] font-semibold text-slate-800">
          {prefix}
        </label>

        <div className="w-[72%] sm:w-[75%] relative flex items-center">
          <div className="absolute left-3 text-slate-400 pointer-events-none">
            <User className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Enter name"
            className={`w-full pl-9 pr-3 py-2.5 bg-white text-slate-800 text-sm border rounded-lg shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
              error
                ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
                : 'border-slate-300 focus:border-brand-700 focus:ring-brand-700/20'
            }`}
          />
        </div>
      </div>
      {error && (
        <p className="text-[11px] text-red-600 text-right pr-1">{error}</p>
      )}
    </div>
  );
};

interface DateFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export const DateField: React.FC<DateFieldProps> = ({ value, onChange }) => {
  return (
    <div className="flex items-center justify-between">
      <label className="text-[13px] font-semibold text-slate-800">
        Date
      </label>

      <div className="w-[72%] sm:w-[75%] relative flex items-center">
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onClick={(e) => e.currentTarget.showPicker?.()}
          className="w-full px-3.5 py-2.5 bg-white text-slate-800 text-sm font-medium border border-slate-300 rounded-lg shadow-xs focus:outline-none focus:border-brand-700 focus:ring-2 focus:ring-brand-700/20 transition-all cursor-pointer [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:p-1 [&::-webkit-calendar-picker-indicator]:hover:bg-slate-100 [&::-webkit-calendar-picker-indicator]:rounded"
        />
      </div>
    </div>
  );
};
