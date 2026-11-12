import { describe, it, expect } from 'vitest';
import { validateLetterData } from '../validation';
import { INITIAL_LETTER_DATA } from '../../config/defaultLetter';

describe('validateLetterData', () => {
  it('validates the default populated letter as valid with 0 errors', () => {
    const result = validateLetterData(INITIAL_LETTER_DATA);
    expect(result.isValid).toBe(true);
    expect(result.errors.length).toBe(0);
  });

  it('detects missing date or recipient', () => {
    const invalid = {
      ...INITIAL_LETTER_DATA,
      date: '',
      recipient: '',
    };
    const result = validateLetterData(invalid);
    expect(result.isValid).toBe(false);
    expect(result.errors.some((e) => e.field === 'date')).toBe(true);
    expect(result.errors.some((e) => e.field === 'recipient')).toBe(true);
  });

  it('detects empty guest name', () => {
    const invalid = {
      ...INITIAL_LETTER_DATA,
      guests: [
        {
          id: '1',
          nama: '   ',
          type: 'DELUXE',
          checkIn: '2026-10-07',
          checkOut: '2026-10-10',
        },
      ],
    };
    const result = validateLetterData(invalid);
    expect(result.isValid).toBe(false);
    expect(result.errors.some((e) => e.field.includes('guest-name'))).toBe(true);
  });

  it('detects check-out before check-in', () => {
    const invalid = {
      ...INITIAL_LETTER_DATA,
      guests: [
        {
          id: '1',
          nama: 'CONTOH TAMU',
          type: 'DELUXE',
          checkIn: '2026-10-10',
          checkOut: '2026-10-07',
        },
      ],
    };
    const result = validateLetterData(invalid);
    expect(result.isValid).toBe(false);
    expect(result.errors.some((e) => e.field.includes('guest-dates'))).toBe(true);
  });

  it('flags warning for duplicate guest names', () => {
    const withDuplicates = {
      ...INITIAL_LETTER_DATA,
      guests: [
        {
          id: '1',
          nama: 'CONTOH TAMU',
          type: 'DELUXE',
          checkIn: '2026-10-07',
          checkOut: '2026-10-10',
        },
        {
          id: '2',
          nama: 'contoh tamu',
          type: 'SUPERIOR',
          checkIn: '2026-10-07',
          checkOut: '2026-10-10',
        },
      ],
    };
    const result = validateLetterData(withDuplicates);
    expect(result.warnings.length).toBe(1);
    expect(result.warnings[0].message).toContain('ganda');
  });
});
