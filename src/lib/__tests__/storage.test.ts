import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  FIXED_SIGNATORY_NAME,
  INITIAL_LETTER_DATA,
  OFFICIAL_STAMP_SIGNATURE_URL,
} from '../../config/defaultLetter';
import { loadSavedLetter } from '../storage';

describe('loadSavedLetter', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('restores fixed signatory and official stamp assets from legacy drafts', () => {
    vi.stubGlobal('localStorage', {
      getItem: vi.fn().mockReturnValue(
        JSON.stringify({
          signatoryName: 'A DIFFERENT NAME',
          assets: {
            logoUrl: '/custom-logo.png',
            stampUrl: '/old-stamp.png',
            signatureUrl: '/old-signature.png',
          },
        })
      ),
    });

    const data = loadSavedLetter();

    expect(data.signatoryName).toBe(FIXED_SIGNATORY_NAME);
    expect(data.assets).toEqual({
      logoUrl: '/custom-logo.png',
      stampUrl: OFFICIAL_STAMP_SIGNATURE_URL,
      signatureUrl: null,
    });
  });

  it('migrates the legacy billing heading to the requested contact lines', () => {
    vi.stubGlobal('localStorage', {
      getItem: vi.fn().mockReturnValue(
        JSON.stringify({
          billingBlock: [
            'PERUM LPPNPI CABANG SURABAYA',
            'ADMINISTRATION AND OPERATION BUILDING',
            'JUANDA INTERNATIONAL AIRPORT',
            'BAGIAN PERSONALIA & UMUM',
          ],
        })
      ),
    });

    expect(loadSavedLetter().billingBlock).toEqual([
      'PERUM LPPNPI CABANG SURABAYA',
      'ADMINISTRATION AND OPERATION BUILDING',
      'JUANDA INTERNATIONAL AIRPORT',
      'UP. IBU ENY LAILIYAH',
      'NO. TELP: 031 – 2986515',
    ]);
  });

  it('keeps custom billing blocks unchanged', () => {
    const billingBlock = ['CUSTOM BILLING LINE'];
    vi.stubGlobal('localStorage', {
      getItem: vi.fn().mockReturnValue(JSON.stringify({ billingBlock })),
    });

    expect(loadSavedLetter().billingBlock).toEqual(billingBlock);
  });

  it('includes the contact details in the default billing block', () => {
    expect(INITIAL_LETTER_DATA.billingBlock).toEqual([
      'PERUM LPPNPI CABANG SURABAYA',
      'ADMINISTRATION AND OPERATION BUILDING',
      'JUANDA INTERNATIONAL AIRPORT',
      'UP. IBU ENY LAILIYAH',
      'NO. TELP: 031 – 2986515',
    ]);
  });
});
