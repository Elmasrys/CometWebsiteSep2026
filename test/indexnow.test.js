import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { changedUrls, notifyIndexNow } from '../indexnow.js';

test('changedUrls reports added, changed and removed pages only', () => {
  const previous = { 'https://x/a': '1', 'https://x/b': '2', 'https://x/gone': '3' };
  const current = { 'https://x/a': '1', 'https://x/b': '9', 'https://x/new': '4' };
  assert.deepEqual(changedUrls(previous, current).sort(), ['https://x/b', 'https://x/gone', 'https://x/new']);
  assert.deepEqual(changedUrls(current, current), []);
  assert.deepEqual(changedUrls(null, current).sort(), Object.keys(current).sort());
});

function setup(liveSequence) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'indexnow-'));
  const current = { 'https://www.example.com/': 'h1', 'https://www.example.com/insights/a': 'new' };
  const manifestPath = path.join(dir, 'm.json');
  fs.writeFileSync(manifestPath, JSON.stringify(current));
  const calls = [];
  let i = 0;
  const fetchImpl = async (url, opts = {}) => {
    calls.push({ url, body: opts.body });
    if (url.endsWith('/indexnow-manifest.json')) {
      const live = liveSequence[Math.min(i++, liveSequence.length - 1)];
      if (live === 404) return { status: 404, ok: false };
      return { status: 200, ok: true, json: async () => (live === 'current' ? current : live) };
    }
    return { status: 202, ok: true };
  };
  const log = { info() {}, warn() {} };
  return { current, manifestPath, calls, fetchImpl, log };
}

test('submits only changed URLs, and only once the new build is live', async () => {
  const old = { 'https://www.example.com/': 'h1', 'https://www.example.com/insights/a': 'old' };
  const s = setup([old, old, 'current']);
  const result = await notifyIndexNow({ siteUrl: 'https://www.example.com', key: 'k', manifestPath: s.manifestPath, fetchImpl: s.fetchImpl, log: s.log, pollMs: 1 });
  assert.deepEqual(result.submitted, ['https://www.example.com/insights/a']);
  const submission = JSON.parse(s.calls.find(c => c.url.includes('api.indexnow.org')).body);
  assert.equal(submission.host, 'www.example.com');
  assert.equal(submission.keyLocation, 'https://www.example.com/k.txt');
});

test('does nothing when no page changed', async () => {
  const s = setup(['current']);
  const result = await notifyIndexNow({ siteUrl: 'https://www.example.com', key: 'k', manifestPath: s.manifestPath, fetchImpl: s.fetchImpl, log: s.log, pollMs: 1 });
  assert.deepEqual(result.submitted, []);
  assert.ok(!s.calls.some(c => c.url.includes('api.indexnow.org')));
});

test('does not resubmit everything when the live manifest cannot be read', async () => {
  const s = setup([]);
  s.fetchImpl = async () => { throw new Error('network down'); };
  const result = await notifyIndexNow({ siteUrl: 'https://www.example.com', key: 'k', manifestPath: s.manifestPath, fetchImpl: s.fetchImpl, log: s.log, pollMs: 1 });
  assert.deepEqual(result.submitted, []);
});
