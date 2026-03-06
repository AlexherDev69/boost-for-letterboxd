import { getSettings, saveSettings, clearSearchHistory } from '../storage';
import { LETTERBOXD_CONFIG } from '../constants/config';
import type { SupportedLanguage, FontSize, SearchHistoryEntry, FeatureToggleMessage } from '../types/storage';

const SUPPORTED_LANGUAGES: readonly SupportedLanguage[] = ['en', 'fr', 'de', 'es', 'it', 'pt'];

function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);

  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'yesterday';
  return `${days}d ago`;
}

function renderHistory(entries: readonly SearchHistoryEntry[]): void {
  const list = document.getElementById('history-list');
  if (!list) return;

  list.innerHTML = '';

  if (entries.length === 0) {
    const empty = document.createElement('li');
    empty.className = 'history-empty';
    empty.textContent = 'No searches yet';
    list.appendChild(empty);
    return;
  }

  for (const entry of entries) {
    const li = document.createElement('li');
    li.className = 'history-item';

    const query = document.createElement('span');
    query.className = 'history-query';
    query.textContent = entry.query;

    const time = document.createElement('span');
    time.className = 'history-time';
    time.textContent = formatTimeAgo(entry.timestamp);

    li.appendChild(query);
    li.appendChild(time);

    li.addEventListener('click', () => {
      const url = `${LETTERBOXD_CONFIG.searchBaseUrl}${encodeURIComponent(entry.query)}/`;
      void chrome.tabs.create({ url });
    });

    list.appendChild(li);
  }
}

async function init(): Promise<void> {
  const settings = await getSettings();

  // Populate feature toggles
  const bannerCheckbox = document.getElementById('banner-enabled') as HTMLInputElement | null;
  if (bannerCheckbox) {
    bannerCheckbox.checked = settings.features.bannerEnabled;
    bannerCheckbox.addEventListener('change', async () => {
      const current = await getSettings();
      await saveSettings({
        features: { ...current.features, bannerEnabled: bannerCheckbox.checked },
      });
    });
  }

  const contextMenuCheckbox = document.getElementById('context-menu-enabled') as HTMLInputElement | null;
  if (contextMenuCheckbox) {
    contextMenuCheckbox.checked = settings.features.contextMenuEnabled;
    contextMenuCheckbox.addEventListener('change', async () => {
      const current = await getSettings();
      await saveSettings({
        features: { ...current.features, contextMenuEnabled: contextMenuCheckbox.checked },
      });
      const message: FeatureToggleMessage = {
        type: 'TOGGLE_CONTEXT_MENU',
        enabled: contextMenuCheckbox.checked,
      };
      void chrome.runtime.sendMessage(message);
    });
  }

  // Populate language toggles
  for (const lang of SUPPORTED_LANGUAGES) {
    const checkbox = document.getElementById(`lang-${lang}`) as HTMLInputElement | null;
    if (checkbox) {
      checkbox.checked = settings.languages[lang];
      checkbox.addEventListener('change', async () => {
        const current = await getSettings();
        const updated = { ...current.languages, [lang]: checkbox.checked };
        await saveSettings({ languages: updated });
      });
    }
  }

  // Populate accessibility settings
  const fontSizeSelect = document.getElementById('font-size') as HTMLSelectElement | null;
  if (fontSizeSelect) {
    fontSizeSelect.value = settings.accessibility.fontSize;
    fontSizeSelect.addEventListener('change', async () => {
      const current = await getSettings();
      await saveSettings({
        accessibility: { ...current.accessibility, fontSize: fontSizeSelect.value as FontSize },
      });
    });
  }

  const highContrastCheckbox = document.getElementById('high-contrast') as HTMLInputElement | null;
  if (highContrastCheckbox) {
    highContrastCheckbox.checked = settings.accessibility.highContrast;
    highContrastCheckbox.addEventListener('change', async () => {
      const current = await getSettings();
      await saveSettings({
        accessibility: { ...current.accessibility, highContrast: highContrastCheckbox.checked },
      });
    });
  }

  const animationsCheckbox = document.getElementById('animations') as HTMLInputElement | null;
  if (animationsCheckbox) {
    animationsCheckbox.checked = settings.accessibility.animations;
    animationsCheckbox.addEventListener('change', async () => {
      const current = await getSettings();
      await saveSettings({
        accessibility: { ...current.accessibility, animations: animationsCheckbox.checked },
      });
    });
  }

  // Render history
  renderHistory(settings.searchHistory);

  // Clear history button
  const clearBtn = document.getElementById('clear-history');
  clearBtn?.addEventListener('click', async () => {
    await clearSearchHistory();
    renderHistory([]);
  });

  // Set version from manifest
  const manifest = chrome.runtime.getManifest();
  const versionText = document.getElementById('version-text');
  if (versionText) {
    versionText.textContent = `v${manifest.version}`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  void init();
});
