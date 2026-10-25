// Checks the built site against the content, credibility, SEO and GEO requirements in the brief.
import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { build } from '../build.js';

let out, pages, metas, ctx, SITE;
const html = rel => fs.readFileSync(path.join(out, rel), 'utf8');
const fileFor = urlPath => (urlPath === '/' ? 'index.html' : `${urlPath.slice(1)}.html`);
const decode = s => s.replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const text = rel => decode(html(rel).replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' '));
const graphOf = rel => {
  const m = html(rel).match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  return m ? JSON.parse(m[1])['@graph'] : [];
};
const metaContent = (doc, attr, name) => doc.match(new RegExp(`<meta ${attr}="${name}" content="([^"]*)"`))?.[1];
const internalLinks = rel => [...html(rel).matchAll(/<a[^>]*\shref="(\/[^"]*)"/g)].map(m => m[1]);

before(() => {
  out = fs.mkdtempSync(path.join(os.tmpdir(), 'comet-site-'));
  ({ pages, pageMeta: metas, ctx } = build(out, { quiet: true }));
  SITE = ctx.site.url;
});
const indexable = () => metas.filter(p => !p.noindex);

// ---------- Integrity ----------

test('every internal link and asset resolves, including #anchors, and none uses .html', () => {
  const broken = [];
  for (const page of pages) {
    const doc = html(page);
    const refs = [...doc.matchAll(/\s(?:href|src)="([^"]+)"/g)].map(m => m[1]);
    const srcsets = [...doc.matchAll(/\ssrcset="([^"]+)"/g)].flatMap(m => m[1].split(',').map(s => s.trim().split(/\s+/)[0]));
    for (const ref of [...refs, ...srcsets]) {
      if (/^(https?:|mailto:|tel:|data:)/.test(ref)) continue;
      const [beforeHash, hash] = ref.split('#');
      const pathname = beforeHash.split('?')[0];
      if (/\.html$/.test(pathname)) broken.push(`${page} -> ${ref} (.html URL)`);
      const target = !pathname ? page : path.extname(pathname) ? pathname.slice(1) : fileFor(pathname);
      if (!fs.existsSync(path.join(out, target))) broken.push(`${page} -> ${ref}`);
      else if (hash && target.endsWith('.html') && !html(target).includes(`id="${hash}"`)) broken.push(`${page} -> ${ref} (missing anchor)`);
    }
  }
  assert.deepEqual(broken, []);
});

test('no placeholders, draft markers or unrendered template tags are published', () => {
  for (const page of pages) {
    const doc = html(page).replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g, '');
    assert.doesNotMatch(doc, /\{\{|\}\}/, page);
    assert.doesNotMatch(doc, /\[[A-Z][A-Z /]{3,}\]/, page);
    assert.doesNotMatch(doc, /Draft for review|lorem ipsum|TODO/i, page);
  }
});

// ---------- Content and positioning ----------

test('the home page uses the revised copy: three services, three markets, one framework', () => {
  const home = html('index.html');
  assert.doesNotMatch(home, /film|intro-film|Skip<\/button>/i);
  for (const line of [
    'Helping organisations navigate, lead and build in the AI economy.',
    'Comet Innovations is a London-based AI transformation and venture building firm working with investors, governments and energy businesses.',
    'Explore Our Services', 'Start a Conversation',
    'The opportunity is bigger than technology.',
    'Three ways to work with Comet.',
    'Independent judgement for consequential decisions.', 'Develop the leaders the AI economy demands.', 'Engineering that works inside the business.',
    'Where we focus.', 'Private Equity', 'Government', 'Energy',
    'AI is changing the fundamentals of business.',
    'How do you create and capture value?', 'How should work be performed?', 'How should the organisation operate?', 'What becomes possible next?',
    'From understanding to action.', 'Business before technology.', 'Independence of judgement.', 'Close to operating reality.',
    'Thinking matters. What changes matters more.',
    'Beyond intelligent responses.',
    'Ideas for decisions that matter.',
    'The next decision starts here.',
  ]) assert.ok(home.includes(line), line);
  assert.match(home, /href="\/advise"[^>]*>Explore Advisory/);
  assert.match(home, /href="\/educate"[^>]*>Explore Executive Education/);
  assert.match(home, /href="\/engineer"[^>]*>Explore Engineering/);
  assert.match(home, /href="\/industries"[^>]*>Explore Our Markets/);
  for (const anchor of ['advise', 'educate', 'engineer']) assert.match(html('what-we-do.html'), new RegExp(`id="${anchor}"`));
  assert.ok(text('index.html').includes('Independent advisory. Executive education. Forward-deployed AI engineering.'));
  assert.doesNotMatch(home, /<details>/, 'FAQ is not duplicated on the home page');
});

