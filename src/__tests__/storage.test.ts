import { describe, it, expect, beforeEach } from 'vitest';
import {
  getSettings,
  saveSettings,
  addSearchHistoryEntry,
  clearSearchHistory,
  DEFAULT_SETTINGS,
} from '../storage';
import { clearStorageMock } from './setup';

describe('storage', () => {
  beforeEach(() => {
    clearStorageMock();
  });

  describe('getSettings', () => {
    it('should return default settings when storage is empty', async () => {
      const settings = await getSettings();
      expect(settings).toEqual(DEFAULT_SETTINGS);
    });

    it('should merge stored values with defaults', async () => {
      await chrome.storage.sync.set({ languages: { en: true, fr: false, de: true, es: true, it: true, pt: true } });
      const settings = await getSettings();
      expect(settings.languages.fr).toBe(false);
      expect(settings.languages.en).toBe(true);
      expect(settings.accessibility).toEqual(DEFAULT_SETTINGS.accessibility);
    });
  });

  describe('saveSettings', () => {
    it('should save language settings', async () => {
      await saveSettings({ languages: { en: true, fr: false, de: true, es: true, it: true, pt: true } });
      const settings = await getSettings();
      expect(settings.languages.fr).toBe(false);
    });

    it('should save accessibility settings', async () => {
      await saveSettings({ accessibility: { highContrast: true, fontSize: 'large' } });
      const settings = await getSettings();
      expect(settings.accessibility.highContrast).toBe(true);
      expect(settings.accessibility.fontSize).toBe('large');
    });
  });

  describe('addSearchHistoryEntry', () => {
    it('should add a new entry to empty history', async () => {
      await addSearchHistoryEntry('inception');
      const settings = await getSettings();
      expect(settings.searchHistory).toHaveLength(1);
      expect(settings.searchHistory[0].query).toBe('inception');
    });

    it('should prepend new entries', async () => {
      await addSearchHistoryEntry('inception');
      await addSearchHistoryEntry('oppenheimer');
      const settings = await getSettings();
      expect(settings.searchHistory[0].query).toBe('oppenheimer');
      expect(settings.searchHistory[1].query).toBe('inception');
    });

    it('should deduplicate by query (case-insensitive)', async () => {
      await addSearchHistoryEntry('inception');
      await addSearchHistoryEntry('Inception');
      const settings = await getSettings();
      expect(settings.searchHistory).toHaveLength(1);
      expect(settings.searchHistory[0].query).toBe('Inception');
    });

    it('should keep max 20 entries', async () => {
      for (let i = 0; i < 25; i++) {
        await addSearchHistoryEntry(`movie-${i}`);
      }
      const settings = await getSettings();
      expect(settings.searchHistory).toHaveLength(20);
      expect(settings.searchHistory[0].query).toBe('movie-24');
    });
  });

  describe('clearSearchHistory', () => {
    it('should clear all history entries', async () => {
      await addSearchHistoryEntry('inception');
      await addSearchHistoryEntry('oppenheimer');
      await clearSearchHistory();
      const settings = await getSettings();
      expect(settings.searchHistory).toHaveLength(0);
    });
  });
});
