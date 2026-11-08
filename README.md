# Thebe Portal (\`thebe-site\`)

The authoritative bilingual portal and documentation hub for [Thebe](https://thebe.cc) and [Thebe Core](https://github.com/unitsung/thebe-core).

- **Canonical Origin**: \`https://thebe.cc\`
- **Primary Locale**: Chinese (unprefixed: \`/\`, \`/app/\`, \`/core/\`, \`/core/docs/\`)
- **English Locale**: \`/en/\` (\`/en/app/\`, \`/en/core/\`, \`/en/core/docs/\`)

## Architecture

This repository uses a single repository structure with two deliberately standalone static applications composed by root build scripts into one immutable release artifact:

1. **\`marketing/\` (Astro)**:
   - Home page, App presentation, Core presentation, and trust pages (\`privacy\`, \`support\`, \`security\`, \`responsible-use\`).
   - Clean URLs, static pre-rendering, reciprocal \`hreflang\` alternates, Open Graph metadata, and responsive layouts.
   - Sourced from curated screenshot assets and product messaging.
2. **\`documentation/\` (VitePress)**:
   - Dedicated Core documentation mounted at \`/core/docs/\` (Chinese) and \`/en/core/docs/\` (English).
   - Local search, structured sidebar, version context (\`v0.1.0 · Preview\`).
   - Synchronized deterministically from Core repository via \`scripts/sync-core-docs.mjs\`.
3. **Release Composition (\`scripts/compose-release.mjs\`)**:
   - Merges marketing and documentation static outputs into \`dist/release/\`.
   - Generates a root \`sitemap-index.xml\` referencing both marketing and documentation sitemaps.
   - Real 404 response page at \`/404.html\`.

## Development & Verification Commands

\`\`\`bash
# Install app dependencies
npm run install:apps

# Synchronize Core documentation
npm run sync:core-docs

# Type & syntax checks (Astro, TypeScript, build scripts)
npm run check

# Full build (Marketing + Documentation + Composition)
npm run build

# Unit & integration tests
npm test

# Release artifact verification (HTML metadata, links, assets, sitemaps, Nginx syntax)
npm run verify

# End-to-end responsive & accessibility checks (Playwright)
npm run test:e2e

# Deployment dry-run check
npm run deploy:dry-run
\`\`\`

## Deployment

Deployments follow an immutable versioned directory workflow with an atomic symlink switch:

- Artifacts upload to \`/var/www/thebe.cc/releases/<timestamp>-<commit>\`.
- The active release is pointed to by an atomic symlink \`/var/www/thebe.cc/current\`.
- Nginx configuration (\`deploy/nginx.conf\`) handles SSL termination, security headers, clean URL routing (\`try_files $uri $uri/ $uri.html =404;\`), and caching.
- Automated CI/CD runs via \`.github/workflows/ci.yml\`.
