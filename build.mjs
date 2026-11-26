// Builds the site from src/ into dist/. No dependencies, needs Node 18 or newer.
//
//   node build.mjs
//
// What it does, all aimed at a faster first load:
//   1. Minifies styles.css and inlines it into index.html (no render-blocking CSS request).
//   2. Strips comments and extra whitespace from the HTML.
//   3. Copies fonts, images and the favicon as they are.
//   4. Warns about placeholder links (anything containing "TODO") still left in the page.

import { cp, mkdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { gzipSync } from "node:zlib";

const SRC = "src";
const OUT = "dist";
const CSS_LINK = '<link rel="stylesheet" href="styles.css">';

function minifyCss(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, "") // comments
    .replace(/\s+/g, " ") // collapse whitespace
    .replace(/\s*([{};,>])\s*/g, "$1") // spaces around punctuation
    .replace(/:\s+/g, ":") // space after a colon (never before one, that would break selectors)
    .replace(/;}/g, "}")
    .trim();
}

function minifyHtml(html) {
  return html
    .replace(/<!--[\s\S]*?-->/g, "") // comments
    .replace(/\s+/g, " ") // collapse whitespace (the page has no <pre> or <textarea>)
    .replace(/>\s+</g, "><")
    .trim();
}

const kb = (bytes) => `${(bytes / 1024).toFixed(1)} KB`;

await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });
await cp(`${SRC}/assets`, `${OUT}/assets`, { recursive: true });
await cp(`${SRC}/favicon.svg`, `${OUT}/favicon.svg`);

const css = minifyCss(await readFile(`${SRC}/styles.css`, "utf8"));
let html = await readFile(`${SRC}/index.html`, "utf8");
if (!html.includes(CSS_LINK)) {
  throw new Error(`Could not find ${CSS_LINK} in ${SRC}/index.html`);
}
html = minifyHtml(html).replace(CSS_LINK, () => `<style>${css}</style>`);
await writeFile(`${OUT}/index.html`, html);

// ---- Report ----
const page = Buffer.byteLength(html);
console.log(`Built ${OUT}/index.html: ${kb(page)} (${kb(gzipSync(html).length)} gzipped, CSS included)`);
for (const f of ["plus-jakarta-sans.woff2", "ibm-plex-mono-600.woff2", "ibm-plex-mono-400.woff2"]) {
  console.log(`  font ${f}: ${kb((await stat(`${OUT}/assets/fonts/${f}`)).size)}`);
}

const todos = [...new Set([...html.matchAll(/(?:href|src)="([^"]*TODO[^"]*)"/g)].map((m) => m[1]))];
if (todos.length) {
  console.warn(`\nHeads up: ${todos.length} placeholder link(s) still need a real URL in ${SRC}/index.html:`);
  for (const t of todos) console.warn(`  - ${t}`);
}
