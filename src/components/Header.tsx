import React from 'react';
import { RotateCcw, Bookmark, History } from 'lucide-react';

interface HeaderProps {
  logoUrl?: string | null;
  onOpenResetModal: () => void;
  onOpenTemplateModal: () => void;
  onOpenHistoryDrawer: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  logoUrl,
  onOpenResetModal,
  onOpenTemplateModal,
  onOpenHistoryDrawer,
}) => {
  return (
    <header className="h-14 bg-navy-900 text-white px-4 sm:px-6 flex items-center justify-between border-b border-navy-700 shadow-sm shrink-0 z-30">
      {/* Left Branding */}
      <div className="flex items-center gap-3">
        {/* Official AirNav Logo */}
        <img
          src={logoUrl || '/assets/airnav-logo.png'}
          alt="AirNav Indonesia Logo"
          className="w-9 h-9 object-contain drop-shadow-sm shrink-0"
        />

        <div className="flex items-center gap-2 sm:gap-3">
          <span className="font-bold text-base sm:text-lg tracking-wide text-white leading-none">
            AirNav Indonesia
          </span>
          <span className="hidden sm:inline-block h-4 w-px bg-navy-700"></span>
          <span className="text-xs sm:text-[14px] font-medium text-gray-200">
            Guarantee Letter Generator
          </span>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        <button
          type="button"
          onClick={onOpenTemplateModal}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-gray-200 hover:text-white rounded-lg hover:bg-navy-700 text-xs font-medium transition-colors"
          title="Kelola template isian"
        >
          <Bookmark className="w-4 h-4 text-gray-300" />
          <span className="hidden md:inline">Template</span>
        </button>

        <button
          type="button"
          onClick={onOpenHistoryDrawer}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-gray-200 hover:text-white rounded-lg hover:bg-navy-700 text-xs font-medium transition-colors"
          title="Buka riwayat surat"
        >
          <History className="w-4 h-4 text-gray-300" />
          <span className="hidden md:inline">Riwayat</span>
        </button>

        <div className="h-4 w-px bg-navy-700 mx-1"></div>

        <button
          type="button"
          onClick={onOpenResetModal}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-danger-600/90 hover:text-danger-600 hover:bg-red-500/10 rounded-lg text-xs font-medium transition-colors"
          title="Reset semua isian ke kondisi awal"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>
    </header>
  );
};
