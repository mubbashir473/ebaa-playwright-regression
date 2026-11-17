> Current run guidance for the published `archive-exclusions` snapshot (package version 1.0.0). Source milestones remain documented in [export notes](PUBLIC-EXPORT.md); the project is [MIT licensed](LICENSE). Example origins below are deliberately nonresolving placeholders, not working environments. No current website pass is claimed.

# EBAA Playwright Regression Suite (starter)

## Install
Node.js 20+ recommended. This snapshot has no committed lockfile, so an installation does not reproduce an exact historical dependency graph. Run setup in an isolated local checkout and keep any real environment settings private.

```bash
npm install
npx playwright install chromium webkit
cp .env.example .env
```

The example `.env` defaults to production. Select a target explicitly for each website run; do not rely on an old shell setting or a remembered environment name.

## Run on authorized staging or development

Replace the placeholder below **privately** with the exact origin you are authorized to test. Do not commit internal hostnames, credentials or real `.env` files. Running the unchanged `example.invalid` URL will fail by design.

```bash
BASE_URL=https://staging.example.invalid ALLOW_SUBMISSIONS=false npm run test:safe
```

For a separately authorized development origin:

```bash
BASE_URL=https://development.example.invalid ALLOW_SUBMISSIONS=false npm run test:safe
```

**Version-specific target selection:** this v1.0.0 snapshot reads `BASE_URL`; it does not implement `EBAA_ENV`. Setting only `EBAA_ENV=staging` does not switch the target and can leave the default `https://ebaa.com` selected. Other snapshots can have different environment controls and scripts; check their own configuration rather than transferring commands between versions.

`test:safe` excludes `@staging` cases. Desktop runs the core specs; mobile runs responsive specs only. The submission template remains unimplemented and unconditionally skipped. Neither the `@staging` label nor `ALLOW_SUBMISSIONS=false` is a universal network-write guard in this older snapshot. No successful business submission, delivery or server-validation coverage is claimed. Do not enable submissions, bypass CAPTCHA or use `test:staging` as permission to write.

For test discovery without contacting the target, after dependencies are installed:

```bash
BASE_URL=https://staging.example.invalid ALLOW_SUBMISSIONS=false npm run test:safe -- --list
```

Discovery lists cases; it does not execute their assertions or prove a website pass.

## View and retain local reports

After an actual run:

```bash
npm run report
```

Report viewing opens an existing local report. `test-results/site-audit.json` contains the machine-readable inventory. Copy results to a private, dated location before another run can overwrite them. Record the command, exact target privately, snapshot/commit, browser projects, Node/Playwright versions, bounds, first failures, retries and skipped cases. Keep raw traces, screenshots, video, cookies and captured request data private; share only reviewed/redacted findings. See [SECURITY.md](SECURITY.md) for private reporting.

The default example production origin is not evidence that a production run is authorized. This runbook adds no write workflow or new environment guard and does not change historical test behavior.

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
