# Profile maintenance

The profile content lives in `README.md`. Keep research status, affiliations,
and selected projects aligned with https://oyyp.nexa-lang.com/.

The contribution calendar is the only generated graphic. Its workflow runs
once a day, after profile/configuration changes, or through `workflow_dispatch`.
It updates `metrics.isocalendar.svg` on the branch being run. The README uses
this repository file, so profile visitors do not call a third-party stats API.

The existing `METRICS_TOKEN` reads GitHub activity. The built-in `GITHUB_TOKEN`
commits the resulting file with repository contents permission. Preserve the
current token scope; no additional credentials are required for this workflow.

When changing the Metrics configuration, run the workflow on the feature branch
and inspect the resulting SVG for embedded error messages before merging.
The native GitHub contribution graph remains available below the profile README.
