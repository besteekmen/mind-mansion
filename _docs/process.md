# Issue workflow

GitHub Issues in [besteekmen/mind-mansion](https://github.com/besteekmen/mind-mansion/issues) are the active implementation backlog. Keep `tasks.md` as the original planning artifact, not a second live task tracker. The approved MVP follows the Must Have scope in `plan.md` §24; full portfolio polish in §26 is a later scope.

1. Select one open issue at a time unless two issues are explicitly coupled; record any coupling in the issues. Check dependencies and existing equivalent issues before creating new work.
2. Read `plan.md`, the root `AGENTS.md`, and the selected issue, including its acceptance criteria. Inspect the relevant existing code and assets before modifying anything.
3. Make small, focused changes that preserve working behavior outside the issue. Keep missing-art placeholders until final assets are supplied; do not expand product scope or refactor unrelated systems.
4. Test the affected flow manually after each meaningful change, checking the browser console and the relevant cases in `plan.md` §23. Run available automated checks before completion; currently there is no automated test suite, and the lightweight syntax/whitespace checks are documented in `AGENTS.md`.
5. Commit regularly with clear messages identifying the issue and concrete change. Include only intended files and preserve unrelated working-tree changes.
6. Record blockers, ambiguities, plan conflicts, and reproducible defects in the issue. Seek resolution there rather than silently changing requirements; create focused follow-up issues where appropriate and avoid duplicates.
7. Re-read the acceptance criteria before completion. Record the change, validation performed, and any limitations in the issue; do not close it until every acceptance criterion is satisfied. If GitHub access is unavailable, retain the report locally and leave the issue open until it can be updated.

## Current artwork

The owner has supplied the completed visuals in `assets/`, including `memory-complete.png` and `ending-morning.png`. Use the current files where relevant; the original planning artifact retains historical missing-art wording. Preserve `assets/old/` and all `_old` files, but ignore them for implementation and asset selection; do not delete them. This does not expand the MVP to include optional visual polish.

## Verified backlog migration

All 38 planning tasks were converted to open GitHub Issues in task order. No equivalent open issues existed, so 38 were created and none skipped; read-back verification confirmed unique titles and exact preserved Goal, Description, and Done when text. Each issue also carries a separate current-artwork clarification. `tasks.md` is unchanged.

| Planning task | GitHub Issue |
| --- | --- |
| 1 | [#1 — Verify: Establish the unchanged Room 0–2 baseline](https://github.com/besteekmen/mind-mansion/issues/1) |
| 2 | [#2 — Fix: Prevent duplicate answers and transitions in existing rooms](https://github.com/besteekmen/mind-mansion/issues/2) |
| 3 | [#3 — Fix: Cancel obsolete room callbacks](https://github.com/besteekmen/mind-mansion/issues/3) |
| 4 | [#4 — Fix: Reset room hints and clarify the raw-list/BRIDGE flow](https://github.com/besteekmen/mind-mansion/issues/4) |
| 5 | [#5 — Fix: Make Room 1 completion unconditional and player controlled](https://github.com/besteekmen/mind-mansion/issues/5) |
| 6 | [#6 — Fix: Keep LOCKE strategy feedback under player control](https://github.com/besteekmen/mind-mansion/issues/6) |
| 7 | [#7 — Add: Teach Aether Engine relationships through map selection](https://github.com/besteekmen/mind-mansion/issues/7) |
| 8 | [#8 — Fix: Place Room 2 distortion before the corrected LOCKE retrieval](https://github.com/besteekmen/mind-mansion/issues/8) |
| 9 | [#9 — Add: Finish Room 2 with Aether retrieval and Fragment 2](https://github.com/besteekmen/mind-mansion/issues/9) |
| 10 | [#10 — Fix: Establish usable shared puzzle boundaries](https://github.com/besteekmen/mind-mansion/issues/10) |
| 11 | [#11 — Add: Establish the Room 3 scene and selectable landmarks](https://github.com/besteekmen/mind-mansion/issues/11) |
| 12 | [#12 — Add: Let players build and revise their Memory Palace](https://github.com/besteekmen/mind-mansion/issues/12) |
| 13 | [#13 — Add: Retrieve three Memory Palace assignments](https://github.com/besteekmen/mind-mansion/issues/13) |
| 14 | [#14 — Add: Establish the Final Escape scene](https://github.com/besteekmen/mind-mansion/issues/14) |
| 15 | [#15 — Add: Implement the three Final Escape callbacks](https://github.com/besteekmen/mind-mansion/issues/15) |
| 16 | [#16 — Add: Reconstruct the final event through imagery and structure](https://github.com/besteekmen/mind-mansion/issues/16) |
| 17 | [#17 — Add: Anchor the final event in the Room 4 scene](https://github.com/besteekmen/mind-mansion/issues/17) |
| 18 | [#18 — Add: Complete final retrieval and recover Fragment 4](https://github.com/besteekmen/mind-mansion/issues/18) |
| 19 | [#19 — Add: Gate the opening with Enter Mansion](https://github.com/besteekmen/mind-mansion/issues/19) |
| 20 | [#20 — Fix: Account for elapsed exam time](https://github.com/besteekmen/mind-mansion/issues/20) |
| 21 | [#21 — Add: Capture room-entry checkpoints](https://github.com/besteekmen/mind-mansion/issues/21) |
| 22 | [#22 — Add: Trigger recoverable Mind Collapse from both limits](https://github.com/besteekmen/mind-mansion/issues/22) |
| 23 | [#23 — Add: Retry the existing Rooms 0–2 from checkpoints](https://github.com/besteekmen/mind-mansion/issues/23) |
| 24 | [#24 — Add: Extend checkpoint retry to the spatial rooms](https://github.com/besteekmen/mind-mansion/issues/24) |
| 25 | [#25 — Add: Provide confirmed full-game restart](https://github.com/besteekmen/mind-mansion/issues/25) |
| 26 | [#26 — Add: Track neutral journey statistics](https://github.com/besteekmen/mind-mansion/issues/26) |
| 27 | [#27 — Add: Display four pieces of one restored memory](https://github.com/besteekmen/mind-mansion/issues/27) |
| 28 | [#28 — Add: Restore the mansion and show the morning ending](https://github.com/besteekmen/mind-mansion/issues/28) |
| 29 | [#29 — Add: Present results and learning credits](https://github.com/besteekmen/mind-mansion/issues/29) |
| 30 | [#30 — Verify: Check Room 0–2 regression and learning flow](https://github.com/besteekmen/mind-mansion/issues/30) |
| 31 | [#31 — Verify: Check spatial rooms and final progression](https://github.com/besteekmen/mind-mansion/issues/31) |
| 32 | [#32 — Verify: Check collapse, retry, and restart interruptions](https://github.com/besteekmen/mind-mansion/issues/32) |
| 33 | [#33 — Verify: Assess real-time first-playthrough pacing](https://github.com/besteekmen/mind-mansion/issues/33) |
| 34 | [#34 — Verify: Complete desktop Chrome and Edge playthroughs](https://github.com/besteekmen/mind-mansion/issues/34) |
| 35 | [#35 — Verify: Complete desktop Firefox playthroughs](https://github.com/besteekmen/mind-mansion/issues/35) |
| 36 | [#36 — Document: Write the MVP portfolio README](https://github.com/besteekmen/mind-mansion/issues/36) |
| 37 | [#37 — Deploy: Publish the static game through Netlify](https://github.com/besteekmen/mind-mansion/issues/37) |
| 38 | [#38 — Verify: Smoke-test the public MVP](https://github.com/besteekmen/mind-mansion/issues/38) |
