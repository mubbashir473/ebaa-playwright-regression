> Sanitized archive export: dev/staging examples are non-operational placeholders. MIT licensing and owner-confirmed attribution are current publication overlays; original development dates remain unverified. See [export notes](PUBLIC-EXPORT.md) and [license](LICENSE). Historical commands/results below are not current verification.

# EBAA Playwright Regression Suite (starter)

## Install
Node.js 20+ recommended.

```bash
npm install
npx playwright install chromium webkit
cp .env.example .env
```

Edit `.env` to point BASE_URL to your authorized staging site or production.

## Run

```bash
npm run test:safe
npm run report
```

`test:safe` excludes @staging submission tests. Desktop runs all site-wide checks. Mobile only runs responsive tests. To inspect the machine-readable site inventory, open `test-results/site-audit.json`.

For staging, configure the correct staging domain and forms (plus CAPTCHA test configuration) and run `npm run test:staging`. The included submission test is deliberately skipped until you implement site-specific, approved assertions.

## What this suite measures
- Bounded internal HTML page discovery from WP sitemaps + hyperlink crawling.
- Page status, title, visible images, uncaught JS exceptions.
- Internal URL GET checks, up to MAX_LINKS; the entire `/documents/`, `/videos/`, and `/video/` section and downloadable document/media assets are excluded.
- Critical routes and selected form inventory.
- Mobile and desktop viewport smoke tests with screenshots.
- Playwright HTML report, JSON report and retained failure traces/screenshots.

## Important limitations
- Crawling is limited by MAX_PAGES/MAX_LINKS, respects only explicit excluded paths, and is **not** a full business-flow test.
- Does not click every button, exercise every calculator, test downloads' contents, assert email delivery, or inspect server errors. Add dedicated tests for these.
- CAPTCHA submissions must be tested on staging with the CAPTCHA vendor's test keys or a staging-only server-side switch. Never disable CAPTCHA on production.
- Google reCAPTCHA v2 has vendor-provided test keys; v3 uses separate staging keys. Other CAPTCHA vendors have different setups.
- `test-results/site-audit.json` may be overwritten by repeated runs (desktop project only runs crawler).
- A CDN may return 403/429, block automated clients, or have transient failures. Investigate before classifying as an actual site defect.
- Non-HTML links and third-party links are excluded from crawler expansion. Only same-origin links are GET-checked.
- Form inventory is not an end-to-end submission assertion; cross-check mails/CRM/db separately.
- For low server load, run with 1 worker and limit breadth with MAX_PAGES/MAX_LINKS.
- Search, map, calculator and backend assertions are future site-specific tests. Document testing is intentionally excluded.

## Recommended post-update workflow
1. Snapshot staging DB/files and note plugin, WordPress, Sage, Bedrock versions.
2. Apply updates to staging.
3. Run `npm run test:safe` and investigate failures.
4. Run approved staging submission and core calculation tests after configuring them.
5. Compare results to the last known-good baseline; review visual changes.
6. Deploy to production only after approval, then run safe production smoke tests.

## Document exclusions
All URLs beginning with `/documents/`, `/videos/`, and `/video/` (including document-related request forms) are excluded from sitemap discovery, page crawling, link validation and direct test routes. Downloadable assets (PDF, Office files, ZIP, images, videos) are not followed as pages or validated as links. Other areas of the site remain in scope.

## Excluded sections

The crawler ignores `/documents/`, `/videos/`, `/video/` and their child pages. Links to these URLs are not checked. Download file extensions are also excluded. Other site areas remain in scope.
