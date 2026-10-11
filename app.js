import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const publicDir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'public');

export const TOPICS = {
  diagnostic: 'The Fundamentals Diagnostic',
  'value-creation': 'Value Creation',
  'work-redesign': 'Work Redesign',
  'operating-model': 'Operating Model',
  'venture-building': 'Venture Building',
  education: 'Education & Capability',
  other: 'Something Else',
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const oneLine = v => String(v ?? '').replace(/[\r\n]+/g, ' ').trim();

/** Returns { enquiry } or { error } for a submitted contact form body. */
export function validateEnquiry(body = {}) {
  const enquiry = {
    name: oneLine(body.name),
    organisation: oneLine(body.organisation),
    email: oneLine(body.email),
    topic: oneLine(body.topic),
    message: String(body.message ?? '').trim(),
  };
  if (!enquiry.name || enquiry.name.length > 200) return { error: 'Please enter your name.' };
  if (enquiry.organisation.length > 200) return { error: 'Organisation name is too long.' };
  if (!EMAIL_RE.test(enquiry.email) || enquiry.email.length > 254) return { error: 'Please enter a valid email address.' };
  if (!(enquiry.topic in TOPICS)) enquiry.topic = 'other';
  if (enquiry.message.length > 5000) return { error: 'Please keep your message under 5,000 characters.' };
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
        `Organisation: ${enquiry.organisation || '-'}`,
        `Email: ${enquiry.email}`,
        `Topic: ${topic}`,
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
  return res.redirect(303, status < 300 ? '/contact.html?sent=1' : '/contact.html?error=1');
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

export function createApp({ sendEnquiry = sendWithResend, log = console, rateLimit = {} } = {}) {
  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', 1); // Railway terminates TLS in front of the app

  app.use((req, res, next) => {
    res.set(SECURITY_HEADERS);
    next();
  });

  app.get('/healthz', (req, res) => res.type('text').send('ok'));

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

  app.use(
    express.static(publicDir, {
      extensions: ['html'],
      setHeaders(res, filePath) {
        if (filePath.includes(`${path.sep}fonts${path.sep}`)) {
          res.set('Cache-Control', 'public, max-age=31536000, immutable');
        } else if (/\.(svg|png|jpe?g|webp|avif)$/.test(filePath)) {
          res.set('Cache-Control', 'public, max-age=86400');
        } else {
          res.set('Cache-Control', 'no-cache');
        }
      },
    }),
  );

  app.use((req, res) => res.status(404).sendFile(path.join(publicDir, '404.html')));
  return app;
}
