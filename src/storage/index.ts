import type {
  ExtensionSettings,
  LanguageSettings,
  AccessibilitySettings,
  FeatureSettings,
  SearchHistoryEntry,
} from '../types/storage';

const MAX_HISTORY_ENTRIES = 20;

export const DEFAULT_LANGUAGES: LanguageSettings = {
  en: true,
  fr: true,
  de: true,
  es: true,
  it: true,
  pt: true,
};

export const DEFAULT_ACCESSIBILITY: AccessibilitySettings = {
  highContrast: false,
  fontSize: 'normal',
  animations: true,
};

export const DEFAULT_FEATURES: FeatureSettings = {
  bannerEnabled: true,
  contextMenuEnabled: true,
};

export const DEFAULT_SETTINGS: ExtensionSettings = {
  languages: DEFAULT_LANGUAGES,
  accessibility: DEFAULT_ACCESSIBILITY,
  features: DEFAULT_FEATURES,
  searchHistory: [],
};

/** Read all settings from chrome.storage.sync, with defaults. */
export async function getSettings(): Promise<ExtensionSettings> {
  const result = await chrome.storage.sync.get(DEFAULT_SETTINGS);
  return {
    languages: { ...DEFAULT_LANGUAGES, ...(result['languages'] as Partial<LanguageSettings>) },
    accessibility: {
      ...DEFAULT_ACCESSIBILITY,
      ...(result['accessibility'] as Partial<AccessibilitySettings>),
    },
    features: {
      ...DEFAULT_FEATURES,
      ...(result['features'] as Partial<FeatureSettings>),
    },
    searchHistory: (result['searchHistory'] as readonly SearchHistoryEntry[]) ?? [],
  };
}

/** Save partial settings (merges with existing). */
export async function saveSettings(
  partial: Partial<Pick<ExtensionSettings, 'languages' | 'accessibility' | 'features'>>,
): Promise<void> {
  await chrome.storage.sync.set(partial);
}

/**
 * Add a search query to history. Deduplicates by query text
 * (updates timestamp if already exists). Keeps max 20 entries.
 */
export async function addSearchHistoryEntry(query: string): Promise<void> {
  const settings = await getSettings();
  const filtered = settings.searchHistory.filter(
    (entry) => entry.query.toLowerCase() !== query.toLowerCase(),
  );
  const newEntry: SearchHistoryEntry = { query, timestamp: Date.now() };
  const updated = [newEntry, ...filtered].slice(0, MAX_HISTORY_ENTRIES);
  await chrome.storage.sync.set({ searchHistory: updated });
}

/** Clear all search history. */
export async function clearSearchHistory(): Promise<void> {
  await chrome.storage.sync.set({ searchHistory: [] });
}
