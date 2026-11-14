# Terminal CV — Astro

A static Astro port of `../draft-v3-neofetch.html`. The original file is unchanged.

## Requirements

Node.js 22.12 or newer and npm. For production, use a supported Node.js LTS release.

## Run locally

From this directory:

```sh
npm install
npm run dev
```

Open the local URL printed by Astro (normally `http://localhost:4321`).

## Check and build

```sh
npm run check
npm run build
npm run preview
```

`build` runs Astro's diagnostics, then generates the static site in `dist/`.
Deploy that directory to a static host. No server adapter, React, or backend is needed.

## Files

- `src/pages/index.astro` — portfolio markup.
- `src/data/cv.ts` — profile, skills, education, experience, projects, publications, and conferences transcribed from `cv.tex`.
- `public/oleksandr_kovalyk_cv.pdf` — downloadable résumé compiled from `cv.tex`.
- `src/layouts/BaseLayout.astro` — document shell, metadata, and font loading.
- `src/styles/global.css` — Tailwind v4, Gruvbox palette, and terminal effects.
- `src/scripts/terminal.js` — particles, ASCII toroid, and local clock.
- `src/scripts/terminal-reveal.js` — initial command typing and scroll-triggered section reveals.
- `src/components/TerminalCommand.astro` — accessible terminal command prompts.
- `src/components/Icon.astro` — build-time SVG icons, replacing the Iconify CDN.
- `public/` — files copied directly into the build, such as a résumé PDF.

Tailwind runs at build time through its Vite plugin. Browser JavaScript is bundled by Astro, with no UI framework hydration. Google Fonts is still an external request; self-host JetBrains Mono if offline loading is required.

## Before publishing

The portfolio uses Oleksandr Kovalyk Borodyak's details from `cv.tex`, with matching page metadata and working PDF download links. Content is transcribed, not parsed automatically: when updating the CV, update `src/data/cv.ts` and recompile `public/oleksandr_kovalyk_cv.pdf` as well. Project cards without a URL in the CV are intentionally not linked.

Set Astro's `site` and, if needed, `base` in `astro.config.mjs` for your deployment URL.

## Accessibility and progressive enhancement

Without JavaScript, all content remains visible and the toroid has static fallback artwork. With JavaScript, `neofetch` types on load, then further downward scrolling types the next command and reveals its output. The terminal grows without intercepting scrolling; the continue button also works with touch and keyboard. “Show all” bypasses the sequence. Deep links, browser find, printing, and restored history navigation expose the full content.

The live clock uses the visitor's local time. Reduced-motion users see all content immediately, without typing or reveal animations; particles, toroid rotation, scanlines, blinking, and smooth scrolling also stop. Background visual animations pause in inactive tabs. Links and buttons have visible focus outlines.

SVG icon paths are derived from Lucide/Feather; see `LICENSE-ICONS.txt`.
