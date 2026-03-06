import { describe, it, expect, beforeEach } from 'vitest';
import {
  matchesKeyword,
  hasExistingLetterboxdResults,
  matchesKnowledgePanel,
  matchesCategoryChips,
  detectMovieSearch,
  cleanQueryForLetterboxd,
} from '../content/detection';

describe('matchesKeyword', () => {
  it('should detect English movie keywords', () => {
    expect(matchesKeyword('best horror movies 2024')).toBe(true);
    expect(matchesKeyword('inception director')).toBe(true);
    expect(matchesKeyword('where to watch interstellar')).toBe(true);
  });

  it('should detect French movie keywords', () => {
    expect(matchesKeyword('bande annonce avatar')).toBe(true);
    expect(matchesKeyword('réalisateur dune')).toBe(true);
    expect(matchesKeyword('allocine top films')).toBe(true);
  });

  it('should detect streaming platform keywords', () => {
    expect(matchesKeyword('best netflix series')).toBe(true);
    expect(matchesKeyword('disney+ new releases')).toBe(true);
    expect(matchesKeyword('hbo max shows')).toBe(true);
  });

  it('should be case insensitive', () => {
    expect(matchesKeyword('HORROR MOVIE')).toBe(true);
    expect(matchesKeyword('Netflix Series')).toBe(true);
  });

  it('should detect German movie keywords', () => {
    expect(matchesKeyword('bester horrorfilm 2024')).toBe(true);
    expect(matchesKeyword('schauspieler batman')).toBe(true);
    expect(matchesKeyword('kino berlin')).toBe(true);
  });

  it('should detect Spanish movie keywords', () => {
    expect(matchesKeyword('mejor película 2024')).toBe(true);
    expect(matchesKeyword('cartelera madrid')).toBe(true);
    expect(matchesKeyword('donde ver dune')).toBe(true);
  });

  it('should detect Italian movie keywords', () => {
    expect(matchesKeyword('miglior attore 2024')).toBe(true);
    expect(matchesKeyword('dove guardare oppenheimer')).toBe(true);
    expect(matchesKeyword('recensione dune')).toBe(true);
  });

  it('should detect Portuguese movie keywords', () => {
    expect(matchesKeyword('melhor filme 2024')).toBe(true);
    expect(matchesKeyword('onde assistir dune')).toBe(true);
    expect(matchesKeyword('adorocinema top filmes')).toBe(true);
  });

  it('should not match unrelated queries', () => {
    expect(matchesKeyword('weather paris')).toBe(false);
    expect(matchesKeyword('javascript tutorial')).toBe(false);
    expect(matchesKeyword('best restaurants near me')).toBe(false);
  });
});

describe('hasExistingLetterboxdResults', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('should return true when Letterboxd links exist', () => {
    document.body.innerHTML = '<a href="https://letterboxd.com/film/dune/">Dune</a>';
    expect(hasExistingLetterboxdResults()).toBe(true);
  });

  it('should return false when no Letterboxd links exist', () => {
    document.body.innerHTML = '<a href="https://imdb.com">IMDb</a>';
    expect(hasExistingLetterboxdResults()).toBe(false);
  });
});

describe('matchesKnowledgePanel', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('should return true when Knowledge Panel contains movie keywords', () => {
    document.body.innerHTML = `
      <div class="panel">
        <div data-attrid="title">Inception</div>
        <span>Director: Christopher Nolan | Runtime: 148 min</span>
      </div>
    `;
    expect(matchesKnowledgePanel()).toBe(true);
  });

  it('should return false when no Knowledge Panel exists', () => {
    document.body.innerHTML = '<div>Regular content</div>';
    expect(matchesKnowledgePanel()).toBe(false);
  });

  it('should return false when Knowledge Panel has no movie keywords', () => {
    document.body.innerHTML = `
      <div class="panel">
        <div data-attrid="title">Paris</div>
        <span>Capital of France | Population: 2.1M</span>
      </div>
    `;
    expect(matchesKnowledgePanel()).toBe(false);
  });
});

describe('matchesCategoryChips', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('should return true when category chips contain movie keywords', () => {
    document.body.innerHTML = `
      <div role="listitem">Film</div>
      <div role="listitem">Cast</div>
    `;
    expect(matchesCategoryChips()).toBe(true);
  });

  it('should return false when no movie chips exist', () => {
    document.body.innerHTML = `
      <div role="listitem">News</div>
      <div role="listitem">Images</div>
    `;
    expect(matchesCategoryChips()).toBe(false);
  });
});

describe('detectMovieSearch', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('should detect keyword match with correct source', () => {
    const result = detectMovieSearch('inception movie');
    expect(result.isMovie).toBe(true);
    expect(result.matchSource).toBe('keyword');
  });

  it('should detect existing Letterboxd results', () => {
    document.body.innerHTML = '<a href="https://letterboxd.com/film/test/">Test</a>';
    const result = detectMovieSearch('some unrelated query');
    expect(result.isMovie).toBe(true);
    expect(result.matchSource).toBe('existing-result');
  });

  it('should return not a movie for unrelated queries', () => {
    const result = detectMovieSearch('best pizza recipe');
    expect(result.isMovie).toBe(false);
    expect(result.matchSource).toBe('none');
  });
});

describe('cleanQueryForLetterboxd', () => {
  it('should remove detection keywords from query', () => {
    expect(cleanQueryForLetterboxd('oppenheimer director')).toBe('oppenheimer');
    expect(cleanQueryForLetterboxd('dune bande annonce')).toBe('dune');
    expect(cleanQueryForLetterboxd('inception trailer')).toBe('inception');
  });

  it('should remove noise words', () => {
    expect(cleanQueryForLetterboxd('best horror movies 2024')).toBe('2024');
    expect(cleanQueryForLetterboxd('top netflix series 2024')).toBe('2024');
  });

  it('should remove multilingual keywords', () => {
    expect(cleanQueryForLetterboxd('oppenheimer réalisateur')).toBe('oppenheimer');
    expect(cleanQueryForLetterboxd('dune schauspieler')).toBe('dune');
    expect(cleanQueryForLetterboxd('dune donde ver')).toBe('dune');
    expect(cleanQueryForLetterboxd('dune dove guardare')).toBe('dune');
    expect(cleanQueryForLetterboxd('dune onde assistir')).toBe('dune');
  });

  it('should preserve the film title', () => {
    expect(cleanQueryForLetterboxd('the dark knight review')).toBe('the dark knight');
    expect(cleanQueryForLetterboxd('parasite film coréen')).toBe('parasite coréen');
  });

  it('should return original query if cleaning removes everything', () => {
    expect(cleanQueryForLetterboxd('film')).toBe('film');
    expect(cleanQueryForLetterboxd('movie')).toBe('movie');
  });

  it('should handle queries with only a film name', () => {
    expect(cleanQueryForLetterboxd('interstellar')).toBe('interstellar');
  });
});
