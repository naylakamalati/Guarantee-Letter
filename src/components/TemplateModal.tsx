import React, { useState, useEffect } from 'react';
import { Bookmark, Plus, Trash2, Check, X, FileText } from 'lucide-react';
import { LetterData, LetterTemplate } from '../types';
import { loadTemplates, saveTemplate, deleteTemplate } from '../lib/storage';
import { FIXED_SIGNATORY_NAME } from '../config/defaultLetter';

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentData: LetterData;
  onApplyTemplate: (template: LetterTemplate) => void;
}

export const TemplateModal: React.FC<TemplateModalProps> = ({
  isOpen,
  onClose,
  currentData,
  onApplyTemplate,
}) => {
  const [templates, setTemplates] = useState<LetterTemplate[]>([]);
  const [templateName, setTemplateName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTemplates(loadTemplates());
      setTemplateName('');
      setIsCreating(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!templateName.trim()) return;

    const newTemplate: LetterTemplate = {
      id: `tpl-${Date.now()}`,
      name: templateName.trim(),
      recipient: currentData.recipient,
      recipientBranch: currentData.recipientBranch,
      coverageType: currentData.coverageType,
      signatoryTitle: currentData.signatoryTitle,
      signatoryName: FIXED_SIGNATORY_NAME,
      billingBlock: [...currentData.billingBlock],
    };

    saveTemplate(newTemplate);
    setTemplates(loadTemplates());
    setTemplateName('');
    setIsCreating(false);
  };

  const handleDelete = (id: string) => {
    deleteTemplate(id);
    setTemplates(loadTemplates());
  };

  const handleSelect = (tpl: LetterTemplate) => {
    onApplyTemplate(tpl);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-navy-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full border border-gray-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-5 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-navy-100 flex items-center justify-center text-navy-700">
              <Bookmark className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-navy-900">
                Template Isian Surat
              </h3>
              <p className="text-[11.5px] text-gray-500">
                Simpan &amp; muat kombinasi penerima, penandatangan, dan tagihan
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-500 hover:text-gray-800 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          {/* Create New Template Section */}
          {isCreating ? (
            <div className="p-3.5 bg-navy-100/40 border border-navy-100 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-navy-900">
                  Simpan Pengaturan Saat Ini Sebagai Template:
                </span>
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="text-gray-500 hover:text-gray-800 text-xs"
                >
                  Batal
                </button>
              </div>
              <input
                type="text"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="Contoh: Four Points Surabaya - Room Only"
                className="w-full h-9 px-3 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-navy-600"
                autoFocus
              />
              <div className="text-[11px] text-gray-600 space-y-0.5">
                <div>• Penerima: <strong>{currentData.recipient}</strong></div>
                <div>• Cakupan: <strong>{currentData.coverageType}</strong></div>
                <div>• Penandatangan: <strong>{FIXED_SIGNATORY_NAME}</strong></div>
              </div>
              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  disabled={!templateName.trim()}
                  onClick={handleSave}
                  className="px-3.5 py-1.5 bg-navy-700 hover:bg-navy-600 disabled:opacity-50 text-white rounded-lg text-xs font-medium transition-colors"
                >
                  Simpan Template
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsCreating(true)}
              className="w-full py-2.5 px-3 border border-dashed border-navy-700/50 hover:border-navy-700 text-navy-700 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors bg-white hover:bg-navy-100/30"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Simpan Isian Saat Ini Sebagai Template Baru</span>
            </button>
          )}

          {/* Saved Templates List */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Daftar Template Tersimpan ({templates.length})
            </h4>

            {templates.length > 0 ? (
              <div className="divide-y divide-gray-100 border border-gray-200 rounded-lg overflow-hidden">
                {templates.map((tpl) => (
                  <div
                    key={tpl.id}
                    className="p-3 bg-white hover:bg-gray-50 flex items-center justify-between gap-3 transition-colors"
                  >
                    <div className="flex items-start gap-2.5">
                      <FileText className="w-4 h-4 text-navy-700 mt-0.5 shrink-0" />
                      <div>
                        <div className="text-xs font-bold text-navy-900">
                          {tpl.name}
                        </div>
                        <div className="text-[11px] text-gray-500 mt-0.5">
                          {tpl.recipient} • {tpl.coverageType}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleSelect(tpl)}
                        className="px-3 py-1 bg-navy-700 hover:bg-navy-600 text-white rounded text-xs font-medium flex items-center gap-1 transition-colors shadow-2xs"
                      >
                        <Check className="w-3 h-3" />
                        <span>Muat</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(tpl.id)}
                        className="p-1 text-gray-400 hover:text-danger-600 rounded transition-colors"
                        title="Hapus template"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-gray-500 border border-dashed border-gray-200 rounded-lg">
                Belum ada template tersimpan. Klik tombol di atas untuk membuat template pertama Anda.
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-gray-50 border-t border-gray-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-200 bg-white hover:bg-gray-100 rounded-lg text-xs font-medium text-gray-800 transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
