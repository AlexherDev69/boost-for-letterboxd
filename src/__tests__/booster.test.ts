import { describe, it, expect, beforeEach } from 'vitest';
import { boostLetterboxdResults } from '../content/booster';
import { LETTERBOXD_CONFIG } from '../constants/config';

describe('boostLetterboxdResults', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('should move Letterboxd results to the top', () => {
    document.body.innerHTML = `
      <div id="rso">
        <div class="g" id="result-1"><a href="https://imdb.com">IMDb</a></div>
        <div class="g" id="result-2"><a href="https://letterboxd.com/film/dune/">Letterboxd</a></div>
        <div class="g" id="result-3"><a href="https://wikipedia.org">Wikipedia</a></div>
      </div>
    `;

    boostLetterboxdResults();

    const container = document.getElementById('rso');
    const children = container?.querySelectorAll('.g');
    expect(children?.[0]?.id).toBe('result-2');
  });

  it('should apply green border style to boosted results', () => {
    document.body.innerHTML = `
      <div id="rso">
        <div class="g"><a href="https://letterboxd.com/film/test/">Test</a></div>
      </div>
    `;

    boostLetterboxdResults();

    const result = document.querySelector('.g') as HTMLElement;
    // jsdom normalizes hex colors to rgb()
    expect(result.style.borderLeft).toContain('3px solid');
    expect(result.style.borderLeft).toContain('rgb(0, 224, 84)');
    expect(result.style.paddingLeft).toBe(LETTERBOXD_CONFIG.boostPaddingLeft);
  });

  it('should not modify results without Letterboxd links', () => {
    document.body.innerHTML = `
      <div id="rso">
        <div class="g"><a href="https://imdb.com">IMDb</a></div>
      </div>
    `;

    boostLetterboxdResults();

    const result = document.querySelector('.g') as HTMLElement;
    expect(result.style.borderLeft).toBe('');
  });

  it('should handle empty search results gracefully', () => {
    document.body.innerHTML = '<div id="rso"></div>';
    expect(() => boostLetterboxdResults()).not.toThrow();
  });

  it('should handle missing container gracefully', () => {
    document.body.innerHTML = '<div>no container</div>';
    expect(() => boostLetterboxdResults()).not.toThrow();
  });

  it('should maintain relative order of multiple Letterboxd results', () => {
    document.body.innerHTML = `
      <div id="rso">
        <div class="g" id="imdb"><a href="https://imdb.com">IMDb</a></div>
        <div class="g" id="lb-1"><a href="https://letterboxd.com/film/a/">A</a></div>
        <div class="g" id="wiki"><a href="https://wikipedia.org">Wiki</a></div>
        <div class="g" id="lb-2"><a href="https://letterboxd.com/film/b/">B</a></div>
      </div>
    `;

    boostLetterboxdResults();

    const container = document.getElementById('rso');
    const children = container?.querySelectorAll('.g');
    expect(children?.[0]?.id).toBe('lb-1');
    expect(children?.[1]?.id).toBe('lb-2');
  });
});
