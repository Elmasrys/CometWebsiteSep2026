# SEO and GEO implementation report

Comet Innovations website. Canonical origin: **https://www.comet-innovations.com**. Status as of 14 October 2026.

The approved copy was not rewritten for search. Optimisation comes from metadata, semantic structure, internal linking, entity clarity and a small amount of definitional language. All new copy is listed in section 13 for approval.

The tables in sections 1 to 4 are generated from the build, so they match what is deployed. Every item in this report is checked automatically by `npm test` (`test/site.test.js`, `test/app.test.js`, `test/indexnow.test.js`).

## 1. Final URL inventory, titles and meta descriptions

| URL | Indexed | Title | Meta description |
| --- | --- | --- | --- |
| `/` | Yes | AI Transformation & Venture Building \| Comet Innovations | Comet Innovations helps leadership teams identify where AI changes business economics, redesign work and operating models, and build new sources of growth. |
| `/what-we-do` | Yes | AI Transformation Strategy & Services \| Comet Innovations | Explore Comet's approach to AI transformation across value creation, work redesign, operating models and venture building. |
| `/value-creation` | Yes | AI Growth Strategy & Value Creation \| Comet Innovations | Identify where AI changes customer value, revenue models, propositions, pricing and margins through AI growth strategy and business model innovation. |
| `/work-redesign` | Yes | AI Work Redesign & Workforce Transformation \| Comet Innovations | Redesign work around people, automation and AI. Comet helps organisations transform workflows, deploy agentic AI and build workforce capability. |
| `/operating-model` | Yes | AI Operating Model & Governance \| Comet Innovations | Design the structures, governance, decision rights and capabilities required to scale AI across the enterprise. |
| `/venture-building` | Yes | Corporate Venture Building & AI Ventures \| Comet Innovations | Comet helps established organisations identify, validate, build and scale new products, services and AI-native ventures. |
| `/diagnostic` | Yes | AI Opportunity Assessment \| The Fundamentals Diagnostic | A four-to-six-week assessment identifying where AI materially changes value, work, organisation and growth, and which opportunities deserve priority. |
| `/our-work` | Yes | AI Transformation & Venture Building Work \| Comet Innovations | Selected Comet engagements across AI transformation, value creation, operating models, work redesign and venture building. |
| `/insights` | Yes | AI Transformation & Venture Building Insights \| Comet Innovations | Research and perspectives on AI economics, work redesign, operating models, business building and enterprise transformation. |
| `/insights/where-is-ai-changing-your-economics` | Yes | Where Is AI Changing Your Economics? \| Comet Innovations | Why AI strategy should begin with business economics rather than use cases, and how leaders can identify where AI materially changes value, work, organisation and growth. |
| `/insights/the-four-fundamentals` | Yes | The Four Fundamentals of AI Transformation \| Comet Innovations | A leadership framework for understanding how AI changes value, work, organisation and growth. |
| `/insights/what-should-you-build-next` | Yes | What Should You Build Next? Corporate Venture Building \| Comet | How established organisations can turn customers, capital, data, expertise and distribution into validated new businesses and AI-native ventures. |
| `/research-and-development` | Yes | AI Research: Stateful AI Orchestration \| Comet Innovations | Comet Innovations conducts applied research into persistent state, validation-gated execution and orchestration for AI-native enterprise systems. |
| `/about` | Yes | About Comet Innovations \| AI Transformation & Venture Building | Meet Comet Innovations, a London-based AI Transformation & Venture Building firm combining senior operating experience, strategy, engineering and applied AI research. |
| `/contact` | Yes | Contact Comet Innovations \| AI Transformation & Venture Building | Speak with Comet Innovations about AI transformation, value creation, work redesign, operating models, venture building or the Fundamentals Diagnostic. |
| `/privacy` | Yes | Privacy Policy \| Comet Innovations | How Comet Innovations collects, uses and protects personal information submitted through this website. |
| `/cookies` | Yes | Cookie Policy \| Comet Innovations | How the Comet Innovations website uses cookies and similar technologies. |
| `/terms` | Yes | Website Terms \| Comet Innovations | The terms that apply to your use of the Comet Innovations website. |
| `/enquiry-received` | No (noindex) | Enquiry received \| Comet Innovations | Your enquiry has been received. |
| any unknown URL | No (404 status, noindex) | Page not found \| Comet Innovations | The page you were looking for could not be found. |

