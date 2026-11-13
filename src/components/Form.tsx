import React, { useState } from 'react';
import {
  ChevronDown,
  Calendar,
  Building2,
  Users,
  CreditCard,
  PenTool,
  Shield,
  Hash,
} from 'lucide-react';
import { LetterData } from '../types';
import { DEFAULT_RECIPIENTS } from '../config/recipients';
import { DEFAULT_POSITIONS } from '../config/positions';
import { DEFAULT_COVERAGES } from '../config/coverages';
import { SelectWithManual } from './SelectWithManual';
import { GuestTable } from './GuestTable';
import { AssetUploader } from './AssetUploader';
import { formatLetterNumber } from '../lib/letterNumber';
import { FIXED_SIGNATORY_NAME } from '../config/defaultLetter';

interface FormProps {
  data: LetterData;
  onChange: (data: LetterData) => void;
}

export const Form: React.FC<FormProps> = ({ data, onChange }) => {
  // Accordion open states (Section 3 open by default as specified in DESIGN.md)
  const [openSections, setOpenSections] = useState<Record<number, boolean>>({
    1: false,
    2: false,
    3: true,
    4: false,
    5: false,
    6: false,
  });

  const toggleSection = (section: number) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleCoverageChange = (newCoverage: string) => {
    // If coverageSentence still has the previous coverageType, replace it cleanly
    let newSentence = data.coverageSentence;
    if (newSentence.includes(data.coverageType)) {
      newSentence = newSentence.replace(data.coverageType, newCoverage);
    } else {
      newSentence = `Adalah tamu Perum LPPNPI dan menanggung biaya tamu tersebut diatas ${newCoverage}. Tagihan dapat dikirimkan kepada :`;
    }

    onChange({
      ...data,
      coverageType: newCoverage,
      coverageSentence: newSentence,
    });
  };

  const handleAutoNumberToggle = (checked: boolean) => {
    let newLetterNumber = data.letterNumber;
    if (checked) {
      newLetterNumber = formatLetterNumber(
        data.autoNumberPattern,
        data.nextSequence,
        data.date
      );
    }
    onChange({
      ...data,
      autoNumbering: checked,
      letterNumber: newLetterNumber,
    });
  };

  const handlePatternChange = (pattern: string) => {
    const newLetterNumber = data.autoNumbering
      ? formatLetterNumber(pattern, data.nextSequence, data.date)
      : data.letterNumber;
    onChange({
      ...data,
      autoNumberPattern: pattern,
      letterNumber: newLetterNumber,
    });
  };

  const handleBillingLineChange = (index: number, val: string) => {
    const updated = [...data.billingBlock];
    updated[index] = val;
    onChange({ ...data, billingBlock: updated });
  };

  return (
    <div className="w-full h-full bg-white border-r border-gray-200 overflow-y-auto p-4 sm:p-6 space-y-3.5 shadow-sm">
      {/* 1. DETAIL SURAT */}
      <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-card transition-all">
        <button
          type="button"
          onClick={() => toggleSection(1)}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50/70 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-navy-100 flex items-center justify-center text-navy-700">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-sm text-navy-900">
                1. Detail Surat
              </span>
              {!openSections[1] && (
                <div className="text-[11.5px] text-gray-500 mt-0.5 truncate max-w-[280px]">
                  Nomor: <span className="text-gray-800 font-medium">{data.letterNumber || '--'}</span> • Tanggal: <span className="text-gray-800 font-medium">{data.date}</span>
                </div>
              )}
            </div>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-gray-500 transition-transform duration-150 ${
              openSections[1] ? 'transform rotate-180' : ''
            }`}
          />
        </button>

        {openSections[1] && (
          <div className="p-4 pt-1 border-t border-gray-100 space-y-3.5 animate-in slide-in-from-top-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-800 mb-1">
                  Kota Surat <span className="text-navy-700">*</span>
                </label>
                <input
                  type="text"
                  value={data.city}
                  onChange={(e) => onChange({ ...data, city: e.target.value })}
                  placeholder="Surabaya"
                  className="w-full h-10 px-3 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-navy-600 focus:border-navy-600"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-800 mb-1">
                  Tanggal Surat <span className="text-navy-700">*</span>
                </label>
                <input
                  type="date"
                  value={data.date}
                  onChange={(e) => {
                    const newDate = e.target.value;
                    const newNumber = data.autoNumbering
                      ? formatLetterNumber(data.autoNumberPattern, data.nextSequence, newDate)
                      : data.letterNumber;
                    onChange({ ...data, date: newDate, letterNumber: newNumber });
                  }}
                  className="w-full h-10 px-3 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-navy-600 focus:border-navy-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-gray-800">
                    Nomor Surat
                  </label>
                  <label className="flex items-center gap-1.5 text-[11px] text-navy-700 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={data.autoNumbering}
                      onChange={(e) => handleAutoNumberToggle(e.target.checked)}
                      className="rounded border-gray-300 text-navy-700 focus:ring-navy-600"
                    />
                    <span>Otomatis</span>
                  </label>
                </div>
                <input
                  type="text"
                  value={data.letterNumber}
                  disabled={data.autoNumbering}
                  onChange={(e) =>
                    onChange({ ...data, letterNumber: e.target.value })
                  }
                  placeholder="--"
                  className={`w-full h-10 px-3 border rounded-lg text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-navy-600 ${
                    data.autoNumbering ? 'bg-gray-100 border-gray-200' : 'bg-white border-gray-200'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-800 mb-1">
                  Perihal <span className="text-navy-700">*</span>
                </label>
                <input
                  type="text"
                  value={data.subject}
                  onChange={(e) =>
                    onChange({ ...data, subject: e.target.value })
                  }
                  placeholder="Guarantee Letter"
                  className="w-full h-10 px-3 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-navy-600 focus:border-navy-600"
                />
              </div>
            </div>

            {/* Auto-numbering pattern settings */}
            {data.autoNumbering && (
              <div className="p-3 bg-navy-100/40 border border-navy-100 rounded-lg space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-navy-900">
                  <Hash className="w-3.5 h-3.5 text-navy-700" />
                  <span>Pengaturan Penomoran Otomatis</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <label className="block text-[11px] text-gray-600 mb-0.5">
                      Pola Format:
                    </label>
                    <input
                      type="text"
                      value={data.autoNumberPattern}
                      onChange={(e) => handlePatternChange(e.target.value)}
                      className="w-full h-8 px-2 bg-white border border-gray-200 rounded text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-gray-600 mb-0.5">
                      No. Urut:
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={data.nextSequence}
                      onChange={(e) => {
                        const nextSeq = Math.max(1, parseInt(e.target.value, 10) || 1);
                        const newNumber = formatLetterNumber(
                          data.autoNumberPattern,
                          nextSeq,
                          data.date
                        );
                        onChange({
                          ...data,
                          nextSequence: nextSeq,
                          letterNumber: newNumber,
                        });
                      }}
                      className="w-full h-8 px-2 bg-white border border-gray-200 rounded text-xs font-mono"
                    />
                  </div>
                </div>
                <p className="text-[10.5px] text-gray-500">
                  Token: <code className="bg-white px-1 py-0.5 rounded border border-gray-200">{'{num:3}'}</code> (001), <code className="bg-white px-1 py-0.5 rounded border border-gray-200">{'{romanMonth}'}</code> (X/XI), <code className="bg-white px-1 py-0.5 rounded border border-gray-200">{'{year}'}</code>. Nomor otomatis naik setelah PDF di-download.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 2. KEPADA YTH. (PENERIMA) */}
      <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-card transition-all">
        <button
          type="button"
          onClick={() => toggleSection(2)}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50/70 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-navy-100 flex items-center justify-center text-navy-700">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-sm text-navy-900">
                2. Kepada Yth. (Penerima)
              </span>
              {!openSections[2] && (
                <div className="text-[11.5px] text-gray-500 mt-0.5 truncate max-w-[280px]">
                  Tujuan: <span className="text-gray-800 font-medium">{data.recipient}</span>
                </div>
              )}
            </div>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-gray-500 transition-transform duration-150 ${
              openSections[2] ? 'transform rotate-180' : ''
            }`}
          />
        </button>

        {openSections[2] && (
          <div className="p-4 pt-1 border-t border-gray-100 space-y-3 animate-in slide-in-from-top-1">
            <SelectWithManual
              category="recipients"
              label="Penerima Surat (Hotel / Rekanan)"
              required
              presetOptions={DEFAULT_RECIPIENTS}
              value={data.recipient}
              onChange={(val) => onChange({ ...data, recipient: val })}
              placeholder="Pilih hotel rekanan atau ketik manual..."
            />

            <div>
              <label className="block text-xs font-medium text-gray-800 mb-1">
                Cabang / Kota (Opsional)
              </label>
              <input
                type="text"
                value={data.recipientBranch}
                onChange={(e) =>
                  onChange({ ...data, recipientBranch: e.target.value.toUpperCase() })
                }
                placeholder="CONTOH: MALANG (Boleh dikosongkan)"
                className="w-full h-10 px-3 bg-white border border-gray-200 rounded-lg text-xs font-medium uppercase text-gray-800 focus:outline-none focus:ring-2 focus:ring-navy-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-medium text-gray-800 mb-1">
                  Prefiks Lokasi
                </label>
                <input
                  type="text"
                  value={data.recipientLocationPrefix}
                  onChange={(e) =>
                    onChange({ ...data, recipientLocationPrefix: e.target.value })
                  }
                  className="w-full h-9 px-3 bg-white border border-gray-200 rounded-lg text-xs text-gray-800"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-800 mb-1">
                  Lokasi
                </label>
                <input
                  type="text"
                  value={data.recipientLocation}
                  onChange={(e) =>
                    onChange({ ...data, recipientLocation: e.target.value })
                  }
                  className="w-full h-9 px-3 bg-white border border-gray-200 rounded-lg text-xs text-gray-800"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. DAFTAR TAMU (EXPANDED BY DEFAULT) */}
      <div className="border-2 border-navy-700 rounded-xl overflow-hidden bg-white shadow-card transition-all">
        <button
          type="button"
          onClick={() => toggleSection(3)}
          className="w-full p-4 bg-navy-100/50 flex items-center justify-between text-left hover:bg-navy-100 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-navy-700 flex items-center justify-center text-white">
              <Users className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-navy-900">
                3. Daftar Tamu
              </span>
              <span className="bg-navy-700 text-white text-[11px] font-semibold px-2 py-0.5 rounded-full">
                {data.guests.length} Tamu
              </span>
            </div>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-navy-900 transition-transform duration-150 ${
              openSections[3] ? 'transform rotate-180' : ''
            }`}
          />
        </button>

        {openSections[3] && (
          <div className="p-4 pt-3 border-t border-gray-200 space-y-4 animate-in slide-in-from-top-1">
            <GuestTable
              guests={data.guests}
              onChange={(guests) => onChange({ ...data, guests })}
              defaultDate={data.date}
            />
          </div>
        )}
      </div>

      {/* 4. TAGIHAN & CAKUPAN */}
      <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-card transition-all">
        <button
          type="button"
          onClick={() => toggleSection(4)}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50/70 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-navy-100 flex items-center justify-center text-navy-700">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-sm text-navy-900">
                4. Tagihan &amp; Cakupan
              </span>
              {!openSections[4] && (
                <div className="text-[11.5px] text-gray-500 mt-0.5 truncate max-w-[280px]">
                  Cakupan: <span className="text-gray-800 font-medium">{data.coverageType}</span>
                </div>
              )}
            </div>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-gray-500 transition-transform duration-150 ${
              openSections[4] ? 'transform rotate-180' : ''
            }`}
          />
        </button>

        {openSections[4] && (
          <div className="p-4 pt-1 border-t border-gray-100 space-y-3.5 animate-in slide-in-from-top-1">
            <SelectWithManual
              category="coverages"
              label="Jenis Cakupan Biaya"
              required
              presetOptions={DEFAULT_COVERAGES}
              value={data.coverageType}
              onChange={handleCoverageChange}
            />

            <div>
              <label className="block text-xs font-medium text-gray-800 mb-1">
                Kalimat Tanggungan Biaya (Dapat Diedit Bebas):
              </label>
              <textarea
                value={data.coverageSentence}
                onChange={(e) =>
                  onChange({ ...data, coverageSentence: e.target.value })
                }
                rows={2}
                className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-navy-600 resize-none"
              />
            </div>

            <div className="space-y-1.5 pt-1">
              <label className="block text-xs font-semibold text-navy-900">
                Blok Alamat Penagihan (Semua Baris Dapat Diedit):
              </label>
              {data.billingBlock.map((line, idx) => (
                <input
                  key={idx}
                  type="text"
                  value={line}
                  onChange={(e) => handleBillingLineChange(idx, e.target.value)}
                  className="w-full h-8 px-2.5 bg-white border border-gray-200 rounded text-xs text-gray-800 font-medium"
                />
              ))}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-800 mb-1">
                Kalimat Penutup Surat:
              </label>
              <input
                type="text"
                value={data.closingSentence}
                onChange={(e) =>
                  onChange({ ...data, closingSentence: e.target.value })
                }
                className="w-full h-9 px-3 bg-white border border-gray-200 rounded-lg text-xs text-gray-800"
              />
            </div>
          </div>
        )}
      </div>

      {/* 5. PENANDATANGAN */}
      <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-card transition-all">
        <button
          type="button"
          onClick={() => toggleSection(5)}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50/70 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-navy-100 flex items-center justify-center text-navy-700">
              <PenTool className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-sm text-navy-900">
                5. Penandatangan
              </span>
              {!openSections[5] && (
                <div className="text-[11.5px] text-gray-500 mt-0.5 truncate max-w-[280px]">
                  Oleh: <span className="text-gray-800 font-medium">{FIXED_SIGNATORY_NAME}</span> ({data.signatoryTitle})
                </div>
              )}
            </div>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-gray-500 transition-transform duration-150 ${
              openSections[5] ? 'transform rotate-180' : ''
            }`}
          />
        </button>

        {openSections[5] && (
          <div className="p-4 pt-1 border-t border-gray-100 space-y-3.5 animate-in slide-in-from-top-1">
            <SelectWithManual
              category="positions"
              label="Jabatan Penandatangan"
              required
              presetOptions={DEFAULT_POSITIONS}
              value={data.signatoryTitle}
              onChange={(val) =>
                onChange({ ...data, signatoryTitle: val.toUpperCase() })
              }
            />

            <div>
              <label className="block text-xs font-medium text-gray-800 mb-1">
                Nama Pejabat Penandatangan
              </label>
              <input
                type="text"
                value={FIXED_SIGNATORY_NAME}
                readOnly
                className="w-full h-10 px-3 bg-gray-100 border border-gray-200 rounded-lg text-xs font-bold uppercase text-gray-600 cursor-not-allowed"
              />
            </div>
          </div>
        )}
      </div>

      {/* 6. ASET RESMI */}
      <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-card transition-all">
        <button
          type="button"
          onClick={() => toggleSection(6)}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50/70 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-navy-100 flex items-center justify-center text-navy-700">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-sm text-navy-900">
                6. Aset Resmi (Logo, Stempel, TTD)
              </span>
              {!openSections[6] && (
                <div className="text-[11.5px] text-gray-500 mt-0.5 truncate max-w-[280px]">
                  Status: Logo {data.assets.logoUrl ? 'Terpasang ✔' : '-'} • Stempel &amp; TTD Terpasang (Tetap)
                </div>
              )}
            </div>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-gray-500 transition-transform duration-150 ${
              openSections[6] ? 'transform rotate-180' : ''
            }`}
          />
        </button>

        {openSections[6] && (
          <div className="p-4 pt-1 border-t border-gray-100 space-y-3.5 animate-in slide-in-from-top-1">
            <AssetUploader
              assets={data.assets}
              onChange={(assets) => onChange({ ...data, assets })}
              showPlaceholdersInPdf={data.showPlaceholdersInPdf}
              onTogglePlaceholdersInPdf={(val) =>
                onChange({ ...data, showPlaceholdersInPdf: val })
              }
            />

            <div className="pt-2 border-t border-gray-100">
              <label className="text-xs text-gray-700 flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={data.repeatHeaderOnPage2}
                  onChange={(e) =>
                    onChange({ ...data, repeatHeaderOnPage2: e.target.checked })
                  }
                  className="w-3.5 h-3.5 text-navy-700 rounded border-gray-300 focus:ring-navy-600"
                />
                <span>Ulangi kop surat lengkap jika surat berlanjut ke halaman 2</span>
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
