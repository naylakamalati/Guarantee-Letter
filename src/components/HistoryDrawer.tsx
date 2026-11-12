import React, { useEffect, useState } from 'react';
import { History, X, RotateCcw, FileText, Calendar, Users } from 'lucide-react';
import { LetterHistoryItem, LetterData } from '../types';
import { loadHistory } from '../lib/storage';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onRestore: (data: LetterData) => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  onRestore,
}) => {
  const [historyList, setHistoryList] = useState<LetterHistoryItem[]>([]);

  useEffect(() => {
    if (isOpen) {
      setHistoryList(loadHistory());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRestore = (item: LetterHistoryItem) => {
    onRestore(item.data);
    onClose();
  };

  const formatTimestamp = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-navy-900/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-md h-full shadow-2xl border-l border-gray-200 flex flex-col animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-4 bg-navy-900 text-white flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-secondary-fixed" />
            <div>
              <h3 className="font-semibold text-sm">Riwayat Surat Diunduh</h3>
              <p className="text-[11px] text-gray-300">
                10 surat terakhir yang telah diekspor ke PDF
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-300 hover:text-white rounded-lg hover:bg-navy-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List Body */}
        <div className="p-4 overflow-y-auto flex-1 divide-y divide-gray-100 space-y-2">
          {historyList.length > 0 ? (
            historyList.map((item) => (
              <div
                key={item.id}
                className="pt-2.5 pb-2.5 first:pt-0 bg-white hover:bg-gray-50/80 p-3 rounded-xl border border-gray-100 transition-colors space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2">
                    <FileText className="w-4 h-4 text-navy-700 mt-0.5 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-navy-900 leading-tight">
                        {item.recipient}
                      </div>
                      <div className="text-[11px] text-gray-500 font-mono mt-0.5">
                        {item.letterNumber || '--'}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRestore(item)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-navy-700 hover:bg-navy-600 text-white rounded-lg text-xs font-medium transition-colors shadow-2xs shrink-0"
                    title="Muat kembali isian surat ini"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Buka kembali</span>
                  </button>
                </div>

                <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1 border-t border-gray-100">
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span>{item.guestCount} Tamu</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{formatTimestamp(item.timestamp)}</span>
                  </div>
                </div>

                <div className="text-[10.5px] text-gray-400 font-mono truncate" title={item.filename}>
                  {item.filename}
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-xs text-gray-500">
              <History className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <span>Belum ada riwayat surat yang di-download. Setiap kali Anda mengunduh PDF, arsipnya akan muncul di sini.</span>
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-100 rounded-lg text-xs font-medium text-gray-800 transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
