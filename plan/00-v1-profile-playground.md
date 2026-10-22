# Profile playground implementation plan

Goal: add every category from the approved widget gallery to the English
GitHub Profile, including the CRT card, stats, summary cards, activity graph,
streaks, skill icons, typing, pixel scenery, 3D city, snake, arcade games,
quotes, and jokes. Preserve the published biography and research facts.

## Design and scope

- Keep the CRT card and animated research tagline near the introduction.
- Group the remaining visuals in open, collapsible sections below research.
- Store every image in this repository; generate daily and on demand.
- Use pinned official generators where available. Render the unavailable
  Activity Graph from a GitHub calendar with a small native-SVG fallback.
- Render the official streak card from the rolling-year calendar, explicitly
  labelled UTC, to avoid backdated imported history dominating the display.
- Use the repository token for public data and the existing Metrics read
  credential for Pixel's user query. Do not expand scopes or create credentials.
  Preserve the existing calendar. Document that renderer views can differ.
- Validate generated assets before publishing. A failed generation must not
  replace the last good images. Serialize visual workflows per branch.

## Work

- [x] Inspect and pin generator inputs, output paths, and data semantics.
- [x] Add the generation workflow, small adapters, and meaningful data tests.
- [x] Generate the complete image set on the feature branch and inspect it.
- [x] Add the complete README layout and update maintenance documentation.
- [x] Verify Markdown rendering, desktop/mobile image loading, and links.
- [ ] Review, rebase onto current main, pass CI, and Rebase and merge.
- [ ] Verify the public Profile and the first main refresh workflow.

## Acceptance and risk

All twelve gallery categories must have working images sourced from the
user's GitHub data or correctly labelled decorative content. Render aggregate
figures only; publish no private repository names or contents. No official
demo image may masquerade as the user's data. Third-party outages must be
visible in Actions while the previous published images remain available.
Check SVG error cards as well as HTTP status. Check PNG signatures and
streak/calendar date ranges. Keep bot commits in the Pedalboard format.

Known input: GitHub reports contribution years back to 1969, although this
account was created in 2023. The streak card will use the past-year window;
all-time summary cards retain the upstream counting semantics and are
labelled as such. Public statistics can differ from private activity totals.

Feature verification: 9 behavior tests and 33 image validations pass. The
GitHub-rendered README loads all 19 images at desktop and 390px mobile widths
without horizontal overflow; section collapse/reopen works. Light assets
were inspected on a separate white-background preview because logged-out
GitHub follows the system theme and offers only a contrast control. Actual
GitHub light-mode switching remains outside this browser's available controls.
Code and generated-asset review found no remaining merge blockers.
Feature refresh evidence: Actions run 39833267518 succeeded.

Integration decision: the official Activity Graph local build failed because
its package-lock omits optional resolver packages; its rendering dependency
also requires jsdom 9. A native SVG over the same last-31-day input replaces
that renderer, retaining the requested chart and animation with no new deps.
