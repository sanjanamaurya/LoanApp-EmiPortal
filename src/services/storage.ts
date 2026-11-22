import { Application, ApplicationDraft } from '../types';
import { STORAGE_KEYS, DRAFT_VERSION } from '../constants';
import { INITIAL_MOCK_APPLICATIONS } from '../data/mockApplications';

/**
 * Safe local storage reader with try-catch and type guards
 */
export function getStoredApplications(): Application[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
    if (!raw) {
      // First-time seed
      localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(INITIAL_MOCK_APPLICATIONS));
      return INITIAL_MOCK_APPLICATIONS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_MOCK_APPLICATIONS;
  } catch (err) {
    console.error('Failed to load applications from localStorage:', err);
    return INITIAL_MOCK_APPLICATIONS;
  }
}

export function saveStoredApplications(apps: Application[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(apps));
  } catch (err) {
    console.error('Failed to save applications to localStorage:', err);
  }
}

export function getStoredDraft(): ApplicationDraft | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DRAFT);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.version === DRAFT_VERSION) {
      return parsed;
    }
    return null;
  } catch (err) {
    console.error('Failed to load draft from localStorage:', err);
    return null;
  }
}

export function saveStoredDraft(draft: ApplicationDraft): void {
  try {
    localStorage.setItem(STORAGE_KEYS.DRAFT, JSON.stringify(draft));
  } catch (err) {
    console.error('Failed to save draft to localStorage:', err);
  }
}

export function clearStoredDraft(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.DRAFT);
  } catch (err) {
    console.error('Failed to clear draft from localStorage:', err);
  }
}
