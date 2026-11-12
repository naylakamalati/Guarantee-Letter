import { parseDateString, toRomanMonth } from './formatDate';

/**
 * Formats a letter number according to a customizable pattern.
 * Supports:
 * - {num:3} -> "001"
 * - {num:4} -> "0001"
 * - {num}   -> "1"
 * - {romanMonth} -> "XI" (Roman numeral for November)
 * - {month:2} -> "11"
 * - {month} -> "11"
 * - {year} -> "2026"
 * - {year:2} -> "26"
 */
export function formatLetterNumber(
  pattern: string,
  sequenceNumber: number,
  dateStr: string
): string {
  if (!pattern) return "--";

  const parsed = parseDateString(dateStr) || {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
  };

  const roman = toRomanMonth(parsed.month);
  const monthTwoDigits = String(parsed.month).padStart(2, "0");
  const yearFull = String(parsed.year);
  const yearTwoDigits = yearFull.slice(-2);

  let formatted = pattern;

  // Replace {num:X}
  formatted = formatted.replace(/\{num:(\d+)\}/g, (_, digits) => {
    const pad = parseInt(digits, 10);
    return String(sequenceNumber).padStart(pad, "0");
  });

  // Replace bare {num}
  formatted = formatted.replace(/\{num\}/g, String(sequenceNumber));

  // Replace {romanMonth}
  formatted = formatted.replace(/\{romanMonth\}/gi, roman);

  // Replace {month:2}
  formatted = formatted.replace(/\{month:2\}/g, monthTwoDigits);

  // Replace {month}
  formatted = formatted.replace(/\{month\}/g, String(parsed.month));

  // Replace {year:2}
  formatted = formatted.replace(/\{year:2\}/g, yearTwoDigits);

  // Replace {year}
  formatted = formatted.replace(/\{year\}/g, yearFull);

  return formatted;
}
