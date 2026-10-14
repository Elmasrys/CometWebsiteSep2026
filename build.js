// Builds the static site into dist/: renders src/pages and src/insights through the
// shared layout with the content in src/content, then copies the assets in public/.
// Run with `npm run build` (Railway runs it on every deploy).
import crypto from 'node:crypto';
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
// "| " stacked lines, ":: " definition, ">> " key question, "> " pull quote, "::: diagram name" for src/partials/diagrams/name.html.

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
      if (all(/^:: /)) return `<p class="definition">${inline(lines.map(l => l.slice(3)).join(' '))}</p>`;
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
  const { cases } = readJson('cases.json');

  site.url = (process.env.SITE_URL || site.url).replace(/\/$/, '');
  legal.addressLine = legal.registeredAddress.join(', ');
  legal.lastUpdatedLabel = legal.lastUpdated ? formatDate(legal.lastUpdated) : '';
  for (const person of people) person.profileUrl = `/about#${person.slug}`;

  const insights = fs
    .readdirSync(path.join(SRC, 'insights'))
    .filter(f => f.endsWith('.md'))
    .map(file => {
      const [, front, body] = readSrc(`insights/${file}`).match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
      const meta = JSON.parse(front);
      const author = people.find(p => p.slug === meta.author);
      if (!author) throw new Error(`${file}: unknown author "${meta.author}"`);
      const words = body.replace(/\[(.+?)\]\(.+?\)/g, '$1').replace(/[#>*|?:-]/g, ' ').split(/\s+/).filter(Boolean).length;
      const modified = meta.modified && meta.modified !== meta.date ? meta.modified : '';
      return {
        ...meta,
        body,
        author,
        words,
        url: `/insights/${meta.slug}`,
        dateLabel: formatDate(meta.date),
        modified,
        modifiedLabel: modified ? formatDate(modified) : '',
        readingTime: Math.max(1, Math.round(words / 200)),
      };
    })
    .sort((a, b) => a.order - b.order);
  for (const insight of insights) insight.related = insights.find(i => i.slug === insight.related);
  for (const person of people) {
    person.authored = insights.filter(i => i.author.slug === person.slug);
    person.hasAuthored = person.authored.length > 0;
  }

  const hasServiceProviders = present(legal.serviceProviders);
  return { site, legal, people, founder: people[0], faq, insights, forthcoming, cases, hasServiceProviders, year: new Date().getFullYear() };
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

// ---------- URLs ----------

/** Clean public path for a source file: index.html -> /, about.html -> /about. */
const cleanPath = file => (file === 'index.html' ? '/' : `/${file.replace(/\.html$/, '')}`);

/** Root-relative, extension-free URLs everywhere: "about.html#people" -> "/about#people". */
function normaliseLinks(html) {
  const fix = url => {
    if (/^(https?:|#|mailto:|tel:|data:)/.test(url)) return url;
    let u = url.startsWith('/') ? url : `/${url}`;
    u = u.replace(/^([^?#]*?)\.html(?=$|[?#])/, '$1');
    return u.replace(/^\/index(?=$|[?#])/, '/');
  };
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

/** Cache-busting query strings for the unhashed CSS and JS files, so they can be cached for a year. */
function assetVersions() {
  const hash = file => crypto.createHash('sha256').update(fs.readFileSync(path.join(PUBLIC, file))).digest('hex').slice(0, 10);
  return Object.fromEntries(['styles.css', 'script.js', 'head.js'].map(f => [f, hash(f)]));
}

// ---------- Structured data ----------

const jsonLd = graph => `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c')}</script>`;

export function ids(site, founder) {
  return {
    organisation: `${site.url}/#organization`,
    website: `${site.url}/#website`,
    logo: `${site.url}/#logo`,
    person: `${site.url}/about#${founder.slug}`,
  };
}

function areaServed(site) {
  return site.marketsServed.map(m => ({ '@type': m.type, name: m.name }));
}

function organisationNode({ site, legal, founder }) {
  const id = ids(site, founder);
  return {
    '@type': 'Organization',
    '@id': id.organisation,
    name: site.name,
    ...(legal.entityName ? { legalName: legal.entityName } : {}),
    url: `${site.url}/`,
    logo: { '@type': 'ImageObject', '@id': id.logo, url: `${site.url}${site.logo.url}`, width: site.logo.width, height: site.logo.height, caption: site.name },
    image: { '@id': id.logo },
    description: site.description,
    slogan: site.question,
    address: { '@type': 'PostalAddress', addressLocality: 'London', addressCountry: 'GB' },
    areaServed: areaServed(site),
    contactPoint: { '@type': 'ContactPoint', contactType: 'New business enquiries', url: `${site.url}/contact`, availableLanguage: 'English', areaServed: areaServed(site) },
    sameAs: [site.linkedin].filter(Boolean),
    founder: { '@id': id.person },
    knowsAbout: site.knowsAbout,
    ...(legal.companyNumber ? { identifier: { '@type': 'PropertyValue', propertyID: 'Companies House company number', value: legal.companyNumber } } : {}),
  };
}

function websiteNode({ site, founder }) {
  const id = ids(site, founder);
  return { '@type': 'WebSite', '@id': id.website, url: `${site.url}/`, name: site.name, description: site.description, publisher: { '@id': id.organisation }, inLanguage: 'en-GB' };
}

function personNode(person, { site, founder }) {
  const id = ids(site, founder);
  return {
    '@type': 'Person',
    '@id': `${site.url}${person.profileUrl}`,
    name: person.name,
    jobTitle: person.title,
    worksFor: { '@id': id.organisation },
    url: `${site.url}${person.profileUrl}`,
    ...(person.portrait ? { image: `${site.url}/${person.portrait.replace(/^\//, '')}` } : {}),
    description: person.bio[0],
    sameAs: [person.linkedin].filter(Boolean),
    knowsAbout: person.expertise,
  };
}

function breadcrumbNode(url, crumbs) {
  return {
    '@type': 'BreadcrumbList',
    '@id': `${url}#breadcrumb`,
    itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: c.url })),
  };
}

function pageGraph(ctx, page) {
  const { site, founder } = ctx;
  const id = ids(site, founder);
  const url = `${site.url}${page.path}`;
  const crumbs = [{ name: 'Home', url: `${site.url}/` }];
  if (page.parent) crumbs.push({ name: page.parent.name, url: `${site.url}${page.parent.path}` });
  if (page.path !== '/') crumbs.push({ name: page.breadcrumb || page.heading, url });

  const graph = [organisationNode(ctx), websiteNode(ctx)];
  const webPage = {
    '@type': page.pageType || 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: page.title,
    description: page.description,
    isPartOf: { '@id': id.website },
    inLanguage: 'en-GB',
    primaryImageOfPage: { '@type': 'ImageObject', url: `${site.url}${page.ogImage}`, width: 1200, height: 630 },
    ...(page.path === '/' || page.path === '/about' ? { about: { '@id': id.organisation } } : {}),
    ...(page.updated ? { dateModified: page.updated } : {}),
    ...(page.path !== '/' ? { breadcrumb: { '@id': `${url}#breadcrumb` } } : {}),
  };
  graph.push(webPage);
  if (page.path !== '/') graph.push(breadcrumbNode(url, crumbs));

  for (const kind of page.schema || []) {
    if (kind === 'person') for (const person of ctx.people) graph.push(personNode(person, ctx));
    if (kind === 'faq') {
      graph.push({
        '@type': 'FAQPage',
        '@id': `${url}#faq`,
        url: `${url}#faq`,
        isPartOf: { '@id': id.website },
        mainEntity: ctx.faq.map(({ question, answer }) => ({ '@type': 'Question', name: question, acceptedAnswer: { '@type': 'Answer', text: answer } })),
      });
    }
    if (kind === 'service') {
      const s = page.service;
      graph.push({ '@type': 'Service', '@id': `${url}#service`, name: s.name, serviceType: s.serviceType, description: s.description, provider: { '@id': id.organisation }, areaServed: areaServed(site), url });
      webPage.mainEntity = { '@id': `${url}#service` };
    }
    if (kind === 'term') {
      for (const term of page.terms) graph.push({ '@type': 'DefinedTerm', '@id': `${url}#${term.id}`, name: term.name, description: term.description, url: `${url}#${term.id}` });
    }
    if (kind === 'insights') {
      webPage.mainEntity = {
        '@type': 'ItemList',
        itemListElement: ctx.insights.map((a, i) => ({ '@type': 'ListItem', position: i + 1, url: `${site.url}${a.url}`, name: a.title })),
      };
    }
  }

  if (page.article) {
    const a = page.article;
    graph.push(personNode(a.author, ctx));
    graph.push({
      '@type': 'Article',
      '@id': `${url}#article`,
      headline: a.title,
      description: a.standfirst,
      datePublished: a.date,
      dateModified: a.modified || a.date,
      author: { '@id': `${site.url}${a.author.profileUrl}` },
      publisher: { '@id': id.organisation },
      image: [`${site.url}${page.ogImage}`],
      mainEntityOfPage: { '@id': `${url}#webpage` },
      isPartOf: { '@id': id.website },
      articleSection: a.category,
      wordCount: a.words,
      inLanguage: 'en-GB',
    });
  }
  return graph;
}

// ---------- Discovery files ----------

function sitemapXml(site, entries) {
  const urls = entries
    .map(e => `  <url>\n    <loc>${site.url}${e.path}</loc>${e.lastmod ? `\n    <lastmod>${e.lastmod}</lastmod>` : ''}\n  </url>`)
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

function robotsTxt(site) {
  const { search, training } = site.crawlers;
  return [
    `# Crawler policy for ${site.name}. Rationale: docs/seo-report.md`,
    '',
    '# Search engines and all other crawlers: public content is open.',
    'User-agent: *',
    'Allow: /',
    'Disallow: /api/',
    'Disallow: /enquiry-received',
    '',
    '# AI search and citation crawlers: allowed, so pages can be found and cited in AI answers.',
    ...search.map(ua => `User-agent: ${ua}`),
    'Allow: /',
    'Disallow: /api/',
    'Disallow: /enquiry-received',
    '',
    '# AI training crawlers: not allowed to collect content for model training.',
    ...training.map(ua => `User-agent: ${ua}`),
    'Disallow: /',
    '',
    `Sitemap: ${site.url}/sitemap.xml`,
    '',
  ].join('\n');
}

function llmsTxt(ctx, pages) {
  const { site } = ctx;
  const link = (name, p, note) => `- [${name}](${site.url}${p})${note ? `: ${note}` : ''}`;
  const byPath = Object.fromEntries(pages.map(p => [p.path, p]));
  const key = ['/what-we-do', '/value-creation', '/work-redesign', '/operating-model', '/venture-building', '/diagnostic', '/research-and-development', '/our-work', '/about', '/contact'];
  return [
    `# ${site.name}`,
    '',
    `> ${site.name} is a London-based ${site.category} firm. ${site.description}`,
    '',
    `Core question: ${site.question}`,
    '',
    `${site.name} examines AI transformation across four fundamentals:`,
    '',
    '- Value: How do you make money?',
    '- Work: How do people work?',
    '- Organisation: How does the organisation run?',
    '- Growth: How do you grow?',
    '',
    `Office: ${site.office}. Market experience: United Kingdom, Middle East and Africa.`,
    `Founder & Managing Partner: ${ctx.founder.name} (${site.url}${ctx.founder.profileUrl}).`,
    '',
    '## Key pages',
    '',
    ...key.map(p => link(byPath[p].heading, p, byPath[p].description)),
    '',
    '## Cornerstone insights',
    '',
    ...ctx.insights.map(a => link(a.title, a.url, a.standfirst)),
    '',
    '## Optional',
    '',
    link('Insights', '/insights', 'All published perspectives'),
    link('Privacy Policy', '/privacy'),
    '',
  ].join('\n');
}

/** A stable fingerprint of each page's content, used to notify IndexNow only about URLs that changed. */
const fingerprint = html => crypto.createHash('sha256').update(html.replace(/<footer class="footer">[\s\S]*<\/footer>/, '').replace(/\?v=[0-9a-f]+/g, '')).digest('hex').slice(0, 16);

// ---------- Pages ----------

function renderPage({ ctx, page, main, file, versions }) {
  const html = render(readSrc('layout.html'), { ...ctx, page, main }, `layout (${file})`);
  return markCurrent(normaliseLinks(html), page.nav || page.path)
    .replace(/(href|src)="\/(styles\.css|script\.js|head\.js)"/g, (_, attr, f) => `${attr}="/${f}?v=${versions[f]}"`);
}

function pageMeta(ctx, page, { checkImages = true } = {}) {
  const { site } = ctx;
  page.canonical = `${site.url}${page.path}`;
  page.ogImage = page.ogImage || '/images/og/default.png';
  page.ogImageUrl = `${site.url}${page.ogImage}`;
  page.ogTitle = page.ogTitle || page.title;
  page.ogDescription = page.ogDescription || page.description;
  if (checkImages && !fs.existsSync(path.join(PUBLIC, page.ogImage))) throw new Error(`${page.path}: missing social image ${page.ogImage}`);
  page.head = page.noindex ? '' : jsonLd(pageGraph(ctx, page));
  return page;
}

export function build(outDir = DIST, { quiet = false, checkImages = true } = {}) {
  const ctx = loadContent();
  const versions = assetVersions();
  fs.rmSync(outDir, { recursive: true, force: true });
  fs.cpSync(PUBLIC, outDir, { recursive: true });
  const written = [];
  const pages = [];
  const write = (rel, html, page) => {
    if (/\{\{|\[[A-Z][A-Z /]{3,}\]/.test(html)) throw new Error(`${rel}: unrendered template tag or placeholder in output`);
    const out = path.join(outDir, rel);
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, html);
    written.push(rel);
    pages.push({ ...page, file: rel, fingerprint: fingerprint(html) });
  };

  for (const file of fs.readdirSync(path.join(SRC, 'pages')).filter(f => f.endsWith('.html'))) {
    const source = readSrc(`pages/${file}`);
    const [, metaJson, body] = source.match(/^<!--meta (.*?) -->\n([\s\S]*)$/);
    const page = pageMeta(ctx, { ...JSON.parse(metaJson), path: cleanPath(file) }, { checkImages });
    write(file, renderPage({ ctx, page, main: render(body, { ...ctx, page }, file), file, versions }), page);
  }

  const articleTpl = readSrc('partials/article-page.html');
  for (const article of ctx.insights) {
    const articleCtx = { ...ctx, article, bodyHtml: markdown(article.body, { ...ctx, article }) };
    const page = pageMeta(ctx, {
      ...article.seo,
      heading: article.title,
      breadcrumb: article.title,
      parent: { name: 'Insights', path: '/insights' },
      path: article.url,
      nav: '/insights',
      ogType: 'article',
      ogImage: `/images/og/${article.slug}.png`,
      updated: article.modified || article.date,
      article,
    }, { checkImages });
    write(`${article.url.slice(1)}.html`, renderPage({ ctx: articleCtx, page, main: render(articleTpl, articleCtx, article.slug), file: article.slug, versions }), page);
  }

  const indexable = pages.filter(p => !p.noindex);
  fs.writeFileSync(path.join(outDir, 'sitemap.xml'), sitemapXml(ctx.site, indexable.map(p => ({ path: p.path, lastmod: p.updated }))));
  fs.writeFileSync(path.join(outDir, 'robots.txt'), robotsTxt(ctx.site));
  fs.writeFileSync(path.join(outDir, 'llms.txt'), llmsTxt(ctx, indexable));
  fs.writeFileSync(path.join(outDir, 'indexnow-manifest.json'), `${JSON.stringify(Object.fromEntries(indexable.map(p => [`${ctx.site.url}${p.path}`, p.fingerprint])), null, 2)}\n`);

  if (!quiet) {
    console.log(`Built ${written.length} pages into ${path.relative(ROOT, outDir) || outDir}/ for ${ctx.site.url}`);
    const missing = missingLegalFacts(ctx.legal);
    if (missing.length) console.warn(`Legal facts not yet confirmed (omitted from the site): ${missing.join(', ')}`);
  }
  return { pages: written, pageMeta: pages, ctx };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) build();
