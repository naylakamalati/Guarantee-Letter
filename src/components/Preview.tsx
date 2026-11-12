import React, { useState, useRef, useEffect } from 'react';
import { ZoomIn, ZoomOut, Maximize2, FileText, Printer } from 'lucide-react';
import { LetterData } from '../types';
import { GuaranteeLetter } from './GuaranteeLetter';

interface PreviewProps {
  data: LetterData;
  letterContainerRef: React.RefObject<HTMLDivElement>;
  onPrint: () => void;
}

export const Preview: React.FC<PreviewProps> = ({
  data,
  letterContainerRef,
  onPrint,
}) => {
  const [zoom, setZoom] = useState<number>(100);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 10, 150));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 10, 50));
  };

  const handleFitToWidth = () => {
    if (!containerRef.current) return;
    const containerWidth = containerRef.current.clientWidth - 48; // padding
    // A4 width in pixels at standard 96 DPI is ~794px
    const a4WidthPx = 794;
    const computedZoom = Math.floor((containerWidth / a4WidthPx) * 100);
    setZoom(Math.max(50, Math.min(computedZoom, 130)));
  };

  // Initial fit to width on desktop mount
  useEffect(() => {
    const timer = setTimeout(() => {
      if (containerRef.current && containerRef.current.clientWidth < 900) {
        handleFitToWidth();
      }
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#EEF1F5] overflow-hidden select-none">
      {/* Top Floating Preview Toolbar */}
      <div className="h-12 bg-white/95 backdrop-blur-xs border-b border-gray-200 px-6 flex items-center justify-between shrink-0 shadow-xs z-10">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-navy-700" />
          <span className="text-xs font-semibold text-gray-800">
            Pratinjau Dokumen A4 (Standar Resmi Perum LPPNPI)
          </span>
        </div>

        {/* Zoom & Fit Controls */}
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center bg-gray-100 border border-gray-200 rounded-lg p-0.5 text-xs text-gray-800">
            <button
              type="button"
              onClick={handleZoomOut}
              disabled={zoom <= 50}
              className="p-1 hover:bg-white rounded text-gray-600 disabled:opacity-40 transition-colors"
              title="Perkecil (-10%)"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 font-mono font-medium text-[11px] w-12 text-center">
              {zoom}%
            </span>
            <button
              type="button"
              onClick={handleZoomIn}
              disabled={zoom >= 150}
              className="p-1 hover:bg-white rounded text-gray-600 disabled:opacity-40 transition-colors"
              title="Perbesar (+10%)"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleFitToWidth}
            className="flex items-center gap-1.5 text-xs font-medium text-navy-700 hover:text-navy-900 border border-gray-200 bg-white hover:bg-gray-50 px-2.5 py-1.5 rounded-lg shadow-2xs transition-colors"
            title="Sesuaikan dengan lebar layar"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Fit Lebar</span>
          </button>

          <button
            type="button"
            onClick={onPrint}
            className="flex items-center gap-1.5 text-xs font-medium text-gray-700 hover:text-navy-900 border border-gray-200 bg-white hover:bg-gray-50 px-2.5 py-1.5 rounded-lg shadow-2xs transition-colors"
            title="Cetak langsung lewat browser"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Cetak</span>
          </button>
        </div>
      </div>

      {/* Scrollable Canvas for A4 Paper */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center items-start bg-[#EEF1F5]"
      >
        <div
          style={{
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'top center',
            transition: 'transform 0.15s ease-out',
          }}
        >
          <GuaranteeLetter ref={letterContainerRef} data={data} />
        </div>
      </div>
    </div>
  );
};
