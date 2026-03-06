import { LETTERBOXD_CONFIG, LOGO_ICON_PATH } from '../constants/config';
import { GOOGLE_SELECTORS } from '../constants/selectors';
import { truncateDisplay, queryFirst } from './dom-utils';

/**
 * Create the banner DOM element safely using createElement.
 * User data (query) is inserted via textContent to prevent XSS.
 */
function createBannerElement(query: string): HTMLDivElement {
  const encodedQuery = encodeURIComponent(query);
  const letterboxdUrl = `${LETTERBOXD_CONFIG.searchBaseUrl}${encodedQuery}/`;
  const displayQuery = truncateDisplay(query, LETTERBOXD_CONFIG.maxDisplayQueryLength);

  const banner = document.createElement('div');
  banner.id = LETTERBOXD_CONFIG.bannerId;
  banner.className = 'lb-boost-banner';

  const link = document.createElement('a');
  link.href = letterboxdUrl;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.className = 'lb-boost-link';
  link.setAttribute('aria-label', `Search "${displayQuery}" on Letterboxd`);

  // Logo: extension icon loaded via chrome.runtime.getURL
  const logo = document.createElement('img');
  logo.src = chrome.runtime.getURL(LOGO_ICON_PATH);
  logo.alt = 'Boost for Letterboxd';
  logo.className = 'lb-boost-logo';

  // Text block built with textContent — safe from XSS
  const textBlock = document.createElement('span');
  textBlock.className = 'lb-boost-text';

  const title = document.createElement('strong');
  title.textContent = `Search "${displayQuery}" on Letterboxd`;

  const subtitle = document.createElement('span');
  subtitle.className = 'lb-boost-sub';
  subtitle.textContent = 'Films, lists, reviews & ratings';

  textBlock.appendChild(title);
  textBlock.appendChild(subtitle);

  // Arrow
  const arrow = document.createElement('span');
  arrow.className = 'lb-boost-arrow';
  arrow.textContent = '\u2192';

  link.appendChild(logo);
  link.appendChild(textBlock);
  link.appendChild(arrow);
  banner.appendChild(link);

  return banner;
}

/**
 * Inject the Letterboxd banner above Google search results.
 * No-op if banner already exists.
 */
export function injectBanner(query: string): void {
  if (document.getElementById(LETTERBOXD_CONFIG.bannerId)) return;

  const searchContainer = queryFirst(GOOGLE_SELECTORS.resultsContainer);
  if (!searchContainer?.parentNode) return;

  const banner = createBannerElement(query);
  searchContainer.parentNode.insertBefore(banner, searchContainer);
}
