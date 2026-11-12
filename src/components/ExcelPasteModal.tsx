import React, { useState } from 'react';
import { X, FileSpreadsheet, Check, AlertCircle } from 'lucide-react';
import { Guest } from '../types';

interface ExcelPasteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (importedGuests: Guest[], mode: 'replace' | 'append') => void;
  defaultCheckIn: string;
  defaultCheckOut: string;
}

export const ExcelPasteModal: React.FC<ExcelPasteModalProps> = ({
  isOpen,
  onClose,
  onImport,
  defaultCheckIn,
  defaultCheckOut,
}) => {
  const [rawText, setRawText] = useState('');
  const [importMode, setImportMode] = useState<'replace' | 'append'>('append');
  const [parsedPreview, setParsedPreview] = useState<Guest[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleParse = (text: string) => {
    setRawText(text);
    setParseError(null);

    const lines = text
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    if (lines.length === 0) {
      setParsedPreview([]);
      return;
    }

    const guests: Guest[] = [];

    lines.forEach((line, index) => {
      // Split by tab (Excel copy) or comma or semicolon
      let cols: string[] = [];
      if (line.includes('\t')) {
        cols = line.split('\t');
      } else if (line.includes(';')) {
        cols = line.split(';');
      } else if (line.includes(',')) {
        cols = line.split(',');
      } else {
        cols = [line];
      }

      cols = cols.map((c) => c.trim());

      // If the first column is a number (e.g. 1, 2, 3), shift it
      if (cols.length > 1 && /^\d+\.?$/.test(cols[0])) {
        cols.shift();
      }

      let title: 'Mr.' | 'Mrs.' = 'Mr.';
      let nama = (cols[0] || '').toUpperCase();
      if (/^(MR\.?|TUAN)\s+/i.test(nama)) {
        title = 'Mr.';
        nama = nama.replace(/^(MR\.?|TUAN)\s+/i, '').trim();
      } else if (/^(MS\.?|MRS\.?|NY\.?|NONA)\s+/i.test(nama)) {
        title = 'Mrs.';
        nama = nama.replace(/^(MS\.?|MRS\.?|NY\.?|NONA)\s+/i, '').trim();
      }

      const type = (cols[1] || 'DELUXE').toUpperCase();
      const checkIn = cols[2] && /^\d{4}-\d{2}-\d{2}$/.test(cols[2]) ? cols[2] : defaultCheckIn;
      const checkOut = cols[3] && /^\d{4}-\d{2}-\d{2}$/.test(cols[3]) ? cols[3] : defaultCheckOut;

      if (nama) {
        guests.push({
          id: `pasted-${Date.now()}-${index}`,
          title,
          nama,
          type,
          checkIn,
          checkOut,
        });
      }
    });

    if (guests.length === 0) {
      setParseError('Tidak ada baris nama tamu yang berhasil diparsing.');
    }

    setParsedPreview(guests);
  };

  const handleConfirm = () => {
    if (parsedPreview.length === 0) return;
    onImport(parsedPreview, importMode);
    onClose();
    setRawText('');
    setParsedPreview([]);
  };

  return (
    <div className="fixed inset-0 z-50 bg-navy-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full border border-gray-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-3.5 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-navy-100 flex items-center justify-center text-navy-700">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-navy-900">Tempel dari Excel / Teks</h3>
              <p className="text-[11.5px] text-gray-500">
                Salin baris dari Microsoft Excel atau Google Sheets, lalu tempelkan di bawah.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-500 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          {/* Format Guide */}
          <div className="bg-navy-100/40 border border-navy-100 rounded-lg p-2.5 text-xs text-navy-900 leading-relaxed">
            <span className="font-semibold">Format kolom (dipisah Tab / Koma):</span>
            <div className="text-[11.5px] text-gray-800 mt-1 font-mono bg-white p-2 rounded border border-gray-200">
              NAMA TAMU [Tab] ROOM TYPE [Tab] CHECK IN (opsional) [Tab] CHECK OUT (opsional)
            </div>
          </div>

          {/* Textarea */}
          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-800">
              Tempel data di sini (Ctrl+V):
            </label>
            <textarea
              value={rawText}
              onChange={(e) => handleParse(e.target.value)}
              placeholder={`Contoh:\nNAMA TAMU 1\tDELUXE KING\t2026-10-07\t2026-10-10\nNAMA TAMU 2\tDELUXE TWIN\t2026-10-07\t2026-10-10`}
              rows={5}
              className="w-full p-3 bg-white border border-gray-200 rounded-lg text-xs font-mono text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-navy-600 focus:border-navy-600 resize-none"
            />
          </div>

          {/* Mode Selector */}
          <div className="flex items-center gap-4 text-xs text-gray-800">
            <span className="font-medium">Metode Impor:</span>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name="importMode"
                value="append"
                checked={importMode === 'append'}
                onChange={() => setImportMode('append')}
                className="text-navy-700 focus:ring-navy-600"
              />
              <span>Tambahkan ke daftar saat ini</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name="importMode"
                value="replace"
                checked={importMode === 'replace'}
                onChange={() => setImportMode('replace')}
                className="text-navy-700 focus:ring-navy-600"
              />
              <span>Gantikan seluruh tamu saat ini</span>
            </label>
          </div>

          {/* Parse Error */}
          {parseError && (
            <div className="flex items-center gap-2 p-2.5 bg-danger-600/10 text-danger-600 rounded-lg text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{parseError}</span>
            </div>
          )}

          {/* Preview of Parsed Guests */}
          {parsedPreview.length > 0 && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-medium text-gray-800">
                <span>Pratinjau Hasil Parsing ({parsedPreview.length} tamu terdeteksi):</span>
              </div>
              <div className="border border-gray-200 rounded-lg max-h-40 overflow-y-auto">
                <table className="w-full text-[11px] text-left border-collapse">
                  <thead className="bg-gray-100 text-gray-800 uppercase font-semibold sticky top-0">
                    <tr>
                      <th className="py-1.5 px-2 w-8 text-center border-b border-gray-200">No</th>
                      <th className="py-1.5 px-2 border-b border-gray-200">Nama</th>
                      <th className="py-1.5 px-2 border-b border-gray-200">Type</th>
                      <th className="py-1.5 px-2 border-b border-gray-200">Check In</th>
                      <th className="py-1.5 px-2 border-b border-gray-200">Check Out</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {parsedPreview.map((g, idx) => (
                      <tr key={g.id} className="hover:bg-gray-50">
                        <td className="py-1 px-2 text-center text-gray-500">{idx + 1}</td>
                        <td className="py-1 px-2 font-medium text-gray-800">{g.nama}</td>
                        <td className="py-1 px-2 text-gray-500">{g.type}</td>
                        <td className="py-1 px-2 text-gray-500">{g.checkIn}</td>
                        <td className="py-1 px-2 text-gray-500">{g.checkOut}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-gray-50 border-t border-gray-200 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-200 bg-white hover:bg-gray-100 rounded-lg text-xs font-medium text-gray-800 transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            disabled={parsedPreview.length === 0}
            onClick={handleConfirm}
            className="px-4 py-2 bg-navy-700 hover:bg-navy-600 disabled:bg-gray-200 disabled:text-gray-500 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Check className="w-4 h-4" />
            <span>Impor {parsedPreview.length > 0 ? `(${parsedPreview.length} Tamu)` : ''}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
