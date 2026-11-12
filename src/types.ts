export interface Guest {
  id: string;
  title?: 'Mr.' | 'Mrs.' | string;
  nama: string;
  type: string;
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
}

export interface LetterAssets {
  logoUrl: string | null;
  stampUrl: string | null;
  signatureUrl: string | null;
}

export interface LetterData {
  city: string;
  date: string; // YYYY-MM-DD
  letterNumber: string;
  autoNumbering: boolean;
  autoNumberPattern: string; // e.g. "{num:3}/GL/PERS-SUB/{romanMonth}/{year}"
  nextSequence: number;
  subject: string;
  recipient: string;
  recipientBranch: string;
  recipientLocationPrefix: string;
  recipientLocation: string;
  salutation: string;
  statementPreamble: string;
  guests: Guest[];
  coverageType: string;
  coverageSentence: string;
  billingBlock: string[];
  closingSentence: string;
  signatoryTitle: string;
  signatoryName: string;
  assets: LetterAssets;
  showPlaceholdersInPdf: boolean;
  repeatHeaderOnPage2: boolean;
}

export interface LetterHistoryItem {
  id: string;
  timestamp: number;
  filename: string;
  recipient: string;
  guestCount: number;
  letterNumber: string;
  date: string;
  data: LetterData;
}

export interface LetterTemplate {
  id: string;
  name: string;
  recipient: string;
  recipientBranch?: string;
  coverageType: string;
  signatoryTitle: string;
  signatoryName: string;
  billingBlock: string[];
}

export interface ValidationIssue {
  field: string;
  message: string;
  guestIndex?: number;
}
