import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { createApp, validateEnquiry, sendWithResend } from '../app.js';

const sent = [];
let failNext = false;
let server, base;

before(async () => {
  const app = createApp({
    sendEnquiry: async enquiry => {
      if (failNext) { failNext = false; throw new Error('boom'); }
      sent.push(enquiry);
    },
    log: { error() {} },
    rateLimit: { limit: 1000 },
  });
  server = app.listen(0);
  await new Promise(r => server.once('listening', r));
  base = `http://127.0.0.1:${server.address().port}`;
});
after(() => server.close());

const post = (body, json = true) =>
  fetch(`${base}/api/contact`, {
    method: 'POST',
    redirect: 'manual',
    headers: json
      ? { 'Content-Type': 'application/json', Accept: 'application/json' }
      : { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: json ? JSON.stringify(body) : new URLSearchParams(body).toString(),
  });

const valid = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  organisation: 'Analytical Engines',
  role: 'Chief Executive',
  country: 'United Kingdom',
  topic: 'diagnostic',
  message: 'Hello',
  consent: 'yes',
};

test('serves pages with security headers', async () => {
  const res = await fetch(`${base}/`);
  assert.equal(res.status, 200);
  assert.match(res.headers.get('content-security-policy'), /default-src 'self'/);
  assert.match(await res.text(), /AI is changing the fundamentals of business/);
});

test('serves clean URLs and a 404 page', async () => {
  assert.equal((await fetch(`${base}/about`)).status, 200);
  assert.equal((await fetch(`${base}/insights/the-four-fundamentals`)).status, 200);
  const missing = await fetch(`${base}/nope`);
  assert.equal(missing.status, 404);
  assert.match(await missing.text(), /Page not found/);
});

test('health check', async () => {
  const res = await fetch(`${base}/healthz`);
  assert.equal(await res.text(), 'ok');
});

test('accepts a valid JSON enquiry', async () => {
  const res = await post(valid);
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { ok: true });
  assert.equal(sent.at(-1).email, 'ada@example.com');
});

test('rejects an invalid email', async () => {
  const res = await post({ ...valid, email: 'not-an-email' });
  assert.equal(res.status, 400);
  assert.match((await res.json()).error, /valid business email/);
});

for (const field of ['name', 'organisation', 'role', 'country', 'topic']) {
  test(`requires ${field}`, async () => {
    const res = await post({ ...valid, [field]: '' });
    assert.equal(res.status, 400);
  });
}

test('requires privacy consent', async () => {
  const { consent, ...withoutConsent } = valid;
  const res = await post(withoutConsent);
  assert.equal(res.status, 400);
  assert.match((await res.json()).error, /Privacy Policy/);
});

test('message and marketing opt-in are optional, and opt-in defaults to no', async () => {
  const { message, ...withoutMessage } = valid;
  assert.equal((await post(withoutMessage)).status, 200);
  assert.equal(sent.at(-1).marketing, false);
  await post({ ...valid, marketing: 'yes' });
  assert.equal(sent.at(-1).marketing, true);
});

test('drops honeypot submissions without sending', async () => {
  const before = sent.length;
  const res = await post({ ...valid, website: 'http://spam.example' });
  assert.equal(res.status, 200);
  assert.equal(sent.length, before);
});

test('redirects plain form posts back to the contact page', async () => {
  const ok = await post(valid, false);
  assert.equal(ok.status, 303);
  assert.equal(ok.headers.get('location'), '/enquiry-received');
  const bad = await post({ ...valid, name: '' }, false);
  assert.equal(bad.headers.get('location'), '/contact?error=1');
});

test('reports delivery failures', async () => {
  failNext = true;
  const res = await post(valid);
  assert.equal(res.status, 502);
});

