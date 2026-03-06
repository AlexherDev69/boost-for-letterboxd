import { createContextMenu, removeContextMenu, handleContextMenuClick } from './context-menu';
import { addSearchHistoryEntry, getSettings } from '../storage';
import type { SearchDetectedMessage, FeatureToggleMessage } from '../types/storage';

chrome.runtime.onInstalled.addListener(async () => {
  const settings = await getSettings();
  if (settings.features.contextMenuEnabled) {
    createContextMenu();
  }
});

chrome.contextMenus.onClicked.addListener(handleContextMenuClick);

chrome.runtime.onMessage.addListener(
  (message: SearchDetectedMessage | FeatureToggleMessage) => {
    if (message.type === 'SEARCH_DETECTED' && 'query' in message && message.query) {
      void addSearchHistoryEntry(message.query);
    }

    if (message.type === 'TOGGLE_CONTEXT_MENU') {
      if (message.enabled) {
        createContextMenu();
      } else {
        removeContextMenu();
      }
    }
  },
);
