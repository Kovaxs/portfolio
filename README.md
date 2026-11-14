# Terminal CV — Astro

A static Astro port of `../draft-v3-neofetch.html`. The original file is unchanged.

## Requirements

Node.js 22.12 or newer and npm. For production, use a supported Node.js LTS release.

## Run locally

From this directory:

```sh
npm install --ignore-scripts
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

- `.github/workflows/deploy.yml` — checked static build and GitHub Pages deployment on pushes to `main` or manual runs.
- `astro.config.mjs` — static output, production URL (`https://kovaxs.dev`), and Tailwind integration.
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

## GitHub Pages and custom domain

The production URL is **https://kovaxs.dev**. Astro's `site` and page canonical links use this URL. Keep `base` unset: the custom domain serves the site at `/`, not `/portfolio/`.

The deployment workflow uses Node.js 24, installs the lockfile with `npm ci --ignore-scripts`, runs `npm run build` (including diagnostics), and uploads only `dist/`. Official GitHub actions are pinned to commit hashes. Only the deployment job receives Pages write and identity-token permissions; no personal access token or repository secret is needed.

1. In [repository Settings → Pages](https://github.com/Kovaxs/portfolio/settings/pages), select **GitHub Actions** as the source and set **Custom domain** to `kovaxs.dev`. These settings are configured separately from the repository files. A `CNAME` file is not required or used for an Actions deployment.
2. At the DNS provider, replace conflicting parking records for `@` and `www` with:

   | Type | Name | Value |
   | --- | --- | --- |
   | A | `@` | `185.199.108.153` |
   | A | `@` | `185.199.109.153` |
   | A | `@` | `185.199.110.153` |
   | A | `@` | `185.199.111.153` |
   | CNAME | `www` | `kovaxs.github.io` |

   Remove conflicting apex `AAAA` records unless they point to [GitHub Pages' IPv6 addresses](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site). Keep unrelated email and verification records. On Cloudflare DNS, use **DNS only**, not the proxy, for these records. Cloudflare DNS can manage the domain while GitHub Pages hosts the site; Cloudflare Pages is not needed.
3. Push the configuration commit to `main`; subsequent pushes deploy automatically. You can also run **Deploy to GitHub Pages** manually from the Actions tab after the workflow is on `main`.
4. Once DNS resolves and GitHub issues a certificate, enable **Enforce HTTPS** in Pages settings. DNS and certificate issuance can take up to 24 hours. `.dev` domains require HTTPS in browsers, so the domain will not work until the certificate is ready.

For takeover protection, [verify domain ownership in your GitHub account's Pages settings](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages) using GitHub's generated TXT record. Do not add wildcard DNS records. Set the custom domain in GitHub before pointing DNS at Pages.

## Accessibility and progressive enhancement

Without JavaScript, all content remains visible and the toroid has static fallback artwork. With JavaScript, `neofetch` types on load, then further downward scrolling types the next command and reveals its output. The terminal grows without intercepting scrolling; the continue button also works with touch and keyboard. “Show all” bypasses the sequence. Deep links, browser find, printing, and restored history navigation expose the full content.

The live clock uses the visitor's local time. Reduced-motion users see all content immediately, without typing or reveal animations; particles, toroid rotation, scanlines, blinking, and smooth scrolling also stop. Background visual animations pause in inactive tabs. Links and buttons have visible focus outlines.

SVG icon paths are derived from Lucide/Feather; see `LICENSE-ICONS.txt`.
