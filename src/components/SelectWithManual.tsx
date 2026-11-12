import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Search, Check, Edit2 } from 'lucide-react';
import { loadManualOptions, saveManualOption } from '../lib/storage';

interface SelectWithManualProps {
  id?: string;
  label?: string;
  category: string; // for localStorage memory, e.g. 'recipients', 'room_types', 'positions'
  presetOptions: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  disabled?: boolean;
}

export const SelectWithManual: React.FC<SelectWithManualProps> = ({
  id,
  label,
  category,
  presetOptions,
  value,
  onChange,
  placeholder = 'Pilih salah satu...',
  required = false,
  className = '',
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [isManualMode, setIsManualMode] = useState(false);
  const [manualText, setManualText] = useState('');
  const [savedManuals, setSavedManuals] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load remembered manual options on mount
  useEffect(() => {
    const loaded = loadManualOptions(category);
    setSavedManuals(loaded);

    // If initial value is not in presets and not in savedManuals, determine if it's custom manual
    if (value && !presetOptions.includes(value)) {
      setIsManualMode(true);
      setManualText(value);
    }
  }, [category, presetOptions, value]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Combine options: saved manuals + presets
  const allKnownOptions = Array.from(new Set([...savedManuals, ...presetOptions]));

  // Filtered by search term
  const filteredOptions = allKnownOptions.filter((opt) =>
    opt.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (option: string) => {
    setIsManualMode(false);
    onChange(option);
    setIsOpen(false);
    setSearch('');
  };

  const handleChooseManualOption = () => {
    setIsManualMode(true);
    setIsOpen(false);
    if (!manualText && value) {
      setManualText(value);
    }
  };

  const handleManualChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setManualText(val);
    onChange(val);
  };

  const handleManualBlur = () => {
    if (manualText.trim()) {
      saveManualOption(category, manualText.trim());
      setSavedManuals(loadManualOptions(category));
    }
  };

  return (
    <div className={`space-y-1.5 ${className}`} ref={dropdownRef}>
      {label && (
        <label
          htmlFor={id}
          className="block text-[13px] font-medium text-gray-800"
        >
          {label} {required && <span className="text-navy-700">*</span>}
        </label>
      )}

      {/* Main Dropdown Button */}
      <div className="relative">
        <button
          type="button"
          id={id}
          disabled={disabled}
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full h-10 px-3 bg-white border rounded-lg text-left text-sm flex items-center justify-between transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-navy-600 focus:border-navy-600 ${
            isOpen ? 'border-navy-600 ring-2 ring-navy-600' : 'border-gray-200 hover:border-gray-500'
          } ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'text-gray-800'}`}
        >
          <span className="truncate pr-2 font-normal">
            {isManualMode
              ? manualText
                ? `${manualText} (Manual)`
                : 'Lainnya (Ketik manual...)'
              : value || <span className="text-gray-500">{placeholder}</span>}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-gray-500 transition-transform duration-150 shrink-0 ${
              isOpen ? 'transform rotate-180' : ''
            }`}
          />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden max-h-72 flex flex-col animate-in fade-in zoom-in-95 duration-100">
            {/* Search Input */}
            <div className="p-2 border-b border-gray-200 bg-gray-50 flex items-center gap-2">
              <Search className="w-4 h-4 text-gray-500 shrink-0 ml-1" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari pilihan..."
                className="w-full bg-transparent text-xs text-gray-800 focus:outline-none py-1"
                autoFocus
              />
            </div>

            {/* Options List */}
            <div className="overflow-y-auto flex-1 divide-y divide-gray-100 py-1">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt) => {
                  const isSelected = !isManualMode && value === opt;
                  const isSavedManual = savedManuals.includes(opt) && !presetOptions.includes(opt);

                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleSelect(opt)}
                      className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-navy-100/60 transition-colors ${
                        isSelected ? 'bg-navy-100 font-semibold text-navy-900' : 'text-gray-800'
                      }`}
                    >
                      <span className="truncate pr-2">
                        {opt}
                        {isSavedManual && (
                          <span className="ml-1.5 text-[10px] bg-gray-100 text-gray-500 px-1 py-0.5 rounded">
                            manual
                          </span>
                        )}
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-navy-700 shrink-0" />}
                    </button>
                  );
                })
              ) : (
                <div className="px-3 py-2 text-xs text-gray-500 italic">
                  Tidak ada opsi yang cocok dengan "{search}"
                </div>
              )}

              {/* Always present final option: Lainnya (Ketik manual) */}
              <button
                type="button"
                onClick={handleChooseManualOption}
                className={`w-full px-3 py-2.5 text-left text-xs font-medium text-navy-700 hover:bg-navy-100/80 flex items-center gap-2 border-t border-gray-200 bg-gray-50 ${
                  isManualMode ? 'bg-navy-100 font-semibold' : ''
                }`}
              >
                <Edit2 className="w-3.5 h-3.5 text-navy-700" />
                <span>Lainnya (ketik manual)...</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Manual Input Revealed Directly Below */}
      {isManualMode && (
        <div className="space-y-1 pt-1 animate-in slide-in-from-top-1 duration-150">
          <label className="block text-[11.5px] font-medium text-navy-700">
            Ketik manual:
          </label>
          <div className="relative">
            <input
              type="text"
              value={manualText}
              onChange={handleManualChange}
              onBlur={handleManualBlur}
              placeholder="Ketik teks manual di sini..."
              className="w-full h-9 px-3 bg-white border border-navy-600 rounded-lg text-xs text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-navy-600"
              autoFocus
            />
          </div>
        </div>
      )}
    </div>
  );
};
