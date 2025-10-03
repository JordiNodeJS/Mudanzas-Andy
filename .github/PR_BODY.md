This PR canonicalizes JSON-LD urls to https://mudanzasandy.es across site schemas and fixes JSON-LD serialization bugs found in blog pages.

Changes made:

- Canonical site set in astro.config.mjs -> https://mudanzasandy.es
- Fixed BlogPosting image serialization in src/pages/blog/[slug].astro to avoid malformed [object Object] URLs
- Converted inline JSON-LD blocks to set:html={JSON.stringify(...)} in several files to avoid Astro parser issues and ensure safe serialization
  - src/components/AccessibleImage.astro
  - src/pages/blog-astro.astro
  - src/pages/blog/[slug].astro
- Minor TS fixes to silence hints from astro check

Build & verification steps performed locally:

- pnpm check (no errors/warnings/hints)
- pnpm build (site builds successfully and dist/ JSON-LD inspected)

Notes and next steps:

- Please run Google Rich Results Test (or the Structured Data Testing Tool) on the home page and a sample blog post before merging.
- I left documentation files containing historical references to mudanzasandy.com untouched. If you want, I can sweep docs and replace .com -> .es where appropriate.

If anything should be split into smaller PRs (for example docs-only changes), tell me and I can prepare them.
