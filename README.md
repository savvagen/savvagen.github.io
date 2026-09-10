# savvagen.github.io
```text
© 2026 Savva Henchevskyi. All rights reserved. Unauthorised copying, modification, or distribution of this repository's content or code is strictly prohibited.
```




Personal one-page site for **Savva Henchevskyi** — Lead / Senior Performance, Reliability & Automation Engineer.

Static HTML/CSS/JS with no build step and no dependencies, so GitHub Pages serves it straight from the repository root.

## Structure

```
index.html            all page content
assets/css/styles.css theme tokens + layout (dark default, light override)
assets/js/main.js     theme toggle, nav, scroll spy, reveals, projects disclosure
images/avatar.jpg     portrait
cv/                   source résumé
```

## Local preview

```bash
npm start          # http://localhost:4173
```

Any static server works — the page has no build or runtime dependencies.

## Editing

- **Sections** are plain HTML in `index.html`: About, Career, Services, AI Adoption, Experience, Skills, Projects, Contact.
- **Theme** — dark is the default. `assets/css/styles.css` holds the palette in `:root`, with light-mode overrides under `[data-theme="light"]`. The visitor's choice is stored in `localStorage`, and an inline script in `<head>` applies it before first paint so there is no flash.
- **Experience entries** are native `<details>` elements — they expand without JavaScript.
- **Projects** are hidden behind a disclosure button; `#projects` in the URL opens the panel automatically.

## Deployment

Push to the default branch of `savvagen/savvagen.github.io`. GitHub Pages publishes the root of the repository as-is.

See [PUBLISHING.md](PUBLISHING.md) for first-time setup, Pages configuration, and the recommended repository security settings.

## License

Source code (HTML structure, CSS, JavaScript) is released under the [MIT License](LICENSE).

Personal content — the résumé text, career history, portrait photograph and the documents in `cv/` — is © Savva Henchevskyi, all rights reserved, and is not covered by the MIT grant.
