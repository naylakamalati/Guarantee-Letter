import { LetterData, LetterHistoryItem, LetterTemplate } from '../types';
import { INITIAL_LETTER_DATA } from '../config/defaultLetter';

const STORAGE_KEY_LETTER = 'airnav_gl_draft';
const STORAGE_KEY_HISTORY = 'airnav_gl_history';
const STORAGE_KEY_TEMPLATES = 'airnav_gl_templates';
const STORAGE_KEY_MANUAL_PREFIX = 'airnav_gl_manual_';

export function loadSavedLetter(): LetterData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LETTER);
    if (!raw) return INITIAL_LETTER_DATA;
    const parsed = JSON.parse(raw);
    const migratedGuests = (parsed.guests || INITIAL_LETTER_DATA.guests).map((g: any) => {
      let title = g.title;
      if (title === 'MR.' || title === 'MR') title = 'Mr.';
      else if (title === 'MS.' || title === 'MS' || title === 'MRS.' || title === 'MRS') title = 'Mrs.';
      else if (!title) title = 'Mr.';

      let nama = g.nama || '';
      if (/^IR\.\s+/i.test(nama)) {
        nama = nama.replace(/^IR\.\s+/i, '');
        title = 'Mr.';
      }
      return {
        ...g,
        title,
        nama,
      };
    });

    return {
      ...INITIAL_LETTER_DATA,
      ...parsed,
      guests: migratedGuests,
      assets: {
        logoUrl: parsed.assets?.logoUrl || INITIAL_LETTER_DATA.assets.logoUrl,
        stampUrl: parsed.assets?.stampUrl || INITIAL_LETTER_DATA.assets.stampUrl,
        signatureUrl: parsed.assets?.signatureUrl || INITIAL_LETTER_DATA.assets.signatureUrl,
      },
    };
  } catch (e) {
    console.error('Failed to load letter draft from localStorage', e);
    return INITIAL_LETTER_DATA;
  }
}

export function saveLetterDraft(data: LetterData): void {
  try {
    localStorage.setItem(STORAGE_KEY_LETTER, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save letter draft to localStorage', e);
  }
}

export function loadManualOptions(category: string): string[] {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY_MANUAL_PREFIX}${category}`);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveManualOption(category: string, value: string): void {
  if (!value || !value.trim()) return;
  try {
    const list = loadManualOptions(category);
    const trimmed = value.trim();
    if (!list.includes(trimmed)) {
      list.unshift(trimmed); // add to top
      // Keep up to 20 manual options
      const truncated = list.slice(0, 20);
      localStorage.setItem(`${STORAGE_KEY_MANUAL_PREFIX}${category}`, JSON.stringify(truncated));
    }
  } catch (e) {
    console.error('Failed to save manual option', e);
  }
}

export function loadHistory(): LetterHistoryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_HISTORY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function addToHistory(item: LetterHistoryItem): void {
  try {
    const history = loadHistory();
    // Filter out item with same id if any, prepend new item
    const updated = [item, ...history.filter((h) => h.id !== item.id)].slice(0, 10);
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to add to history', e);
  }
}

export function loadTemplates(): LetterTemplate[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_TEMPLATES);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveTemplate(template: LetterTemplate): void {
  try {
    const templates = loadTemplates();
    const updated = [template, ...templates.filter((t) => t.id !== template.id)];
    localStorage.setItem(STORAGE_KEY_TEMPLATES, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save template', e);
  }
}

export function deleteTemplate(templateId: string): void {
  try {
    const templates = loadTemplates();
    const updated = templates.filter((t) => t.id !== templateId);
    localStorage.setItem(STORAGE_KEY_TEMPLATES, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to delete template', e);
  }
}