test('rate limits repeated submissions', async () => {
  const limited = createApp({ sendEnquiry: async () => {}, rateLimit: { limit: 2 } }).listen(0);
  await new Promise(r => limited.once('listening', r));
  const url = `http://127.0.0.1:${limited.address().port}/api/contact`;
  const send = () => fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(valid) });
  try {
    assert.equal((await send()).status, 200);
    assert.equal((await send()).status, 200);
    assert.equal((await send()).status, 429);
  } finally {
    limited.close();
  }
});

test('validateEnquiry strips newlines and rejects unknown topics', () => {
  const { enquiry } = validateEnquiry({ ...valid, name: 'Ada\r\nBcc: x@y.z' });
  assert.equal(enquiry.name, 'Ada Bcc: x@y.z');
  assert.match(validateEnquiry({ ...valid, topic: 'nonsense' }).error, /discuss/);
});

test('sendWithResend refuses to run unconfigured', async () => {
  await assert.rejects(sendWithResend(validateEnquiry(valid).enquiry, {}), /not configured/);
});

test('permanently redirects old and non-canonical paths, one to one', async () => {
  const cases = {
    '/index.html': '/',
    '/about.html': '/about',
    '/about/': '/about',
    '/insights/the-four-fundamentals.html': '/insights/the-four-fundamentals',
    '/rd.html': '/research-and-development',
    '/rd': '/research-and-development',
    '/contact.html?topic=diagnostic': '/contact?topic=diagnostic',
  };
  for (const [from, to] of Object.entries(cases)) {
    const res = await fetch(`${base}${from}`, { redirect: 'manual' });
    assert.equal(res.status, 301, from);
    assert.equal(res.headers.get('location'), to, from);
  }
});

test('the bare domain and http redirect to the canonical https://www origin', async () => {
  const app = createApp({ siteUrl: 'https://www.example.com', sendEnquiry: async () => {} }).listen(0);
  await new Promise(r => app.once('listening', r));
  const port = app.address().port;
  const get = (host, proto = 'https') =>
    new Promise((resolve, reject) => {
      http.get({ host: '127.0.0.1', port, path: '/about', headers: { Host: host, 'X-Forwarded-Proto': proto } }, res => {
        res.resume();
        resolve({ status: res.statusCode, headers: { get: name => res.headers[name] ?? null } });
      }).on('error', reject);
    });
  try {
    assert.equal((await get('example.com')).headers.get('location'), 'https://www.example.com/about');
    assert.equal((await get('www.example.com', 'http')).headers.get('location'), 'https://www.example.com/about');
    const canonicalRes = await get('www.example.com');
    assert.equal(canonicalRes.status, 200);
    assert.equal(canonicalRes.headers.get('x-robots-tag'), null);
    const preview = await get('comet.up.railway.app');
    assert.equal(preview.status, 200);
    assert.equal(preview.headers.get('x-robots-tag'), 'noindex', 'non-canonical hosts are never indexed');
  } finally {
    app.close();
  }
});

test('robots.txt, sitemap.xml and llms.txt are served', async () => {
  const robots = await (await fetch(`${base}/robots.txt`)).text();
  assert.match(robots, /User-agent: OAI-SearchBot[\s\S]*?Allow: \//);
  assert.match(robots, /User-agent: GPTBot[\s\S]*?Disallow: \/\n/);
  assert.match(robots, /Sitemap: https:\/\/www\.comet-innovations\.com\/sitemap\.xml/);
  const sitemap = await fetch(`${base}/sitemap.xml`);
  assert.match(sitemap.headers.get('content-type'), /xml/);
  assert.match(await (await fetch(`${base}/llms.txt`)).text(), /^# Comet Innovations/);
});

test('compresses responses and caches versioned assets for a year', async () => {
  const page = await fetch(`${base}/`, { headers: { 'Accept-Encoding': 'gzip' } });
  assert.equal(page.headers.get('content-encoding'), 'gzip');
  const html = await page.text();
  const css = html.match(/href="(\/styles\.css\?v=[0-9a-f]+)"/)[1];
  assert.match((await fetch(`${base}${css}`)).headers.get('cache-control'), /immutable/);
});