test('What We Do presents three independent services, the framework and venture building', () => {
  const page = text('what-we-do.html');
  for (const line of [
    'Different challenges. Different expertise. One firm.',
    'Three independent services for organisations navigating the AI economy.',
    'Each service addresses a distinct client need and can be commissioned independently.',
    'Better decisions in a changing economic landscape.',
    'Leadership capability for an AI-shaped future.',
    'Forward-deployed engineering for real operational challenges.',
    'They are not mandatory stages of an engagement.',
    'Creating what comes next.',
    'Engage us where you need us.',
    'Discuss Your Requirements',
  ]) assert.ok(page.includes(line), line);
  const doc = html('what-we-do.html');
  for (const id of ['advise', 'educate', 'engineer', 'four-fundamentals', 'venture-building']) assert.match(doc, new RegExp(`<section[^>]*id="${id}"`), id);
  assert.match(doc, /href="\/four-fundamentals"[^>]*>Explore the Framework/);
  assert.match(doc, /href="\/venture-building"[^>]*>Explore Venture Building/);
});

test('Advise is a service page linked from the navigation, home and What We Do', () => {
  const page = text('advise.html');
  for (const line of [
    'Independent judgement for an AI-shaped economy.',
    'Strategic questions, not technology prescriptions.',
    'Our advice is independent of any particular AI model, software vendor or implementation platform.',
    'AI strategy and investment priorities', 'Business model and value creation', 'Operating model transformation',
    'AI governance and strategic oversight', 'Corporate venture strategy', 'Portfolio transformation',
    'How advisory engagements work.', 'Who we advise.',
    'The value of independent thinking.',
  ]) assert.ok(page.includes(line), line);
  const doc = html('advise.html');
  assert.match(doc, /href="\/contact\?topic=advisory"[^>]*>Discuss an Advisory Engagement/);
  assert.match(doc, /<a href="\/advise" aria-current="page">Advise<\/a>/);
  assert.match(html('what-we-do.html'), /href="\/advise"[^>]*>Explore Advise/);
  assert.match(html('contact.html'), /<option value="advisory">/);
  const graph = JSON.parse(doc.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'];
  assert.ok(graph.some(n => n['@type'] === 'Service' && n.name === 'AI strategy and advisory'));
});

test('Educate is a service page linked from the navigation, home and What We Do', () => {
  const page = text('educate.html');
  for (const line of [
    'Developing leadership for the AI economy.',
    'Executive education for leaders navigating technological and strategic change.',
    'Beyond AI literacy.',
    'AI for Boards and Executive Committees', 'AI as a Strategic Thinking Partner', 'Leading AI Transformation',
    'AI, Innovation and New Business Models', 'Custom Executive Leadership Programmes',
    'How we teach.', 'Formats and delivery', 'Facilitated strategic decision-making labs.',
    'Sector-specific executive education',
    'Learning grounded in operating experience.',
    'while recognising that judgement and accountability remain with leaders.',
    'Develop the capability to lead what comes next.',
  ]) assert.ok(page.includes(line), line);
  const doc = html('educate.html');
  assert.match(doc, /href="\/contact\?topic=education"[^>]*>Discuss an Executive Programme/);
  assert.match(doc, /<a href="\/educate" aria-current="page">Educate<\/a>/);
  assert.match(html('what-we-do.html'), /href="\/educate"[^>]*>Explore Educate/);
});

test('Engineer is a service page linked from the navigation, home and What We Do', () => {
  const page = text('engineer.html');
  for (const line of [
    'AI engineering, deployed where the work happens.',
    'Forward-deployed engineering for enterprise AI systems, intelligent workflows and new digital products.',
    'Engineering close to the problem.',
    'Enterprise AI Agents', 'Intelligent Workflow Engineering', 'AI Systems Integration', 'AI-Native Products',
    'Applied AI Prototyping', 'AI Orchestration and Persistent Workflows',
    'The forward-deployed engineering model.', 'Operational handover',
    'Built for the operating environment.', 'Our approach is technology-agnostic.',
    'Engagement models', 'A prior advisory engagement is not necessary.',
    'From prototype to operational capability.',
    'Applied research informs practical engineering.',
    'Build where it matters.',
  ]) assert.ok(page.includes(line), line);
  const doc = html('engineer.html');
  assert.match(doc, /href="\/contact\?topic=engineering"[^>]*>Discuss an Engineering Engagement/);
  assert.match(doc, /href="\/research-and-development#stateful-ai-orchestration"/);
  assert.match(doc, /<a href="\/engineer" aria-current="page">Engineer<\/a>/);
  assert.match(html('what-we-do.html'), /href="\/engineer"[^>]*>Explore Engineer/);
  assert.match(html('contact.html'), /<option value="engineering">/);
});

test('Industries overview presents the three markets and the navigation points to it', () => {
  const page = text('industries.html').replace(/\s+([,.])/g, '$1');
  for (const line of [
    'Focused on environments where change matters.',
    'Private Equity. Government. Energy.',
    'Our services remain consistent: Advise, Educate and Engineer.',
    'From AI opportunity to portfolio value.',
    'More capable institutions. Better public outcomes.',
    'Intelligence across a changing energy system.',
    'One firm. Three ways to engage.',
    'We work from the requirements of the engagement, not from a predetermined consulting sequence.',
  ]) assert.ok(page.includes(line), line);
  const doc = html('industries.html');
  for (const id of ['private-equity', 'government', 'energy']) {
    assert.match(doc, new RegExp(`<section[^>]*id="${id}"`), id);
    assert.match(doc, new RegExp(`<a href="/industries(#|/)${id}">`), `nav -> ${id}`);
  }
  assert.match(doc, /<div class="menu current"><button[^>]*>Industries<\/button>/);
});

test('Private Equity is an industry page under /industries, linked from the menu and the overview', () => {
  const file = 'industries/private-equity.html';
  const page = text(file);
  for (const line of [
    'AI as a lever for portfolio value creation.',
    'It is which changes can create meaningful, defensible investment value.',
    'An investment perspective on AI.',
    'Commercial performance', 'Operating performance', 'Business model resilience', 'Portfolio-wide capabilities', 'New products and growth',
    'How Comet supports private equity',
    'Executive education programmes designed to strengthen AI judgement',
    'A consistent method. Business-specific decisions.',
    'The measure is investment relevance.',
    'AI activity is not a substitute for investment performance.',
    'A partner for the investment and operating agenda.',
  ]) assert.ok(page.includes(line), line);
  const doc = html(file);
  assert.match(doc, /<link rel="canonical" href="https:\/\/www\.comet-innovations\.com\/industries\/private-equity">/);
  assert.match(doc, /<a href="\/industries\/private-equity" aria-current="page">Private Equity<\/a>/);
  assert.match(doc, /href="\/contact\?topic=private-equity"[^>]*>Discuss Private Equity Opportunities/);
  for (const s of ['advise', 'educate', 'engineer']) assert.match(doc, new RegExp(`href="/${s}"`));
  assert.match(html('industries.html'), /href="\/industries\/private-equity"[^>]*>Explore Private Equity/);
  const graph = JSON.parse(doc.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'];
  const crumbs = graph.find(n => n['@type'] === 'BreadcrumbList').itemListElement.map(i => i.name);
  assert.deepEqual(crumbs, ['Home', 'Industries', 'Private Equity']);
});

test('Government is an industry page under /industries, linked from the menu and the overview', () => {
  const file = 'industries/government.html';
  const page = text(file);
  for (const line of [
    'Building the capabilities of government in the AI economy.',
    'Realising these opportunities requires sound institutional judgement, accountable governance and practical execution.',
    'Technology must serve public value.',
    'Institutional AI Strategy', 'Public Service Transformation', 'Government Operating Models',
    'Policy and Strategic Decision Support', 'Public-Sector Innovation', 'Data and AI Governance',
    'with human judgement and accountability retained.',
    'How Comet supports government',
    'Responsible deployment by design.',
    'We do not assume that a public institution should adopt a particular platform or hosting model.',
    'From institutional ambition to practical capability.',
  ]) assert.ok(page.includes(line), line);
  const doc = html(file);
  assert.match(doc, /<a href="\/industries\/government" aria-current="page">Government<\/a>/);
  assert.match(doc, /href="\/contact\?topic=government"[^>]*>Discuss a Government Engagement/);
  for (const s of ['advise', 'educate', 'engineer']) assert.match(doc, new RegExp(`href="/${s}"`));
  assert.match(html('industries.html'), /href="\/industries\/government"[^>]*>Explore Government/);
});

test('Energy is an industry page under /industries, linked from the menu and the overview', () => {
  const file = 'industries/energy.html';
  const page = text(file);
  for (const line of [
    'Applying intelligence to a complex energy future.',
    'Business value in the physical world.',
    'Operational Performance', 'Asset and Infrastructure Intelligence', 'Forecasting and Decision Support',
    'Enterprise AI Strategy', 'Operating Model Transformation', 'Energy Innovation and New Ventures',
    'How Comet supports energy organisations',
    'Engineering in operationally sensitive environments.',
    'AI systems intended to inform consequential operating decisions require appropriate validation, oversight and safety controls.',
    'Experience that understands the environment.',
    'Intelligence with an economic purpose.',
  ]) assert.ok(page.includes(line), line);
  const doc = html(file);
  assert.match(doc, /<a href="\/industries\/energy" aria-current="page">Energy<\/a>/);
  assert.match(doc, /<div class="menu current"><button[^>]*>Industries<\/button>/);
  assert.match(doc, /href="\/contact\?topic=energy"[^>]*>Discuss an Energy Engagement/);
  for (const s of ['advise', 'educate', 'engineer']) assert.match(doc, new RegExp(`href="/${s}"`));
  assert.match(html('industries.html'), /href="\/industries\/energy"[^>]*>Explore Energy/);
});

test('The Four Fundamentals has its own framework page, linked from the menu, home and What We Do', () => {
  const page = text('four-fundamentals.html');
  for (const line of [
    'A framework for understanding business in the AI economy.',
    'What artificial intelligence changes is the economics of how they are fulfilled.',
    'Why the framework matters.',
    'How do you create and capture value?', 'How should work be performed?', 'How should the organisation operate?', 'What becomes possible next?',
    'Which activities require human judgement?',
    'Should the opportunity be pursued within the existing business or through a new venture?',
    'A strategic perspective, not a mandatory delivery process.',
    'What should change?',
  ]) assert.ok(page.includes(line), line);
  const doc = html('four-fundamentals.html');
  for (const [label, href] of [['Explore Value', '/value-creation'], ['Explore Work', '/work-redesign'], ['Explore Organisation', '/operating-model'], ['Explore Growth', '/venture-building']]) {
    assert.match(doc, new RegExp(`href="${href}"[^>]*>${label}<`), label);
  }
  assert.match(doc, /<a href="\/four-fundamentals" aria-current="page">The Four Fundamentals<\/a>/);
  assert.match(html('index.html'), /href="\/four-fundamentals"[^>]*>Discover the Four Fundamentals/);
  const graph = JSON.parse(doc.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'];
  assert.ok(graph.some(n => n['@type'] === 'DefinedTerm' && n.name === 'The Four Fundamentals'));
  assert.ok(fs.readFileSync(path.join(out, 'llms.txt'), 'utf8').includes('- Value: How do you create and capture value?'));
});

test('positioning is intact: fundamentals, pillars, delivery modes and R&D', () => {
  const all = pages.map(text).join(' ');
  for (const term of ['Value', 'Work', 'Organisation', 'Growth', 'Value creation', 'Work redesign', 'Operating model', 'Venture building', 'Advise', 'Educate', 'Engineer']) {
    assert.ok(all.toLowerCase().includes(term.toLowerCase()), term);
  }
  for (const page of ['value-creation.html', 'work-redesign.html', 'operating-model.html', 'venture-building.html', 'research-and-development.html', 'what-we-do.html']) {
    assert.ok(pages.includes(page), page);
  }
  assert.ok(text('research-and-development.html').includes('It is not a product.'));
});

test('the Fundamentals Diagnostic is retired: no page, links, mentions or contact topic', () => {
  assert.ok(!pages.includes('diagnostic.html'));
  for (const page of pages) assert.doesNotMatch(html(page), /diagnostic/i, page);
  assert.doesNotMatch(fs.readFileSync(path.join(out, 'llms.txt'), 'utf8'), /diagnostic/i);
  assert.doesNotMatch(fs.readFileSync(path.join(out, 'sitemap.xml'), 'utf8'), /diagnostic/i);
});

test('the founder profile comes from content data and is complete', () => {
  const about = text('about.html');
  const founder = ctx.founder;
  assert.ok(html('about.html').includes(`id="${founder.slug}"`));
  for (const piece of [founder.name, founder.title, ...founder.bio, ...founder.expertise, ...founder.experience.flatMap(e => [e.heading, e.text])]) {
    assert.ok(about.includes(piece), piece);
  }
  assert.ok(about.includes('These are not descriptions of Comet client engagements.'));
  assert.ok(html('about.html').includes(founder.linkedin));
  for (const insight of ctx.insights) assert.ok(html('about.html').includes(`href="${insight.url}"`), insight.url);
});

test('three complete insights are published with the full article template', () => {
  const articles = pages.filter(p => p.startsWith('insights/'));
  assert.equal(articles.length, 3);
  for (const insight of ctx.insights) {
    const rel = fileFor(insight.url);
    const doc = html(rel);
    for (const part of [insight.category, insight.title, insight.standfirst, insight.author.name, insight.dateLabel, `${insight.readingTime} minutes`, insight.cta.label, insight.related.title]) {
      assert.ok(doc.includes(part.replace(/&/g, '&amp;').replace(/'/g, '&#39;')), `${insight.slug}: ${part}`);
    }
    assert.ok(doc.includes(`href="${insight.author.profileUrl}"`), 'author profile link');
    assert.ok(text(rel).split(' ').length > 1000, `${insight.slug} is a full article`);
  }
});

test('forthcoming insights are labelled and not linked as finished articles', () => {
  const insights = html('insights.html');
  for (const { title } of ctx.forthcoming) {
    const escaped = title.replace(/[?]/g, '\\?');
    assert.match(insights, new RegExp(`<span class="forthcoming-title">${escaped}</span>`));
    assert.doesNotMatch(insights, new RegExp(`<a[^>]*>${escaped}`));
  }
  assert.ok(!html('index.html').includes('Beyond Automation'));
});

test('contact form matches the approved specification', () => {
  const contact = html('contact.html');
  for (const name of ['name', 'email', 'organisation', 'role', 'country', 'topic']) {
    assert.match(contact, new RegExp(`<(input|select)[^>]*\\brequired\\b[^>]*name="${name}"|<(input|select)[^>]*name="${name}"[^>]*\\brequired\\b`), name);
  }
  assert.doesNotMatch(contact, /<textarea[^>]*required/);
  assert.match(contact, /<input type="checkbox" name="consent" value="yes" required>/);
  assert.match(contact, /<input type="checkbox" name="marketing" value="yes">/);
  const received = text('enquiry-received.html');
  assert.ok(received.includes('A member of Comet Innovations will review the information you have provided and respond using the business email address supplied.'));
  assert.doesNotMatch(received, /within \d|hours|working days/i);
});

test('legal pages exist, use configured facts, and the site sets no cookies or storage', () => {
  for (const page of ['privacy.html', 'cookies.html', 'terms.html']) assert.ok(pages.includes(page), page);
  assert.ok(text('privacy.html').includes(`This website is operated by ${ctx.legal.entityName}, trading as Comet Innovations.`));
  assert.ok(text('terms.html').includes(`governed by the law of ${ctx.legal.governingLaw}`));
  assert.ok(text('cookies.html').includes('does not set any'));
  for (const file of ['script.js', 'head.js']) {
    assert.doesNotMatch(fs.readFileSync(path.join(out, file), 'utf8'), /cookie|localStorage|sessionStorage|indexedDB/i, file);
  }
});

test('the Four Fundamentals carry the proprietary notice, and the Terms protect the framework', () => {
  const notice = 'The Four Fundamentals framework and associated methodology are proprietary to Maverika Ltd, trading as Comet Innovations. © Maverika Ltd. All rights reserved.';
  assert.equal(ctx.legal.frameworkNotice, notice);
  for (const page of ['index.html', 'what-we-do.html', 'four-fundamentals.html', 'insights/the-four-fundamentals.html', 'insights/where-is-ai-changing-your-economics.html']) {
    assert.ok(text(page).includes(notice), page);
  }
  assert.ok(fs.readFileSync(path.join(out, 'llms.txt'), 'utf8').includes(notice));
  const terms = text('terms.html');
  for (const sentence of [
    'Unless otherwise stated, the content of this website, including text, graphics, frameworks, methodologies, branding and original materials, is owned by or licensed to Maverika Ltd.',
    'The Four Fundamentals framework and associated methodology are proprietary to Maverika Ltd and are protected by applicable intellectual property rights.',
    'No part of the Four Fundamentals framework or associated methodology may be reproduced, adapted, distributed or used commercially without prior written permission from Maverika Ltd.',
  ]) assert.ok(terms.includes(sentence), sentence);
  assert.ok(terms.includes(`Effective date: ${ctx.legal.termsLastUpdatedLabel}`));
});

test('only London is presented as an office, in copy and in structured data', () => {
  for (const page of pages) {
    assert.doesNotMatch(text(page), /\b(Cairo|Dubai|Riyadh|Lagos)\b/, page);
    assert.doesNotMatch(JSON.stringify(graphOf(page)), /Cairo|Dubai/, page);
  }
  assert.ok(text('about.html').includes('Comet Innovations is an AI Transformation & Venture Building firm based in London.'));
  assert.ok(html('index.html').includes('London, United Kingdom'));
});

test('the main navigation follows the institutional structure, and every link resolves', () => {
  const nav = html('index.html').match(/<nav class="nav"[\s\S]*?<\/nav>/)[0];
  const labels = [...nav.matchAll(/<button type="button" aria-expanded="false" aria-controls="menu-[^"]+">([^<]+)<\/button>|<a (?:class="nav-cta" )?href="[^"]*">([^<]+)<\/a>(?=\s*(?:<div class="menu"|<a class="nav-cta"|<\/div>\s*<\/div><\/nav>))/g)].map(m => m[1] || m[2]);
  assert.deepEqual(labels, ['What We Do', 'Industries', 'Our Thinking', 'Our Work', 'About', 'Contact']);
  const items = {
    'menu-what-we-do': ['Advise', 'Educate', 'Engineer', 'Venture Building'],
    'menu-industries': ['Private Equity', 'Government', 'Energy'],
    'menu-our-thinking': ['The Four Fundamentals', 'Insights', 'Research &amp; Development'],
    'menu-about': ['Firm', 'People', 'Approach'],
  };
  for (const [id, expected] of Object.entries(items)) {
    const dropdown = nav.match(new RegExp(`<div class="dropdown" id="${id}">([\\s\\S]*?)</div>`))[1];
    assert.deepEqual([...dropdown.matchAll(/>([^<]+)<\/a>/g)].map(m => m[1]), expected, id);
  }
  for (const [, href] of nav.matchAll(/href="([^"]+)"/g)) {
    const [p, anchor] = href.split('#');
    const doc = html(fileFor(p));
    if (anchor) assert.match(doc, new RegExp(`id="${anchor}"`), href);
  }
});

test('the current page is marked in the navigation', () => {
  assert.match(html('about.html'), /<div class="menu current"><button[^>]*>About<\/button>[\s\S]*?<a href="\/about" aria-current="page">Firm<\/a>/);
  assert.match(html('value-creation.html'), /<div class="menu current"><button[^>]*>What We Do<\/button>/);
  assert.match(html('insights/the-four-fundamentals.html'), /<a href="\/insights" aria-current="page">Insights<\/a>/);
  assert.match(html(fileFor(ctx.insights[0].url)), /<a href="\/insights" aria-current="page">Insights<\/a>/);
});

// ---------- Metadata ----------

test('every indexable page has a unique title and description and a self-referencing canonical', () => {
  const titles = new Set();
  const descriptions = new Set();
  for (const page of indexable()) {
    const doc = html(page.file);
    const title = decode(doc.match(/<title>(.*?)<\/title>/)[1]);
    const description = decode(metaContent(doc, 'name', 'description'));
    assert.ok(title && description, page.path);
    assert.ok(!titles.has(title), `duplicate title ${title}`);
    assert.ok(!descriptions.has(description), `duplicate description on ${page.path}`);
    titles.add(title);
    descriptions.add(description);
    assert.match(doc, new RegExp(`<link rel="canonical" href="${SITE}${page.path.replace(/[/.]/g, '\\$&')}">`), page.path);
    assert.doesNotMatch(doc, /name="robots" content="noindex"/, page.path);
  }
});

test('the specified titles and descriptions are used', () => {
  const expect = {
    '/': ['AI Transformation & Venture Building | Comet Innovations', 'London-based AI transformation and venture building firm offering independent advisory, executive education and forward-deployed AI engineering.'],
    '/what-we-do': ['AI Transformation Strategy & Services | Comet Innovations'],
    '/advise': ['AI Strategy & Advisory Services | Comet Innovations'],
    '/educate': ['AI Executive Education & Leadership Programmes | Comet Innovations'],
    '/engineer': ['Forward-Deployed AI Engineering | Comet Innovations'],
    '/industries': ['AI for Private Equity, Government & Energy | Comet Innovations'],
    '/industries/private-equity': ['AI for Private Equity: Portfolio Value Creation | Comet Innovations'],
    '/industries/government': ['AI for Government & Public Sector | Comet Innovations'],
    '/industries/energy': ['AI for Energy, Utilities & Infrastructure | Comet Innovations'],
    '/four-fundamentals': ['The Four Fundamentals: An AI Strategy Framework | Comet Innovations'],
    '/value-creation': ['AI Growth Strategy & Value Creation | Comet Innovations'],
    '/work-redesign': ['AI Work Redesign & Workforce Transformation | Comet Innovations'],
    '/operating-model': ['AI Operating Model & Governance | Comet Innovations'],
    '/venture-building': ['Corporate Venture Building & AI Ventures | Comet Innovations'],
    '/our-work': ['AI Transformation & Venture Building Work | Comet Innovations'],
    '/insights': ['AI Transformation & Venture Building Insights | Comet Innovations'],
    '/insights/where-is-ai-changing-your-economics': ['Where Is AI Changing Your Economics? | Comet Innovations'],
    '/insights/the-four-fundamentals': ['The Four Fundamentals of AI Transformation | Comet Innovations'],
    '/insights/what-should-you-build-next': ['What Should You Build Next? Corporate Venture Building | Comet'],
    '/research-and-development': ['AI Research: Stateful AI Orchestration | Comet Innovations'],
    '/about': ['About Comet Innovations | AI Transformation & Venture Building'],
    '/contact': ['Contact Comet Innovations | AI Transformation & Venture Building'],
  };
  for (const [p, [title, description]] of Object.entries(expect)) {
    const doc = html(fileFor(p));
    assert.equal(decode(doc.match(/<title>(.*?)<\/title>/)[1]), title, p);
    if (description) assert.equal(decode(metaContent(doc, 'name', 'description')), description, p);
  }
});

test('noindex pages carry no canonical and are kept out of discovery files', () => {
  for (const page of metas.filter(p => p.noindex)) {
    const doc = html(page.file);
    assert.match(doc, /<meta name="robots" content="noindex">/, page.path);
    assert.doesNotMatch(doc, /rel="canonical"/, page.path);
  }
});

test('Open Graph and Twitter metadata are complete, with distinct images', () => {
  const images = new Set();
  for (const page of indexable()) {
    const doc = html(page.file);
    for (const prop of ['og:title', 'og:description', 'og:url', 'og:type', 'og:image']) assert.ok(metaContent(doc, 'property', prop), `${page.path} ${prop}`);
    assert.equal(metaContent(doc, 'property', 'og:url'), `${SITE}${page.path}`);
    for (const name of ['twitter:card', 'twitter:title', 'twitter:description', 'twitter:image']) assert.ok(metaContent(doc, 'name', name), `${page.path} ${name}`);
    const image = metaContent(doc, 'property', 'og:image');
    assert.ok(fs.existsSync(path.join(out, image.replace(SITE, ''))), image);
    images.add(image);
  }
  for (const p of ['/', '/research-and-development', '/value-creation', ...ctx.insights.map(i => i.url)]) {
    const image = metaContent(html(fileFor(p)), 'property', 'og:image');
    assert.doesNotMatch(image, /default\.png$/, `${p} has its own social image`);
  }
  assert.ok(images.size >= 12);
  for (const a of ctx.insights) {
    const doc = html(fileFor(a.url));
    assert.equal(metaContent(doc, 'property', 'article:published_time'), a.date);
    assert.ok(metaContent(doc, 'property', 'article:author'));
  }
});

// ---------- Semantic structure ----------

test('one H1 per page and no skipped heading levels', () => {
  for (const page of pages) {
    const levels = [...html(page).replace(/<footer class="footer">[\s\S]*<\/footer>/, '').matchAll(/<h([1-6])[\s>]/g)].map(m => Number(m[1]));
    assert.equal(levels.filter(l => l === 1).length, 1, `${page} H1 count`);
    levels.forEach((l, i) => i && assert.ok(l - levels[i - 1] <= 1, `${page}: h${levels[i - 1]} -> h${l}`));
  }
});

test('the specified H1s are used', () => {
  const h1 = rel => text(rel).length && decode(html(rel).match(/<h1[^>]*>([\s\S]*?)<\/h1>/)[1].replace(/<[^>]+>/g, '')).trim();
  assert.equal(h1('value-creation.html'), 'Rethink how value is created and captured.');
  assert.equal(h1('work-redesign.html'), 'Redesign work around what AI makes possible.');
  assert.equal(h1('operating-model.html'), 'Build an organisation capable of scaling AI.');
  assert.equal(h1('venture-building.html'), 'Build what comes next.');
  assert.equal(h1('insights.html'), 'Insights');
  assert.equal(h1('about.html'), 'About Comet Innovations');
  assert.equal(h1('research-and-development.html'), 'Building the foundations of AI-native organisations.');
});

test('every image has alt text, empty only when decorative', () => {
  for (const page of pages) {
    for (const img of html(page).matchAll(/<img\b[^>]*>/g)) assert.match(img[0], /\salt="/, `${page}: ${img[0]}`);
  }
});

// ---------- Structured data ----------

test('structured data is valid, connected by stable @ids, and reflects visible content', () => {
  const ORG = `${SITE}/#organization`;
  const PERSON = `${SITE}/about#${ctx.founder.slug}`;
  for (const page of indexable()) {
    const graph = graphOf(page.file);
    const byId = Object.fromEntries(graph.filter(n => n['@id']).map(n => [n['@id'], n]));
    const org = byId[ORG];
    assert.ok(org, `${page.path} Organization`);
    assert.equal(org.description, ctx.site.description);
    assert.equal(org.address.addressLocality, 'London');
    assert.deepEqual(org.sameAs, [ctx.site.linkedin]);
    assert.equal(org.founder['@id'], PERSON);
    assert.ok(byId[`${SITE}/#website`], `${page.path} WebSite`);
    assert.ok(byId[`${SITE}${page.path}#webpage`], `${page.path} WebPage`);
    if (page.path !== '/') {
      const crumbs = byId[`${SITE}${page.path}#breadcrumb`];
      assert.ok(crumbs, `${page.path} BreadcrumbList`);
      assert.equal(crumbs.itemListElement.at(-1).item, `${SITE}${page.path}`);
    }
    // every in-site reference points at a node defined on this page or a known site-wide entity
    const refs = JSON.stringify(graph).match(/"@id":"[^"]+"/g).map(r => r.slice(7, -1));
    for (const ref of refs) assert.ok(byId[ref] || [ORG, PERSON, `${SITE}/#website`, `${SITE}/#logo`].includes(ref), `${page.path} dangling ${ref}`);
  }
});

test('articles connect to the founder Person entity with real dates', () => {
  for (const a of ctx.insights) {
    const graph = graphOf(fileFor(a.url));
    const article = graph.find(n => n['@type'] === 'Article');
    const person = graph.find(n => n['@type'] === 'Person');
    assert.equal(article.author['@id'], person['@id']);
    assert.equal(person.name, ctx.founder.name);
    assert.equal(person.worksFor['@id'], `${SITE}/#organization`);
    assert.equal(article.datePublished, a.date);
    assert.equal(article.dateModified, a.modified || a.date);
    assert.equal(article.mainEntityOfPage['@id'], `${SITE}${a.url}#webpage`);
    assert.ok(article.image[0].endsWith(`/images/og/${a.slug}.png`));
    assert.ok(html(`${a.url.slice(1)}.html`).includes(`href="${person['@id'].replace(SITE, '')}"`), 'visible author link matches Person @id');
  }
});

test('FAQPage markup exists only on About and matches the visible questions exactly', () => {
  const faqPages = pages.filter(p => graphOf(p).some(n => n['@type'] === 'FAQPage'));
  assert.deepEqual(faqPages, ['about.html']);
  const faq = graphOf('about.html').find(n => n['@type'] === 'FAQPage');
  const about = html('about.html');
  assert.equal(faq.mainEntity.length, ctx.faq.length);
  for (const q of faq.mainEntity) {
    assert.ok(about.includes(`<summary>${q.name.replace(/&/g, '&amp;')}</summary><p>${q.acceptedAnswer.text.replace(/&/g, '&amp;')}</p>`), q.name);
  }
});

test('Service entities exist only on substantive service pages, provided by Comet', () => {
  const servicePages = metas.filter(p => graphOf(p.file).some(n => n['@type'] === 'Service')).map(p => p.path).sort();
  assert.deepEqual(servicePages, ['/advise', '/educate', '/engineer', '/operating-model', '/value-creation', '/venture-building', '/work-redesign']);
  for (const p of servicePages) {
    const service = graphOf(fileFor(p)).find(n => n['@type'] === 'Service');
    assert.equal(service.provider['@id'], `${SITE}/#organization`);
  }
});

// ---------- Discovery files ----------

test('sitemap lists every canonical indexable URL and nothing else', () => {
  const xml = fs.readFileSync(path.join(out, 'sitemap.xml'), 'utf8');
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]).sort();
  assert.deepEqual(locs, indexable().map(p => `${SITE}${p.path}`).sort());
  assert.doesNotMatch(xml, /404|enquiry-received|\.html/);
  for (const m of xml.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)) assert.match(m[1], /^\d{4}-\d{2}-\d{2}$/);
});

test('robots.txt allows search and AI search crawlers, blocks training crawlers, and lists the sitemap', () => {
  const robots = fs.readFileSync(path.join(out, 'robots.txt'), 'utf8');
  const groups = robots.split(/\n\n+/).map(g => g.split('\n').filter(l => !l.startsWith('#')));
  const groupFor = ua => groups.find(g => g.includes(`User-agent: ${ua}`));
  assert.ok(groupFor('*').includes('Allow: /'));
  for (const ua of ['OAI-SearchBot', 'ChatGPT-User', 'Claude-SearchBot', 'PerplexityBot']) {
    assert.ok(groupFor(ua).includes('Allow: /'), ua);
    assert.ok(!groupFor(ua).includes('Disallow: /'), ua);
  }
  for (const ua of ['GPTBot', 'ClaudeBot', 'Google-Extended', 'CCBot']) assert.ok(groupFor(ua).includes('Disallow: /'), ua);
  assert.doesNotMatch(robots, /Disallow: \/(styles|script|fonts|images)/, 'rendering assets stay crawlable');
  assert.ok(robots.includes(`Sitemap: ${SITE}/sitemap.xml`));
});

test('llms.txt maps the authoritative pages with canonical URLs', () => {
  const llms = fs.readFileSync(path.join(out, 'llms.txt'), 'utf8');
  assert.ok(llms.startsWith('# Comet Innovations'));
  assert.ok(llms.includes('London-based AI Transformation & Venture Building firm'));
  for (const p of ['/what-we-do', '/value-creation', '/work-redesign', '/operating-model', '/venture-building', '/research-and-development', '/about', ...ctx.insights.map(i => i.url)]) {
    assert.ok(llms.includes(`(${SITE}${p})`), p);
  }
  assert.doesNotMatch(llms, /\[[A-Z ]+URL\]/);
});

test('IndexNow manifest fingerprints every indexable URL', () => {
  const manifest = JSON.parse(fs.readFileSync(path.join(out, 'indexnow-manifest.json'), 'utf8'));
  assert.deepEqual(Object.keys(manifest).sort(), indexable().map(p => `${SITE}${p.path}`).sort());
});

// ---------- Entity clarity and internal linking ----------

test('key concepts are defined in visible HTML, consistently', () => {
  const ff = 'The Four Fundamentals is Comet’s framework for examining where AI changes four core dimensions of a business: value, work, organisation and growth.';
  assert.ok(text('insights/the-four-fundamentals.html').includes(ff));
  assert.ok(text('what-we-do.html').includes('Across our work, we examine how AI changes value, work, organisation and growth.'));
  assert.ok(text('venture-building.html').includes('Corporate venture building is the disciplined process of identifying, validating, building and launching new businesses using the assets and advantages of an established organisation.'));
  assert.ok(text('venture-building.html').includes('Comet helps established organisations identify, validate, build and launch new businesses.'));
  assert.ok(/Agentic AI describes AI systems/.test(text('work-redesign.html')));
  for (const term of ['Corporate innovation', 'Venture validation', 'Venture building', 'Venture acceleration']) assert.ok(html('venture-building.html').includes(`<dt>${term}</dt>`), term);
  for (const term of ['Task automation', 'Workflow redesign', 'AI agents and agentic AI', 'Workforce transformation', 'Capability building']) assert.ok(html('work-redesign.html').includes(`<dt>${term}</dt>`), term);
});

test('British English is used throughout the visible copy', () => {
  const american = /\b(judgment|judgments|percent|toward|afterward|color|colors|center|centered|behavior|behaviors|favor|favorite|honor|labor|analyze|analyzed|catalog|defense|fulfill|enroll|modeling|modeled|traveled|organizational|organization|organizations|optimize|optimized|optimizing|prioritize|prioritized|prioritizing|recognize|recognized|realize|realized|utilize|utilized|specialize|specialized|standardize|minimize|maximize|summarize|emphasize|program|programs)\b/i;
  for (const page of pages) {
    const match = text(page).match(american);
    assert.equal(match, null, `${page}: "${match?.[0]}"`);
  }
  assert.doesNotMatch(fs.readFileSync(path.join(out, 'llms.txt'), 'utf8'), american);
});

test('no conflicting company descriptions or unsupported superlatives', () => {
  for (const page of pages) {
    const t = text(page);
    assert.doesNotMatch(t, /\b(AI agency|technology company|software company|innovation studio|digital transformation agency)\b/i, page);
    assert.doesNotMatch(t, /\b(world-class|market-leading|best-in-class|industry-leading)\b/i, page);
  }
});

test('every pillar page links to What We Do, an Insight, Our Work and Contact', () => {
  for (const p of ['value-creation', 'work-redesign', 'operating-model', 'venture-building']) {
    const links = internalLinks(`${p}.html`).map(l => l.split('#')[0].split('?')[0]);
    for (const target of ['/what-we-do', '/contact']) assert.ok(links.includes(target), `${p} -> ${target}`);
    assert.ok(links.some(l => l.startsWith('/insights/')), `${p} -> insight`);
    assert.ok(links.includes('/our-work') || p === 'work-redesign', `${p} -> our work`);
  }
});

test('the economics Insight links to the framework and every pillar', () => {
  const links = internalLinks('insights/where-is-ai-changing-your-economics.html').map(l => l.split('#')[0]);
  for (const target of ['/insights/the-four-fundamentals', '/value-creation', '/work-redesign', '/operating-model', '/venture-building', '/advise']) {
    assert.ok(links.includes(target), target);
  }
  assert.ok(internalLinks('insights/what-should-you-build-next.html').includes('/venture-building'));
});

test('no orphan pages: every indexable page is linked from another page', () => {
  const inbound = new Set(pages.flatMap(p => internalLinks(p).filter(() => true).map(l => l.split('#')[0].split('?')[0])).concat());
  for (const page of indexable()) assert.ok(inbound.has(page.path), `${page.path} has no inbound links`);
});
