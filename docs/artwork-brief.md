# Comet Innovations: AI artwork brief

> **Direction update (October 2026).** The site has moved from a cinematic presentation to an institutional, editorial one. Inner pages now use typographic heroes and need no imagery. Any new photography should show real business environments: leadership, industry, infrastructure, cities, complex operations, architecture, markets, physical businesses and decision environments. Avoid robots, glowing brains, neural networks, holographic interfaces, blue AI clichés, people pointing at screens, handshakes and obvious stock photography. Priority 2 below (Egyptian-motif page heroes) is **superseded** and should not be generated. Images 4 to 6 (card textures) and 18 to 26 remain optional.

The site currently uses code-built placeholders (`public/images/*.svg`). This brief lists the images to generate with AI so they can be replaced with photographic artwork in the concept's visual language. Each item names the file it replaces or adds, where it appears, its size and how the composition must leave room for text.

## How to use this brief

1. **Start with image 1 (home hero).** Iterate until it feels right, because it sets the look for everything else.
2. **Use it as a style reference for the rest.** In Midjourney, use `--sref` with the hero image. In other tools, upload it as a style or reference image. This keeps light, colour and texture consistent across the set.
3. **Add the style block and the negative prompt to every prompt.**
4. **Deliver at the listed size or larger** as PNG or maximum-quality JPEG, named as listed. Claude will convert them to AVIF and WebP, produce responsive sizes, and tune the overlays so text stays readable.

### Style block (add to every prompt)

> Cinematic architectural photograph. Monumental ancient Egyptian-inspired stone architecture reinterpreted with contemporary minimalism. Warm, low golden-hour sunlight, deep sculpted shadows, limestone and sandstone textures. Restrained palette of near-black, warm umber, sand and soft gold light. Vast negative space, timeless and quiet. Medium-format camera, natural film grain, high dynamic range, editorial and understated.

### Negative prompt (add to every prompt)

> text, letters, hieroglyphs, inscriptions, carvings of figures, logos, watermarks, faces, crowds, tourists, modern buildings, vehicles, signage, blue sky, saturated colours, purple or teal tones, lens flare artefacts, fantasy, sci-fi, CGI look, plastic surfaces

**Why no hieroglyphs:** AI tools invent fake glyphs, which look wrong to anyone who reads them. The concept works through form, light and geometry, so keep stone surfaces plain.

**What AI should not make:** the Comet mark and wordmark. Image generators can't reproduce the exact logo geometry. Where the mark appears in a scene (image 16), generate the scene and Claude will composite the real mark from the SVG.

---

## Priority 1: replace the current placeholders

### 1. Home hero, desktop: "The Gateway" (delivered)

> **Status:** live as `public/images/home-hero-*` (AVIF, WebP and JPEG). The delivered file is 1586 × 992. If your tool can upscale or re-export it at 2400 × 1500, send that version for sharper results on large screens.

- **File:** `home-hero.jpg` (replaces `hero-scene.svg`)
- **Size:** 2400 × 1500 (16:10)
- **Where:** full-screen home page hero, behind the opening film and headline
- **Composition:** The camera looks down a monumental stone corridor toward an opening. The sun sits half-set on a distant desert horizon, centred in the opening at about **68% across and 60% down** the frame. The **left 45% must be deep shadow** (dark stone wall) because the headline sits there. A single small figure walks toward the light, about a fifth of the way up from the bottom, casting a long shadow toward the camera.
- **Prompt:** A vast stone corridor of monumental sandstone walls framing a tall narrow opening; through it a low sun sits on a flat desert horizon, its light pouring down the corridor floor; a single small silhouetted figure walks toward the light, casting a long shadow toward the camera; the left side of the frame is a towering wall in deep shadow; symmetrical perspective, dust in the air catching the light.

### 2. Home hero, mobile (optional now)

> **Status:** the delivered desktop image crops well on phones, so this is only needed if you want a purpose-made vertical composition.

- **File:** `home-hero-mobile.jpg`
- **Size:** 1200 × 1500 (4:5)
- **Where:** home hero on phones, where the scene sits above the headline
- **Composition:** The same scene, framed vertically. The sun is in the **upper-middle of the frame (about 55% down)**, and the **bottom 25% fades to near-black floor**, where the headline overlaps.
- **Prompt:** Same as image 1, in a tall vertical framing, centred on the opening.

### 3. Inner page hero, default: "The Horizon"
- **File:** `page-hero.jpg` (replaces `horizon.svg`)
- **Size:** 2400 × 1050 (about 16:7)
- **Where:** the hero of every inner page that doesn't get its own image below, plus the panel on the contact page
- **Composition:** A flat horizon at **about 75% down**, with the sun half-risen at **about 74% across**, between two distant tapered stone pylons. The **left half is dark, empty sky**.
- **Prompt:** A flat dark desert at dawn under a near-black sky; a half-risen sun sits on the horizon between two distant tapered stone pylons; a thin line of gold light along the horizon and a soft reflected path of light on the ground; minimal and silent, most of the frame dark.

### 4. Card texture: "Arch and shadow"
- **File:** `card-arch.jpg` (replaces `art-arch.svg`)
- **Size:** 1600 × 1000 (16:10)
- **Where:** home page, first Selected work card
- **Prompt:** An abstract close-up of a pale limestone wall with a large curved shadow sweeping across it from an unseen arch, and a dark vertical stone edge on the left; soft warm light, minimalist, architectural abstraction.

