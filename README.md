# Tin Caballes · Portfolio

A one-page portfolio: plain HTML and CSS, no frameworks and no JavaScript. It publishes to GitHub Pages automatically.

## What's in here

| Path | What it is |
| --- | --- |
| `src/index.html` | All page content. Edit text here. |
| `src/styles.css` | All styling. Colours and fonts are set at the top. |
| `src/assets/img/` | The five dashboard mockups (vector images with sample data). |
| `src/assets/fonts/` | Self-hosted fonts, trimmed to the characters the page uses. |
| `build.mjs` | Prepares the site for publishing (see "Why it loads fast"). |
| `.github/workflows/deploy.yml` | Publishes the site whenever `main` changes. |

## Preview on your computer

You need [Node.js](https://nodejs.org) 18 or newer, plus Python 3 (only for the preview server).

```bash
npm run preview
```

Then open http://localhost:8000. You can also open `src/index.html` straight in a browser; it works without building.

## Publish on GitHub Pages

One-time setup:

1. On GitHub, open the repository's **Settings**, then **Pages**.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.

After that, every change merged into `main` goes live in about a minute. The address appears in the **Actions** tab and on the Pages settings screen, normally `https://<your-username>.github.io/portfolio-cmic/`.

Pull requests are built as a check, but only `main` is published.

## Before you share the link

The build prints a warning for any placeholder that is still in the page. Replace these in `src/index.html`:

- [ ] **LinkedIn URL** (hero button and footer): `https://www.linkedin.com/in/TODO-your-linkedin-handle/`
- [ ] **Email** (hero button and footer): `mailto:TODO-your-email@example.com`
- [ ] **TÜV "Verify certificate" link**: `TODO-verify-certificate-url`
- [ ] **Case study link** at the bottom of Projects: `TODO-case-study-url`
- [ ] **Your photo**: save it as `src/assets/img/tin.webp` (about 432 × 540 px), then swap the placeholder `<div class="photo">` for the `<img>` line in the comment just above it.

## Swapping in real dashboard screenshots

The mockups are drawn with sample numbers. To use your own:

1. Export each screenshot at **1200 × 760** px (twice the display size, so it stays sharp on phones and retina screens).
2. Save it as `.webp`, ideally under 120 KB, in `src/assets/img/`.
3. Change the `src` of the matching `<img>` in `src/index.html`. Keep `width="600" height="380"`, which reserves the space so the page does not jump while images load.

## Why it loads fast

- **No render-blocking requests.** The build inlines the CSS into the HTML, so the first screen draws after a single download. The page is about 7.5 KB compressed.
- **Small, self-hosted fonts.** About 40 KB in total, with no trip to Google Fonts. A size-matched fallback font is shown while they load, so text does not jump when the real fonts arrive.
- **Images wait their turn.** Dashboard images only download as you scroll near them, and their size is reserved in advance.
- **No JavaScript.** The scroll fade-ins are pure CSS. Browsers that do not support them, and visitors who turn off motion, simply see the content.

Measured on a throttled phone (slow 4G, 4× slower CPU): first content in about 0.5 s and zero layout shift.
