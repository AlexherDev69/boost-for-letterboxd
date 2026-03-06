import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createContextMenu, handleContextMenuClick } from '../background/context-menu';
import { CONTEXT_MENU_CONFIG, LETTERBOXD_CONFIG } from '../constants/config';

describe('createContextMenu', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create a context menu item with correct config', () => {
    createContextMenu();

    expect(chrome.contextMenus.create).toHaveBeenCalledWith({
      id: CONTEXT_MENU_CONFIG.id,
      title: CONTEXT_MENU_CONFIG.title,
      contexts: ['selection'],
    });
  });
});

describe('handleContextMenuClick', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should open Letterboxd search for selected text', () => {
    const info = {
      menuItemId: CONTEXT_MENU_CONFIG.id,
      selectionText: 'inception',
      editable: false,
    } as chrome.contextMenus.OnClickData;

    handleContextMenuClick(info);

    expect(chrome.tabs.create).toHaveBeenCalledWith({
      url: `${LETTERBOXD_CONFIG.searchBaseUrl}inception/`,
    });
  });

  it('should encode special characters in query', () => {
    const info = {
      menuItemId: CONTEXT_MENU_CONFIG.id,
      selectionText: 'the dark knight',
      editable: false,
    } as chrome.contextMenus.OnClickData;

    handleContextMenuClick(info);

    expect(chrome.tabs.create).toHaveBeenCalledWith({
      url: `${LETTERBOXD_CONFIG.searchBaseUrl}the%20dark%20knight/`,
    });
  });

  it('should trim whitespace from selection', () => {
    const info = {
      menuItemId: CONTEXT_MENU_CONFIG.id,
      selectionText: '  inception  ',
      editable: false,
    } as chrome.contextMenus.OnClickData;

    handleContextMenuClick(info);

    expect(chrome.tabs.create).toHaveBeenCalledWith({
      url: `${LETTERBOXD_CONFIG.searchBaseUrl}inception/`,
    });
  });

  it('should ignore clicks on other menu items', () => {
    const info = {
      menuItemId: 'other-menu-item',
      selectionText: 'inception',
      editable: false,
    } as chrome.contextMenus.OnClickData;

    handleContextMenuClick(info);

    expect(chrome.tabs.create).not.toHaveBeenCalled();
  });

  it('should ignore clicks without selection text', () => {
    const info = {
      menuItemId: CONTEXT_MENU_CONFIG.id,
      selectionText: undefined,
      editable: false,
    } as chrome.contextMenus.OnClickData;

    handleContextMenuClick(info);

    expect(chrome.tabs.create).not.toHaveBeenCalled();
  });
});
