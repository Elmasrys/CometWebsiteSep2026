# Comet Innovations: photography inventory

Generated from `src/content/images.json` by `node tools/image-inventory.mjs`. Do not edit by hand.

**12 of 25 slots are live; 13 await approved photography.** Slots without photography keep their typographic composition, so nothing placeholder-like is published. The visual redesign is not final until these photographs are integrated and reviewed.

## How to add a photograph

1. Save the licensed master in `assets/source/` under the slot's master filename (JPEG, highest available resolution, no grading or watermark).
2. Record the source, photographer and licence in the slot's `credit` field in `src/content/images.json`, and set `alt` if the image carries information.
3. Run `python3 tools/grade-images.py` (house grade plus AVIF, WebP and JPEG at each width), then `node tools/image-inventory.mjs`.
4. Run `npm test` and review the page; adjust the slot's `focal` point if the crop needs it.

## Shared photographic treatment

Contemporary editorial, medium-format character, restrained saturation, neutral and subtly warm, soft diffused natural light, deep but lifted shadows, preserved highlights, subtle grain, strong composition, authentic material texture. The grading script keeps each photograph in colour and applies the house tone (lifted shadows, soft highlights, fine grain); supply ungraded, naturally lit colour originals. Avoid stock-business clichés, futuristic AI imagery, glowing networks, holograms and robots.

## Summary

| Status | Slot | Master filename | Page | Ratio | Minimum master |
| --- | --- | --- | --- | --- | --- |
| Live | `home_opening` | `assets/source/gateway.jpg` | Home | 3:4 frame (master 16:10) | Master at least 2400 × 1500; existing 1586 × 992 accepted, 2400 × 1500 re-export preferred |
| Live | `about_plate` | `assets/source/gateway.jpg` | About | fills hero plate (about 2:3) | Shares the Gateway master |
| Live | `home_fundamentals` | `assets/source/fundamentals-architecture.jpg` | Home | 4:5 | 2000 × 2500 minimum |
| Live | `industry_private_equity` | `assets/source/industry-private-equity.jpg` | Private Equity; Home section 04; Industries | 4:5 (hero) and 3:2 (home markets) | 2400 × 3000 minimum (subject centred so a 3:2 crop also works) |
| Live | `industry_private_equity_detail` | `assets/source/industry-private-equity-detail.jpg` | Private Equity | 21:9 | 3000 × 1286 minimum |
| Live | `industry_government` | `assets/source/industry-government.jpg` | Government; Home section 04; Industries | 3:2 | 2400 × 1600 minimum |
| Live | `industry_government_detail` | `assets/source/industry-government-detail.jpg` | Government | 21:9 | 3000 × 1286 minimum |
| Live | `industry_energy` | `assets/source/industry-energy.jpg` | Energy; Home section 04; Industries | 21:9 (hero) and 3:2 (home markets) | 3600 × 1543 minimum (subject centred for a 3:2 crop) |
| Live | `industry_energy_detail` | `assets/source/industry-energy-detail.jpg` | Energy | 4:5 | 2000 × 2500 minimum |
| Live | `advise_hero` | `assets/source/advise.jpg` | Advise | 4:5 | 2000 × 2500 minimum |
| Awaiting | `advise_context` | `assets/source/advise-context.jpg` | Advise | 16:9 | 3000 × 1688 minimum |
| Live | `educate_hero` | `assets/source/educate.jpg` | Educate | 16:9 | 3000 × 1688 minimum |
| Awaiting | `educate_detail` | `assets/source/educate-detail.jpg` | Educate | 4:5 | 2000 × 2500 minimum |
| Live | `engineer_hero` | `assets/source/engineer.jpg` | Engineer | 3:2 | 2400 × 1600 minimum |
| Awaiting | `engineer_artefact` | `assets/source/engineer-artefact.png` | Engineer | 16:10 | 2560 × 1600 minimum |
| Awaiting | `fundamentals_overview` | `assets/source/fundamentals-overview.jpg` | The Four Fundamentals | 21:9 | 3600 × 1543 minimum |
| Awaiting | `fundamentals_value` | `assets/source/fundamentals-value.jpg` | The Four Fundamentals | 4:5 | 2000 × 2500 minimum |
| Awaiting | `fundamentals_work` | `assets/source/fundamentals-work.jpg` | The Four Fundamentals | 4:5 | 2000 × 2500 minimum |
| Awaiting | `fundamentals_organisation` | `assets/source/fundamentals-organisation.jpg` | The Four Fundamentals | 4:5 | 2000 × 2500 minimum |
| Awaiting | `fundamentals_growth` | `assets/source/fundamentals-growth.jpg` | The Four Fundamentals | 4:5 | 2000 × 2500 minimum |
| Awaiting | `about_founder` | `assets/source/founder.jpg` | About; Home section 06 | 4:5 | 1600 × 2000 minimum |
| Awaiting | `research_hero` | `assets/source/research.jpg` | Research & Development | 3:2 | 2400 × 1600 minimum |
| Awaiting | `insight_economics` | `assets/source/insight-economics.jpg` | Home section 07; Insights | 3:2 | 2400 × 1600 minimum |
| Awaiting | `insight_fundamentals` | `assets/source/insight-fundamentals.jpg` | Home section 07; Insights | 3:2 | 2400 × 1600 minimum |
| Awaiting | `insight_build_next` | `assets/source/insight-build-next.jpg` | Home section 07; Insights | 3:2 | 2400 × 1600 minimum |

