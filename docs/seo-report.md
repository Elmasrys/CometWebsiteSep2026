# SEO and GEO implementation report

Comet Innovations website. Canonical origin: **https://www.comet-innovations.com**. Status as of 6 November 2026, after the move to two offerings (AI Transformation and AI-Native Operating Services).

The approved copy was not rewritten for search. Optimisation comes from metadata, semantic structure, internal linking, entity clarity and a small amount of definitional language. All new copy is listed in section 13 for approval.

The tables in sections 1 to 4 are generated from the build, so they match what is deployed. Every item in this report is checked automatically by `npm test` (`test/site.test.js`, `test/app.test.js`, `test/indexnow.test.js`).

## 1. Final URL inventory, titles and meta descriptions

| URL | Indexed | Title | Meta description |
| --- | --- | --- | --- |
| `/` | Yes | AI Transformation & Operating Services \| Comet Innovations | Comet Innovations helps organisations improve business performance through AI: project-led AI transformation and recurring AI-native operating services. |
| `/ai-transformation` | Yes | AI Transformation Services \| Comet Innovations | Project-led AI transformation: AI strategy and economics, operating model redesign, executive education, venture development and AI engineering and deployment. |
| `/ai-transformation/executive-education` | Yes | AI Executive Education & Leadership Programmes \| Comet Innovations | Executive education connecting AI with strategy, leadership and decision-making, for boards, executive committees and senior leadership teams. |
| `/ai-transformation/engineering` | Yes | AI Engineering & Deployment \| Comet Innovations | AI engineering and deployment: enterprise AI agents, intelligent workflows, systems integration, AI-native products and prototypes, built with client teams. |
| `/operating-services` | Yes | AI-Native Operating Services \| Comet Innovations | Recurring AI-native operating services for customer, revenue and business process operations: defined workflows delivered with AI, automation and human oversight. |
| `/industries` | Yes | AI for Private Equity, Government & Energy \| Comet Innovations | How Comet applies AI transformation and AI-native operating services in private equity, government and energy, three markets where AI changes the economics. |
| `/industries/private-equity` | Yes | AI for Private Equity: Portfolio Value Creation \| Comet Innovations | AI transformation and AI-native operating services for private equity: portfolio value creation, EBITDA, cost-to-serve and shared operating capabilities. |
| `/industries/government` | Yes | AI for Government & Public Sector \| Comet Innovations | AI transformation and AI-native operating services for government: institutional AI strategy, public service delivery, administrative workflows and AI governance. |
| `/industries/energy` | Yes | AI for Energy, Utilities & Infrastructure \| Comet Innovations | AI transformation and AI-native operating services for energy businesses, utilities and infrastructure operators, from asset information to enterprise workflows. |
| `/four-fundamentals` | Yes | The Four Fundamentals: An AI Strategy Framework \| Comet Innovations | Comet’s Four Fundamentals framework examines how AI changes value, work, organisation and growth, helping leaders decide which changes deserve attention. |
| `/value-creation` | Yes | AI Growth Strategy & Value Creation \| Comet Innovations | How AI changes the economics of value: customer propositions, revenue and pricing, cost and margin, competitive position and business model innovation. |
| `/work-redesign` | Yes | AI Work Redesign & Workforce Transformation \| Comet Innovations | How AI changes work: workflow redesign, agentic AI, human and AI collaboration, operational productivity and the workforce implications of intelligent systems. |
| `/operating-model` | Yes | AI Operating Model & Governance \| Comet Innovations | How AI changes the organisation: enterprise AI priorities, operating model design, decision rights, governance, capability development and portfolio transformation. |
| `/venture-building` | Yes | Corporate Venture Building & AI Ventures \| Comet Innovations | How AI changes growth: opportunity discovery, business model innovation, venture validation, corporate venture building, AI-native products and commercialisation. |
| `/insights` | Yes | AI Transformation & Operating Model Insights \| Comet Innovations | Research and perspectives on AI economics, work redesign, operating models, business building and enterprise transformation. |
| `/insights/where-is-ai-changing-your-economics` | Yes | Where Is AI Changing Your Economics? \| Comet Innovations | Why AI strategy should begin with business economics rather than use cases, and how leaders can identify where AI materially changes value, work, organisation and growth. |
| `/insights/the-four-fundamentals` | Yes | The Four Fundamentals of AI Transformation \| Comet Innovations | A leadership framework for understanding how AI changes value, work, organisation and growth. |
| `/insights/what-should-you-build-next` | Yes | What Should You Build Next? Corporate Venture Building \| Comet | How established organisations can turn customers, capital, data, expertise and distribution into validated new businesses and AI-native ventures. |
| `/research-and-development` | Yes | AI Research: Stateful AI Orchestration \| Comet Innovations | Comet’s applied research into stateful AI orchestration: persistent workflow state, validation-gated execution and multi-step orchestration for enterprise AI. |
| `/about` | Yes | About Comet Innovations \| AI Transformation & Operating Services | Meet Comet Innovations, a London-based AI Transformation & Operating Services firm combining senior operating experience, strategy, engineering and applied AI research. |
| `/contact` | Yes | Contact Comet Innovations \| AI Transformation & Operating Services | Speak with Comet Innovations about an AI transformation requirement or an AI-native operating service, in private equity, government, energy or beyond. |
| `/privacy` | Yes | Privacy Policy \| Comet Innovations | How Comet Innovations collects, uses and protects personal information submitted through this website. |
| `/cookies` | Yes | Cookie Policy \| Comet Innovations | How the Comet Innovations website uses cookies and similar technologies. |
| `/terms` | Yes | Website Terms \| Comet Innovations | The terms that apply to your use of the Comet Innovations website. |
| `/enquiry-received` | No | Enquiry received \| Comet Innovations | Your enquiry has been received. |
| `/404` | No | Page not found \| Comet Innovations | The page you were looking for could not be found. |

