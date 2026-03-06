import { detectMovieSearch, cleanQueryForLetterboxd, setActiveKeywords } from './detection';
import { injectBanner } from './banner';
import { boostLetterboxdResults } from './booster';
import { applyAccessibilitySettings } from './accessibility';
import { getSettings } from '../storage';
import { getActiveKeywords } from '../constants/keywords';
import { LETTERBOXD_CONFIG } from '../constants/config';
import type { SearchDetectedMessage } from '../types/storage';

const DEBOUNCE_DELAY_MS = 150;

let bannerEnabled = true;

function getSearchQuery(): string {
  const params = new URLSearchParams(window.location.search);
  return params.get('q') ?? '';
}

function run(): void {
  const query = getSearchQuery();
  if (!query) return;

  const detection = detectMovieSearch(query);
  if (detection.isMovie) {
    const cleanedQuery = cleanQueryForLetterboxd(query);

    if (bannerEnabled) {
      injectBanner(cleanedQuery);
    }
    boostLetterboxdResults();

    // Send to background for history tracking
    const message: SearchDetectedMessage = { type: 'SEARCH_DETECTED', query: cleanedQuery };
    void chrome.runtime.sendMessage(message);
  }
}

// Load settings then run
async function initWithSettings(): Promise<void> {
  try {
    const settings = await getSettings();
    setActiveKeywords(getActiveKeywords(settings.languages));
    applyAccessibilitySettings(settings.accessibility);
    bannerEnabled = settings.features.bannerEnabled;
  } catch {
    // Storage unavailable (e.g. first install) — use defaults
  }
  run();
}

// Initial run
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    void initWithSettings();
  });
} else {
  void initWithSettings();
}

// Observe dynamic changes (Google loads results dynamically)
let debounceTimer: ReturnType<typeof setTimeout> | null = null;

const observer = new MutationObserver(() => {
  if (debounceTimer) clearTimeout(debounceTimer);

  debounceTimer = setTimeout(() => {
    const query = getSearchQuery();
    if (!query) return;

    const detection = detectMovieSearch(query);
    if (detection.isMovie) {
      if (bannerEnabled && !document.getElementById(LETTERBOXD_CONFIG.bannerId)) {
        const cleanedQuery = cleanQueryForLetterboxd(query);
        injectBanner(cleanedQuery);
      }
      boostLetterboxdResults();
    }
  }, DEBOUNCE_DELAY_MS);
});

observer.observe(document.body, { childList: true, subtree: true });
