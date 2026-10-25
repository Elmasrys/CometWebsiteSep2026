# Drafts

Pages here are kept but not published (the build only reads `src/pages`).

- `our-work.html`: withheld until approved case studies are supplied. Its data is in `src/content/cases.json`. To publish it again, move it back to `src/pages/`, restore the "Our Work" link in `src/layout.html` (main navigation and footer Explore column), add `/our-work` to the key pages in `llmsTxt` in `build.js`, run `node tools/generate-og.mjs`, and remove the "Our Work is withheld" test.
