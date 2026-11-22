import { useState, useEffect, useRef, useCallback } from 'react';
import { ApplicationDraft } from '../types';
import { DRAFT_VERSION } from '../constants';
import { clearStoredDraft, getStoredDraft, saveStoredDraft } from '../services/storage';

export function useDraftAutosave(draftData: Omit<ApplicationDraft, 'version' | 'lastSaved'>) {
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounced auto-save (450ms)
  useEffect(() => {
    setIsSaving(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      const timestamp = new Date().toISOString();
      const fullDraft: ApplicationDraft = {
        ...draftData,
        version: DRAFT_VERSION,
        lastSaved: timestamp,
      };
      saveStoredDraft(fullDraft);
      setLastSaved(timestamp);
      setIsSaving(false);
    }, 450);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [draftData]);

  const restoreDraft = useCallback((): ApplicationDraft | null => {
    return getStoredDraft();
  }, []);

  const resetDraft = useCallback(() => {
    clearStoredDraft();
    setLastSaved(null);
  }, []);

  return {
    lastSaved,
    isSaving,
    restoreDraft,
    resetDraft,
  };
}