## Slot briefs

### `home_opening` (live)

- **Page:** Home
- **Placement:** Section 01, opening: right half of the screen, full height of the opening, framed with margin
- **Subject:** The Gateway: a figure walking through monumental stone walls towards an opening onto a horizon
- **Composition:** Approved. Tall walls on the left, opening and figure right of centre; crop keeps the figure and the far horizon
- **Aspect ratio:** 3:4 frame (master 16:10); **focal point:** 66% 60%
- **Master:** `assets/source/gateway.jpg`, Master at least 2400 × 1500; existing 1586 × 992 accepted, 2400 × 1500 re-export preferred; outputs `public/images/home-hero-{960,1586}.{avif,webp}` and `.jpg` at 1586px
- **Credit and licence:** Comet Innovations commissioned artwork (approved October 2026)

### `about_plate` (live)

- **Page:** About
- **Placement:** Opening plate, right third, bleeding to the right edge
- **Subject:** Detail crop of the Gateway: the single figure and long shadow
- **Composition:** Crop to the figure and threshold; no new master required
- **Aspect ratio:** fills hero plate (about 2:3); **focal point:** 84% 60%
- **Master:** `assets/source/gateway.jpg`, Shares the Gateway master; outputs `public/images/home-hero-{960,1586}.{avif,webp}` and `.jpg` at 1586px
- **Credit and licence:** Comet Innovations commissioned artwork

### `home_fundamentals` (live)

- **Page:** Home
- **Placement:** Section 05, The Four Fundamentals: tall image in the left columns beside the four questions
- **Subject:** Contemporary monumental architecture with Egyptian proportions: tapered planes, a deep threshold or a colonnade in diffused daylight
- **Composition:** Strong verticals, one dominant mass, generous negative space at top; no pyramids, temples or hieroglyphs
- **Aspect ratio:** 4:5; **focal point:** 50% 50%
- **Master:** `assets/source/fundamentals-architecture.jpg`, 2000 × 2500 minimum; outputs `public/images/fundamentals-architecture-{960,1122}.{avif,webp}` and `.jpg` at 1122px
- **Credit and licence:** Supplied by Comet Innovations (curated collection, October 2026)

### `industry_private_equity` (live)

- **Page:** Private Equity; Home section 04; Industries
- **Placement:** Private Equity opening (image left half); featured image in the homepage markets section; Industries band
- **Subject:** An operating business: a production floor, distribution centre or industrial workshop at work
- **Composition:** People at work but not posed, depth through the space, calm light; no trading floors, skyscrapers or boardrooms
- **Aspect ratio:** 4:5 (hero) and 3:2 (home markets); **focal point:** 38% 34%
- **Master:** `assets/source/industry-private-equity.jpg`, 2400 × 3000 minimum (subject centred so a 3:2 crop also works); outputs `public/images/industry-private-equity-{960,1122}.{avif,webp}` and `.jpg` at 1122px
- **Credit and licence:** Supplied by Comet Innovations (curated collection, October 2026)

### `industry_private_equity_detail` (live)

