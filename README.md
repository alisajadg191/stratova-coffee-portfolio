# Stratova Coffee — portfolio concept

An interactive fictional coffee brand website created for Stratova Consulting’s portfolio. Products and prices are illustrative; there is no checkout or operating coffee business.

## Preview and build

Requires Node.js 18+ and Python 3. No dependency installation is needed.

```sh
npm run check
npm run build
npm run preview
```

Open http://localhost:8080. Routes:
- `/` — portfolio card preview
- `/portfolio/stratova-coffee/` — case study
- `/concepts/stratova-coffee/` — working concept
- `/showcase/` — presentation

`site/` is the editable source. `dist/` is the cPanel-ready static build. `scripts/build.mjs` checks links, titles and JavaScript syntax before copying the source.

## Future Stratova portfolio integration

This repository preserves the concept for later integration. No live website is modified or deployed. Use `INTEGRATION.html` as the card starting point, adapt the case study to the main website’s routing, and preserve existing portfolio conventions. Do not overwrite the agency homepage with the standalone preview index.

For standalone cPanel hosting, upload the contents of `dist/` to the intended document root. For integration into an existing site, namespace assets and adjust relative links as described in INTEGRATION.md. Concept pages remain noindex pending review.

Brand provenance and font licences are in BRAND.md and site/assets/. Motion implementation is described in MOTION.md. VALIDATION.md records checks from the original delivery; it is historical documentation, not a claim of fresh browser testing for this upload.

Large promotional videos and rendering intermediates are intentionally excluded from this source repository. The original delivery retains those files.
