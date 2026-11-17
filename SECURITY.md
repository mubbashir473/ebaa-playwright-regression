# Security reporting and private test evidence

Report suspected vulnerabilities privately through [GitHub private vulnerability reporting](https://github.com/mubbashir473/ebaa-playwright-regression/security/advisories/new). Do not put credentials, customer information, cookies, captured headers or raw diagnostic artifacts in public issues. No response-time guarantee or security-maintenance commitment is currently stated.

Keep real `.env` files, internal target origins, browser/authentication state, traces, screenshots, videos and runtime reports out of commits and releases. A sanitized `.env.example` and synthetic fixture data may be tracked after review. Ignore rules are preventive; inspect staged files and all reachable history before publication. Deleting a file in a later commit does not remove its earlier copies.

The published v1.0.0 snapshot has a skipped submission template, not an implemented safe staging write workflow. `ALLOW_SUBMISSIONS=false` is not a general request firewall in that snapshot. Confirm the exact target and inspect the selected tests before execution. Never submit business forms or bypass production CAPTCHA without a separate, explicit safe-environment authorization. Keep diagnostic evidence private even when tests are observational.

If a credential is exposed, stop further distribution, notify its owner privately, rotate/revoke it through the responsible owner and assess history, copies and consumers. A release deletion or branch rewind cannot recall public clones or caches. Coordinate any remote cleanup explicitly rather than treating a later deletion as a repair.

This policy is current project work. It does not certify earlier archive versions, prove current website behavior or replace authorization to run a test or publish a change.