- **Page:** Private Equity
- **Placement:** Full-bleed pause between 'An investment perspective on AI' and 'Where we focus'
- **Subject:** Portfolio-company operations at scale: a logistics yard, plant exterior or line seen from above
- **Composition:** Wide, orderly, operational; horizon or structure on a third; no logos
- **Aspect ratio:** 21:9; **focal point:** 50% 55%
- **Master:** `assets/source/industry-private-equity-detail.jpg`, 3000 × 1286 minimum; outputs `public/images/industry-private-equity-detail-{1280,1916}.{avif,webp}` and `.jpg` at 1916px
- **Credit and licence:** Supplied by Comet Innovations (curated collection, October 2026)

### `industry_government` (live)

- **Page:** Government; Home section 04; Industries
- **Placement:** Government opening (offset image beneath the title); homepage markets; Industries band
- **Subject:** A civic institution in use: the hall of a public building, a library or a transport concourse with people
- **Composition:** Institutional architecture with human scale; no flags, politicians, handshakes or ceremonies
- **Aspect ratio:** 3:2; **focal point:** 42% 62%
- **Master:** `assets/source/industry-government.jpg`, 2400 × 1600 minimum; outputs `public/images/industry-government-{960,1536}.{avif,webp}` and `.jpg` at 1536px
- **Credit and licence:** Supplied by Comet Innovations (curated collection, October 2026)

### `industry_government_detail` (live)

- **Page:** Government
- **Placement:** Full-bleed pause before 'Responsible deployment by design'
- **Subject:** Cities and urban systems: a city seen at dusk, a rail interchange or public infrastructure
- **Composition:** Systemic and calm; repeating structure; avoid landmarks that pin the image to one country
- **Aspect ratio:** 21:9; **focal point:** 62% 50%
- **Master:** `assets/source/industry-government-detail.jpg`, 3000 × 1286 minimum; outputs `public/images/industry-government-detail-{1280,1916}.{avif,webp}` and `.jpg` at 1916px
- **Credit and licence:** Supplied by Comet Innovations (curated collection, October 2026)

### `industry_energy` (live)

- **Page:** Energy; Home section 04; Industries
- **Placement:** Energy opening: full-bleed panorama under the title; homepage markets; Industries band
- **Subject:** Energy infrastructure at scale: a substation, transmission corridor, turbine hall or generation site
- **Composition:** Scale and order, people small in frame for scale where possible; no stock wind-farm sunsets
- **Aspect ratio:** 21:9 (hero) and 3:2 (home markets); **focal point:** 85% 50%
- **Master:** `assets/source/industry-energy.jpg`, 3600 × 1543 minimum (subject centred for a 3:2 crop); outputs `public/images/industry-energy-{1280,1916}.{avif,webp}` and `.jpg` at 1916px
- **Credit and licence:** Supplied by Comet Innovations (curated collection, October 2026)

### `industry_energy_detail` (live)

- **Page:** Energy
- **Placement:** Beside 'Engineering in operationally sensitive environments'
- **Subject:** A control environment or operator at physical assets: control room, switchgear, plant walkway
- **Composition:** Operational reality, screens may show but must not be readable or invented
- **Aspect ratio:** 4:5; **focal point:** 52% 45%
- **Master:** `assets/source/industry-energy-detail.jpg`, 2000 × 2500 minimum; outputs `public/images/industry-energy-detail-{960,1122}.{avif,webp}` and `.jpg` at 1122px
- **Credit and licence:** Supplied by Comet Innovations (curated collection, October 2026)

### `advise_hero` (live)

- **Page:** Advise
- **Placement:** Opening: portrait image in the right columns beside the title
- **Subject:** Strategic judgement: an authentic professional portrait of Comet's founder, or an executive environment without identifiable clients
- **Composition:** Quiet, considered, eye level; never a staged meeting presented as a Comet engagement
- **Aspect ratio:** 4:5; **focal point:** 56% 30%
- **Master:** `assets/source/advise.jpg`, 2000 × 2500 minimum; outputs `public/images/advise-{960,1122}.{avif,webp}` and `.jpg` at 1122px
- **Credit and licence:** Supplied by Comet Innovations (curated collection, October 2026)

### `advise_context` (awaiting photography)

- **Page:** Advise
- **Placement:** Full-bleed pause after 'Strategic questions, not technology prescriptions.'
- **Subject:** Organisational complexity: a headquarters atrium or working floor seen from height
- **Composition:** Layers of structure and people, restrained, no logos
- **Aspect ratio:** 16:9; **focal point:** 50% 50%
- **Master:** `assets/source/advise-context.jpg`, 3000 × 1688 minimum; outputs `public/images/advise-context-{1280,2400}.{avif,webp}` and `.jpg` at 2400px
- **Credit and licence:** to be recorded on delivery

