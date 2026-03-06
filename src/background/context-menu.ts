import { LETTERBOXD_CONFIG, CONTEXT_MENU_CONFIG } from '../constants/config';

/**
 * Register the "Search on Letterboxd" context menu item.
 */
export function createContextMenu(): void {
  chrome.contextMenus.create({
    id: CONTEXT_MENU_CONFIG.id,
    title: CONTEXT_MENU_CONFIG.title,
    contexts: ['selection'],
  });
}

/**
 * Remove the context menu item.
 */
export function removeContextMenu(): void {
  chrome.contextMenus.removeAll();
}

/**
 * Handle context menu click: open Letterboxd search in a new tab.
 */
export function handleContextMenuClick(info: chrome.contextMenus.OnClickData): void {
  if (info.menuItemId !== CONTEXT_MENU_CONFIG.id || !info.selectionText) return;

  const query = encodeURIComponent(info.selectionText.trim());
  const url = `${LETTERBOXD_CONFIG.searchBaseUrl}${query}/`;

  void chrome.tabs.create({ url });
}
