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
  Activity Graph from a GitHub calendar using its official chart renderer.
- Render the official streak card from the rolling-year calendar, explicitly
  labelled UTC, to avoid backdated imported history dominating the display.
- Use the built-in repository token for public data. Do not expand scopes or
  create credentials. Preserve the existing Metrics calendar and token.
- Validate generated assets before publishing. A failed generation must not
  replace the last good images. Serialize visual workflows per branch.

## Work

- [ ] Inspect and pin generator inputs, output paths, and data semantics.
- [ ] Add the generation workflow, small adapters, and meaningful data tests.
- [ ] Generate the complete image set on the feature branch and inspect it.
- [ ] Add the complete README layout and update maintenance documentation.
- [ ] Verify Markdown rendering, desktop/mobile image loading, and links.
- [ ] Review, rebase onto current main, pass CI, and Rebase and merge.
- [ ] Verify the public Profile and the first main refresh workflow.

## Acceptance and risk

All twelve gallery categories must have working images sourced from the
user's public data or correctly labelled decorative content. No official
demo image may masquerade as the user's data. Third-party outages must be
visible in Actions while the previous published images remain available.
Check SVG error cards as well as HTTP status. Check PNG signatures and
streak/calendar date ranges. Keep bot commits in the Pedalboard format.

Known input: GitHub reports contribution years back to 1969, although this
account was created in 2023. The streak card will use the past-year window;
all-time summary cards retain the upstream counting semantics and are
labelled as such. Public statistics can differ from private activity totals.