### `educate_hero` (live)

- **Page:** Educate
- **Placement:** Opening: wide image under the title, full width
- **Subject:** Human presence in executive learning: leaders in focused discussion around a table or in a seminar room
- **Composition:** Natural light, engaged expressions, no slides or logos; only authorised Comet imagery may be presented as a Comet programme
- **Aspect ratio:** 16:9; **focal point:** 46% 40%
- **Master:** `assets/source/educate.jpg`, 3000 × 1688 minimum; outputs `public/images/educate-{1280,1672}.{avif,webp}` and `.jpg` at 1672px
- **Credit and licence:** Supplied by Comet Innovations (curated collection, October 2026)

### `educate_detail` (awaiting photography)

- **Page:** Educate
- **Placement:** Beside 'How we teach.'
- **Subject:** A single participant listening, writing or speaking; hands and notes acceptable
- **Composition:** Intimate, shallow depth of field, warm-neutral light
- **Aspect ratio:** 4:5; **focal point:** 50% 40%
- **Master:** `assets/source/educate-detail.jpg`, 2000 × 2500 minimum; outputs `public/images/educate-detail-{960,1600}.{avif,webp}` and `.jpg` at 1600px
- **Credit and licence:** to be recorded on delivery

### `engineer_hero` (live)

- **Page:** Engineer
- **Placement:** Opening: offset image beneath the title
- **Subject:** Technical work in progress: engineers at workstations, a whiteboard architecture session or hardware on a bench
- **Composition:** Precise and practical; screens unreadable unless showing genuine Comet work
- **Aspect ratio:** 3:2; **focal point:** 52% 40%
- **Master:** `assets/source/engineer.jpg`, 2400 × 1600 minimum; outputs `public/images/engineer-{960,1536}.{avif,webp}` and `.jpg` at 1536px
- **Credit and licence:** Supplied by Comet Innovations (curated collection, October 2026)

### `engineer_artefact` (awaiting photography)

- **Page:** Engineer
- **Placement:** Beside 'Our engineering capabilities'
- **Subject:** A genuine Comet artefact: a real product interface, architecture diagram or demonstration still
- **Composition:** Only authentic material; never a mock-up of a fictional project; set alt text to describe it
- **Aspect ratio:** 16:10; **focal point:** 50% 50%
- **Master:** `assets/source/engineer-artefact.png`, 2560 × 1600 minimum; outputs `public/images/engineer-artefact-{1280,2000}.{avif,webp}` and `.jpg` at 2000px
- **Credit and licence:** to be recorded on delivery

### `fundamentals_overview` (awaiting photography)

- **Page:** The Four Fundamentals
- **Placement:** Full-bleed image under the opening title
- **Subject:** A monumental contemporary courtyard or long wall with Egyptian proportions
- **Composition:** Symmetry or a single strong axis, deep lifted shadow, vast negative space
- **Aspect ratio:** 21:9; **focal point:** 50% 50%
- **Master:** `assets/source/fundamentals-overview.jpg`, 3600 × 1543 minimum; outputs `public/images/fundamentals-overview-{1280,2400}.{avif,webp}` and `.jpg` at 2400px
- **Credit and licence:** to be recorded on delivery

### `fundamentals_value` (awaiting photography)

- **Page:** The Four Fundamentals
- **Placement:** Value section, left column
- **Subject:** Mass: a single monolithic volume in light
- **Composition:** One form, one light source, no ornament
- **Aspect ratio:** 4:5; **focal point:** 50% 50%
- **Master:** `assets/source/fundamentals-value.jpg`, 2000 × 2500 minimum; outputs `public/images/fundamentals-value-{960,1600}.{avif,webp}` and `.jpg` at 1600px
- **Credit and licence:** to be recorded on delivery

### `fundamentals_work` (awaiting photography)

- **Page:** The Four Fundamentals
- **Placement:** Work section, left column
- **Subject:** Rhythm: a colonnade or repeated planes
- **Composition:** Repetition receding in perspective
- **Aspect ratio:** 4:5; **focal point:** 50% 50%
- **Master:** `assets/source/fundamentals-work.jpg`, 2000 × 2500 minimum; outputs `public/images/fundamentals-work-{960,1600}.{avif,webp}` and `.jpg` at 1600px
- **Credit and licence:** to be recorded on delivery

