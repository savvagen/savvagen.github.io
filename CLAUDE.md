# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

The personal one-page site of Savva Henchevskyi (Lead / Senior Performance, Reliability & Automation Engineer), published at `https://savvagen.github.io/`. It is a GitHub Pages **user site**: the repository name must stay `savvagen.github.io`, and Pages serves the repository root verbatim.

## Commands

```bash
npm start    # static server on http://localhost:4173
```

There is no build, no bundler, no dependency install, and no test suite — `npm test` is the unmodified npm scaffold and exits 1. Any static file server works; what Pages serves is exactly what is on disk.

Verify changes by loading `http://localhost:4173` in a browser rather than by running a test. The things worth checking after a change: no console errors, no horizontal overflow at 1440px and 390px, and both themes.

## Architecture

Three files carry the whole site. Nothing is generated, so an edit to any of them is the deployed change.

- **`index.html`** — every section, inline as static markup. Sections in document order: `#about` (hero), `#career`, `#services`, `#ai`, `#experience`, `#skills`, `#projects`, `#contact`. Section `id`s are load-bearing: the header nav, the scroll spy, and `scroll-padding-top` all key off them.
- **`assets/css/styles.css`** — design tokens in `:root`, overridden wholesale under `[data-theme="light"]`. Every color in the stylesheet is a `var(--…)`; adding a hard-coded color breaks light mode. Layout is CSS Grid with `auto-fit`/`auto-fill`, so sections reflow without media queries — the media queries only handle the nav collapse (860px), hero stacking (980px) and small-screen padding (620px).
- **`assets/js/main.js`** — one IIFE, no modules. Handles theme toggle, mobile nav, scroll spy, reveal-on-scroll, stat counters, the projects disclosure, and card pointer spotlight.

### Content source of truth

Page copy is derived from `cv/Savva Henchevskyi - Lead Performance Engineer.md` (the résumé, with base64 images embedded — read it with `awk` filtering long lines, not `Read`, or it will blow out the context window). When the résumé changes, the corresponding section in `index.html` has to be updated by hand.

Some hero content is interpretation rather than résumé text — the four `data-count` stats, the availability badge, and the "Position on AI" note. Treat those as the site owner's positioning, not facts to re-derive.

### Theme

Dark is the default and is set as `<html data-theme="dark">`. An inline script in `<head>` reads `localStorage.theme` and applies it **before first paint** — that script must stay inline and stay in the head, or the page flashes the wrong theme on load. `main.js` re-asserts the same value on init and owns the toggle. `prefers-color-scheme` is deliberately ignored; dark is the default regardless of OS setting.

### Progressive enhancement

The page is expected to remain useful without JavaScript, and three mechanisms keep that true:

- Experience entries are native `<details>`/`<summary>` — they expand with no JS.
- The Projects panel is a `hidden` div driven by a button, so a `<noscript>` block in `<head>` un-hides it and hides the button.
- `.reveal` elements start at `opacity: 0`; the same `<noscript>` block and the `prefers-reduced-motion` query both force them visible. Any new `.reveal` element inherits this for free — but an element that is animated in some *other* way needs its own reduced-motion fallback.

`#projects` in the URL auto-expands the panel, but only on a full page load (the handler runs once at init, not on `hashchange`).

## Conventions

- Vanilla HTML/CSS/JS with zero runtime dependencies — this is a deliberate constraint, not an accident of the site being small. Do not introduce a framework, a build step, or a CDN script tag without being asked.
- Icons are inline SVG with `fill: none; stroke: currentColor` set globally in CSS; SVG markup in HTML carries only `viewBox` and path data.
- Fonts (Inter, JetBrains Mono) are the one external request, from Google Fonts.
