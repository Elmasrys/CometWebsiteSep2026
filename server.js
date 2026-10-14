import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createApp } from './app.js';
import { notifyIndexNow } from './indexnow.js';

const port = Number(process.env.PORT) || 3000;
createApp().listen(port, () => {
  console.log(`Comet website listening on port ${port}`);
  const { INDEXNOW_KEY, INDEXNOW_ENABLED } = process.env;
  if (INDEXNOW_KEY && INDEXNOW_ENABLED !== 'false') {
    const root = path.dirname(fileURLToPath(import.meta.url));
    const siteUrl = (process.env.SITE_URL || JSON.parse(fs.readFileSync(path.join(root, 'src', 'content', 'site.json'), 'utf8')).url).replace(/\/$/, '');
    const manifestPath = path.join(root, 'dist', 'indexnow-manifest.json');
    notifyIndexNow({ siteUrl, key: INDEXNOW_KEY, manifestPath }).catch(err =>
      console.warn(`IndexNow: ${err.message}`),
    );
  }
});
