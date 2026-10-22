# Profile maintenance

Keep the biography, affiliations, and research status in `README.md` aligned
with https://oyyp.nexa-lang.com/. All image references are repository files.
The public Profile does not request a third-party widget API while rendering.

## Daily visual generation

`profile-visuals.yml` runs at 00:30 UTC daily, on profile/generator changes,
or through `workflow_dispatch`. It writes to `.build/visuals/`, validates
the complete set, then copies the images into `profile/` and commits to the
branch being run. A failed refresh leaves the previous published files intact.
The bot commit message is `.github/visuals.gitmessage`.

The existing `metrics_display.yml` keeps the six-month isometric calendar.
Both workflows share the same per-branch concurrency group so they cannot
push conflicting visual updates at the same time.

Generators use the built-in `GITHUB_TOKEN` to read public profile data and
write images to this repository. The existing calendar uses `METRICS_TOKEN`.
No additional secret or permission scope is needed.

## Sources and adaptations

| Visual | Source | Generation |
| --- | --- | --- |
| CRT and Fuji cards | [Pixel Profile](https://github.com/LuciNyan/pixel-profile) | Pinned official renderer on Node 24 |
| GitHub statistics | [Readme Stats core](https://github.com/stats-organization/github-readme-stats) | Version 2.2.0, locked in pnpm |
| Summary, languages, working hours | [Summary Cards](https://github.com/vn7n24fzkq/github-profile-summary-cards) | Download and validate hosted SVGs |
| Contribution city | [3D Contrib](https://github.com/yoshi389111/github-profile-3d-contrib) | Pinned official Action |
| Snake | [snk](https://github.com/Platane/snk) | Pinned SVG-only Action |
| Breakout, Pac-Man, Galaga | [Contribution Arcade](https://github.com/abozanona/pacman-contribution-graph) | Library 5.3.1; call renderer directly |
| Activity graph | [Activity Graph](https://github.com/Ashutosh00710/github-readme-activity-graph) | Pinned chart renderer, local calendar adapter |
| Streaks | [Streak Stats](https://github.com/DenverCoder1/github-readme-streak-stats) | Pinned PHP renderer, rolling-year calendar adapter |
| Typing tagline | [Typing SVG](https://github.com/DenverCoder1/readme-typing-svg) | Download customized SVG |
| Skill icons | [Skill Icons](https://github.com/LelouchFR/skill-icons) | Download chosen icons for both themes |
| Quote | [Readme Quotes](https://github.com/PiyushSuthar/github-readme-quotes) | Download and fix intrinsic image dimensions |
| Joke | [Readme Jokes](https://github.com/ABSphreak/readme-jokes) | Download, remove image-incompatible resize script, set dimensions |

GitHub reports contribution years back to 1969 for this account. The streak
card deliberately uses the rolling-year UTC calendar; the activity chart
uses the last 31 days. Summary Cards retains its upstream all-time semantics.
The working-hours chart is UTC+8. Cards can count public activity differently.

The Arcade library is called directly, without the upstream Action wrapper's
leaderboard submission or analytics calls. No official demo data is published.

## Verification

Use Node 24 and the pnpm version in `package.json`:

```sh
pnpm install --frozen-lockfile --ignore-scripts
pnpm test
```

Test generation on a feature branch. Inspect the resulting images for content
and dates as well as HTTP success. `publish-visuals.mjs` rejects error-card
SVGs, script-dependent SVGs, and invalid PNG signatures. A refresh must finish
successfully before merging. Check the rendered GitHub README in both themes
and at mobile width after changing the layout.
