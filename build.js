// Builds the static site into dist/: renders src/pages and src/insights through the
// shared layout with the content in src/content, then copies the assets in public/.
// Run with `npm run build` (Railway runs it on every deploy).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(ROOT, 'src');
const PUBLIC = path.join(ROOT, 'public');
export const DIST = path.join(ROOT, 'dist');

const readSrc = file => fs.readFileSync(path.join(SRC, file), 'utf8');
const readJson = file => JSON.parse(readSrc(`content/${file}`));

// ---------- Templates ----------
// {{key}} escaped, {{{key}}} raw, {{#key}}…{{/key}} section (loops arrays), {{^key}}…{{/key}} inverse,
// {{> partial}} include from src/partials. A missing {{key}} fails the build: nothing ships half-filled.

const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
export const escapeHtml = value => String(value).replace(/[&<>"']/g, c => ESCAPES[c]);

const lookup = (ctx, key) => (key === '.' ? ctx['.'] : key.split('.').reduce((o, k) => (o == null ? undefined : o[k]), ctx));
const present = v => (Array.isArray(v) ? v.length > 0 : Boolean(v));
const expandPartials = tpl => tpl.replace(/\{\{>\s*([\w/-]+)\s*\}\}/g, (_, name) => expandPartials(readSrc(`partials/${name}.html`)));

export function render(tpl, ctx, name = 'template') {
  const sections = expandPartials(tpl).replace(
    /\{\{([#^])\s*([\w.]+)\s*\}\}([\s\S]*?)\{\{\/\s*\2\s*\}\}/g,
    (_, type, key, inner) => {
      const v = lookup(ctx, key);
      if (type === '^') return present(v) ? '' : render(inner, ctx, name);
      if (!present(v)) return '';
      if (Array.isArray(v)) {
        return v.map((item, i) => render(inner, { ...ctx, ...(typeof item === 'object' ? item : {}), '.': item, index: i + 1 }, name)).join('');
      }
      return render(inner, typeof v === 'object' ? { ...ctx, ...v } : ctx, name);
    },
  );
  const value = key => {
    const v = lookup(ctx, key);
    if (v === undefined || v === null || v === '') throw new Error(`${name}: no value for {{${key}}}`);
    return v;
  };
  return sections
    .replace(/\{\{\{\s*([\w.]+)\s*\}\}\}/g, (_, k) => String(value(k)))
    .replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_, k) => escapeHtml(value(k)));
}

// ---------- Markdown (the small subset the Insights use) ----------
// ## / ### headings, paragraphs, "- " lists, "1. " ordered lists, "? " question lists,
// "| " stacked lines, ">> " key question, "> " pull quote, "::: diagram name" for src/partials/diagrams/name.html.

const slugify = s => s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const inline = s =>
  escapeHtml(s)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>');

export function markdown(src, ctx) {
  return src
    .replace(/\r/g, '')
    .trim()
    .split(/\n\s*\n/)
    .map(block => {
      const lines = block.split('\n').map(l => l.trim());
      const all = re => lines.every(l => re.test(l));
      const items = (re, tag, cls = '') =>
        `<${tag}${cls ? ` class="${cls}"` : ''}>${lines.map(l => `<li>${inline(l.replace(re, ''))}</li>`).join('')}</${tag}>`;
      const diagram = lines[0].match(/^:::\s*diagram\s+([\w-]+)$/);
      if (diagram) return render(readSrc(`partials/diagrams/${diagram[1]}.html`), ctx, `diagram ${diagram[1]}`);
      if (lines.length === 1 && lines[0].startsWith('## ')) {
        const text = lines[0].slice(3);
        return `<h2 id="${slugify(text)}">${inline(text)}</h2>`;
      }
      if (lines.length === 1 && lines[0].startsWith('### ')) return `<h3>${inline(lines[0].slice(4))}</h3>`;
      if (all(/^- /)) return items(/^- /, 'ul');
      if (all(/^\d+\. /)) return items(/^\d+\. /, 'ol');
      if (all(/^\? /)) return items(/^\? /, 'ul', 'questions');
      if (all(/^\| /)) return `<p class="lines">${lines.map(l => inline(l.slice(2))).join('<br>')}</p>`;
      if (all(/^>> /)) return `<p class="key-question">${inline(lines.map(l => l.slice(3)).join(' '))}</p>`;
      if (all(/^> /)) return `<blockquote class="pull-quote"><p>${inline(lines.map(l => l.slice(2)).join(' '))}</p></blockquote>`;
      return `<p>${inline(lines.join(' '))}</p>`;
    })
    .join('\n');
}

// ---------- Content ----------

const formatDate = iso =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

function loadContent() {
  const site = readJson('site.json');
  const legal = readJson('legal.json');
  const { people } = readJson('people.json');
  const faq = readJson('faq.json');
  const { forthcoming } = readJson('insights.json');

  legal.addressLine = legal.registeredAddress.join(', ');
  legal.lastUpdatedLabel = legal.lastUpdated ? formatDate(legal.lastUpdated) : '';
  for (const person of people) person.profileUrl = `/about.html#${person.slug}`;

  const insights = fs
    .readdirSync(path.join(SRC, 'insights'))
    .filter(f => f.endsWith('.md'))
    .map(file => {
      const [, front, body] = readSrc(`insights/${file}`).match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
      const meta = JSON.parse(front);
      const author = people.find(p => p.slug === meta.author);
      if (!author) throw new Error(`${file}: unknown author "${meta.author}"`);
      const words = body.replace(/[#>*|?:-]/g, ' ').split(/\s+/).filter(Boolean).length;
      return { ...meta, body, author, url: `/insights/${meta.slug}.html`, dateLabel: formatDate(meta.date), readingTime: Math.max(1, Math.round(words / 200)) };
    })
    .sort((a, b) => a.order - b.order);
  for (const insight of insights) insight.related = insights.find(i => i.slug === insight.related);
  for (const person of people) {
    person.authored = insights.filter(i => i.author.slug === person.slug);
    person.hasAuthored = person.authored.length > 0;
  }

  const hasServiceProviders = present(legal.serviceProviders);
  return { site, legal, people, founder: people[0], faq, insights, forthcoming, hasServiceProviders, year: new Date().getFullYear() };
}

/** Facts the legal pages need that are not yet confirmed. Listed at build time, never published as placeholders. */
export function missingLegalFacts(legal) {
  const required = {
    entityName: 'Legal entity name',
    companyNumber: 'Company number',
    registeredAddress: 'Registered address',
    privacyEmail: 'Privacy contact email',
    retentionPeriod: 'Data retention period',
    governingLaw: 'Governing law',
  };
  return Object.entries(required).filter(([key]) => !present(legal[key])).map(([, label]) => label);
}

// ---------- Structured data ----------

const jsonLd = data => `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;

function organisationLd({ site, legal, founder }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.name,
    legalName: legal.entityName || undefined,
    ...(site.url ? { url: site.url } : {}),
    description: `${site.name} is an ${site.category} firm.`,
    sameAs: [site.linkedin].filter(Boolean),
    founder: { '@type': 'Person', name: founder.name, jobTitle: founder.title, sameAs: [founder.linkedin].filter(Boolean) },
    address: { '@type': 'PostalAddress', addressLocality: 'London', addressCountry: 'GB' },
  };
}

function faqLd(faq) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map(({ question, answer }) => ({ '@type': 'Question', name: question, acceptedAnswer: { '@type': 'Answer', text: answer } })),
  };
}

function articleLd(article, { site }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.standfirst,
    datePublished: article.date,
    articleSection: article.category,
    author: { '@type': 'Person', name: article.author.name, jobTitle: article.author.title },
    publisher: { '@type': 'Organization', name: site.name },
  };
}

// ---------- Pages ----------

/** Root-relative URLs everywhere, so pages in /insights/ resolve assets and links correctly. */
function absolutise(html) {
  const fix = url => (/^(https?:|\/|#|mailto:|tel:|data:)/.test(url) ? url : `/${url}`);
  return html
    .replace(/\s(href|src)="([^"]*)"/g, (_, attr, url) => ` ${attr}="${fix(url)}"`)
    .replace(/\ssrcset="([^"]*)"/g, (_, set) => ` srcset="${set.split(',').map(s => s.trim().replace(/^(\S+)/, fix)).join(', ')}"`);
}

/** Marks the current page in the main navigation. */
function markCurrent(html, navPath) {
  return html.replace(/(<nav class="nav"[\s\S]*?<\/nav>)/, nav =>
    nav.replace(new RegExp(`href="${navPath.replace(/[.]/g, '\\.')}"`, 'g'), `href="${navPath}" aria-current="page"`),
  );
}

function renderPage({ ctx, page, main, file }) {
  const layout = render(readSrc('layout.html'), { ...ctx, page, main }, `layout (${file})`);
  return markCurrent(absolutise(layout), page.nav || page.path);
}

export function build(outDir = DIST, { quiet = false } = {}) {
  const ctx = loadContent();
  fs.rmSync(outDir, { recursive: true, force: true });
  fs.cpSync(PUBLIC, outDir, { recursive: true });
  const written = [];
  const write = (rel, html) => {
    if (/\{\{|\[[A-Z][A-Z /]{3,}\]/.test(html)) throw new Error(`${rel}: unrendered template tag or placeholder in output`);
    const out = path.join(outDir, rel);
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, html);
    written.push(rel);
  };

  for (const file of fs.readdirSync(path.join(SRC, 'pages')).filter(f => f.endsWith('.html'))) {
    const source = readSrc(`pages/${file}`);
    const [, metaJson, body] = source.match(/^<!--meta (.*?) -->\n([\s\S]*)$/);
    const page = { ...JSON.parse(metaJson), path: `/${file}` };
    const structured = [];
    if (page.structuredData?.includes('organisation')) structured.push(jsonLd(organisationLd(ctx)));
    if (page.structuredData?.includes('faq')) structured.push(jsonLd(faqLd(ctx.faq)));
    page.head = structured.join('\n');
    write(file, renderPage({ ctx, page, main: render(body, { ...ctx, page }, file), file }));
  }

  const articleTpl = readSrc('partials/article-page.html');
  for (const article of ctx.insights) {
    const articleCtx = { ...ctx, article, bodyHtml: markdown(article.body, { ...ctx, article }) };
    const page = {
      title: article.title,
      description: article.standfirst,
      path: article.url,
      nav: '/insights.html',
      ogType: 'article',
      head: jsonLd(articleLd(article, ctx)),
    };
    write(article.url.slice(1), renderPage({ ctx: articleCtx, page, main: render(articleTpl, articleCtx, article.slug), file: article.slug }));
  }

  if (!quiet) {
    console.log(`Built ${written.length} pages into ${path.relative(ROOT, outDir) || outDir}/`);
    const missing = missingLegalFacts(ctx.legal);
    if (missing.length) console.warn(`Legal facts not yet confirmed (omitted from the site): ${missing.join(', ')}`);
  }
  return { pages: written, ctx };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) build();
