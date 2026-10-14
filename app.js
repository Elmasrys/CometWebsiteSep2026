import compression from 'compression';
import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
// The built site (see build.js). `npm start` builds it first.
const siteDir = path.join(ROOT, 'dist');
const configuredSiteUrl = () =>
  process.env.SITE_URL || JSON.parse(fs.readFileSync(path.join(ROOT, 'src', 'content', 'site.json'), 'utf8')).url;

/** Old URLs that map to a different page, one to one. `.html` suffixes are handled generically. */
export const LEGACY_REDIRECTS = { '/rd': '/research-and-development', '/index': '/' };

export const TOPICS = {
  diagnostic: 'The Fundamentals Diagnostic',
  'value-creation': 'Value Creation',
  'work-redesign': 'Work Redesign',
  'operating-model': 'Operating Model',
  'venture-building': 'Venture Building',
  education: 'Education and capability programmes',
  other: 'Other',
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const oneLine = v => String(v ?? '').replace(/[\r\n]+/g, ' ').trim();
const ticked = v => v === true || v === 'yes' || v === 'on' || v === 'true';

/** Returns { enquiry } or { error } for a submitted contact form body. */
export function validateEnquiry(body = {}) {
  const enquiry = {
    name: oneLine(body.name),
    email: oneLine(body.email),
    organisation: oneLine(body.organisation),
    role: oneLine(body.role),
    country: oneLine(body.country),
    topic: oneLine(body.topic),
    message: String(body.message ?? '').trim(),
    consent: ticked(body.consent),
    marketing: ticked(body.marketing),
  };
  const required = [
    ['name', 200, 'Please enter your name.'],
    ['organisation', 200, 'Please enter your organisation.'],
    ['role', 200, 'Please enter your role.'],
    ['country', 120, 'Please enter your country or region.'],
  ];
  for (const [field, max, message] of required) {
    if (!enquiry[field] || enquiry[field].length > max) return { error: message };
  }
  if (!EMAIL_RE.test(enquiry.email) || enquiry.email.length > 254) return { error: 'Please enter a valid business email address.' };
  if (!(enquiry.topic in TOPICS)) return { error: 'Please choose what you would like to discuss.' };
  if (enquiry.message.length > 5000) return { error: 'Please keep your message under 5,000 characters.' };
  if (!enquiry.consent) return { error: 'Please confirm that we may process your information in accordance with the Privacy Policy.' };
  return { enquiry };
}

/** Sends an enquiry through the Resend API. Configured with environment variables. */
export async function sendWithResend(enquiry, env = process.env) {
  const { RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL } = env;
  if (!RESEND_API_KEY || !CONTACT_TO_EMAIL || !CONTACT_FROM_EMAIL) {
    throw new Error('Contact form is not configured: set RESEND_API_KEY, CONTACT_TO_EMAIL and CONTACT_FROM_EMAIL.');
  }
  const topic = TOPICS[enquiry.topic];
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: CONTACT_FROM_EMAIL,
      to: CONTACT_TO_EMAIL.split(',').map(s => s.trim()),
      reply_to: enquiry.email,
      subject: `Website enquiry: ${topic} (${enquiry.name})`,
      text: [
        `Name: ${enquiry.name}`,
        `Business email: ${enquiry.email}`,
        `Organisation: ${enquiry.organisation}`,
        `Role: ${enquiry.role}`,
        `Country or region: ${enquiry.country}`,
        `Topic: ${topic}`,
        `Privacy consent: given at ${new Date().toISOString()}`,
        `Marketing opt-in: ${enquiry.marketing ? 'yes' : 'no'}`,
        '',
        enquiry.message || '(no message)',
      ].join('\n'),
    }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error(`Resend responded ${res.status}: ${await res.text()}`);
}

/** Small in-memory limiter: at most `limit` submissions per IP per window. */
function rateLimiter({ limit = 5, windowMs = 10 * 60_000 } = {}) {
  const hits = new Map();
  setInterval(() => {
    const cutoff = Date.now() - windowMs;
    for (const [ip, times] of hits) {
      const recent = times.filter(t => t > cutoff);
      recent.length ? hits.set(ip, recent) : hits.delete(ip);
    }
  }, windowMs).unref();
  return (req, res, next) => {
    const now = Date.now();
    const times = (hits.get(req.ip) || []).filter(t => t > now - windowMs);
    if (times.length >= limit) return reply(req, res, 429, { error: 'Too many enquiries. Please try again later.' });
    times.push(now);
    hits.set(req.ip, times);
    next();
  };
}

const wantsJson = req => (req.get('accept') || '').includes('application/json');

function reply(req, res, status, body) {
  if (wantsJson(req)) return res.status(status).json(body);
  // Without JavaScript the form posts normally: send the visitor back to the page.
  return res.redirect(303, status < 300 ? '/enquiry-received' : '/contact?error=1');
}