### 5. Card texture: "Columns"
- **File:** `card-columns.jpg` (replaces `art-columns.svg`)
- **Size:** 1600 × 1000
- **Where:** home page, second Selected work card
- **Prompt:** An abstract close-up of tightly spaced dark fluted stone columns in near-darkness; thin vertical edges of warm light catch the ribs; strong vertical rhythm, almost black.

### 6. Card texture: "Stone and light"
- **File:** `card-stone.jpg` (replaces `art-stone.svg`)
- **Size:** 1600 × 1000
- **Where:** home page, third Selected work card
- **Prompt:** A macro photograph of weathered sand-coloured stone with fine natural mottling, crossed by a single soft diagonal beam of sunlight; calm, tactile, minimal.

---

## Priority 2: a hero for each inner page

Each of these replaces the default horizon on one page. They all share the same size and layout rules.

- **Size:** 2400 × 1050
- **Text area:** the **left half must be dark and uncluttered**, because the page title sits there.
- **Subject:** in the right half.

| # | File | Page | Idea | Prompt |
|---|---|---|---|---|
| 7 | `hero-what-we-do.jpg` | What we do | The Four Fundamentals | Four monumental plain stone forms standing on a vast plateau at dawn, each catching the low sun differently, long shadows across the ground |
| 8 | `hero-value.jpg` | Value creation | Shen ring: value, wholeness | A large smooth stone ring carved in low relief, resting on a horizontal bar, set into a limestone wall; raking golden light reveals its form; no inscriptions |
| 9 | `hero-work.jpg` | Work redesign | Akhet: a new day of work | The sun rising exactly between two distant mountain peaks, seen through a monumental stone gateway; layered haze |
| 10 | `hero-organisation.jpg` | Operating model | Columns: structure and proportion | A colonnade of massive plain stone columns in a dark hall, shafts of sunlight falling between them onto the floor in a regular rhythm |
| 11 | `hero-growth.jpg` | Venture building | Solar switch: a new state | A total solar eclipse at the "diamond ring" moment above a dark desert horizon, a thin bright corona, the land below in silhouette |
| 12 | `hero-diagnostic.jpg` | Fundamentals diagnostic | Measurement: reading the light | A tall stone gnomon casting a precise long shadow across a plain stone floor marked only by fine lines, like a monumental sundial at golden hour |
| 13 | `hero-work-cases.jpg` | Work (case studies) | Ascent: something changed | A monumental stone staircase rising toward a bright opening, sunlight spilling down the steps, the rest in deep shadow |
| 14 | `hero-insights.jpg` | Insights | Enduring questions | A close-up of an ancient, smooth stone tablet with no writing, a single beam of warm light crossing its surface in a dark room |
| 15 | `hero-about.jpg` | About | Perspective and experience | A lone figure walking across a vast pale limestone plaza beside a monumental wall, very long shadows, figure small in the frame |
| 16 | `hero-rd.jpg` | R&D | The artefact from the future | A dark basalt stone fragment on a black background, lit by a single raking light, with a smooth rounded rectangular recess on its face. *Claude will composite the exact Comet mark into the recess.* |
| 17 | `hero-contact.jpg` | Contact | The threshold | A tall open stone doorway seen from inside a dark chamber, warm sunlight pouring through and spilling across the floor |

---

## Priority 3: optional extras

### 18. Hero video loop
This would sit behind the opening film in place of image 1. Generate it with a video tool such as Veo, Runway or Sora, using image 1 as the first frame.

- **File:** `home-hero.mp4`
- **Size:** 1920 × 1080, 10 to 15 seconds, a seamless loop, no camera cuts
- **Motion:** almost still. Dust drifts slowly through the light, the light shifts subtly, and the figure takes a few slow steps or stays still. Nothing should pull attention away from the text.
- Claude will encode it under about 4 MB, use image 1 as the poster frame, and show the still image to reduced-motion visitors.

### 19. Social share image
- **File:** `share-background.jpg`
- **Size:** 1200 × 630
- **Where:** the preview shown when the site is shared on LinkedIn, Slack and similar platforms
- **Prompt:** Image 3's horizon, with the sun centred and the upper two-thirds dark. Claude will add the logo and tagline.

### 20 to 26. Insight thumbnails
These are for when articles get their own pages.

- **Size:** 1600 × 1000
- **Style:** abstract stone-and-light compositions like images 4 to 6
- **One per article:**
  - Where Is AI Changing Your Economics? (a balance of light across two stone planes)
  - The Four Fundamentals (four stone blocks in a row)
  - What Should You Build Next? (a stone block partly lit, partly shaped)
  - Beyond Automation (a worn, repetitive stone track broken by a beam of light)
  - The AI Native Operating Model (a grid of stone pillars from above)
  - Build, Buy or Partner? (three converging stone paths)
  - The Economics of Agentic AI (a long corridor of identical doorways, one lit)

---

## Not needed

- **R&D eclipse on the home page.** It's drawn in code and animated, so it stays sharper than an image.
- **The Four Fundamentals glyphs.** They're line drawings that need to stay crisp at every size.
- **Logos and the favicon.** These are the brand SVGs already in the repo.
