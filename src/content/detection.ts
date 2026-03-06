import {
  ALL_MOVIE_KEYWORDS,
  KNOWLEDGE_PANEL_KEYWORDS,
  CATEGORY_CHIP_KEYWORDS,
  NOISE_WORDS,
} from '../constants/keywords';
import { GOOGLE_SELECTORS } from '../constants/selectors';
import type { DetectionResult } from '../types';

/** Active keywords — defaults to all, updated by content script on settings load. */
let activeKeywords: readonly string[] = ALL_MOVIE_KEYWORDS;
let cleaningRegexes: readonly RegExp[] = buildCleaningRegexes(ALL_MOVIE_KEYWORDS);

function buildCleaningRegexes(keywords: readonly string[]): readonly RegExp[] {
  return [...keywords, ...NOISE_WORDS]
    .sort((a, b) => b.length - a.length)
    .map((keyword) => {
      const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      return new RegExp(`\\b${escaped}\\b`, 'gi');
    });
}

/** Update the active keywords list (called when settings are loaded). */
export function setActiveKeywords(keywords: readonly string[]): void {
  activeKeywords = keywords;
  cleaningRegexes = buildCleaningRegexes(keywords);
}

/**
 * Check if the query string contains any movie-related keyword.
 */
export function matchesKeyword(query: string): boolean {
  const lowered = query.toLowerCase();
  return activeKeywords.some((keyword) => lowered.includes(keyword));
}

/**
 * Check if Letterboxd links already exist in the search results.
 */
export function hasExistingLetterboxdResults(): boolean {
  return document.querySelectorAll(GOOGLE_SELECTORS.letterboxdLinks).length > 0;
}

/**
 * Check Google Knowledge Panel for movie-related content.
 */
export function matchesKnowledgePanel(): boolean {
  const panel = document.querySelector(GOOGLE_SELECTORS.knowledgePanelTitle);
  if (!panel) return false;

  const panelText = panel.closest('[class]')?.textContent?.toLowerCase() ?? '';
  return KNOWLEDGE_PANEL_KEYWORDS.some((keyword) => panelText.includes(keyword));
}

/**
 * Check Google category chips for movie-related labels.
 */
export function matchesCategoryChips(): boolean {
  const chips = document.querySelectorAll(GOOGLE_SELECTORS.categoryChips);
  for (const chip of chips) {
    const text = chip.textContent?.toLowerCase() ?? '';
    if (CATEGORY_CHIP_KEYWORDS.some((keyword) => text.includes(keyword))) {
      return true;
    }
  }
  return false;
}

/**
 * Remove detection keywords and noise words from the query
 * to produce a cleaner search term for Letterboxd.
 * E.g. "oppenheimer director" → "oppenheimer"
 */
export function cleanQueryForLetterboxd(query: string): string {
  let cleaned = query.toLowerCase();

  for (const regex of cleaningRegexes) {
    cleaned = cleaned.replace(regex, ' ');
  }

  // Collapse whitespace and trim
  cleaned = cleaned.replace(/\s+/g, ' ').trim();

  // If cleaning removed everything, return the original query
  return cleaned.length >= 2 ? cleaned : query.trim();
}

/**
 * Determine if the current search is movie-related.
 * Returns the detection result with the match source for debugging.
 */
export function detectMovieSearch(query: string): DetectionResult {
  if (matchesKeyword(query)) {
    return { isMovie: true, matchSource: 'keyword' };
  }
  if (hasExistingLetterboxdResults()) {
    return { isMovie: true, matchSource: 'existing-result' };
  }
  if (matchesKnowledgePanel()) {
    return { isMovie: true, matchSource: 'knowledge-panel' };
  }
  if (matchesCategoryChips()) {
    return { isMovie: true, matchSource: 'category-chip' };
  }
  return { isMovie: false, matchSource: 'none' };
}
