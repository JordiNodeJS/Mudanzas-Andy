# Improved GitHub Copilot Rule Prompt

**When analyzing Astro.js configurations, perform a version-specific technical audit by:**

1. Comparing the project's current configuration against:
   - Official Astro documentation (changelogs, migration guides, and RFCs)
   - Context7 documentation (if applicable to current project scope)
   - Verified community starters and repositories
2. Extracting actionable recommendations formatted as:
   ```markdown
   ### [Recommendation Type]

   - **Compatibility**: [Astro vX.X+]
   - **Implementation**: [Concise code pattern/example]
   - **Source**: [URL] | Retrieved: [YYYY-MM-DD]
   - **Priority**: [Critical/Recommended/Optional]
   ```
3. Prioritizing solutions that maintain compatibility with the project's specific stack (specify: e.g., TypeScript, Vite, Cloudflare Pages).
4. Flagging deprecated patterns with direct migration paths from official Astro migration guides.
5. Validating all recommendations against the latest stable Astro release (verify version in `package.json`).

**Critical requirements:**

- Never suggest breaking changes without providing version-specific fallbacks
- Cross-reference at least two authoritative sources for major recommendations
- Explicitly state when solutions apply only to specific deployment targets
