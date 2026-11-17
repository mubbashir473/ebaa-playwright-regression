# Current work and reconstructed source integration

The published current documentation commit `2aef71741c883517a16bb403d3c32252c4883831` remains in main's ancestry. It fixes v1.0.0 staging selection guidance and adds private reporting information. The exact v1.0.0 guide is retained in archive-exclusions-runbook.md; its statements do not automatically apply to newer configurations.

This integration incorporates source `archive-packaging-lock` (`a45c1e8370bafcba45e79db6589b184c1e77d8ae`) as the second parent. The first parent is the prior public integration main (`2aef71741c883517a16bb403d3c32252c4883831`). Historical source commits, their author dates and annotated tag objects are not rewritten. Main is an ordinary fast-forward from its previous published state; it does not jump backward to an archive-only sibling.

Runtime JS, package/lock declarations, required fixtures and .env.example match the source milestone byte-for-byte. Current README, retained archive README, security policy and this provenance/runbook are deliberate documentation overlays, not new historical source features. The complete private manifest stores exact hashes and expected reachable DAGs.

Integration commits use actual preparation timestamps; publishing an already prepared integration on a later day does not move its author date or promise contribution credit for that day. No future publication is scheduled or authorized by preparing this local branch.