Clean URLs throughout: no `.html`, no trailing slash, one host (`www`), HTTPS only. The R&D page moved from `/rd` to `/research-and-development`.

## 2. Primary and secondary search intent per page

Each page has one primary intent and a limited set of secondary intents. The intents are recorded in each page's metadata (`src/pages/*.html`, `src/insights/*.md`) for future editors; they are not printed on the page.

| URL | Primary search intent | Secondary intents |
| --- | --- | --- |
| `/` | AI transformation services | AI-native operating services, enterprise AI strategy, AI operating model transformation, AI for private equity value creation |
| `/ai-transformation` | AI transformation services | enterprise AI strategy, AI operating model transformation, AI strategy consulting, AI for private equity value creation |
| `/ai-transformation/executive-education` | AI executive education | AI leadership programme, AI for boards, executive AI training, AI leadership development |
| `/ai-transformation/engineering` | AI engineering and deployment | forward-deployed AI engineering, AI workflow automation, enterprise AI agents, AI systems integration, AI workflow automation, AI product development |
| `/operating-services` | AI-native operating services | AI-enabled business process outsourcing, AI business process operations, AI customer operations, AI revenue operations, AI workflow automation |
| `/industries` | AI consulting for private equity, government and energy | AI for private equity, AI in government, AI in energy, AI value creation private equity |
| `/industries/private-equity` | AI for private equity | AI for private equity value creation, AI portfolio value creation, private equity AI strategy, portfolio AI assessment, AI operating partner support, shared services for portfolio companies |
| `/industries/government` | AI for government | AI transformation for government, public sector AI strategy, AI in public services, government AI governance, AI public sector transformation |
| `/industries/energy` | AI for energy | AI for energy operations, AI in utilities, AI for energy infrastructure, energy AI strategy, AI asset intelligence |
| `/four-fundamentals` | AI strategy framework | AI transformation framework, Four Fundamentals, AI business framework, AI value work organisation growth |
| `/value-creation` | AI value creation | AI business model innovation, AI pricing strategy, AI growth strategy, AI commercial strategy |
| `/work-redesign` | AI work redesign | AI workflow redesign, agentic AI, human and AI collaboration, AI workforce transformation |
| `/operating-model` | AI operating model | AI governance, AI decision rights, enterprise AI strategy, AI portfolio transformation |
| `/venture-building` | corporate venture building | AI venture building, venture validation, AI-native products, AI growth strategy |
| `/insights` | AI transformation insights | AI strategy insights, AI economics, AI operating models, corporate venture building |
| `/insights/where-is-ai-changing-your-economics` | AI economics | AI transformation strategy, AI business value, AI value creation |
| `/insights/the-four-fundamentals` | AI transformation framework | AI strategy framework, enterprise AI transformation |
| `/insights/what-should-you-build-next` | corporate venture building | corporate innovation, new business building, AI venture building |
| `/research-and-development` | stateful AI orchestration | AI orchestration, persistent AI workflows, agentic AI architecture, enterprise AI architecture |
| `/about` | Comet Innovations | AI transformation consulting firm London, AI venture building firm, AI consultancy London |
| `/contact` | Contact Comet Innovations | None |
| `/privacy` | Comet Innovations privacy policy | None |
| `/cookies` | Comet Innovations cookie policy | None |
| `/terms` | Comet Innovations website terms | None |

