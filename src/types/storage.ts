export type SupportedLanguage = 'en' | 'fr' | 'de' | 'es' | 'it' | 'pt';

export type FontSize = 'normal' | 'large' | 'xlarge';

export interface SearchHistoryEntry {
  readonly query: string;
  readonly timestamp: number;
}

export type LanguageSettings = Record<SupportedLanguage, boolean>;

export interface AccessibilitySettings {
  readonly highContrast: boolean;
  readonly fontSize: FontSize;
  readonly animations: boolean;
}

export interface FeatureSettings {
  readonly bannerEnabled: boolean;
  readonly contextMenuEnabled: boolean;
}

export interface ExtensionSettings {
  readonly languages: LanguageSettings;
  readonly accessibility: AccessibilitySettings;
  readonly features: FeatureSettings;
  readonly searchHistory: readonly SearchHistoryEntry[];
}

export interface SearchDetectedMessage {
  readonly type: 'SEARCH_DETECTED';
  readonly query: string;
}

export interface FeatureToggleMessage {
  readonly type: 'TOGGLE_CONTEXT_MENU';
  readonly enabled: boolean;
}
