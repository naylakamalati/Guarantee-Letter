import { describe, it, expect } from 'vitest';
import { formatLetterNumber } from '../letterNumber';

describe('formatLetterNumber', () => {
  it('formats letter number with sequence padding, Roman month, and year', () => {
    const pattern = '{num:3}/GL/PERS-SUB/{romanMonth}/{year}';
    const result = formatLetterNumber(pattern, 1, '2026-10-07');
    expect(result).toBe('001/GL/PERS-SUB/X/2026');
  });

  it('supports 4-digit sequence padding and two-digit year', () => {
    const pattern = 'GL/{num:4}/{romanMonth}/{year:2}';
    const result = formatLetterNumber(pattern, 42, '2026-11-10');
    expect(result).toBe('GL/0042/XI/26');
  });

  it('handles empty pattern gracefully', () => {
    expect(formatLetterNumber('', 1, '2026-10-07')).toBe('--');
  });
});
