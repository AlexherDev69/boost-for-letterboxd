import type { AccessibilitySettings, FontSize } from '../types/storage';

const FONT_SIZE_CLASSES: Record<FontSize, string> = {
  normal: '',
  large: 'lb-boost-large',
  xlarge: 'lb-boost-xlarge',
};

const HIGH_CONTRAST_CLASS = 'lb-boost-high-contrast';
const ANIMATE_CLASS = 'lb-boost-animate';

/**
 * Apply accessibility settings by adding CSS classes to <html>.
 * Uses <html> so styles apply to all injected elements.
 */
export function applyAccessibilitySettings(settings: AccessibilitySettings): void {
  const root = document.documentElement;

  // Remove existing font size classes
  for (const cls of Object.values(FONT_SIZE_CLASSES)) {
    if (cls) root.classList.remove(cls);
  }

  // Add current font size class
  const fontClass = FONT_SIZE_CLASSES[settings.fontSize];
  if (fontClass) root.classList.add(fontClass);

  // Toggle high contrast
  root.classList.toggle(HIGH_CONTRAST_CLASS, settings.highContrast);

  // Toggle animations
  root.classList.toggle(ANIMATE_CLASS, settings.animations);
}
