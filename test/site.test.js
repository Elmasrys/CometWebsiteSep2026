// Checks the built site against the content and credibility requirements in the brief.
import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { build } from '../build.js';

let out, pages, ctx;
const html = rel => fs.readFileSync(path.join(out, rel), 'utf8');
const decode = s => s.replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const text = rel => decode(html(rel).replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' '));

before(() => {
  out = fs.mkdtempSync(path.join(os.tmpdir(), 'comet-site-'));
  ({ pages, ctx } = build(out, { quiet: true }));
});

test('every internal link and asset resolves, including #anchors', () => {
  const broken = [];
  for (const page of pages) {
    const doc = html(page);
    const refs = [...doc.matchAll(/\s(?:href|src)="([^"]+)"/g)].map(m => m[1]);
    const srcsets = [...doc.matchAll(/\ssrcset="([^"]+)"/g)].flatMap(m => m[1].split(',').map(s => s.trim().split(/\s+/)[0]));
    for (const ref of [...refs, ...srcsets]) {
      if (/^(https?:|mailto:|tel:|data:)/.test(ref)) continue;
      const [file, hash] = ref.split('#');
      const target = file ? file.split('?')[0].replace(/^\//, '') : page;
      if (file && !fs.existsSync(path.join(out, target))) broken.push(`${page} -> ${ref}`);
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

test('the home page loads straight into the institutional hero with no film', () => {
  const home = html('index.html');
  assert.doesNotMatch(home, /film|intro-film|Skip<\/button>/i);
  for (const line of [
    'AI Transformation &amp; Venture Building',
    'AI is changing the fundamentals of business.',
    'How you make money.', 'How people work.', 'How the organisation runs.', 'How you grow.',
    'Comet Innovations works with leadership teams to understand where AI materially changes these fundamentals, then helps turn that understanding into action.',
    'Where is AI changing your economics?',
    'Explore What We Do', 'Start a Conversation',
    'UK · Middle East · Africa experience',
    'The people shaping the engagement stay involved in the work.',
  ]) assert.ok(home.includes(line), line);
  assert.match(home, /href="\/about\.html#people"[^>]*>Meet the people behind Comet/);
  assert.doesNotMatch(home, /<details>/, 'FAQ is not duplicated on the home page');
});

test('positioning is intact: fundamentals, pillars, delivery modes and the Diagnostic', () => {
  const all = pages.map(text).join(' ');
  for (const term of ['Value', 'Work', 'Organisation', 'Growth', 'Value creation', 'Work redesign', 'Operating model', 'Venture building', 'Advise', 'Educate', 'Engineer', 'Fundamentals Diagnostic']) {
    assert.ok(all.includes(term), term);
  }
  for (const page of ['value-creation.html', 'work-redesign.html', 'operating-model.html', 'venture-building.html', 'diagnostic.html', 'rd.html', 'what-we-do.html']) {
    assert.ok(pages.includes(page), page);
  }
});

test('every "Request a Diagnostic" link preselects the Diagnostic', () => {
  for (const page of pages) {
    for (const m of html(page).matchAll(/<a[^>]*href="([^"]+)"[^>]*>Request a Diagnostic/g)) {
      assert.equal(m[1], '/contact.html?topic=diagnostic', page);
    }
  }
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

test('FAQ stays on About and its structured data matches the visible questions', () => {
  const about = html('about.html');
  const ld = [...about.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m => JSON.parse(m[1]));
  const faq = ld.find(d => d['@type'] === 'FAQPage');
  assert.ok(faq, 'FAQPage structured data present');
  assert.equal(faq.mainEntity.length, 6);
  for (const q of faq.mainEntity) {
    assert.equal(q['@type'], 'Question');
    assert.equal(q.acceptedAnswer['@type'], 'Answer');
    assert.ok(about.includes(`<summary>${q.name}</summary>`), q.name);
  }
  const faqPages = pages.filter(p => html(p).includes('FAQPage'));
  assert.deepEqual(faqPages, ['about.html']);
});

test('three complete insights are published with the full article template', () => {
  const articles = pages.filter(p => p.startsWith('insights/'));
  assert.equal(articles.length, 3);
  for (const insight of ctx.insights) {
    const doc = html(insight.url.slice(1));
    for (const part of [insight.category, insight.title, insight.standfirst, insight.author.name, insight.dateLabel, `${insight.readingTime} minutes`, insight.cta.label, insight.related.title]) {
      assert.ok(doc.includes(part.replace(/&/g, '&amp;').replace(/'/g, '&#39;')), `${insight.slug}: ${part}`);
    }
    assert.ok(doc.includes(`href="${insight.author.profileUrl}"`), 'author profile link');
    assert.ok(text(insight.url.slice(1)).split(' ').length > 1000, `${insight.slug} is a full article`);
  }
});

test('forthcoming insights are labelled and not linked as finished articles', () => {
  const insights = html('insights.html');
  for (const { title } of ctx.forthcoming) {
    const escaped = title.replace(/[?]/g, '\\?');
    assert.match(insights, new RegExp(`<span class="forthcoming-title">${escaped}</span>`));
    assert.doesNotMatch(insights, new RegExp(`<a[^>]*>${escaped}`));
  }
  assert.ok(insights.includes('Forthcoming'));
  assert.ok(!html('index.html').includes('Beyond Automation'));
});

test('contact form matches the approved specification', () => {
  const contact = html('contact.html');
  for (const name of ['name', 'email', 'organisation', 'role', 'country', 'topic']) {
    assert.match(contact, new RegExp(`<(input|select)[^>]*\\brequired\\b[^>]*name="${name}"|<(input|select)[^>]*name="${name}"[^>]*\\brequired\\b`), name);
  }
  assert.match(contact, /<textarea name="message"/);
  assert.doesNotMatch(contact, /<textarea[^>]*required/);
  assert.match(contact, /<input type="checkbox" name="consent" value="yes" required>/);
  assert.match(contact, /<input type="checkbox" name="marketing" value="yes">/);
  assert.ok(contact.includes('I agree to Comet Innovations processing my information in accordance with the'));
  assert.ok(contact.includes('I would like to receive occasional insights and updates from Comet Innovations.'));
  assert.ok(contact.includes('Business email'));
  assert.ok(contact.includes('Education and capability programmes'));
  const received = text('enquiry-received.html');
  assert.ok(received.includes('A member of Comet Innovations will review the information you have provided and respond using the business email address supplied.'));
  assert.doesNotMatch(received, /within \d|hours|working days/i, 'no promised response time');
});

test('legal pages exist and use only configured facts', () => {
  for (const page of ['privacy.html', 'cookies.html', 'terms.html']) assert.ok(pages.includes(page), page);
  const privacy = text('privacy.html');
  assert.ok(privacy.includes(`This website is operated by ${ctx.legal.entityName}, trading as Comet Innovations.`));
  assert.ok(privacy.includes(ctx.legal.companyNumber));
  assert.ok(text('terms.html').includes(`governed by the law of ${ctx.legal.governingLaw}`));
  assert.ok(text('cookies.html').includes('does not set any'), 'cookie policy reflects the site setting no cookies');
});

test('the site sets no cookies and uses no browser storage, as the Cookie Policy states', () => {
  for (const file of ['script.js', 'head.js']) {
    assert.doesNotMatch(fs.readFileSync(path.join(out, file), 'utf8'), /cookie|localStorage|sessionStorage|indexedDB/i, file);
  }
});

test('only London is presented as an office', () => {
  for (const page of pages) assert.doesNotMatch(text(page), /\b(Cairo|Dubai|Riyadh|Lagos)\b/, page);
  assert.ok(html('index.html').includes('London, United Kingdom'));
});

test('footer carries navigation, legal links, LinkedIn and location', () => {
  const footer = html('index.html').split('<footer class="footer">')[1];
  for (const link of ['What We Do', 'Our Work', 'Insights', 'R&amp;D', 'About', 'Contact', 'Privacy Policy', 'Cookie Policy', 'Website Terms', 'LinkedIn', 'London, United Kingdom', 'Where is AI changing your economics?']) {
    assert.ok(footer.includes(link), link);
  }
});

test('R&D is presented as research, not a commercial product', () => {
  assert.ok(text('rd.html').includes('It is not a product.'));
});

test('the current page is marked in the navigation', () => {
  assert.match(html('about.html'), /<a href="\/about\.html" aria-current="page">About<\/a>/);
  assert.match(html(ctx.insights[0].url.slice(1)), /<a href="\/insights\.html" aria-current="page">Insights<\/a>/);
});
