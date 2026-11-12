import React from 'react';
import { Download, Printer, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { ValidationResult } from '../lib/validation';

interface ActionBarProps {
  validation: ValidationResult;
  guestCount: number;
  isGeneratingPdf: boolean;
  pdfProgressMessage: string;
  onDownloadPdf: () => void;
  onPrint: () => void;
}

export const ActionBar: React.FC<ActionBarProps> = ({
  validation,
  guestCount,
  isGeneratingPdf,
  pdfProgressMessage,
  onDownloadPdf,
  onPrint,
}) => {
  const { isValid, errors } = validation;

  return (
    <footer className="fixed bottom-0 left-0 right-0 h-14 bg-white border-t border-gray-200 px-4 sm:px-6 flex items-center justify-between z-30 shadow-sm">
      {/* Left Validation Status */}
      <div className="flex items-center gap-3">
        {isValid ? (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-green-50 text-success-600 border border-green-200 px-2.5 py-1 rounded-full text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Siap diunduh</span>
            </div>
            <span className="hidden sm:inline text-xs text-gray-500">
              Semua data valid ({guestCount} tamu terisi)
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-red-50 text-danger-600 border border-red-200 px-2.5 py-1 rounded-full text-xs font-semibold">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.length} kolom perlu diperbaiki</span>
            </div>
            <span className="hidden sm:inline text-[11px] text-danger-600 truncate max-w-[240px]">
              {errors[0]?.message}
            </span>
          </div>
        )}
      </div>

      {/* Right Primary Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={onPrint}
          className="bg-white border border-navy-700 text-navy-700 hover:bg-gray-50 h-9 sm:h-10 px-3.5 sm:px-4 rounded-lg font-medium text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
          title="Cetak langsung lewat browser"
        >
          <Printer className="w-4 h-4" />
          <span>Cetak</span>
        </button>

        <button
          type="button"
          disabled={!isValid || isGeneratingPdf}
          onClick={onDownloadPdf}
          className={`h-9 sm:h-10 px-4 sm:px-5 rounded-lg font-medium text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all duration-150 ${
            !isValid || isGeneratingPdf
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-navy-700 hover:bg-navy-600 active:scale-95 text-white'
          }`}
        >
          {isGeneratingPdf ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{pdfProgressMessage || 'Membuat PDF...'}</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </>
          )}
        </button>
      </div>
    </footer>
  );
};
