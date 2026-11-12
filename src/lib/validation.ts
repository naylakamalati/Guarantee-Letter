import { LetterData, ValidationIssue } from '../types';

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
}

export function validateLetterData(data: LetterData): ValidationResult {
  const errors: ValidationIssue[] = [];
  const warnings: ValidationIssue[] = [];

  // 1. Tanggal Surat
  if (!data.date || !data.date.trim()) {
    errors.push({
      field: 'date',
      message: 'Tanggal surat wajib diisi.',
    });
  }

  // 2. Kota
  if (!data.city || !data.city.trim()) {
    errors.push({
      field: 'city',
      message: 'Kota surat wajib diisi.',
    });
  }

  // 3. Penerima
  if (!data.recipient || !data.recipient.trim()) {
    errors.push({
      field: 'recipient',
      message: 'Pilih penerima surat (Kepada Yth.).',
    });
  }

  // 4. Daftar Tamu
  if (!data.guests || data.guests.length === 0) {
    errors.push({
      field: 'guests',
      message: 'Tambahkan minimal satu tamu.',
    });
  } else {
    const seenNames = new Map<string, number>();

    data.guests.forEach((guest, index) => {
      const trimmedName = (guest.nama || '').trim();

      if (!trimmedName) {
        errors.push({
          field: `guest-name-${index}`,
          guestIndex: index,
          message: `Baris #${index + 1}: Nama tamu tidak boleh kosong.`,
        });
      } else {
        const normalized = trimmedName.toUpperCase();
        if (seenNames.has(normalized)) {
          warnings.push({
            field: `guest-name-${index}`,
            guestIndex: index,
            message: `Baris #${index + 1}: Nama "${trimmedName}" terdeteksi ganda (sama dengan baris #${seenNames.get(normalized)! + 1}).`,
          });
        } else {
          seenNames.set(normalized, index);
        }
      }

      // Check dates
      if (!guest.checkIn) {
        errors.push({
          field: `guest-checkin-${index}`,
          guestIndex: index,
          message: `Baris #${index + 1}: Tanggal Check In wajib diisi.`,
        });
      }

      if (!guest.checkOut) {
        errors.push({
          field: `guest-checkout-${index}`,
          guestIndex: index,
          message: `Baris #${index + 1}: Tanggal Check Out wajib diisi.`,
        });
      }

      if (guest.checkIn && guest.checkOut) {
        if (guest.checkOut < guest.checkIn) {
          errors.push({
            field: `guest-dates-${index}`,
            guestIndex: index,
            message: `Baris #${index + 1}: Check Out (${guest.checkOut}) harus setelah Check In (${guest.checkIn}).`,
          });
        }
      }
    });
  }

  // 5. Penandatangan
  if (!data.signatoryName || !data.signatoryName.trim()) {
    errors.push({
      field: 'signatoryName',
      message: 'Nama penandatangan wajib diisi.',
    });
  }

  if (!data.signatoryTitle || !data.signatoryTitle.trim()) {
    errors.push({
      field: 'signatoryTitle',
      message: 'Jabatan penandatangan wajib diisi.',
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}
