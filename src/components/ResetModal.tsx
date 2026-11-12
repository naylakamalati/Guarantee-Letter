import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ResetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ResetModal: React.FC<ResetModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-navy-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-danger-600 font-semibold text-sm">
            <AlertTriangle className="w-4 h-4" />
            <span>Konfirmasi Reset Formulir</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-500 hover:text-gray-800 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-2">
          <h4 className="text-sm font-semibold text-gray-800">
            Reset semua isian form ke pengaturan awal?
          </h4>
          <p className="text-xs text-gray-500 leading-relaxed">
            Tindakan ini akan mengembalikan data surat, penerima, daftar tamu, dan blok penandatangan ke nilai default awal. Aset logo dan stempel tetap tersimpan.
          </p>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 bg-gray-50 border-t border-gray-200 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-200 bg-white hover:bg-gray-100 rounded-lg text-xs font-medium text-gray-800 transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 bg-danger-600 hover:bg-danger-600/90 text-white rounded-lg text-xs font-medium transition-colors shadow-xs"
          >
            Ya, Reset Formulir
          </button>
        </div>
      </div>
    </div>
  );
};
