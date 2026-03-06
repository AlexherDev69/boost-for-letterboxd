import type { GoogleSelectors } from '../types';

export const GOOGLE_SELECTORS: GoogleSelectors = {
  searchResults: ['#search .g', '#rso .g'],
  resultsContainer: ['#rso', '#search', '#main'],
  knowledgePanelTitle: '[data-attrid="title"], [data-attrid="subtitle"]',
  categoryChips: 'div[role="listitem"], .YmvwI',
  letterboxdLinks: 'a[href*="letterboxd.com"]',
} as const;
