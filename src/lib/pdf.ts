export interface GeneratePdfOptions {
  filename: string;
  onProgress?: (progress: number, message: string) => void;
}

const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const PDF_RENDER_SCALE = 300 / 96;

function getPageElements(source: HTMLElement | HTMLElement[]): HTMLElement[] {
  const pages = Array.isArray(source)
    ? source
    : source.classList.contains('a4-page')
      ? [source]
      : Array.from(source.querySelectorAll<HTMLElement>('.a4-page'));

  if (pages.length === 0) {
    throw new Error('Elemen dokumen tidak ditemukan.');
  }

  return pages;
}

async function waitForImages(element: HTMLElement): Promise<void> {
  const images = Array.from(element.querySelectorAll('img'));

  await Promise.all(
    images.map(async (image) => {
      image.loading = 'eager';

      if (!image.complete) {
        await new Promise<void>((resolve) => {
          const handleDone = () => {
            image.removeEventListener('load', handleDone);
            image.removeEventListener('error', handleDone);
            resolve();
          };

          image.addEventListener('load', handleDone, { once: true });
          image.addEventListener('error', handleDone, { once: true });
        });
      }

      if (image.naturalWidth > 0) {
        try {
          await image.decode();
        } catch {
          // ignore decode error if any
        }
      }
    })
  );
}

function createCaptureWrapper(page: HTMLElement): {
  wrapper: HTMLDivElement;
  clonedPage: HTMLElement;
} {
  const wrapper = document.createElement('div');
  wrapper.setAttribute('aria-hidden', 'true');
  Object.assign(wrapper.style, {
    position: 'fixed',
    left: '0',
    top: '0',
    width: `${A4_WIDTH_MM}mm`,
    height: `${A4_HEIGHT_MM}mm`,
    zIndex: '2147483647',
    backgroundColor: '#ffffff',
    opacity: '1',
    visibility: 'visible',
    pointerEvents: 'none',
    overflow: 'hidden',
    margin: '0',
    padding: '0',
  });

  const clonedPage = page.cloneNode(true) as HTMLElement;
  clonedPage.classList?.add?.('pdf-export-capture');
  Object.assign(clonedPage.style, {
    boxShadow: 'none',
    margin: '0',
    transform: 'none',
    opacity: '1',
    visibility: 'visible',
    width: `${A4_WIDTH_MM}mm`,
    minWidth: `${A4_WIDTH_MM}mm`,
    maxWidth: `${A4_WIDTH_MM}mm`,
    height: `${A4_HEIGHT_MM}mm`,
    minHeight: `${A4_HEIGHT_MM}mm`,
    maxHeight: `${A4_HEIGHT_MM}mm`,
    boxSizing: 'border-box',
    backgroundColor: '#ffffff',
  });

  wrapper.appendChild(clonedPage);
  return { wrapper, clonedPage };
}

/**
 * Exports the rendered A4 document pages, keeping HTML layout as the source of truth
 * for preview, PDF, and printing.
 */
export async function exportToPdf(
  source: HTMLElement | HTMLElement[],
  options: GeneratePdfOptions
): Promise<void> {
  const { filename, onProgress } = options;

  if (typeof document === 'undefined') {
    throw new Error('Ekspor PDF hanya dapat dilakukan di browser.');
  }

  const pageElements = getPageElements(source);
  const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
    import('jspdf'),
    import('html2canvas'),
  ]);
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  onProgress?.(10, 'Menyiapkan dokumen A4...');
  await document.fonts.ready;

  for (let index = 0; index < pageElements.length; index += 1) {
    const pageNumber = index + 1;
    onProgress?.(
      Math.round(15 + (pageNumber / pageElements.length) * 70),
      `Merender halaman ${pageNumber} dari ${pageElements.length}...`
    );

    const { wrapper, clonedPage } = createCaptureWrapper(pageElements[index]);
    document.body.appendChild(wrapper);

    try {
      await waitForImages(clonedPage);

      const canvas = await html2canvas(clonedPage, {
        scale: PDF_RENDER_SCALE,
        width: clonedPage.offsetWidth,
        height: clonedPage.offsetHeight,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        scrollX: 0,
        scrollY: 0,
        windowWidth: clonedPage.offsetWidth,
        windowHeight: clonedPage.offsetHeight,
      });

      if (index > 0) {
        doc.addPage('a4', 'portrait');
      }

      doc.addImage(
        canvas.toDataURL('image/png'),
        'PNG',
        0,
        0,
        A4_WIDTH_MM,
        A4_HEIGHT_MM,
        undefined,
        'FAST'
      );
    } finally {
      wrapper.remove();
    }
  }

  onProgress?.(95, 'Menyimpan berkas PDF...');
  doc.save(filename);
  onProgress?.(100, 'Selesai!');
}