Clean URLs throughout: no `.html`, no trailing slash, one host (`www`), HTTPS only. The R&D page moved from `/rd` to `/research-and-development`.

## 2. Primary and secondary search intent per page

Each page has one primary intent and a limited set of secondary intents. The intents are recorded in each page's metadata (`src/pages/*.html`, `src/insights/*.md`) for future editors; they are not printed on the page.

| URL | Primary search intent | Secondary intents |
| --- | --- | --- |
| `/` | AI transformation consulting | AI transformation firm, AI venture building, enterprise AI transformation |
| `/what-we-do` | AI transformation strategy | AI strategy consulting, enterprise AI transformation, AI business transformation |
| `/value-creation` | AI growth strategy | AI business model innovation, AI value creation, AI commercial strategy, AI product strategy |
| `/work-redesign` | AI workforce transformation | AI work redesign, agentic AI consulting, AI workflow redesign, AI agents for business |
| `/operating-model` | AI operating model | AI governance consulting, enterprise AI strategy, AI centre of excellence, AI portfolio management |
| `/venture-building` | corporate venture building | AI venture building, corporate innovation consulting, venture validation, AI-native ventures, new business building |
| `/diagnostic` | AI opportunity assessment | AI readiness assessment, AI transformation assessment, AI strategy assessment, AI opportunity discovery |
| `/our-work` | AI transformation case studies | AI consulting case studies, corporate venture building examples, AI transformation examples |
| `/insights` | AI transformation insights | AI strategy insights, AI economics, AI operating models, corporate venture building |
| `/insights/where-is-ai-changing-your-economics` | AI economics | AI transformation strategy, AI business value, AI value creation |
| `/insights/the-four-fundamentals` | AI transformation framework | AI strategy framework, enterprise AI transformation |
| `/insights/what-should-you-build-next` | corporate venture building | corporate innovation, new business building, AI venture building |
| `/research-and-development` | stateful AI orchestration | AI orchestration, persistent AI systems, agentic AI architecture, enterprise AI architecture |
| `/about` | Comet Innovations | AI transformation consulting firm London, AI venture building firm, AI consultancy London |
| `/contact` | Contact Comet Innovations | – |
| `/privacy` | Comet Innovations privacy policy | – |
| `/cookies` | Comet Innovations cookie policy | – |
| `/terms` | Comet Innovations website terms | – |

## 3. Structured data per page

Every indexable page carries one JSON-LD `@graph`. Entities connect through stable `@id`s across the whole site:

- `https://www.comet-innovations.com/#organization`: Comet Innovations (Organization; legal name Maverika Ltd, Companies House number, London address locality, markets served, LinkedIn, logo, founder, knowsAbout)
- `https://www.comet-innovations.com/#website`: WebSite, published by the Organization
- `https://www.comet-innovations.com/about#sherif-elmasry`: Person (also the visible profile anchor), worksFor the Organization
- `<page URL>#webpage`, `#breadcrumb`, `#service`, `#article`, `#faq`: page-level nodes

| URL | JSON-LD (one connected @graph per page) |
| --- | --- |
| `/` | Organization, WebSite, WebPage |
| `/what-we-do` | Organization, WebSite, WebPage, BreadcrumbList, DefinedTerm |
| `/value-creation` | Organization, WebSite, WebPage, BreadcrumbList, Service |
| `/work-redesign` | Organization, WebSite, WebPage, BreadcrumbList, Service |
| `/operating-model` | Organization, WebSite, WebPage, BreadcrumbList, Service |
| `/venture-building` | Organization, WebSite, WebPage, BreadcrumbList, Service, DefinedTerm |
| `/diagnostic` | Organization, WebSite, WebPage, BreadcrumbList, Service |
| `/our-work` | Organization, WebSite, CollectionPage, BreadcrumbList |
| `/insights` | Organization, WebSite, CollectionPage, BreadcrumbList |
| `/insights/where-is-ai-changing-your-economics` | Organization, WebSite, WebPage, BreadcrumbList, Person, Article |
| `/insights/the-four-fundamentals` | Organization, WebSite, WebPage, BreadcrumbList, Person, Article |
| `/insights/what-should-you-build-next` | Organization, WebSite, WebPage, BreadcrumbList, Person, Article |
| `/research-and-development` | Organization, WebSite, WebPage, BreadcrumbList, DefinedTerm |
| `/about` | Organization, WebSite, AboutPage, BreadcrumbList, Person, FAQPage |
| `/contact` | Organization, WebSite, ContactPage, BreadcrumbList |
| `/privacy` | Organization, WebSite, WebPage, BreadcrumbList |
| `/cookies` | Organization, WebSite, WebPage, BreadcrumbList |
| `/terms` | Organization, WebSite, WebPage, BreadcrumbList |

