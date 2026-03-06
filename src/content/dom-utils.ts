/**
 * Truncate a string for display, adding ellipsis if needed.
 */
export function truncateDisplay(text: string, maxLength: number): string {
  return text.length > maxLength ? `${text.slice(0, maxLength)}\u2026` : text;
}

/**
 * Find the first matching element from an array of CSS selectors.
 */
export function queryFirst(selectors: readonly string[]): Element | null {
  for (const selector of selectors) {
    const element = document.querySelector(selector);
    if (element) return element;
  }
  return null;
}

/**
 * Find all matching elements from an array of CSS selectors.
 */
export function queryAllFromSelectors(selectors: readonly string[]): Element[] {
  const results: Element[] = [];
  for (const selector of selectors) {
    results.push(...document.querySelectorAll(selector));
  }
  return results;
}
