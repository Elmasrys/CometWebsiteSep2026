# Editorial rules for the Comet Innovations website

- **British English is standard across the website**: judgement, organisation, prioritise, programme, per cent, towards. `npm test` fails on common American spellings in visible copy and llms.txt. Schema.org vocabulary (`Organization`, `#organization`) is exempt.
- Use em dashes (—), never double hyphens. Avoid repetitive rhetorical structures such as "not x, not y, but z".
- Publish approved copy as supplied apart from spelling standardisation; never invent client names, results, legal facts or team members, and never publish placeholders.
- The Four Fundamentals questions are defined once in `src/content/fundamentals.json` (Value: How do you create and capture value? Work: How should work be performed? Organisation: How should the organisation operate? Growth: What becomes possible next?). Reference them (`{{fundamentals.0.question}}`, `{{#fundamentals}}…{{/fundamentals}}`, or the same tokens in Insights) instead of retyping them; `npm test` fails on the superseded formulations.
- Wherever the Four Fundamentals framework is presented, include `{{> framework-notice}}` (or `"frameworkNotice": true` in an Insight's front matter).
- London is the only office.
