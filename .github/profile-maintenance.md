# Profile maintenance

Keep the biography, affiliations, and research status in `README.md` aligned
with https://oyyp.nexa-lang.com/. Generated cards are repository files.
The live Profile views badge is served by Komarev so visits can be counted.
The four contact badges in `badges/` are static Shields SVGs. Refresh them
manually with `node .github/scripts/update-badges.mjs` when labels or styles
change; they are independent of daily statistics generation. Homepage and
Email use simple globe/envelope icons; Scholar and ORCID use brand icons.

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
write images to this repository. The calendar and pixel renderer use the
existing `METRICS_TOKEN` for user data: the Pixel renderer's stargazer
connection query is unavailable to the repository integration token.
No additional secret or permission scope is needed.

## Sources and adaptations

| Visual | Source | Generation |
| --- | --- | --- |
| Fuji pixel card | [Pixel Profile](https://github.com/LuciNyan/pixel-profile) | Pinned official renderer on Node 24 |
| Trophy cabinet | [GitHub Profile Trophy](https://github.com/ryo-ma/github-profile-trophy#load-balancing-endpoints) | Officially listed public mirrors; validated flat/onedark SVGs |
| GitHub statistics | [Readme Stats core](https://github.com/stats-organization/github-readme-stats) | Version 2.2.0, locked in pnpm |
| Summary, languages, working hours | [Summary Cards](https://github.com/vn7n24fzkq/github-profile-summary-cards) | Download and validate hosted SVGs |
| Contribution city | [3D Contrib](https://github.com/yoshi389111/github-profile-3d-contrib) | Pinned official Action |
| Pac-Man | [Contribution Arcade](https://github.com/abozanona/pacman-contribution-graph/tree/7332e1de7903ab780c3692a4127a59cc13872daa) | Official v5.3.2 tag pinned by commit; call renderer directly |
| Activity graph | [Activity Graph](https://github.com/Ashutosh00710/github-readme-activity-graph) concept | Local native-SVG fallback over the validated calendar |
| Streaks | [Streak Stats](https://github.com/DenverCoder1/github-readme-streak-stats) | Pinned PHP renderer, rolling-year calendar adapter |
| Typing tagline | [Typing SVG](https://github.com/DenverCoder1/readme-typing-svg) | Download customized SVG |
| Skill icons | [Skill Icons](https://github.com/LelouchFR/skill-icons) | Download chosen icons for both themes |
| Quote | [Readme Quotes](https://github.com/PiyushSuthar/github-readme-quotes) | Download and fix intrinsic image dimensions |
| Contact badges | [Shields](https://shields.io/badges/static-badge) | Static repository-hosted SVGs, refreshed manually |
| Profile views | [Komarev](https://github.com/antonkomarev/github-profile-views-counter) | Live monochrome badge using the existing GitHub username |

Trophy preserves the former rank filter (`-?,-C,-B`) in one row of six,
displayed at 600px wide in the README and scaled down on smaller screens.
URLSearchParams encodes the question mark in that filter. The primary mirror
is `trophy.ryglcloud.net`; the fallback is
`github-profile-trophy-unserori.vercel.app`. Both are in the original project's
recommended endpoint list. Both themes must pass validation from one mirror
before staging; a failure leaves the previous published pair intact.
Requests send only the public username and appearance options, with no
authentication headers or cookies. Mirror requests never use a GitHub token.

The retired Trophy workflow failed with `Resource not accessible by
integration` on its cross-repository query. It is replaced by the public
mirror generator. Trophy renders public aggregate ranks and counts using
the service's counting rules; contribution-based ranks cover the past year.

The former `profile-counter.glitch.me` endpoint returns HTTP 410 following
Glitch's hosting shutdown. Its historical count has no verified migration
source. The Komarev badge uses its own counter for `ouyangyipeng`, with no
invented `base` offset. It records image requests through GitHub's proxy,
so repeat views and caching affect the count. Keep this badge live rather
than copying it into the daily image set. If a verified old total is later
recovered, Komarev documents a `base` parameter for migration.

GitHub reports contribution years back to 1969 for this account. The streak
card deliberately uses the rolling-year UTC calendar; the activity chart
uses the last 31 days. Summary Cards retains its upstream all-time semantics.
The working-hours chart is UTC+8. Cards can count public activity differently.

Pixel is generated with the existing Metrics read credential; Stats uses the
repository integration token. Their available GitHub views can differ. One
verified run showed Pixel 345 stars / 28 PRs / 9 issues versus Stats 343 / 25 /
8; do not treat the two cards as identical counting scopes. Only aggregate
figures are rendered. No private repository names or contents are published.

Activity Graph's hosted service returned HTTP 402, and its local build has an
incomplete upstream lockfile and a jsdom 9 dependency. The local SVG fallback
keeps the contribution curve and drawing animation without that legacy stack.

The Arcade library is called directly, without the upstream Action wrapper's
leaderboard submission or analytics calls. No official demo data is published.
The v5.3.1 renderer could finish its 3000-frame loop without exporting SVG or
calling its completion callback. The pinned v5.3.2 tag fixes this, and its
checked-in build is used with install scripts disabled. That version was not
available from npm during verification. A deterministic scenario regression
checks completion and SVG output. Await the renderer's own Promise so missing
output produces an explicit error instead of an unsettled top-level await.

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
