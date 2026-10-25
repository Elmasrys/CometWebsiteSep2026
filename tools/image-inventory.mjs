// Writes docs/image-inventory.md from src/content/images.json, marking each slot as live or awaiting photography.
// Run: node tools/image-inventory.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const { slots } = JSON.parse(fs.readFileSync(path.join(root, 'src/content/images.json'), 'utf8'));
const live = s => fs.existsSync(path.join(root, 'public/images', `${s.file}-${Math.max(...s.widths)}.jpg`));
const esc = v => String(v ?? '').replace(/\|/g, '\\|');
const entries = Object.entries(slots);
const waiting = entries.filter(([, s]) => !live(s));

const lines = [
  '# Comet Innovations: photography inventory',
  '',
  'Generated from `src/content/images.json` by `node tools/image-inventory.mjs`. Do not edit by hand.',
  '',
  `**${entries.length - waiting.length} of ${entries.length} slots are live; ${waiting.length} await approved photography.** Slots without photography keep their typographic composition, so nothing placeholder-like is published. The visual redesign is not final until these photographs are integrated and reviewed.`,
  '',
  '## How to add a photograph',
  '',
  '1. Save the licensed master in `assets/source/` under the slot\'s master filename (JPEG, highest available resolution, no grading or watermark).',
  '2. Record the source, photographer and licence in the slot\'s `credit` field in `src/content/images.json`, and set `alt` if the image carries information.',
  '3. Run `python3 tools/grade-images.py` (house grade plus AVIF, WebP and JPEG at each width), then `node tools/image-inventory.mjs`.',
  '4. Run `npm test` and review the page; adjust the slot\'s `focal` point if the crop needs it.',
  '',
  '## Shared photographic treatment',
  '',
  'Contemporary editorial, medium-format character, restrained saturation, neutral and subtly warm, soft diffused natural light, deep but lifted shadows, preserved highlights, subtle grain, strong composition, authentic material texture. The grading script applies the house look; supply ungraded, naturally lit originals. Avoid stock-business clichés, futuristic AI imagery, glowing networks, holograms and robots.',
  '',
  '## Summary',
  '',
  '| Status | Slot | Master filename | Page | Ratio | Minimum master |',
  '| --- | --- | --- | --- | --- | --- |',
  ...entries.map(([n, s]) => `| ${live(s) ? 'Live' : 'Awaiting'} | \`${n}\` | \`assets/source/${s.master}\` | ${esc(s.page)} | ${esc(s.ratio)} | ${esc(s.dimensions)} |`),
  '',
  '## Slot briefs',
  '',
  ...entries.flatMap(([n, s]) => [
    `### \`${n}\` (${live(s) ? 'live' : 'awaiting photography'})`,
    '',
    `- **Page:** ${s.page}`,
    `- **Placement:** ${s.placement}`,
    `- **Subject:** ${s.subject}`,
    `- **Composition:** ${s.composition}`,
    `- **Aspect ratio:** ${s.ratio}; **focal point:** ${s.focal}`,
    `- **Master:** \`assets/source/${s.master}\`, ${s.dimensions}; outputs \`public/images/${s.file}-{${s.widths.join(',')}}.{avif,webp}\` and \`.jpg\` at ${Math.max(...s.widths)}px`,
    `- **Credit and licence:** ${s.credit || 'to be recorded on delivery'}`,
    '',
  ]),
];
fs.writeFileSync(path.join(root, 'docs/image-inventory.md'), lines.join('\n'));
console.log(`docs/image-inventory.md: ${entries.length} slots, ${waiting.length} awaiting photography`);
