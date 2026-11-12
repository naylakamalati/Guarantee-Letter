/**
 * Generates an automated clean filename for the exported PDF.
 * Format: Guarantee-Letter_<NamaHotelTanpaKataPimpinan>_<YYYY-MM-DD>.pdf
 * Spaces become hyphens, special characters removed.
 */
export function generatePdfFilename(recipient: string, dateStr: string): string {
  // Strip "Pimpinan" prefix (case insensitive, optional trailing punctuation or whitespace)
  let hotelName = (recipient || "")
    .replace(/^pimpinan\s+/i, "")
    .trim();

  if (!hotelName) {
    hotelName = "Hotel";
  }

  // Remove special characters except alphanumeric, whitespace, and hyphens
  const cleaned = hotelName
    .replace(/[^a-zA-Z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  const safeHotel = cleaned || "Hotel";
  const safeDate = dateStr && /^\d{4}-\d{2}-\d{2}$/.test(dateStr) ? dateStr : "document";

  return `Guarantee-Letter_${safeHotel}_${safeDate}.pdf`;
}
