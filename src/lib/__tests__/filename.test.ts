import { describe, it, expect } from 'vitest';
import { generatePdfFilename } from '../filename';

describe('generatePdfFilename', () => {
  it('strips "Pimpinan" prefix and formats spaces as hyphens', () => {
    const filename = generatePdfFilename(
      'Pimpinan Hotel Four Points Tunjungan Plaza',
      '2026-10-07'
    );
    expect(filename).toBe(
      'Guarantee-Letter_Hotel-Four-Points-Tunjungan-Plaza_2026-10-07.pdf'
    );
  });

  it('handles "Pimpinan Hotel" without double prefix', () => {
    const filename = generatePdfFilename(
      'Pimpinan IJEN SUITES Resort & Convention',
      '2026-10-07'
    );
    expect(filename).toBe(
      'Guarantee-Letter_IJEN-SUITES-Resort-Convention_2026-10-07.pdf'
    );
  });

  it('removes special characters like commas, periods, and slashes', () => {
    const filename = generatePdfFilename(
      'Pimpinan Hotel Harris Hotel & Convention Gubeng, Surabaya.',
      '2026-10-07'
    );
    expect(filename).toBe(
      'Guarantee-Letter_Hotel-Harris-Hotel-Convention-Gubeng-Surabaya_2026-10-07.pdf'
    );
  });

  it('falls back to default when recipient is blank', () => {
    const filename = generatePdfFilename('', '2026-10-07');
    expect(filename).toBe('Guarantee-Letter_Hotel_2026-10-07.pdf');
  });
});
