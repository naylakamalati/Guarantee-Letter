import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { exportToPdf } from '../pdf';

const { mockSave, mockAddPage, mockAddImage, mockHtml2Canvas, mockCanvas } = vi.hoisted(
  () => ({
    mockSave: vi.fn(),
    mockAddPage: vi.fn(),
    mockAddImage: vi.fn(),
    mockHtml2Canvas: vi.fn(),
    mockCanvas: {
      width: 794,
      height: 1123,
      toDataURL: vi.fn().mockReturnValue('data:image/png;base64,page'),
    },
  })
);

vi.mock('jspdf', () => ({
  default: vi.fn().mockImplementation(() => ({
    save: mockSave,
    addPage: mockAddPage,
    addImage: mockAddImage,
  })),
}));

vi.mock('html2canvas', () => ({
  default: mockHtml2Canvas,
}));

class MockElement {
  classList = {
    add: vi.fn(),
    contains: vi.fn().mockReturnValue(false),
    remove: vi.fn(),
  };
  style: Record<string, string> = {};
  offsetWidth = 794;
  offsetHeight = 1123;
  scrollHeight = 1123;
  parentNode: MockElement | null = null;
  children: MockElement[] = [];

  querySelectorAll(): HTMLImageElement[] {
    return [];
  }

  cloneNode(): MockElement {
    return new MockElement();
  }

  setAttribute(): void {}

  appendChild(child: MockElement): void {
    child.parentNode = this;
    this.children.push(child);
  }

  removeChild(child: MockElement): void {
    this.children = this.children.filter((item) => item !== child);
    child.parentNode = null;
  }

  remove(): void {
    this.parentNode?.removeChild(this);
  }
}

function installDocumentMock(): void {
  const body = new MockElement();
  vi.stubGlobal('document', {
    body,
    fonts: { ready: Promise.resolve() },
    createElement: () => new MockElement(),
  });
}

describe('exportToPdf', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockHtml2Canvas.mockResolvedValue(mockCanvas);
    installDocumentMock();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('exports the supplied A4 pages at 300 DPI without changing their layout', async () => {
    const progressReports: string[] = [];
    const pages = [new MockElement(), new MockElement()];

    await exportToPdf(pages as unknown as HTMLElement[], {
      filename: 'Guarantee-Letter_Test.pdf',
      onProgress: (_, message) => progressReports.push(message),
    });

    expect(mockHtml2Canvas).toHaveBeenCalledTimes(2);
    expect(mockHtml2Canvas.mock.calls[0][1]).toMatchObject({
      scale: 300 / 96,
      width: 794,
      height: 1123,
      useCORS: true,
      backgroundColor: '#ffffff',
      windowWidth: 794,
      windowHeight: 1123,
    });
    expect(mockAddImage).toHaveBeenCalledTimes(2);
    expect(mockAddImage).toHaveBeenCalledWith(
      'data:image/png;base64,page',
      'PNG',
      0,
      0,
      210,
      297,
      undefined,
      'FAST'
    );
    expect(mockAddPage).toHaveBeenCalledTimes(1);
    expect(mockSave).toHaveBeenCalledWith('Guarantee-Letter_Test.pdf');
    expect(progressReports).toContain('Selesai!');
  });

  it('fits content taller than A4 without cropping it', async () => {
    const tallClone = new MockElement();
    tallClone.offsetHeight = 1500;
    tallClone.scrollHeight = 1500;
    const page = new MockElement();
    vi.spyOn(page, 'cloneNode').mockReturnValue(tallClone);
    mockHtml2Canvas.mockResolvedValueOnce({
      ...mockCanvas,
      height: 1500,
    });

    await exportToPdf([page as unknown as HTMLElement], {
      filename: 'Guarantee-Letter_Test.pdf',
    });

    expect(mockHtml2Canvas.mock.calls[0][1]).toMatchObject({
      height: 1500,
      windowHeight: 1500,
    });
    const [, , x, y, width, height] = mockAddImage.mock.calls[0];
    expect(x).toBeGreaterThan(0);
    expect(y).toBe(0);
    expect(width).toBeLessThan(210);
    expect(height).toBe(297);
  });

  it('throws an error when the document contains no A4 pages', async () => {
    await expect(
      exportToPdf([] as HTMLElement[], { filename: 'test.pdf' })
    ).rejects.toThrow('Elemen dokumen tidak ditemukan.');
  });

  it('removes temporary capture elements after rendering fails', async () => {
    mockHtml2Canvas.mockRejectedValueOnce(new Error('capture failed'));

    await expect(
      exportToPdf([new MockElement() as unknown as HTMLElement], {
        filename: 'test.pdf',
      })
    ).rejects.toThrow('capture failed');

    const body = (document as unknown as { body: MockElement }).body;
    expect(body.children).toHaveLength(0);
  });
});