## 3. Structured data per page

Every indexable page carries one JSON-LD `@graph`. Entities connect through stable `@id`s across the whole site:

- `https://www.comet-innovations.com/#organization`: Comet Innovations (Organization; legal name Maverika Ltd, Companies House number, London address locality, markets served, LinkedIn, logo, founder, knowsAbout)
- `https://www.comet-innovations.com/#website`: WebSite, published by the Organization
- `https://www.comet-innovations.com/about#sherif-elmasry`: Person (also the visible profile anchor), worksFor the Organization
- `<page URL>#webpage`, `#breadcrumb`, `#service`, `#article`, `#faq`: page-level nodes

| URL | JSON-LD (one connected @graph per page) |
| --- | --- |
| `/` | Organization, WebSite, WebPage |
| `/ai-transformation` | Organization, WebSite, WebPage, BreadcrumbList, Service |
| `/ai-transformation/executive-education` | Organization, WebSite, WebPage, BreadcrumbList, Service |
| `/ai-transformation/engineering` | Organization, WebSite, WebPage, BreadcrumbList, Service |
| `/operating-services` | Organization, WebSite, WebPage, BreadcrumbList, Service |
| `/industries` | Organization, WebSite, WebPage, BreadcrumbList |
| `/industries/private-equity` | Organization, WebSite, WebPage, BreadcrumbList |
| `/industries/government` | Organization, WebSite, WebPage, BreadcrumbList |
| `/industries/energy` | Organization, WebSite, WebPage, BreadcrumbList |
| `/four-fundamentals` | Organization, WebSite, WebPage, BreadcrumbList, DefinedTerm, DefinedTermSet |
| `/value-creation` | Organization, WebSite, WebPage, BreadcrumbList |
| `/work-redesign` | Organization, WebSite, WebPage, BreadcrumbList |
| `/operating-model` | Organization, WebSite, WebPage, BreadcrumbList |
| `/venture-building` | Organization, WebSite, WebPage, BreadcrumbList |
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
- **Service** appears only on the four offering pages (`/ai-transformation`, `/ai-transformation/executive-education`, `/ai-transformation/engineering`, `/operating-services`), each with Comet as provider.
- **DefinedTerm** records the definitions that appear visibly on the page: the Four Fundamentals, corporate venture building and stateful AI orchestration.
- **FAQPage** appears only on About and matches the visible questions and answers character for character, from the same source file.
- **Article** carries real `datePublished` and `dateModified` values (`modified` is set in an Insight's front matter only after a substantive change), the author as the Person `@id`, the publisher, its own social image and `mainEntityOfPage`.
- **Person has no `image`** until an approved portrait exists.

## 4. Social metadata

Every indexable page has `og:title`, `og:description`, `og:url` (the canonical URL), `og:type`, `og:image` (1200×630, with dimensions and alt text), `og:locale`, and Twitter/X `summary_large_image` tags. Articles also carry `article:published_time`, `article:modified_time`, `article:author` and `article:section`.

There are 22 social images in `public/images/og/`: the default, Home, both offerings and their two subpages, Industries and each market, the Four Fundamentals and each pillar, Insights and each cornerstone Insight, R&D, About and Contact. The legal pages share the default image. Regenerate the images after changing a title with `node tools/generate-og.mjs`.

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
| `/what-we-do`, `/advise` (and `.html`) | `/ai-transformation` |
| `/educate` | `/ai-transformation/executive-education` |
| `/engineer` | `/ai-transformation/engineering` |
| `/diagnostic` (retired October 2026) | `/ai-transformation` |
| any URL with a trailing slash | the same URL without it |
| `*.up.railway.app/*` | `https://www.comet-innovations.com/*`, once `REDIRECT_TO_CANONICAL=true` is set (see section 12). Until then these hosts are served with `X-Robots-Tag: noindex`. |

The October 2026 service pages were retired in November 2026: Educate and Engineer moved intact under `/ai-transformation`, Advise was folded into its AI Strategy & Economics section, and What We Do was replaced by the offerings overview. No other legacy URLs need mapping. The contact form posts to `/api/contact` and confirms at `/enquiry-received` (noindex).

## 6. Sitemap

`https://www.comet-innovations.com/sitemap.xml` lists the 24 canonical, indexable URLs only. It excludes the 404 page, `/enquiry-received`, redirects and every `.html` variant. Each `lastmod` is the page's recorded update date (Insights use `dateModified`). It is referenced from `robots.txt` and from a `<link rel="sitemap">` on every page.

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

The November 2026 restructure introduced new copy, written to the approved brief. It is listed here for review; everything else is earlier approved copy, moved without change.

| Page | New or changed text |
| --- | --- |
| Home | All sections except "Why Comet" (principles partly reused), the founder line, applied research and Insights: the hero supporting line, the four economic outcomes, the two-offerings section, "From building a tool to running a service", the industry summaries and the closing paragraph. |
| AI Transformation | New page. "The problems we address", the five capability descriptions (Executive Education and AI Engineering & Deployment summarise their own pages; AI Strategy & Economics reuses the former Advise copy), "Economics and operating realities first" and "How to engage us". |
| AI-Native Operating Services | New page, all copy, including the status statement ("Available now", "In development", "Illustrative") and every service boundary. |
| Executive Education, AI Engineering & Deployment | Former Educate and Engineer copy unchanged, plus one sentence each linking to AI Transformation or Operating Services. |
| Private Equity, Government, Energy | "How Comet supports…" restructured into the two offerings; the Operating Services paragraph, examples and boundary on each page are new. |
| Industries, About, FAQ | Wording updated for the two offerings; one new FAQ ("What are AI-native operating services?"). |

## 14. Topical clusters and future content

The three cornerstone Insights anchor the AI Economics, Transformation and Venture Building clusters. AI-Native Operating Services has no supporting Insight yet; a piece on how an operating service differs from outsourcing and from an engineering project would give `/operating-services` its first cluster companion, once there is evidence to cite. Their forthcoming companions are already listed on `/insights`, unlinked until written:

- **Work:** Beyond Automation
- **Operating Model:** The AI-Native Operating Model
- **Venture Building:** Build, Buy or Partner?
- **AI Economics:** The Economics of Agentic AI

Each new piece should link to its cornerstone and its pillar page, carry a named author, and contribute an original framework, diagram or decision logic.
