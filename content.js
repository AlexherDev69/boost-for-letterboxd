(() => {
  "use strict";

  const LETTERBOXD_SEARCH_URL = "https://letterboxd.com/search/";
  const LETTERBOXD_LOGO = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="22" height="22" style="vertical-align: middle; margin-right: 8px;">
    <circle cx="250" cy="250" r="250" fill="#00E054"/>
    <circle cx="175" cy="250" r="80" fill="#40BCF4"/>
    <circle cx="325" cy="250" r="80" fill="#FF8000"/>
    <ellipse cx="250" cy="250" rx="30" ry="72" fill="#E9A000"/>
  </svg>`;

  function getSearchQuery() {
    const params = new URLSearchParams(window.location.search);
    return params.get("q") || "";
  }

  function looksLikeMovieSearch(query) {
    const q = query.toLowerCase();

    const movieKeywords = [
      // English
      "film", "movie", "movies", "series", "tv show", "show",
      "netflix", "prime video", "disney+", "disney plus", "hulu", "hbo", "apple tv",
      "cinema", "trailer", "cast", "casting",
      "actor", "actress", "director", "directed by",
      "season", "episode",
      "streaming", "imdb", "letterboxd", "rotten tomatoes",
      "review", "rating", "ratings", "critique",
      "release date", "box office",
      "oscar", "oscars", "academy award", "golden globe",
      "cannes", "sundance", "venice film",
      "horror", "comedy", "thriller", "sci-fi", "science fiction",
      "action", "drama", "documentary", "animation", "animated",
      "watch", "watch online", "where to watch",
      "screenplay", "cinematography", "soundtrack",
      // French
      "série", "serie", "bande annonce", "bande-annonce",
      "acteur", "actrice", "réalisateur", "realisateur",
      "saison", "épisode", "vostfr", "vf", "vo",
      "allocine", "allociné",
      "sortie", "critique", "avis",
      "horreur", "comédie", "comedie", "drame",
      "documentaire", "regarder", "voir", "cinéma",
    ];

    if (movieKeywords.some((kw) => q.includes(kw))) return true;

    // Check if Letterboxd already appears in results
    const resultLinks = document.querySelectorAll("a[href*='letterboxd.com']");
    if (resultLinks.length > 0) return true;

    // Check Google Knowledge Panel
    const knowledgePanel = document.querySelector(
      '[data-attrid="title"], [data-attrid="subtitle"]'
    );
    if (knowledgePanel) {
      const panelText = knowledgePanel.closest("[class]")?.textContent?.toLowerCase() || "";
      const moviePanelKeywords = [
        "film", "movie", "director", "runtime", "genre",
        "release", "box office", "cast", "production",
        "réalisateur", "durée", "sortie", "acteurs",
      ];
      if (moviePanelKeywords.some((kw) => panelText.includes(kw))) return true;
    }

    // Check Google category chips
    const chips = document.querySelectorAll("div[role='listitem'], .YmvwI");
    for (const chip of chips) {
      const text = chip.textContent?.toLowerCase() || "";
      if (["film", "movie", "series", "trailer", "série", "bande-annonce"].some((kw) => text.includes(kw))) {
        return true;
      }
    }

    return false;
  }

  function boostLetterboxdResults() {
    const allResults = document.querySelectorAll("#search .g, #rso .g");
    const container = document.querySelector("#rso") || document.querySelector("#search");
    if (!container) return;

    const lbResults = [];
    for (const result of allResults) {
      const link = result.querySelector("a[href*='letterboxd.com']");
      if (link) {
        lbResults.push(result);
      }
    }

    for (let i = lbResults.length - 1; i >= 0; i--) {
      const el = lbResults[i];
      el.style.borderLeft = "3px solid #00E054";
      el.style.paddingLeft = "12px";
      el.style.marginBottom = "8px";
      container.prepend(el);
    }
  }

  function injectBanner(query) {
    if (document.getElementById("lb-boost-banner")) return;

    const searchContainer =
      document.querySelector("#rso") ||
      document.querySelector("#search") ||
      document.querySelector("#main");

    if (!searchContainer) return;

    const encodedQuery = encodeURIComponent(query);
    const letterboxdUrl = `${LETTERBOXD_SEARCH_URL}${encodedQuery}/`;
    const displayQuery = query.length > 50 ? query.slice(0, 50) + "…" : query;

    const banner = document.createElement("div");
    banner.id = "lb-boost-banner";
    banner.innerHTML = `
      <a href="${letterboxdUrl}" target="_blank" rel="noopener noreferrer" id="lb-boost-link">
        ${LETTERBOXD_LOGO}
        <span class="lb-boost-text">
          <strong>Search "${displayQuery}" on Letterboxd</strong>
          <span class="lb-boost-sub">Films, lists, reviews & ratings</span>
        </span>
        <span class="lb-boost-arrow">→</span>
      </a>
    `;

    searchContainer.parentNode.insertBefore(banner, searchContainer);
  }

  function run() {
    const query = getSearchQuery();
    if (!query) return;

    if (looksLikeMovieSearch(query)) {
      injectBanner(query);
      boostLetterboxdResults();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }

  const observer = new MutationObserver(() => {
    const query = getSearchQuery();
    if (query && looksLikeMovieSearch(query)) {
      if (!document.getElementById("lb-boost-banner")) {
        injectBanner(query);
      }
      boostLetterboxdResults();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();
