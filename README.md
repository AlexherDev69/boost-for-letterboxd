# Boost for Letterboxd

A Chrome extension that puts Letterboxd front and center in your Google searches.

## Features

**Letterboxd Banner** — When you search for a movie, director or actor on Google, a direct link to Letterboxd appears at the top of the results with a smooth slide-in animation.

**Boosted Results** — Existing Letterboxd results in the Google page are automatically moved to the top with a green visual highlight.

**Right-Click Search** — Highlight any text on any website, right-click, and choose "Search on Letterboxd" to jump straight there.

**Smart Detection** — The extension detects cinema-related searches using keywords in 6 languages (English, French, German, Spanish, Italian, Portuguese), Google Knowledge Panels, and category chips.

**Query Cleaning** — Noise words and detection keywords are stripped from the search query before sending it to Letterboxd. For example, "oppenheimer director" becomes "oppenheimer".

**Popup Panel** — Click the extension icon to access:

- Recent search history (last 20 searches, deduplicated)
- Feature toggles (banner, context menu)
- Language toggles (enable/disable detection per language)
- Accessibility settings (font size, high contrast, animations)
- Links to GitHub and X/Twitter

**Accessibility** — Configurable font size (normal, large, extra large), high contrast mode, and animation toggle. Respects `prefers-reduced-motion` and `prefers-color-scheme` automatically.

**Responsive** — The banner adapts to mobile and smaller viewports.

## Installation

### Chrome Web Store (recommended)

Install directly from the [Chrome Web Store](https://chromewebstore.google.com/detail/boost-for-letterboxd/jfnkjbammnogkcfpflgobdjadmcbjigd).

### Manual install (dev mode)

1. Clone and build
   ```bash
   git clone https://github.com/AlexherDev69/boost-for-letterboxd.git
   cd boost-for-letterboxd
   npm install
   npm run build
   ```
2. Open `chrome://extensions/` in Chrome
3. Enable **Developer mode** (top right)
4. Click **Load unpacked** and select the `dist/` folder

## Development

```bash
npm run dev        # Watch mode (auto-rebuild on changes)
npm test           # Run tests
npm run lint       # Lint
npm run lint:fix   # Lint + auto-fix
npm run format     # Prettier
npm run clean      # Remove dist/
```

### Tech stack

- **TypeScript** with strict config
- **esbuild** for bundling (3 entry points: content, background, popup)
- **Vitest** + jsdom for testing
- **ESLint** + **Prettier** for code quality
- **Chrome Extension Manifest V3**

### Project structure

```
src/
  background/       # Service worker (context menu, message listener)
  content/          # Content script (detection, banner, booster, accessibility)
  constants/        # Config, keywords (6 languages), selectors
  popup/            # Popup panel logic
  storage/          # chrome.storage.sync helpers
  types/            # TypeScript interfaces
  __tests__/        # Unit tests
static/             # manifest.json, popup.html/css, style.css, icons
```

## Supported languages

| Language   | Keywords                                      | Example                |
| ---------- | --------------------------------------------- | ---------------------- |
| English    | film, movie, director, trailer, streaming...  | "oppenheimer movie"    |
| French     | cinéma, acteur, réalisateur, bande-annonce... | "oppenheimer film"     |
| German     | kino, schauspieler, regisseur, filmkritik...  | "oppenheimer kinofilm" |
| Spanish    | película, director, estreno, cartelera...     | "oppenheimer película" |
| Italian    | attore, regista, recensione, guardare...      | "oppenheimer film"     |
| Portuguese | filme, diretor, elenco, assistir...           | "oppenheimer filme"    |

Platform keywords (Netflix, Disney+, HBO, etc.) are always active regardless of language settings.

## Supported Google domains

google.com, google.fr, google.co.uk, google.ca, google.be, google.ch, google.de, google.es, google.it, google.com.au, google.co.in, google.com.br

## Privacy

No data collected. No tracking. No analytics. Everything runs locally in your browser. Settings are stored via `chrome.storage.sync` (synced to your Google account if Chrome sync is enabled).

See [PRIVACY_POLICY.md](PRIVACY_POLICY.md) for details.

## Changelog

### v1.2 — Settings & Accessibility

- **Popup panel** with search history, feature toggles, language toggles, accessibility settings
- **6 language support** — English, French, German, Spanish, Italian, Portuguese keywords
- **Feature toggles** — enable/disable banner and context menu independently
- **Accessibility** — configurable font size, high contrast mode, animation toggle
- **Banner animation** — smooth slide-in with `prefers-reduced-motion` support
- **Query cleaning** — strips noise words for better Letterboxd search results
- **Responsive design** — mobile-friendly banner
- **Dark/light mode** — banner adapts to system theme
- **Anti-duplicate** — boosted results are marked to prevent double styling
- **Debounced observer** — MutationObserver is debounced for better performance
- **Full TypeScript rewrite** — strict types, esbuild bundling, vitest tests
- **63 unit tests** across 6 test suites

### v1.0 — Initial release

- Letterboxd search banner on Google
- Result boosting with green highlight
- Right-click context menu search
- English + French keyword detection

## License

MIT License. See [LICENSE](LICENSE) for details.

## Contributing

Contributions, issues and feature requests are welcome! Feel free to open an issue or submit a PR.

## Author

Built by [Alex](https://github.com/AlexherDev69) ([X/Twitter](https://x.com/Alexher__)), a French developer and cinephile.

Not affiliated with Letterboxd. Just a fan who got tired of scrolling Google results.
