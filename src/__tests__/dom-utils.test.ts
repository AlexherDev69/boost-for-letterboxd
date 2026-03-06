import { describe, it, expect, beforeEach } from 'vitest';
import { truncateDisplay, queryFirst, queryAllFromSelectors } from '../content/dom-utils';

describe('truncateDisplay', () => {
  it('should return the original text when shorter than max length', () => {
    expect(truncateDisplay('short text', 50)).toBe('short text');
  });

  it('should return the original text when exactly at max length', () => {
    const text = 'a'.repeat(50);
    expect(truncateDisplay(text, 50)).toBe(text);
  });

  it('should truncate and add ellipsis when text exceeds max length', () => {
    const text = 'a'.repeat(60);
    const result = truncateDisplay(text, 50);
    expect(result).toBe('a'.repeat(50) + '\u2026');
    expect(result.length).toBe(51);
  });

  it('should handle empty string', () => {
    expect(truncateDisplay('', 50)).toBe('');
  });
});

describe('queryFirst', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('should return the first matching element', () => {
    document.body.innerHTML = '<div id="rso">results</div>';
    const result = queryFirst(['#rso', '#search']);
    expect(result).not.toBeNull();
    expect(result?.id).toBe('rso');
  });

  it('should try selectors in order and return first match', () => {
    document.body.innerHTML = '<div id="search">results</div>';
    const result = queryFirst(['#rso', '#search']);
    expect(result).not.toBeNull();
    expect(result?.id).toBe('search');
  });

  it('should return null when no selector matches', () => {
    document.body.innerHTML = '<div id="other">content</div>';
    const result = queryFirst(['#rso', '#search']);
    expect(result).toBeNull();
  });

  it('should handle empty selectors array', () => {
    expect(queryFirst([])).toBeNull();
  });
});

describe('queryAllFromSelectors', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('should return all matching elements across multiple selectors', () => {
    document.body.innerHTML = `
      <div id="search"><div class="g">result 1</div></div>
      <div id="rso"><div class="g">result 2</div></div>
    `;
    const results = queryAllFromSelectors(['#search .g', '#rso .g']);
    expect(results.length).toBe(2);
  });

  it('should return empty array when nothing matches', () => {
    document.body.innerHTML = '<div>no results</div>';
    const results = queryAllFromSelectors(['#search .g', '#rso .g']);
    expect(results.length).toBe(0);
  });
});
