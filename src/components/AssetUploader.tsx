import React, { useRef } from 'react';
import { Upload, Trash2, RefreshCw, ShieldCheck } from 'lucide-react';
import { LetterAssets } from '../types';

interface AssetUploaderProps {
  assets: LetterAssets;
  onChange: (assets: LetterAssets) => void;
  showPlaceholdersInPdf: boolean;
  onTogglePlaceholdersInPdf: (val: boolean) => void;
}

interface DropzoneSlotProps {
  label: string;
  placeholderText: string;
  helperText: string;
  currentUrl: string | null;
  onUpload: (dataUrl: string) => void;
  onRemove: () => void;
}

const DropzoneSlot: React.FC<DropzoneSlotProps> = ({
  label,
  placeholderText,
  helperText,
  currentUrl,
  onUpload,
  onRemove,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onUpload(reader.result);
      }
    };
    reader.readAsDataURL(file);
    // Reset file input value
    e.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onUpload(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex-1 min-w-[120px] flex flex-col items-center">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/svg+xml,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />

      <span className="text-[12px] font-semibold text-navy-900 mb-1">{label}</span>

      {currentUrl ? (
        <div className="relative group w-full h-24 border border-gray-200 rounded-lg p-1.5 bg-white flex flex-col items-center justify-center overflow-hidden shadow-xs hover:border-navy-600 transition-colors">
          <img
            src={currentUrl}
            alt={label}
            className="max-h-full max-w-full object-contain"
          />

          {/* Hover overlay actions */}
          <div className="absolute inset-0 bg-navy-900/75 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-1.5 bg-white/20 hover:bg-white/40 text-white rounded-md transition-colors"
              title="Ganti Gambar"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={onRemove}
              className="p-1.5 bg-danger-600/80 hover:bg-danger-600 text-white rounded-md transition-colors"
              title="Hapus Gambar"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="w-full h-24 border-2 border-dashed border-gray-200 hover:border-navy-600 rounded-lg bg-gray-50 flex flex-col items-center justify-center p-2 text-center cursor-pointer transition-colors group"
        >
          <Upload className="w-4 h-4 text-gray-500 group-hover:text-navy-700 transition-colors mb-1" />
          <span className="text-[11px] font-bold text-gray-500 group-hover:text-navy-900 tracking-wider">
            {placeholderText}
          </span>
          <span className="text-[9.5px] text-gray-500 mt-0.5 leading-tight">{helperText}</span>
        </div>
      )}
    </div>
  );
};

export const AssetUploader: React.FC<AssetUploaderProps> = ({
  assets,
  onChange,
  showPlaceholdersInPdf,
  onTogglePlaceholdersInPdf,
}) => {
  const handleRestoreDefaults = () => {
    onChange({
      logoUrl: '/assets/airnav-logo.png',
      stampUrl: null,
      signatureUrl: null,
    });
  };

  const isUsingDefaults =
    assets.logoUrl === '/assets/airnav-logo.png' &&
    assets.stampUrl === null &&
    assets.signatureUrl === null;

  return (
    <div className="space-y-3.5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h4 className="text-sm font-semibold text-navy-900">Aset Resmi Dokumen</h4>
          <p className="text-xs text-gray-500">
            Logo AirNav tersedia sebagai aset bawaan. Unggah stempel dan tanda tangan yang telah mendapat izin.
          </p>
        </div>
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          {!isUsingDefaults && (
            <button
              type="button"
              onClick={handleRestoreDefaults}
              className="px-2 py-1 bg-navy-100 hover:bg-navy-100/80 text-navy-700 text-[11px] font-medium rounded-md transition-colors"
              title="Kembalikan ke logo dan stempel+ttd bawaan"
            >
              Reset ke Aset Resmi
            </button>
          )}
          <div className="flex items-center gap-1 text-[11px] text-success-600 font-medium bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Tersimpan di browser</span>
          </div>
        </div>
      </div>

      {/* 3 Dropzone Slots */}
      <div className="grid grid-cols-3 gap-3">
        <DropzoneSlot
          label="Logo AirNav"
          placeholderText="LOGO"
          helperText="Klik / seret file"
          currentUrl={assets.logoUrl}
          onUpload={(url) => onChange({ ...assets, logoUrl: url })}
          onRemove={() => onChange({ ...assets, logoUrl: null })}
        />
        <DropzoneSlot
          label="Stempel & TTD"
          placeholderText="STEMPEL & TTD"
          helperText="Stempel basah + TTD"
          currentUrl={assets.stampUrl}
          onUpload={(url) => onChange({ ...assets, stampUrl: url })}
          onRemove={() => onChange({ ...assets, stampUrl: null })}
        />
        <DropzoneSlot
          label="TTD Terpisah (Opsional)"
          placeholderText="TTD"
          helperText="Jika TTD terpisah"
          currentUrl={assets.signatureUrl}
          onUpload={(url) => onChange({ ...assets, signatureUrl: url })}
          onRemove={() => onChange({ ...assets, signatureUrl: null })}
        />
      </div>

      {/* PDF Export Setting for Missing Placeholders */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <label className="text-xs text-gray-800 flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={showPlaceholdersInPdf}
            onChange={(e) => onTogglePlaceholdersInPdf(e.target.checked)}
            className="w-3.5 h-3.5 text-navy-700 rounded border-gray-200 focus:ring-navy-600"
          />
          <span>Tampilkan kotak placeholder ("LOGO", "STEMPEL", "TTD") di hasil PDF jika aset kosong</span>
        </label>
      </div>
    </div>
  );
};