Notes:
- **Organization** uses the single canonical description from `src/content/site.json`. Only London is encoded as an address. The UK, Middle East and Africa appear only as `areaServed`. No street address is published, because the only verified address is the registered office in Loughton, which is not an office.
- **ProfessionalService was not used.** It is a LocalBusiness subtype that expects a public street address. Organization plus Service is the accurate model.
- **Service** appears only on the four pillar pages and the Diagnostic, each with Comet as provider.
- **DefinedTerm** records the definitions that appear visibly on the page: the Four Fundamentals, corporate venture building and stateful AI orchestration.
- **FAQPage** appears only on About and matches the visible questions and answers character for character, from the same source file.
- **Article** carries real `datePublished` and `dateModified` values (`modified` is set in an Insight's front matter only after a substantive change), the author as the Person `@id`, the publisher, its own social image and `mainEntityOfPage`.
- **Person has no `image`** until an approved portrait exists.

## 4. Social metadata

Every indexable page has `og:title`, `og:description`, `og:url` (the canonical URL), `og:type`, `og:image` (1200×630, with dimensions and alt text), `og:locale`, and Twitter/X `summary_large_image` tags. Articles also carry `article:published_time`, `article:modified_time`, `article:author` and `article:section`.

There are 16 distinct designed social images in `public/images/og/`: Home, What We Do, each pillar, the Diagnostic, Our Work, Insights, each cornerstone Insight, R&D, About and Contact. The legal pages share the default image. Regenerate the images after changing a title with `node tools/generate-og.mjs`.

## 5. Redirect map

All redirects are permanent (301), one to one, and preserve query strings.

| From | To |
| --- | --- |
| `https://comet-innovations.com/*` (bare domain) | `https://www.comet-innovations.com/*` |
| `http://www.comet-innovations.com/*` | `https://www.comet-innovations.com/*` |
| `/index`, `/index.html` | `/` |
| `/<page>.html`, for every page | `/<page>` |
| `/insights/<slug>.html` | `/insights/<slug>` |
| `/rd`, `/rd.html` | `/research-and-development` |
| any URL with a trailing slash | the same URL without it |
| `*.up.railway.app/*` | `https://www.comet-innovations.com/*`, once `REDIRECT_TO_CANONICAL=true` is set (see section 12). Until then these hosts are served with `X-Robots-Tag: noindex`. |

There was no earlier Comet website, so no further legacy URLs need mapping. The contact form posts to `/api/contact` and confirms at `/enquiry-received` (noindex).

## 6. Sitemap

`https://www.comet-innovations.com/sitemap.xml` lists the 18 canonical, indexable URLs only. It excludes the 404 page, `/enquiry-received`, redirects and every `.html` variant. Each `lastmod` is the page's recorded update date (Insights use `dateModified`). It is referenced from `robots.txt` and from a `<link rel="sitemap">` on every page.

## 7. robots.txt

Served at `https://www.comet-innovations.com/robots.txt` and generated from the crawler lists in `src/content/site.json`:

```
# Crawler policy for Comet Innovations. Rationale: docs/seo-report.md

# Search engines and all other crawlers: public content is open.
User-agent: *
Allow: /
Disallow: /api/
Disallow: /enquiry-received

# AI search and citation crawlers: allowed, so pages can be found and cited in AI answers.
User-agent: OAI-SearchBot
User-agent: ChatGPT-User
User-agent: Claude-SearchBot
User-agent: Claude-User
User-agent: PerplexityBot
User-agent: Perplexity-User
Allow: /
Disallow: /api/
Disallow: /enquiry-received

# AI training crawlers: not allowed to collect content for model training.
User-agent: GPTBot
User-agent: ClaudeBot
User-agent: Google-Extended
User-agent: Applebot-Extended
User-agent: CCBot
User-agent: Meta-ExternalAgent
User-agent: Bytespider
Disallow: /

Sitemap: https://www.comet-innovations.com/sitemap.xml
```

CSS, JavaScript, fonts and images are never blocked, so crawlers can render pages fully.

## 8. OpenAI and other AI crawler configuration

The decision (14 October 2026) is to **allow AI search and citation crawlers and block AI training crawlers**.

| Crawler | Operator | Purpose | Policy |
| --- | --- | --- | --- |
| OAI-SearchBot | OpenAI | ChatGPT search results and citations | Allowed |
| ChatGPT-User | OpenAI | Pages fetched when a user asks ChatGPT to visit them | Allowed |
| GPTBot | OpenAI | Model training | **Blocked** |
| Claude-SearchBot, Claude-User | Anthropic | Claude search and user-requested fetches | Allowed |
| ClaudeBot | Anthropic | Model training | **Blocked** |
| PerplexityBot, Perplexity-User | Perplexity | Search index and user-requested fetches | Allowed |
| Google-Extended | Google | Gemini training (does not affect Google Search) | **Blocked** |
| Applebot-Extended | Apple | Apple Intelligence training (does not affect Applebot search) | **Blocked** |
| CCBot, Meta-ExternalAgent, Bytespider | Common Crawl, Meta, ByteDance | Training datasets | **Blocked** |
| Googlebot, Bingbot and all others | Search engines | Search | Allowed by the `*` group |

Allowing OAI-SearchBot does not require allowing GPTBot; they are configured independently. To change the policy, edit `crawlers` in `src/content/site.json` and redeploy.

**Bot protection.** The Railway app applies no bot blocking or rate limiting to page requests. Only the contact form is rate-limited. If Cloudflare or another proxy is put in front of the site, make sure "Block AI bots", Bot Fight Mode or similar settings do not challenge OAI-SearchBot, Googlebot or Bingbot. robots.txt already expresses the policy.

All cornerstone content, definitions, headings, author information, case studies and internal links are present in the server-delivered HTML. No JavaScript is needed to read any of it, and no page requires authentication.

## 9. llms.txt

`https://www.comet-innovations.com/llms.txt` is a supplementary map of the authoritative pages and the three cornerstone Insights, with canonical URLs. It contains the canonical company description, the central question, the Four Fundamentals, the office and market experience, and the founder. It contains nothing that is not already public on the site, and it is generated from the same content files, so it cannot drift from the pages.

## 10. IndexNow

**Implemented. It activates when `INDEXNOW_KEY` is set.**

- Each build fingerprints every indexable page (`/indexnow-manifest.json`).
- When a new deployment starts, it reads the manifest the live site is still serving. It waits until the new build is the one being served, then submits only the URLs that were added, changed or removed to `https://api.indexnow.org/indexnow`. That endpoint shares submissions with Bing and the other participating engines.
- Unchanged URLs are never resubmitted. If the live manifest can't be read, nothing is submitted.
- The key is served at `https://www.comet-innovations.com/<key>.txt`.

To enable it, generate a key (for example `openssl rand -hex 16`) and set `INDEXNOW_KEY` in Railway. Set `INDEXNOW_ENABLED=false` to pause it.

## 11. Google Search Console and Bing Webmaster Tools readiness

Ready for verification and submission once DNS points at Railway.

- **Google Search Console:** add a **Domain property** for `comet-innovations.com`, verified by DNS TXT record (recommended; covers www, the bare domain and both protocols). Alternatively, put the HTML-tag token in `verification.google` in `src/content/site.json`. Submit `https://www.comet-innovations.com/sitemap.xml`.
- **Bing Webmaster Tools:** import the site from Search Console, or add the `msvalidate.01` token to `verification.bing`. Submit the sitemap. IndexNow submissions appear in Bing's IndexNow report.
- **After launch, check:**
  - index coverage and canonical selection (Google should choose the `www` HTTPS URLs)
  - the structured-data reports (Organization, Breadcrumb, Article and FAQ)
  - Core Web Vitals field data
  - crawl errors and search queries
  - Bing's AI performance and citation reporting, where available

## 12. Unresolved SEO and legal dependencies

**Launch blockers**

1. **DNS.** Point `www.comet-innovations.com` and the bare domain at the Railway service, and add both as custom domains in Railway. Then set `REDIRECT_TO_CANONICAL=true` so the Railway address redirects to the canonical domain.
2. **Approval of the new copy** listed in section 13.

**Recommended before or soon after launch**

3. **`INDEXNOW_KEY`**, plus the Search Console and Bing verification tokens (sections 10 and 11).
4. **Case-study evidence.** Our Work now renders sector, business challenge, strategic question, intervention, modes, outcome and timeframe as soon as they are added to `src/content/cases.json`. None has been published, because none is approved. The related service is shown for each case.
5. **Home and Our Work show different case studies.** The three "Selected work" cards on the home page are not the three cases on Our Work. Decide whether to align them.
6. **Founder portrait.** Needed for the Person `image` and the visible profile.
7. **Privacy contact email and data retention period** (unchanged from the previous report).
8. **Founding date.** It is not in Organization, because no approved date was supplied.

**Performance**

9. **Lighthouse, lab data, simulated slow 4G** (production build, compression on):

   | Page | Mobile | Desktop |
   | --- | --- | --- |
   | Home | Performance 96–97, LCP 2.4–2.6 s | Performance 100, LCP 0.5 s |
   | Article, About, Value Creation | Performance 98–99, LCP 2.0–2.1 s | Performance 100, LCP 0.5 s |

   On every page: CLS 0, TBT 0 ms, accessibility 100, best practices 100, and SEO 100 when served as the canonical host. The home page's mobile LCP element is the headline, and its remaining delay is the headline font loading. Confirm with Search Console field data (CrUX) after launch. If the 75th percentile exceeds 2.5 s, switch the headline font to `font-display: optional`.

10. **Supporting content.** Build depth within the existing clusters (section 14) rather than broadening the publication.

## 13. New copy for approval

Everything else on the site is the approved copy, unchanged.

| Page | New or changed text |
| --- | --- |
| Home | Eyebrow now reads "An AI Transformation & Venture Building firm", establishing the category in the first screen. Added a link: "The Four Fundamentals, in depth". R&D band: "AI-native" and "patent-pending" hyphenated, and "stateful AI orchestration" linked. |
| What We Do | Two definitional sentences supplied in the brief. Added "Read the framework in depth" and a "Continue exploring" block. Fundamentals links now read "Explore value creation" and so on, instead of "Explore". |
| Value Creation | The H1 is now the brief's statement; the framework question stays as a visible line (now the canonical "How do you create and capture value?", from `src/content/fundamentals.json`). One definitional sentence. **New section: "How AI changes the economics of value"**, five answers. |
| Work Redesign | H1 per the brief. One definitional sentence. **New section: "From task automation to workforce transformation"**, five distinctions, including the plain-language definition of agentic AI. |
| Operating Model | H1 per the brief. A definition of an AI operating model. **New section: "Scaling AI is an organisational question"**, six answers. |
| Venture Building | H1 per the brief. The definition and statement supplied in the brief. **New section: "Four disciplines that are often confused"**. |
| Diagnostic | The definition supplied in the brief, plus "not a downloadable maturity test or self-assessment". **New section: "The Diagnostic at a glance"**, five answers. |
| R&D | H1 hyphenated per the brief. **New definition of stateful AI orchestration.** Research areas hyphenated ("validation-gated", "multi-step", "state-dependent"). |
| About | H1 "About Comet Innovations", followed by "Comet Innovations is an AI Transformation & Venture Building firm based in London." |
| Insights | H1 "Insights", with "Ideas for businesses being changed by AI." as the lead line. |
| The Four Fundamentals (Insight) | The canonical framework definition added as its own paragraph. |
| All three Insights | Contextual links placed on existing phrases. No words changed. |
| Pillar pages, Diagnostic, What We Do, Our Work, R&D | "Continue exploring" link blocks, using existing page and Insight titles. |

## 14. Topical clusters and future content

The three cornerstone Insights anchor the AI Economics, Transformation and Venture Building clusters. Their forthcoming companions are already listed on `/insights`, unlinked until written:

- **Work:** Beyond Automation
- **Operating Model:** The AI-Native Operating Model
- **Venture Building:** Build, Buy or Partner?
- **AI Economics:** The Economics of Agentic AI

Each new piece should link to its cornerstone and its pillar page, carry a named author, and contribute an original framework, diagram or decision logic.
