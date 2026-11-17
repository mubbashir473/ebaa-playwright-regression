# EBAA Playwright Regression

Current source milestone: **archive-packaging-lock**, package **1.0.0**. This is a sanitized reconstructed archive state integrated with current documentation. MIT LICENSE and historical release tags are retained. Original development dates are not inferred from publication dates.

The [archive README](ARCHIVE-README.md) records this source milestone's original exported documentation. The [Day 2 staging runbook](docs/archive-exclusions-runbook.md) is retained as version-specific guidance for the v1.0.0 archive; it is not silently applied to later configurations. [Security reporting](SECURITY.md) remains available.

## Setup (dependency/browser network access)

```sh
npm ci
npx playwright install chromium webkit
cp .env.example .env
```

This source includes a lockfile; use npm ci.

## Local-only checks and viewing

After tools are installed, test discovery reads definitions without executing website assertions:

```sh
BASE_URL=https://staging.example.invalid ALLOW_SUBMISSIONS=false npm run test:safe -- --list
```

Discovery is not a passing website run. `npm run report` views existing local report artifacts. Keep raw reports, traces, screenshots, video, environments and authentication state private.

## Website runs require an explicit authorized target

This configuration selects its target through BASE_URL, not EBAA_ENV. Setting EBAA_ENV=staging alone can leave production selected. Replace the placeholder privately with an authorized origin; do not commit the real internal hostname. The unchanged example.invalid URL intentionally fails.

```sh
BASE_URL=https://staging.example.invalid ALLOW_SUBMISSIONS=false npm run test:safe
```

The older ALLOW_SUBMISSIONS flag and @staging label are not global network-write controls. The business submission template remains unimplemented/skipped. Inspect the selected tests and target; do not submit business forms or bypass CAPTCHA without a separately authorized safe workflow.

## Results and coverage

Record the actual command/target privately, commit, browser/projects, bounds, tool versions and first failures/retries. Retain a dated private baseline before another run overwrites output. Separate website defects, test mistakes, environment failures, historical findings and skipped/untested coverage. Do not turn missing bounded-crawl observations into repair claims. No EBAA website was contacted to prepare this integration.

The archival source and its assertions are preserved; this integration changes current documentation only in addition to the approved source transition. No new website pass, submission/delivery/CAPTCHA verification, restraint math or exhaustive media coverage is claimed. HTML crawler exclusions and dedicated media scope remain version-specific source behavior.

See [integration provenance](docs/PUBLICATION-INTEGRATION.md) for the relationship between the source tag and current main.
