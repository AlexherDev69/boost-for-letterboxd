const MOVIE_KEYWORDS_EN = [
  'film',
  'movie',
  'movies',
  'series',
  'tv show',
  'show',
  'cinema',
  'trailer',
  'cast',
  'casting',
  'actor',
  'actress',
  'director',
  'directed by',
  'season',
  'episode',
  'streaming',
  'imdb',
  'letterboxd',
  'rotten tomatoes',
  'review',
  'rating',
  'ratings',
  'critique',
  'release date',
  'box office',
  'oscar',
  'oscars',
  'academy award',
  'golden globe',
  'cannes',
  'sundance',
  'venice film',
  'horror',
  'comedy',
  'thriller',
  'sci-fi',
  'science fiction',
  'action',
  'drama',
  'documentary',
  'animation',
  'animated',
  'watch',
  'watch online',
  'where to watch',
  'screenplay',
  'cinematography',
  'soundtrack',
] as const;

const MOVIE_KEYWORDS_FR = [
  'série',
  'serie',
  'bande annonce',
  'bande-annonce',
  'acteur',
  'actrice',
  'réalisateur',
  'realisateur',
  'saison',
  'épisode',
  'vostfr',
  'vf',
  'vo',
  'allocine',
  'allociné',
  'sortie',
  'critique',
  'avis',
  'horreur',
  'comédie',
  'comedie',
  'drame',
  'documentaire',
  'regarder',
  'voir',
  'cinéma',
] as const;

const MOVIE_KEYWORDS_DE = [
  'schauspieler',
  'schauspielerin',
  'regisseur',
  'regie',
  'staffel',
  'folge',
  'kinofilm',
  'kino',
  'filmkritik',
  'kritik',
  'bewertung',
  'vorschau',
  'horrorfilm',
  'komödie',
  'komodie',
  'dokumentarfilm',
  'zeichentrickfilm',
  'anschauen',
  'kinostart',
  'filmpreis',
  'drehbuch',
] as const;

const MOVIE_KEYWORDS_ES = [
  'película',
  'pelicula',
  'películas',
  'peliculas',
  'serie',
  'temporada',
  'episodio',
  'estreno',
  'tráiler',
  'trailer',
  'reparto',
  'actriz',
  'director',
  'dirigida por',
  'cartelera',
  'cine',
  'reseña',
  'crítica',
  'critica',
  'calificación',
  'terror',
  'comedia',
  'documental',
  'animación',
  'animacion',
  'ver online',
  'dónde ver',
  'donde ver',
  'guión',
  'guion',
  'taquilla',
  'filmaffinity',
] as const;

const MOVIE_KEYWORDS_IT = [
  'attore',
  'attrice',
  'regista',
  'stagione',
  'episodio',
  'uscita',
  'recensione',
  'valutazione',
  'commedia',
  'orrore',
  'fantascienza',
  'documentario',
  'animazione',
  'guardare',
  'dove guardare',
  'colonna sonora',
  'sceneggiatura',
  'botteghino',
  'incassi',
] as const;

const MOVIE_KEYWORDS_PT = [
  'filme',
  'filmes',
  'série',
  'temporada',
  'episódio',
  'episodio',
  'estreia',
  'elenco',
  'ator',
  'atriz',
  'diretor',
  'dirigido por',
  'resenha',
  'avaliação',
  'avaliacao',
  'terror',
  'comédia',
  'comedia',
  'documentário',
  'documentario',
  'animação',
  'animacao',
  'assistir',
  'assistir online',
  'onde assistir',
  'roteiro',
  'bilheteria',
  'adorocinema',
] as const;

const PLATFORM_KEYWORDS = [
  'netflix',
  'prime video',
  'disney+',
  'disney plus',
  'hulu',
  'hbo',
  'apple tv',
  'paramount+',
  'crunchyroll',
  'mubi',
  'canal+',
  'globoplay',
] as const;

import type { SupportedLanguage } from '../types/storage';

/** Map of language code → keywords array, used by popup toggles. */
export const LANGUAGE_KEYWORDS: Record<SupportedLanguage, readonly string[]> = {
  en: MOVIE_KEYWORDS_EN,
  fr: MOVIE_KEYWORDS_FR,
  de: MOVIE_KEYWORDS_DE,
  es: MOVIE_KEYWORDS_ES,
  it: MOVIE_KEYWORDS_IT,
  pt: MOVIE_KEYWORDS_PT,
};

/** All movie keywords (all languages + platforms). Used as default. */
export const ALL_MOVIE_KEYWORDS: readonly string[] = [
  ...MOVIE_KEYWORDS_EN,
  ...MOVIE_KEYWORDS_FR,
  ...MOVIE_KEYWORDS_DE,
  ...MOVIE_KEYWORDS_ES,
  ...MOVIE_KEYWORDS_IT,
  ...MOVIE_KEYWORDS_PT,
  ...PLATFORM_KEYWORDS,
];

/**
 * Build a filtered keyword list based on active languages.
 * Platform keywords are always included.
 */
export function getActiveKeywords(
  languages: Record<SupportedLanguage, boolean>,
): readonly string[] {
  const keywords: string[] = [...PLATFORM_KEYWORDS];
  for (const [lang, enabled] of Object.entries(languages)) {
    if (enabled) {
      const langKeywords = LANGUAGE_KEYWORDS[lang as SupportedLanguage];
      if (langKeywords) keywords.push(...langKeywords);
    }
  }
  return keywords;
}

/**
 * Common noise words to strip from queries before sending to Letterboxd.
 * These are generic qualifiers that don't help identify a specific film.
 */
export const NOISE_WORDS = [
  'best',
  'top',
  'new',
  'latest',
  'good',
  'great',
  'worst',
  'list',
  'all time',
  'of all time',
  'online',
  'free',
  'full',
  // FR
  'meilleur',
  'meilleurs',
  'meilleures',
  'nouveau',
  'nouveaux',
  'nouvelles',
  'liste',
  'gratuit',
  'complet',
  // DE
  'beste',
  'bester',
  'besten',
  'neue',
  'neuer',
  'neues',
  // ES
  'mejor',
  'mejores',
  'nuevo',
  'nuevos',
  'nuevas',
  'gratis',
  // IT
  'migliore',
  'migliori',
  'nuovo',
  'nuovi',
  'nuove',
  // PT
  'melhor',
  'melhores',
  'novo',
  'novos',
  'novas',
] as const;

export const KNOWLEDGE_PANEL_KEYWORDS = [
  // EN
  'film',
  'movie',
  'director',
  'runtime',
  'genre',
  'release',
  'box office',
  'cast',
  'production',
  // FR
  'réalisateur',
  'durée',
  'sortie',
  'acteurs',
  // DE
  'regisseur',
  'laufzeit',
  'besetzung',
  // ES
  'director',
  'duración',
  'reparto',
  'estreno',
  // IT
  'regista',
  'durata',
  'uscita',
  // PT
  'diretor',
  'duração',
  'elenco',
] as const;

export const CATEGORY_CHIP_KEYWORDS = [
  'film',
  'movie',
  'series',
  'trailer',
  // FR
  'série',
  'bande-annonce',
  // DE
  'staffel',
  'vorschau',
  // ES
  'película',
  'temporada',
  // IT
  'stagione',
  // PT
  'filme',
] as const;