const SECURITY_HEADERS = {
  'Content-Security-Policy': [
    "default-src 'self'",
    "img-src 'self' data:",
    "style-src 'self'",
    "script-src 'self'",
    "font-src 'self'",
    "connect-src 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "object-src 'none'",
  ].join('; '),
  'Strict-Transport-Security': 'max-age=31536000',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

export function createApp({
  sendEnquiry = sendWithResend,
  log = console,
  rateLimit = {},
  siteUrl = configuredSiteUrl(),
  redirectToCanonical = process.env.REDIRECT_TO_CANONICAL === 'true',
  indexNowKey = process.env.INDEXNOW_KEY,
} = {}) {
  const canonical = new URL(siteUrl);
  const apexHost = canonical.hostname.replace(/^www\./, '');
  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', 1); // Railway terminates TLS in front of the app

  app.use((req, res, next) => {
    res.set(SECURITY_HEADERS);
    next();
  });
  app.use(compression());

  app.get('/healthz', (req, res) => res.type('text').send('ok'));

  // One host, one protocol: the bare domain and http go to the canonical origin. Other hosts (the Railway
  // address, previews) are redirected only when REDIRECT_TO_CANONICAL=true, and are never indexed.
  app.use((req, res, next) => {
    const host = req.hostname;
    const local = host === 'localhost' || host === '127.0.0.1';
    const toCanonical = () => res.redirect(301, `${canonical.origin}${req.originalUrl}`);
    if (host === apexHost && apexHost !== canonical.hostname) return toCanonical();
    if (host === canonical.hostname) {
      if (canonical.protocol === 'https:' && req.protocol !== 'https') return toCanonical();
      return next();
    }
    if (redirectToCanonical && !local) return toCanonical();
    res.set('X-Robots-Tag', 'noindex');
    next();
  });

  // Clean, stable URLs: /about rather than /about.html, no trailing slash, legacy paths mapped one to one.
  app.use((req, res, next) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') return next();
    let target = req.path;
    if (target.length > 1) target = target.replace(/\/+$/, '');
    target = target.replace(/\.html$/, '');
    target = LEGACY_REDIRECTS[target] ?? target;
    if (target === req.path) return next();
    const query = req.originalUrl.slice(req.originalUrl.indexOf('?') === -1 ? req.originalUrl.length : req.originalUrl.indexOf('?'));
    return res.redirect(301, `${target || '/'}${query}`);
  });

  if (indexNowKey) app.get(`/${indexNowKey}.txt`, (req, res) => res.type('text').send(indexNowKey));

  app.post(
    '/api/contact',
    rateLimiter(rateLimit),
    express.json({ limit: '20kb' }),
    express.urlencoded({ extended: false, limit: '20kb' }),
    async (req, res) => {
      if (req.body?.website) return reply(req, res, 200, { ok: true }); // honeypot: quietly drop bots
      const { enquiry, error } = validateEnquiry(req.body);
      if (error) return reply(req, res, 400, { error });
      try {
        await sendEnquiry(enquiry);
        return reply(req, res, 200, { ok: true });
      } catch (err) {
        log.error('Contact form delivery failed:', err.message);
        return reply(req, res, 502, {
          error: 'Sorry, we could not send your enquiry just now. Please try again shortly.',
        });
      }
    },
  );

  // Pages: /about -> dist/about.html, /insights/x -> dist/insights/x.html, / -> dist/index.html.
  app.use((req, res, next) => {
    if ((req.method !== 'GET' && req.method !== 'HEAD') || path.extname(req.path)) return next();
    const rel = req.path === '/' ? 'index.html' : `${req.path.slice(1)}.html`;
    if (rel === '404.html') return next();
    const file = path.join(siteDir, rel);
    if (!file.startsWith(siteDir + path.sep)) return next();
    fs.stat(file, (err, stat) => {
      if (err || !stat.isFile()) return next();
      res.set('Cache-Control', 'no-cache');
      res.sendFile(file);
    });
  });

  app.use(
    express.static(siteDir, {
      index: false,
      redirect: false,
      setHeaders(res, filePath) {
        if (res.req?.query?.v || filePath.includes(`${path.sep}fonts${path.sep}`)) {
          res.set('Cache-Control', 'public, max-age=31536000, immutable');
        } else if (/\.(svg|png|jpe?g|webp|avif)$/.test(filePath)) {
          res.set('Cache-Control', 'public, max-age=86400');
        } else if (/\.(txt|xml)$/.test(filePath)) {
          res.set('Cache-Control', 'public, max-age=3600');
        } else {
          res.set('Cache-Control', 'no-cache');
        }
      },
    }),
  );

  app.use((req, res) => res.status(404).set('Cache-Control', 'no-cache').sendFile(path.join(siteDir, '404.html')));
  return app;
}
