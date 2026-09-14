import React from 'react';
import { FileText, LogOut, X, ChevronRight, Sliders } from 'lucide-react';
import { AppMenuIcon } from './AppMenuIcon';

interface SidebarBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigatePrevious?: () => void;
  onLogout?: () => void;
  onOpenStoreSettings?: () => void;
  historyCount?: number;
  showStoreSettings?: boolean;
}

export const SidebarBottomSheet: React.FC<SidebarBottomSheetProps> = ({
  isOpen,
  onClose,
  onNavigatePrevious,
  onLogout,
  onOpenStoreSettings,
  historyCount = 0,
  showStoreSettings = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end select-none">
      {/* Dimmed Blurred Backdrop Overlay */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Bottom Sheet Drawer — Occupies only space based on options, curved top corners */}
      <div className="relative z-10 w-full max-w-[430px] mx-auto bg-white rounded-t-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.18)] border-t border-slate-200/90 pb-6 pt-2 px-4 animate-in slide-in-from-bottom duration-300 ease-out">
        {/* Top Pull Handle Indicator */}
        <div className="flex justify-center pb-2">
          <div className="w-11 h-1.5 bg-slate-300 rounded-full" />
        </div>

        {/* Sheet Title Bar */}
        <div className="flex items-center justify-between px-2 pb-3 mb-2 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-brand-50 text-brand-850 flex items-center justify-center border border-brand-200/50">
              <AppMenuIcon size={16} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800">Quick Navigation</h4>
              <p className="text-[10px] text-slate-400">SURAJ BULLION ACCESSORIES</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Options List — Just occupies space based on options */}
        <div className="space-y-2">
          {/* Option 1: Previous Certificates */}
          {onNavigatePrevious && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onNavigatePrevious();
              }}
              className="w-full p-3 bg-slate-50 hover:bg-brand-50/70 border border-slate-200/70 hover:border-brand-200 rounded-2xl flex items-center justify-between transition-all active:scale-[0.99] cursor-pointer group text-left"
            >
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-brand-850 shadow-2xs group-hover:border-brand-300">
                  <FileText className="w-4 h-4 text-brand-800" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800 group-hover:text-brand-900">
                    Previous Certificates
                  </div>
                  <div className="text-[10.5px] text-slate-500">
                    Browse and manage past assay records
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-1.5">
                {historyCount > 0 && (
                  <span className="px-2 py-0.5 bg-brand-100 text-brand-800 text-[11px] font-bold rounded-full border border-brand-200/60">
                    {historyCount}
                  </span>
                )}
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-brand-800" />
              </div>
            </button>
          )}

          {/* Option 2 (Optional, Laptop Only): Store & Certificate Settings */}
          {showStoreSettings && onOpenStoreSettings && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenStoreSettings();
              }}
              className="w-full p-3 bg-slate-50 hover:bg-teal-50/70 border border-slate-200/70 hover:border-teal-200 rounded-2xl flex items-center justify-between transition-all active:scale-[0.99] cursor-pointer group text-left"
            >
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-teal-800 shadow-2xs group-hover:border-teal-300">
                  <Sliders className="w-4 h-4 text-teal-800" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800 group-hover:text-teal-900">
                    Certificate Static Settings
                  </div>
                  <div className="text-[10.5px] text-slate-500">
                    Edit store names, address, phone & labels
                  </div>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-teal-800" />
            </button>
          )}

          {/* Option 3: Logout Button */}
          {onLogout && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onLogout();
              }}
              className="w-full p-3 bg-slate-50 hover:bg-red-50/70 border border-slate-200/70 hover:border-red-200 rounded-2xl flex items-center justify-between transition-all active:scale-[0.99] cursor-pointer group text-left"
            >
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-red-600 shadow-2xs group-hover:border-red-300">
                  <LogOut className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800 group-hover:text-red-700">
                    Logout
                  </div>
                  <div className="text-[10.5px] text-slate-500">
                    Safely sign out of admin session
                  </div>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-red-600" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
