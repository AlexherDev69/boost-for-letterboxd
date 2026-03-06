import { LETTERBOXD_CONFIG } from '../constants/config';
import { GOOGLE_SELECTORS } from '../constants/selectors';
import { queryFirst, queryAllFromSelectors } from './dom-utils';

const BOOSTED_MARKER = 'lb-boosted';

/**
 * Find Letterboxd results in Google search and move them to the top
 * with a visual green border highlight. Skips already-boosted results.
 */
export function boostLetterboxdResults(): void {
  const allResults = queryAllFromSelectors(GOOGLE_SELECTORS.searchResults);
  const container = queryFirst(GOOGLE_SELECTORS.resultsContainer);
  if (!container) return;

  const letterboxdResults = allResults.filter(
    (result) =>
      result.querySelector(GOOGLE_SELECTORS.letterboxdLinks) !== null &&
      !result.hasAttribute(BOOSTED_MARKER),
  );

  // Prepend in reverse order to maintain original relative order
  for (let i = letterboxdResults.length - 1; i >= 0; i--) {
    const element = letterboxdResults[i];
    if (element instanceof HTMLElement) {
      element.style.borderLeft = `${LETTERBOXD_CONFIG.boostBorderWidth} solid ${LETTERBOXD_CONFIG.boostBorderColor}`;
      element.style.paddingLeft = LETTERBOXD_CONFIG.boostPaddingLeft;
      element.style.marginBottom = LETTERBOXD_CONFIG.boostMarginBottom;
      element.setAttribute(BOOSTED_MARKER, '');
      container.prepend(element);
    }
  }
}
