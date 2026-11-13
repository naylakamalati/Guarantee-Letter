import { LetterData } from '../types';

export const FIXED_SIGNATORY_NAME = 'NURUL HUDA';
export const OFFICIAL_STAMP_SIGNATURE_URL =
  '/assets/airnav-stempel-ttd-transparent.png';

export const INITIAL_LETTER_DATA: LetterData = {
  city: "Surabaya",
  date: "2026-10-07",
  letterNumber: "--",
  autoNumbering: false,
  autoNumberPattern: "{num:3}/GL/PERS-SUB/{romanMonth}/{year}",
  nextSequence: 1,
  subject: "Guarantee Letter",
  recipient: "Pimpinan Hotel Four Points Tunjungan Plaza",
  recipientBranch: "",
  recipientLocationPrefix: "di –",
  recipientLocation: "Tempat",
  salutation: "Dengan hormat,",
  statementPreamble: "Dengan ini kami menyatakan bahwa :",
  guests: [
    {
      id: "guest-1",
      title: "Mr.",
      nama: "CONTOH TAMU 1",
      type: "DELUXE KING",
      checkIn: "2026-10-07",
      checkOut: "2026-10-10",
    },
    {
      id: "guest-2",
      title: "Mrs.",
      nama: "CONTOH TAMU 2",
      type: "DELUXE TWIN",
      checkIn: "2026-10-07",
      checkOut: "2026-10-10",
    },
    {
      id: "guest-3",
      title: "Mr.",
      nama: "CONTOH TAMU 3",
      type: "DELUXE KING",
      checkIn: "2026-10-07",
      checkOut: "2026-10-10",
    },
    {
      id: "guest-4",
      title: "Mrs.",
      nama: "CONTOH TAMU 4",
      type: "SUPERIOR SINGLE",
      checkIn: "2026-10-07",
      checkOut: "2026-10-10",
    },
  ],
  coverageType: "Room only",
  coverageSentence:
    "Adalah tamu Perum LPPNPI dan menanggung biaya tamu tersebut diatas Room only. Tagihan dapat dikirimkan kepada :",
  billingBlock: [
    "PERUM LPPNPI CABANG SURABAYA",
    "ADMINISTRATION AND OPERATION BUILDING",
    "JUANDA INTERNATIONAL AIRPORT",
    "UP. IBU ENY LAILIYAH",
    "NO. TELP: 031 – 2986515",
  ],
  closingSentence:
    "Demikian disampaikan, atas kerja samanya diucapkan terima kasih.",
  signatoryTitle: "JUNIOR MANAGER PERSONALIA & UMUM",
  signatoryName: FIXED_SIGNATORY_NAME,
  assets: {
    logoUrl: "/assets/airnav-logo.png",
    stampUrl: OFFICIAL_STAMP_SIGNATURE_URL,
    signatureUrl: null,
  },
  showPlaceholdersInPdf: false,
  repeatHeaderOnPage2: false,
};

export const BLANK_DEFAULT_LETTER: LetterData = {
  ...INITIAL_LETTER_DATA,
  guests: [
    {
      id: "guest-1",
      title: "Mr.",
      nama: "",
      type: "DELUXE",
      checkIn: "2026-10-07",
      checkOut: "2026-10-10",
    },
  ],
};