### `fundamentals_organisation` (awaiting photography)

- **Page:** The Four Fundamentals
- **Placement:** Organisation section, left column
- **Subject:** Structure: a courtyard or intersecting walls seen from above or along an axis
- **Composition:** Clear geometry, order and relationship between parts
- **Aspect ratio:** 4:5; **focal point:** 50% 50%
- **Master:** `assets/source/fundamentals-organisation.jpg`, 2000 × 2500 minimum; outputs `public/images/fundamentals-organisation-{960,1600}.{avif,webp}` and `.jpg` at 1600px
- **Credit and licence:** to be recorded on delivery

### `fundamentals_growth` (awaiting photography)

- **Page:** The Four Fundamentals
- **Placement:** Growth section, left column
- **Subject:** Aperture: a threshold opening onto light or open space
- **Composition:** Looking through an opening towards what lies beyond
- **Aspect ratio:** 4:5; **focal point:** 50% 50%
- **Master:** `assets/source/fundamentals-growth.jpg`, 2000 × 2500 minimum; outputs `public/images/fundamentals-growth-{960,1600}.{avif,webp}` and `.jpg` at 1600px
- **Credit and licence:** to be recorded on delivery

### `about_founder` (awaiting photography)

- **Page:** About; Home section 06
- **Placement:** People profile portrait; credibility section on the homepage
- **Subject:** Authentic portrait of Sherif Elmasry
- **Composition:** Editorial, natural light, plain or architectural background, colour, natural tones
- **Aspect ratio:** 4:5; **focal point:** 50% 35%
- **Master:** `assets/source/founder.jpg`, 1600 × 2000 minimum; outputs `public/images/founder-{640,1200}.{avif,webp}` and `.jpg` at 1200px
- **Credit and licence:** to be recorded on delivery

### `research_hero` (awaiting photography)

- **Page:** Research & Development
- **Placement:** Beside the stateful AI orchestration section
- **Subject:** Evidence of research: a working session, notebooks, whiteboard derivations or compute hardware
- **Composition:** Substantial and real; no glowing graphics or neural-network imagery
- **Aspect ratio:** 3:2; **focal point:** 50% 50%
- **Master:** `assets/source/research.jpg`, 2400 × 1600 minimum; outputs `public/images/research-{960,1600,2400}.{avif,webp}` and `.jpg` at 2400px
- **Credit and licence:** to be recorded on delivery

### `insight_economics` (awaiting photography)

- **Page:** Home section 07; Insights
- **Placement:** Cover for 'Where Is AI Changing Your Economics?'
- **Subject:** Commerce in motion: a market, port or trading floor detail
- **Composition:** Editorial cover, single idea
- **Aspect ratio:** 3:2; **focal point:** 50% 50%
- **Master:** `assets/source/insight-economics.jpg`, 2400 × 1600 minimum; outputs `public/images/insight-economics-{960,1600}.{avif,webp}` and `.jpg` at 1600px
- **Credit and licence:** to be recorded on delivery

### `insight_fundamentals` (awaiting photography)

- **Page:** Home section 07; Insights
- **Placement:** Cover for 'The Four Fundamentals'
- **Subject:** Architectural detail in the fundamentals series
- **Composition:** Editorial cover, single idea
- **Aspect ratio:** 3:2; **focal point:** 50% 50%
- **Master:** `assets/source/insight-fundamentals.jpg`, 2400 × 1600 minimum; outputs `public/images/insight-fundamentals-{960,1600}.{avif,webp}` and `.jpg` at 1600px
- **Credit and licence:** to be recorded on delivery

### `insight_build_next` (awaiting photography)

- **Page:** Home section 07; Insights
- **Placement:** Cover for 'What Should You Build Next?'
- **Subject:** Making: a workshop, prototype or construction in progress
- **Composition:** Editorial cover, single idea
- **Aspect ratio:** 3:2; **focal point:** 50% 50%
- **Master:** `assets/source/insight-build-next.jpg`, 2400 × 1600 minimum; outputs `public/images/insight-build-next-{960,1600}.{avif,webp}` and `.jpg` at 1600px
- **Credit and licence:** to be recorded on delivery
