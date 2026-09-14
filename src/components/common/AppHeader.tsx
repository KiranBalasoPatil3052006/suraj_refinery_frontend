import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { SBALogo } from './SBALogo';
import { AppMenuIcon } from './AppMenuIcon';

interface AppHeaderProps {
  showBack?: boolean;
  onBack?: () => void;
  onNavigateHistory?: () => void;
  showHistoryButton?: boolean;
  historyCount?: number;
  onOpenMenu?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  showBack = false,
  onBack,
  historyCount,
  onOpenMenu,
}) => {
  return (
    <header className="w-full pt-4 pb-2 px-4 flex items-center justify-between relative select-none">
      {/* Left: Back chevron if showBack, or spacer for center logo balance */}
      <div className="w-10 flex items-center justify-start">
        {showBack && onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-xs flex items-center justify-center text-slate-700 hover:text-brand-800 hover:border-brand-300 active:scale-95 transition-all cursor-pointer"
            aria-label="Go back"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
          </button>
        ) : (
          <div className="w-10" />
        )}
      </div>

      {/* Center Brand Logo */}
      <div className="flex-1 flex justify-center">
        <SBALogo size="md" />
      </div>

      {/* Right Action: Sidebar button placed right where the Previous button was */}
      <div className="w-10 flex items-center justify-end">
        {onOpenMenu ? (
          <button
            type="button"
            onClick={onOpenMenu}
            className="relative w-10 h-10 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-center text-slate-700 hover:text-brand-900 hover:border-brand-300 active:scale-95 transition-all cursor-pointer group"
            aria-label="Open navigation menu"
            title="Menu & History"
          >
            <AppMenuIcon size={18} className="text-slate-700 group-hover:text-brand-900 transition-colors" />
            {historyCount !== undefined && historyCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-brand-800 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-2xs">
                {historyCount}
              </span>
            )}
          </button>
        ) : (
          <div className="w-10" />
        )}
      </div>
    </header>
  );
};
