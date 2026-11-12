const INDONESIAN_MONTHS_FULL = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const INDONESIAN_MONTHS_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];

const ROMAN_NUMERALS = [
  "I",
  "II",
  "III",
  "IV",
  "V",
  "VI",
  "VII",
  "VIII",
  "IX",
  "X",
  "XI",
  "XII",
];

/**
 * Parses YYYY-MM-DD string into [year, monthIndex, day]
 */
export function parseDateString(dateStr: string): { year: number; month: number; day: number } | null {
  if (!dateStr) return null;
  const parts = dateStr.split("-").map((p) => parseInt(p, 10));
  if (parts.length !== 3 || parts.some(isNaN)) return null;
  return {
    year: parts[0],
    month: parts[1], // 1-12
    day: parts[2],
  };
}

/**
 * Formats a date for the letter header date line.
 * Example: "Surabaya, 07 Oktober 2026"
 */
export function formatLetterDate(dateStr: string, city: string = "Surabaya"): string {
  const parsed = parseDateString(dateStr);
  if (!parsed) return `${city}, --`;

  const dayStr = String(parsed.day).padStart(2, "0");
  const monthName = INDONESIAN_MONTHS_FULL[parsed.month - 1] || "";
  const cityName = city.trim() ? city.trim() : "Surabaya";

  return `${cityName}, ${dayStr} ${monthName} ${parsed.year}`;
}

/**
 * Formats a date for the guest table columns.
 * Example: "07 – Okt – 2026"
 */
export function formatTableDate(dateStr: string): string {
  const parsed = parseDateString(dateStr);
  if (!parsed) return "--";

  const dayStr = String(parsed.day).padStart(2, "0");
  const monthShort = INDONESIAN_MONTHS_SHORT[parsed.month - 1] || "";

  return `${dayStr} – ${monthShort} – ${parsed.year}`;
}

/**
 * Converts a month (1-12) to Roman numeral string.
 * Example: 10 -> "X", 11 -> "XI"
 */
export function toRomanMonth(monthNumber: number): string {
  if (monthNumber < 1 || monthNumber > 12) return "";
  return ROMAN_NUMERALS[monthNumber - 1];
}
