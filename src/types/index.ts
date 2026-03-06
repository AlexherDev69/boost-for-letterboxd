export type DetectionMatchSource =
  | 'keyword'
  | 'existing-result'
  | 'knowledge-panel'
  | 'category-chip'
  | 'none';

export interface DetectionResult {
  readonly isMovie: boolean;
  readonly matchSource: DetectionMatchSource;
}

export interface LetterboxdConfig {
  readonly searchBaseUrl: string;
  readonly maxDisplayQueryLength: number;
  readonly bannerId: string;
  readonly boostBorderColor: string;
  readonly boostBorderWidth: string;
  readonly boostPaddingLeft: string;
  readonly boostMarginBottom: string;
}

export interface ContextMenuConfig {
  readonly id: string;
  readonly title: string;
}

export interface GoogleSelectors {
  readonly searchResults: readonly string[];
  readonly resultsContainer: readonly string[];
  readonly knowledgePanelTitle: string;
  readonly categoryChips: string;
  readonly letterboxdLinks: string;
}
