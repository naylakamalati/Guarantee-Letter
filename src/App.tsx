import React, { useState, useEffect, useRef } from 'react';
import { LetterData, LetterTemplate } from './types';
import { loadSavedLetter, saveLetterDraft, addToHistory } from './lib/storage';
import { INITIAL_LETTER_DATA } from './config/defaultLetter';
import { validateLetterData } from './lib/validation';
import { generatePdfFilename } from './lib/filename';
import { exportToPdf } from './lib/pdf';
import { formatLetterNumber } from './lib/letterNumber';
import { Header } from './components/Header';
import { Form } from './components/Form';
import { Preview } from './components/Preview';
import { GuaranteeLetter } from './components/GuaranteeLetter';
import { ActionBar } from './components/ActionBar';
import { ResetModal } from './components/ResetModal';
import { TemplateModal } from './components/TemplateModal';
import { HistoryDrawer } from './components/HistoryDrawer';
import { FileText, Edit3, CheckCircle, X } from 'lucide-react';

export const App: React.FC = () => {
  const [data, setData] = useState<LetterData>(loadSavedLetter);
  const [activeTabMobile, setActiveTabMobile] = useState<'form' | 'preview'>('form');
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false);

  // PDF Export States
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfProgressMessage, setPdfProgressMessage] = useState('');
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' } | null>(null);

  const letterContainerRef = useRef<HTMLDivElement>(null);
  const printExportContainerRef = useRef<HTMLDivElement>(null);

  // Auto-save draft to localStorage whenever data changes
  useEffect(() => {
    saveLetterDraft(data);
  }, [data]);

  // Real-time validation
  const validation = validateLetterData(data);

  // Auto dismiss toast
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Handle PDF Export
  const handleDownloadPdf = async () => {
    if (!validation.isValid) return;

    const filename = generatePdfFilename(data.recipient, data.date);

    try {
      setIsGeneratingPdf(true);
      setPdfProgressMessage('Memulai rendering dokumen PDF A4...');

      const target = printExportContainerRef.current || letterContainerRef.current;
      if (!target) {
        throw new Error('Elemen dokumen tidak ditemukan.');
      }

      await exportToPdf(target, {
        filename,
        onProgress: (_, msg) => setPdfProgressMessage(msg),
      });

      // Save to download history
      addToHistory({
        id: `gl-hist-${Date.now()}`,
        timestamp: Date.now(),
        filename,
        recipient: data.recipient,
        guestCount: data.guests.length,
        letterNumber: data.letterNumber,
        date: data.date,
        data: { ...data },
      });

      // Auto-increment sequence if autoNumbering is enabled
      if (data.autoNumbering) {
        const nextSeq = data.nextSequence + 1;
        const newNumber = formatLetterNumber(data.autoNumberPattern, nextSeq, data.date);
        setData((prev) => ({
          ...prev,
          nextSequence: nextSeq,
          letterNumber: newNumber,
        }));
      }

      setToastMessage({
        text: `PDF berhasil dibuat: ${filename}`,
        type: 'success',
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      setToastMessage({
        text: 'Gagal membuat PDF. Silakan coba lagi atau gunakan opsi Cetak.',
        type: 'info',
      });
    } finally {
      setIsGeneratingPdf(false);
      setPdfProgressMessage('');
    }
  };

  // Browser Print
  const handlePrint = () => {
    window.print();
  };

  // Reset form to defaults
  const handleReset = () => {
    setData({
      ...INITIAL_LETTER_DATA,
      assets: { ...data.assets }, // retain uploaded logos/stamps
    });
    setToastMessage({
      text: 'Formulir berhasil direset ke pengaturan standar.',
      type: 'info',
    });
  };

  // Apply template
  const handleApplyTemplate = (template: LetterTemplate) => {
    setData((prev) => ({
      ...prev,
      recipient: template.recipient,
      recipientBranch: template.recipientBranch || '',
      coverageType: template.coverageType,
      signatoryTitle: template.signatoryTitle,
      signatoryName: template.signatoryName,
      billingBlock: [...template.billingBlock],
    }));
    setToastMessage({
      text: `Template "${template.name}" berhasil diterapkan.`,
      type: 'success',
    });
  };

  // Restore from history
  const handleRestoreHistory = (historyData: LetterData) => {
    setData(historyData);
    setToastMessage({
      text: 'Surat dari riwayat berhasil dibuka kembali.',
      type: 'success',
    });
  };

  return (
    <>
      {/* 1. SCREEN UI - Active interactive interface, completely hidden during print */}
      <div className="screen-ui flex flex-col h-screen w-screen overflow-hidden bg-gray-50 text-gray-800 font-sans print:hidden">
        {/* 1. TOP HEADER */}
        <Header
          logoUrl={data.assets.logoUrl}
          onOpenResetModal={() => setIsResetModalOpen(true)}
          onOpenTemplateModal={() => setIsTemplateModalOpen(true)}
          onOpenHistoryDrawer={() => setIsHistoryDrawerOpen(true)}
        />

        {/* 2. MOBILE / TABLET SEGMENTED SWITCH (<1024px) */}
        <div className="lg:hidden bg-gray-50 px-4 py-2 border-b border-gray-200 shrink-0">
          <div className="h-10 bg-gray-100 p-1 rounded-xl grid grid-cols-2 text-xs font-medium">
            <button
              type="button"
              onClick={() => setActiveTabMobile('form')}
              className={`flex items-center justify-center gap-1.5 rounded-lg transition-all ${
                activeTabMobile === 'form'
                  ? 'bg-white text-navy-900 font-semibold shadow-xs'
                  : 'text-gray-500 hover:text-navy-900'
              }`}
            >
              <Edit3 className="w-4 h-4" />
              <span>Formulir Input</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTabMobile('preview')}
              className={`flex items-center justify-center gap-1.5 rounded-lg transition-all ${
                activeTabMobile === 'preview'
                  ? 'bg-white text-navy-900 font-semibold shadow-xs'
                  : 'text-gray-500 hover:text-navy-900'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Pratinjau Surat (A4)</span>
            </button>
          </div>
        </div>

        {/* 3. MAIN WORKSPACE (Desktop Split / Mobile Stacked) */}
        <main className="flex-1 flex overflow-hidden pb-14">
          {/* Left Form Panel (40% width on >=1024px) */}
          <div
            className={`h-full w-full lg:w-[42%] lg:min-w-[480px] lg:max-w-[620px] ${
              activeTabMobile === 'form' ? 'block' : 'hidden lg:block'
            }`}
          >
            <Form data={data} onChange={setData} />
          </div>

          {/* Right Preview Panel (60% width on >=1024px) */}
          <div
            className={`h-full flex-1 ${
              activeTabMobile === 'preview' ? 'block' : 'hidden lg:block'
            }`}
          >
            <Preview
              data={data}
              letterContainerRef={letterContainerRef}
              onPrint={handlePrint}
            />
          </div>
        </main>

        {/* 4. STICKY BOTTOM ACTION BAR */}
        <ActionBar
          validation={validation}
          guestCount={data.guests.length}
          isGeneratingPdf={isGeneratingPdf}
          pdfProgressMessage={pdfProgressMessage}
          onDownloadPdf={handleDownloadPdf}
          onPrint={handlePrint}
        />

        {/* 5. MODALS & DRAWERS */}
        <ResetModal
          isOpen={isResetModalOpen}
          onClose={() => setIsResetModalOpen(false)}
          onConfirm={handleReset}
        />

        <TemplateModal
          isOpen={isTemplateModalOpen}
          onClose={() => setIsTemplateModalOpen(false)}
          currentData={data}
          onApplyTemplate={handleApplyTemplate}
        />

        <HistoryDrawer
          isOpen={isHistoryDrawerOpen}
          onClose={() => setIsHistoryDrawerOpen(false)}
          onRestore={handleRestoreHistory}
        />

        {/* 6. TOAST NOTIFICATION */}
        {toastMessage && (
          <div className="fixed bottom-16 right-6 z-50 flex items-center gap-2 px-4 py-2.5 bg-navy-900 text-white rounded-lg shadow-lg border border-navy-700 text-xs animate-in slide-in-from-bottom-2 duration-150">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-medium">{toastMessage.text}</span>
            <button
              onClick={() => setToastMessage(null)}
              className="p-1 hover:bg-white/10 rounded ml-2"
            >
              <X className="w-3.5 h-3.5 text-gray-300" />
            </button>
          </div>
        )}
      </div>

      {/* 2. DEDICATED PRINT & PDF EXPORT CONTAINER */}
      <div
        id="print-export-container"
        ref={printExportContainerRef}
        className="print-export-container"
        aria-hidden="true"
      >
        <GuaranteeLetter data={data} />
      </div>
    </>
  );
};
