// Notifies IndexNow (Bing, Yandex, Seznam, Naver and other participating engines) about pages that changed
// in a deploy. Each build writes dist/indexnow-manifest.json: a fingerprint of every indexable page.
// When a new instance starts, it compares its manifest with the one the live site is still serving,
// waits until the new build is live, and submits only the URLs that were added, changed or removed.
import fs from 'node:fs';

const sleep = ms => new Promise(r => setTimeout(r, ms));

/** URLs whose fingerprint differs between two manifests, including removed pages. */
export function changedUrls(previous, current) {
  if (!previous) return Object.keys(current);
  const changed = Object.keys(current).filter(url => previous[url] !== current[url]);
  const removed = Object.keys(previous).filter(url => !(url in current));
  return [...changed, ...removed];
}

const sameManifest = (a, b) => JSON.stringify(a) === JSON.stringify(b);

async function liveManifest(siteUrl, fetchImpl) {
  const res = await fetchImpl(`${siteUrl}/indexnow-manifest.json`, { signal: AbortSignal.timeout(10_000), headers: { 'Cache-Control': 'no-cache' } });
  if (res.status === 404) return null; // first deploy with IndexNow
  if (!res.ok) throw new Error(`live manifest responded ${res.status}`);
  return res.json();
}

export async function notifyIndexNow({
  siteUrl,
  key,
  manifestPath,
  fetchImpl = fetch,
  log = console,
  waitForLiveMs = 10 * 60_000,
  pollMs = 30_000,
}) {
  const current = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  let previous;
  try {
    previous = await liveManifest(siteUrl, fetchImpl);
  } catch (err) {
    log.warn(`IndexNow: could not read the live manifest (${err.message}); skipping to avoid resubmitting unchanged URLs.`);
    return { submitted: [] };
  }
  const urls = changedUrls(previous, current);
  if (!urls.length) {
    log.info('IndexNow: no changed URLs.');
    return { submitted: [] };
  }

  // Submit only once this build is the one being served, so crawlers fetch the new content.
  const deadline = Date.now() + waitForLiveMs;
  for (;;) {
    try {
      if (sameManifest(await liveManifest(siteUrl, fetchImpl), current)) break;
    } catch {
      /* keep waiting */
    }
    if (Date.now() >= deadline) {
      log.warn('IndexNow: new build did not go live in time; not submitting.');
      return { submitted: [] };
    }
    await sleep(pollMs);
  }

  const host = new URL(siteUrl).hostname;
  const res = await fetchImpl('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host, key, keyLocation: `${siteUrl}/${key}.txt`, urlList: urls }),
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok && res.status !== 202) {
    log.warn(`IndexNow: submission responded ${res.status}.`);
    return { submitted: [], status: res.status };
  }
  log.info(`IndexNow: submitted ${urls.length} URL(s).`);
  return { submitted: urls, status: res.status };
}
