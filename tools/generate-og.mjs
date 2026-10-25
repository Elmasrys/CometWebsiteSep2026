// Renders the 1200x630 social images in public/images/og/ and the square logo used in structured data.
// Run after changing a page title or adding an Insight:
//   CHROMIUM_PATH=/path/to/chromium node tools/generate-og.mjs
// (Uses playwright-core with an existing Chromium; it does not download a browser.)
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from 'playwright-core';
import { build } from '../build.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC = path.join(ROOT, 'public');
const OUT = path.join(PUBLIC, 'images', 'og');
fs.mkdirSync(OUT, { recursive: true });
const asset = rel => pathToFileURL(path.join(PUBLIC, rel)).href;

const glyphFor = { 'value-creation': 'shen', 'work-redesign': 'akhet', 'operating-model': 'columns', 'venture-building': 'switch' };
const icons = fs.readFileSync(path.join(PUBLIC, 'images', 'icons.svg'), 'utf8');
const symbol = id => icons.match(new RegExp(`<symbol id="${id}"([^>]*)>([\\s\\S]*?)</symbol>`)).slice(1).reduce((attrs, inner) => `<svg class="glyph"${attrs}>${inner}</svg>`);
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

function card({ eyebrow, title, footer, variant = 'light', glyph, image }) {
  const dark = variant === 'dark';
  return `<!doctype html><html><head><style>
@font-face{font-family:Inter;src:url(${asset('fonts/inter-latin-var.woff2')});font-weight:100 900}
@font-face{font-family:Cormorant;src:url(${asset('fonts/cormorant-garamond-latin-var.woff2')});font-weight:300 700}
*{box-sizing:border-box;margin:0}
body{width:1200px;height:630px;overflow:hidden;background:${dark ? '#101010' : '#FFFFFF'};color:${dark ? '#F5F4F1' : '#101010'};font-family:Inter;display:flex}
.main{flex:1;padding:64px 72px 56px;display:flex;flex-direction:column}
.logo{width:190px}
.eyebrow{margin-top:auto;font-size:17px;letter-spacing:.22em;text-transform:uppercase;color:${dark ? '#A7A19A' : '#44423F'};font-weight:500}
h1{font-family:Cormorant;font-weight:400;font-size:${title.length > 60 ? 60 : 72}px;line-height:1;letter-spacing:-.01em;margin:22px 0 40px;max-width:${dark ? 620 : image || glyph ? 760 : 980}px}
.foot{display:flex;justify-content:space-between;border-top:1px solid ${dark ? 'rgba(255,255,255,.25)' : 'rgba(16,16,16,.85)'};padding-top:20px;font-size:17px;letter-spacing:.06em;color:${dark ? 'rgba(255,255,255,.72)' : '#44423F'}}
.side{width:400px;position:relative;overflow:hidden;background:#101010}
.side img{width:100%;height:100%;object-fit:cover;object-position:68% 58%}
.glyph{position:absolute;right:72px;top:64px;width:120px;height:120px;color:#101010}
.eclipse{position:absolute;right:120px;top:120px;width:260px;height:260px;border-radius:50%;background:#050505;box-shadow:0 0 0 1px rgba(255,255,255,.42),0 0 40px 4px rgba(255,255,255,.16),0 0 140px 30px rgba(202,196,188,.1)}
</style></head><body>
<div class="main">
<img class="logo" src="${asset(dark ? 'comet-lockup-horizontal-white.svg' : 'comet-lockup-horizontal-carbon.svg')}">
<div class="eyebrow">${esc(eyebrow)}</div>
<h1>${esc(title).replace(/(\S+-\S+)/g, "<span style=\"white-space:nowrap\">$1</span>")}</h1>
<div class="foot"><span>${esc(footer)}</span><span>comet-innovations.com</span></div>
</div>
${image ? `<div class="side"><img src="${asset(image)}"></div>` : ''}
${glyph ? symbol(glyph) : ''}
${dark ? '<div class="eclipse"></div>' : ''}
</body></html>`;
}

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'comet-og-'));
const dist = path.join(tmp, 'dist');
const { pageMeta, ctx } = build(dist, { quiet: true, checkImages: false });
const h1Of = file => (fs.readFileSync(path.join(dist, file), 'utf8').match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1] || '').replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').trim();
const category = ctx.site.category;

const jobs = [
  { file: 'default', eyebrow: category, title: ctx.site.question, footer: ctx.site.name },
  { file: 'home', eyebrow: category, title: 'Helping organisations navigate, lead and build in the AI economy.', footer: 'Advise · Educate · Engineer', image: 'images/home-hero-960.webp' },
];
for (const page of pageMeta) {
  const slug = page.ogImage?.match(/\/images\/og\/(.+)\.png$/)?.[1];
  if (!slug || jobs.some(j => j.file === slug)) continue;
  if (page.article) {
    const a = page.article;
    jobs.push({ file: slug, eyebrow: `Insight · ${a.category}`, title: a.title, footer: `${a.author.name}, ${a.author.title}` });
  } else {
    jobs.push({
      file: slug,
      eyebrow: page.heading === 'Research & Development' ? 'Research & Development' : page.parent ? `${page.parent.name} · ${page.heading}` : page.heading,
      title: page.ogHeadline ? page.ogHeadline : page.heading === 'Research & Development' ? 'Stateful AI orchestration.' : page.path === '/about' ? `An ${category} firm based in London.` : h1Of(page.file),
      footer: ctx.site.name,
      glyph: glyphFor[slug],
      variant: slug === 'research-and-development' ? 'dark' : 'light',
    });
  }
}

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium' });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
for (const job of jobs) {
  const html = path.join(tmp, `${job.file}.html`);
  fs.writeFileSync(html, card(job));
  await page.goto(pathToFileURL(html).href, { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(OUT, `${job.file}.png`) });
}

// Square logo for Organization structured data.
await page.setViewportSize({ width: 512, height: 512 });
await page.setContent(`<body style="margin:0;width:512px;height:512px;display:grid;place-items:center;background:#FFFFFF"><img src="${asset('comet-icon-carbon.svg')}" style="width:360px"></body>`);
await page.waitForTimeout(100);
await page.screenshot({ path: path.join(PUBLIC, 'images', 'comet-logo-512.png') });
await browser.close();
fs.rmSync(tmp, { recursive: true, force: true });
console.log(`Wrote ${jobs.length} social images and the square logo.`);
