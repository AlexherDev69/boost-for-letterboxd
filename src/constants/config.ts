import type { LetterboxdConfig, ContextMenuConfig } from '../types';

export const LETTERBOXD_CONFIG: LetterboxdConfig = {
  searchBaseUrl: 'https://letterboxd.com/search/',
  maxDisplayQueryLength: 50,
  bannerId: 'lb-boost-banner',
  boostBorderColor: '#00E054',
  boostBorderWidth: '3px',
  boostPaddingLeft: '12px',
  boostMarginBottom: '8px',
} as const;

export const CONTEXT_MENU_CONFIG: ContextMenuConfig = {
  id: 'search-letterboxd',
  title: 'Search "%s" on Letterboxd',
} as const;

export const LOGO_ICON_PATH = 'icon48.png';
