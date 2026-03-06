import { describe, it, expect, beforeEach } from 'vitest';
import { injectBanner } from '../content/banner';
import { LETTERBOXD_CONFIG } from '../constants/config';

describe('injectBanner', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="main">
        <div id="rso">
          <div class="g">Result 1</div>
        </div>
      </div>
    `;
  });

  it('should inject a banner above search results', () => {
    injectBanner('inception');
    const banner = document.getElementById(LETTERBOXD_CONFIG.bannerId);
    expect(banner).not.toBeNull();
  });

  it('should not inject duplicate banners', () => {
    injectBanner('inception');
    injectBanner('inception');
    const banners = document.querySelectorAll(`#${LETTERBOXD_CONFIG.bannerId}`);
    expect(banners.length).toBe(1);
  });

  it('should contain a link to Letterboxd search', () => {
    injectBanner('inception');
    const link = document.querySelector('.lb-boost-link') as HTMLAnchorElement | null;
    expect(link).not.toBeNull();
    expect(link?.href).toContain('letterboxd.com/search/inception');
    expect(link?.target).toBe('_blank');
    expect(link?.rel).toBe('noopener noreferrer');
  });

  it('should display the search query safely via textContent', () => {
    injectBanner('test movie');
    const strong = document.querySelector(`#${LETTERBOXD_CONFIG.bannerId} strong`);
    expect(strong).not.toBeNull();
    expect(strong?.textContent).toContain('test movie');
  });

  it('should prevent XSS by escaping HTML in query', () => {
    const maliciousQuery = '<img src=x onerror=alert(1)>';
    injectBanner(maliciousQuery);

    // Only the logo img should exist, not one injected via XSS
    const imgs = document.querySelectorAll(`#${LETTERBOXD_CONFIG.bannerId} img`);
    expect(imgs.length).toBe(1);
    expect(imgs[0]?.classList.contains('lb-boost-logo')).toBe(true);

    // The query should appear as plain text
    const strong = document.querySelector(`#${LETTERBOXD_CONFIG.bannerId} strong`);
    expect(strong?.textContent).toContain('<img src=x onerror=alert(1)>');
  });

  it('should truncate long queries', () => {
    const longQuery = 'a'.repeat(100);
    injectBanner(longQuery);
    const strong = document.querySelector(`#${LETTERBOXD_CONFIG.bannerId} strong`);
    expect(strong?.textContent).toContain('a'.repeat(50) + '\u2026');
  });

  it('should not inject when no search container exists', () => {
    document.body.innerHTML = '<div>empty page</div>';
    injectBanner('inception');
    const banner = document.getElementById(LETTERBOXD_CONFIG.bannerId);
    expect(banner).toBeNull();
  });
});
