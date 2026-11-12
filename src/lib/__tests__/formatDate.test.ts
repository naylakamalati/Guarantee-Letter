import { describe, it, expect } from 'vitest';
import {
  formatLetterDate,
  formatTableDate,
  toRomanMonth,
  parseDateString,
} from '../formatDate';

describe('formatDate utilities', () => {
  it('parses YYYY-MM-DD string correctly', () => {
    expect(parseDateString('2026-10-07')).toEqual({
      year: 2026,
      month: 10,
      day: 7,
    });
    expect(parseDateString('')).toBeNull();
    expect(parseDateString('invalid')).toBeNull();
  });

  it('formats letter date line in full Indonesian format', () => {
    expect(formatLetterDate('2026-10-07', 'Surabaya')).toBe(
      'Surabaya, 07 Oktober 2026'
    );
    expect(formatLetterDate('2026-01-15', 'Malang')).toBe('Malang, 15 Januari 2026');
    expect(formatLetterDate('', 'Surabaya')).toBe('Surabaya, --');
  });

  it('formats table date as "DD – Mmm – YYYY"', () => {
    expect(formatTableDate('2026-10-07')).toBe('07 – Okt – 2026');
    expect(formatTableDate('2026-08-17')).toBe('17 – Agu – 2026');
    expect(formatTableDate('2026-12-31')).toBe('31 – Des – 2026');
    expect(formatTableDate('')).toBe('--');
  });

  it('converts month numbers to Roman numerals', () => {
    expect(toRomanMonth(1)).toBe('I');
    expect(toRomanMonth(5)).toBe('V');
    expect(toRomanMonth(9)).toBe('IX');
    expect(toRomanMonth(10)).toBe('X');
    expect(toRomanMonth(11)).toBe('XI');
    expect(toRomanMonth(12)).toBe('XII');
    expect(toRomanMonth(0)).toBe('');
    expect(toRomanMonth(13)).toBe('');
  });
});
