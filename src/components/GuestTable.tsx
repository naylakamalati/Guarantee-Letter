import React from 'react';
import {
  Plus,
  Copy,
  Trash2,
  Wand2,
  AlertTriangle,
  AlertCircle,
} from 'lucide-react';
import { Guest } from '../types';
import { DEFAULT_ROOM_TYPES } from '../config/roomTypes';
import { SelectWithManual } from './SelectWithManual';

interface GuestTableProps {
  guests: Guest[];
  onChange: (guests: Guest[]) => void;
  defaultDate: string;
}

export const GuestTable: React.FC<GuestTableProps> = ({
  guests,
  onChange,
  defaultDate,
}) => {
  // Add new row
  const handleAddGuest = () => {
    const lastGuest = guests[guests.length - 1];
    const newGuest: Guest = {
      id: `guest-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title: 'Mr.',
      nama: '',
      type: lastGuest ? lastGuest.type : 'DELUXE',
      checkIn: lastGuest ? lastGuest.checkIn : defaultDate,
      checkOut: lastGuest ? lastGuest.checkOut : defaultDate,
    };
    onChange([...guests, newGuest]);
  };

  // Duplicate specific row
  const handleDuplicateGuest = (index: number) => {
    const target = guests[index];
    const duplicated: Guest = {
      ...target,
      id: `guest-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    };
    const updated = [...guests];
    updated.splice(index + 1, 0, duplicated);
    onChange(updated);
  };

  // Delete specific row (disabled if length is 1)
  const handleDeleteGuest = (index: number) => {
    if (guests.length <= 1) return;
    const updated = guests.filter((_, i) => i !== index);
    onChange(updated);
  };

  // Update specific field in row
  const handleUpdateField = (
    index: number,
    field: keyof Guest,
    value: string
  ) => {
    const updated = [...guests];
    if (field === 'nama') {
      // Auto-uppercase name
      updated[index] = { ...updated[index], [field]: value.toUpperCase() };
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
    onChange(updated);
  };

  // Apply row 1's type & dates to all guests
  const handleApplyToAll = () => {
    if (guests.length === 0) return;
    const template = guests[0];
    const updated = guests.map((g) => ({
      ...g,
      type: template.type,
      checkIn: template.checkIn,
      checkOut: template.checkOut,
    }));
    onChange(updated);
  };

  // Check for duplicate names across list
  const getDuplicateIndex = (index: number): boolean => {
    const currentName = guests[index]?.nama?.trim().toUpperCase();
    if (!currentName) return false;
    return guests.some(
      (g, i) => i !== index && g.nama?.trim().toUpperCase() === currentName
    );
  };

  return (
    <div className="space-y-3">
      {/* Table Container (Desktop view with Horizontal Scroll & Sticky Action Column) */}
      <div
        className="hidden sm:block border border-gray-200 rounded-lg overflow-x-auto bg-white shadow-card scroll-smooth"
        style={{ scrollbarWidth: 'thin' }}
      >
        <table className="w-full min-w-[720px] text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 text-[11.5px] font-semibold text-gray-800 uppercase tracking-wider border-b border-gray-200">
              <th className="py-2.5 px-3 w-10 text-center">No</th>
              <th className="py-2.5 px-3 min-w-[240px]">Nama Tamu</th>
              <th className="py-2.5 px-3 w-40 min-w-[160px]">Room Type</th>
              <th className="py-2.5 px-2 w-36 min-w-[130px]">Check In</th>
              <th className="py-2.5 px-2 w-36 min-w-[130px]">Check Out</th>
              {/* Sticky Right Action Header so it never cuts off */}
              <th className="py-2.5 px-2 w-20 text-center sticky right-0 bg-gray-100 border-l border-gray-200 z-20 shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.06)]">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-xs">
            {guests.map((guest, index) => {
              const isDateInvalid =
                guest.checkIn && guest.checkOut && guest.checkOut < guest.checkIn;
              const isDuplicate = getDuplicateIndex(index);
              const isNameEmpty = !guest.nama.trim();

              return (
                <tr
                  key={guest.id}
                  className="hover:bg-gray-50/75 transition-colors group align-top"
                >
                  {/* No */}
                  <td className="py-2.5 px-3 text-center font-medium text-gray-500 pt-3">
                    {index + 1}
                  </td>

                  {/* Nama */}
                  <td className="py-2 px-3">
                    <div className="flex items-center gap-1.5 w-full">
                      <select
                        value={guest.title || 'Mr.'}
                        onChange={(e) =>
                          handleUpdateField(index, 'title', e.target.value)
                        }
                        className="h-9 px-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-600 shrink-0 cursor-pointer hover:bg-gray-100 transition-colors"
                        title="Pilih gelar/sapaan (Mr. / Mrs.)"
                      >
                        <option value="Mr.">Mr.</option>
                        <option value="Mrs.">Mrs.</option>
                      </select>
                      <input
                        type="text"
                        value={guest.nama}
                        onChange={(e) =>
                          handleUpdateField(index, 'nama', e.target.value)
                        }
                        placeholder="CONTOH: NAMA TAMU"
                        className={`flex-1 min-w-0 h-9 px-2.5 bg-white border rounded-lg text-xs font-semibold uppercase text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-navy-600 focus:border-navy-600 transition-colors ${
                          isNameEmpty
                            ? 'border-danger-600/70 bg-red-50/20'
                            : 'border-gray-200'
                        }`}
                      />
                    </div>
                    {isDuplicate && (
                      <div className="flex items-center gap-1 text-[10.5px] text-amber-700 mt-1">
                        <AlertTriangle className="w-3 h-3 shrink-0" />
                        <span>Nama terdeteksi ganda</span>
                      </div>
                    )}
                  </td>

                  {/* Room Type */}
                  <td className="py-2 px-3">
                    <SelectWithManual
                      category="room_types"
                      presetOptions={DEFAULT_ROOM_TYPES}
                      value={guest.type}
                      onChange={(val) => handleUpdateField(index, 'type', val)}
                      placeholder="Type kamar"
                    />
                  </td>

                  {/* Check In */}
                  <td className="py-2 px-2">
                    <input
                      type="date"
                      value={guest.checkIn}
                      onChange={(e) =>
                        handleUpdateField(index, 'checkIn', e.target.value)
                      }
                      className="w-full h-9 px-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-navy-600"
                    />
                  </td>

                  {/* Check Out */}
                  <td className="py-2 px-2">
                    <input
                      type="date"
                      value={guest.checkOut}
                      onChange={(e) =>
                        handleUpdateField(index, 'checkOut', e.target.value)
                      }
                      className={`w-full h-9 px-2 bg-white border rounded-lg text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-navy-600 ${
                        isDateInvalid
                          ? 'border-danger-600 bg-red-50/30'
                          : 'border-gray-200'
                      }`}
                    />
                    {isDateInvalid && (
                      <div className="flex items-center gap-1 text-[10px] text-danger-600 mt-1">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>Harus setelah Check In</span>
                      </div>
                    )}
                  </td>

                  {/* Actions - Sticky Right Column so it's NEVER cut off */}
                  <td className="py-2 px-2 text-center align-middle sticky right-0 bg-white group-hover:bg-gray-50/95 border-l border-gray-200 z-10 shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.06)]">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleDuplicateGuest(index)}
                        className="p-1.5 text-gray-400 hover:text-navy-700 hover:bg-gray-100 rounded transition-colors"
                        title="Duplikasi Baris"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteGuest(index)}
                        disabled={guests.length <= 1}
                        className={`p-1.5 rounded transition-colors ${
                          guests.length <= 1
                            ? 'text-gray-300 cursor-not-allowed opacity-40'
                            : 'text-danger-600 hover:text-red-700 hover:bg-red-50'
                        }`}
                        title={
                          guests.length <= 1
                            ? 'Minimal 1 tamu diperlukan (tidak bisa dihapus)'
                            : `Hapus tamu baris ke-${index + 1}`
                        }
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List View (< sm screens) */}
      <div className="sm:hidden space-y-3">
        {guests.map((guest, index) => {
          const isDateInvalid =
            guest.checkIn && guest.checkOut && guest.checkOut < guest.checkIn;
          const isDuplicate = getDuplicateIndex(index);

          return (
            <div
              key={guest.id}
              className="p-3.5 bg-white border border-gray-200 rounded-xl shadow-xs space-y-2.5"
            >
              <div className="flex items-center justify-between pb-1.5 border-b border-gray-100">
                <span className="text-xs font-bold text-navy-900">
                  Tamu #{index + 1}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleDuplicateGuest(index)}
                    className="p-1 text-gray-500 hover:text-navy-700 rounded"
                    title="Duplikasi"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteGuest(index)}
                    disabled={guests.length <= 1}
                    className={`p-1 rounded ${
                      guests.length <= 1
                        ? 'text-gray-300'
                        : 'text-gray-500 hover:text-danger-600'
                    }`}
                    title="Hapus"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-gray-500 uppercase mb-1">
                  Nama Tamu
                </label>
                <div className="flex items-center gap-1.5">
                  <select
                    value={guest.title || 'Mr.'}
                    onChange={(e) =>
                      handleUpdateField(index, 'title', e.target.value)
                    }
                    className="h-9 px-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-600 shrink-0 cursor-pointer"
                    title="Pilih gelar/sapaan (Mr. / Mrs.)"
                  >
                    <option value="Mr.">Mr.</option>
                    <option value="Mrs.">Mrs.</option>
                  </select>
                  <input
                    type="text"
                    value={guest.nama}
                    onChange={(e) =>
                      handleUpdateField(index, 'nama', e.target.value)
                    }
                    placeholder="NAMA LENGKAP"
                    className="flex-1 min-w-0 h-9 px-3 bg-white border border-gray-200 rounded-lg text-xs font-semibold uppercase text-gray-800 focus:ring-2 focus:ring-navy-600"
                  />
                </div>
                {isDuplicate && (
                  <span className="text-[10.5px] text-amber-700 mt-1 block">
                    Nama terdeteksi ganda
                  </span>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-medium text-gray-500 uppercase mb-1">
                  Room Type
                </label>
                <SelectWithManual
                  category="room_types"
                  presetOptions={DEFAULT_ROOM_TYPES}
                  value={guest.type}
                  onChange={(val) => handleUpdateField(index, 'type', val)}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-gray-500 uppercase mb-1">
                    Check In
                  </label>
                  <input
                    type="date"
                    value={guest.checkIn}
                    onChange={(e) =>
                      handleUpdateField(index, 'checkIn', e.target.value)
                    }
                    className="w-full h-9 px-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-gray-500 uppercase mb-1">
                    Check Out
                  </label>
                  <input
                    type="date"
                    value={guest.checkOut}
                    onChange={(e) =>
                      handleUpdateField(index, 'checkOut', e.target.value)
                    }
                    className={`w-full h-9 px-2 bg-white border rounded-lg text-xs text-gray-800 ${
                      isDateInvalid ? 'border-danger-600' : 'border-gray-200'
                    }`}
                  />
                </div>
              </div>
              {isDateInvalid && (
                <span className="text-[10px] text-danger-600 block">
                  Check Out harus setelah Check In
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Table Footer Actions */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
        <button
          type="button"
          onClick={handleAddGuest}
          className="inline-flex items-center gap-1.5 bg-white border border-navy-700 text-navy-700 hover:bg-navy-100/50 px-3.5 py-1.5 rounded-lg font-medium transition-colors shadow-2xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Tambah Tamu</span>
        </button>

        <button
          type="button"
          onClick={handleApplyToAll}
          className="inline-flex items-center gap-1 text-gray-500 hover:text-navy-900 text-xs px-2 py-1 rounded transition-colors"
          title="Salin type dan tanggal tamu pertama ke seluruh tamu"
        >
          <Wand2 className="w-3.5 h-3.5 text-navy-600" />
          <span>Terapkan type/tanggal ke semua</span>
        </button>
      </div>
    </div>
  );
};
