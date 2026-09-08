# Issue #7 verification

Added the Aether Engine learning phase after LOCKE. The puzzle card explicitly
labels it an imaginary machine and presents six readable concepts with their
short functions: Aether Core, Prism Coil, Lumen Cell, Pulse Gate, Beacon Lens,
and Cooling Ring. Next opens three recognition maps. Every map contains the
same six concepts; only the relationships differ. Map A shows the meaningful
energy flow and Cooling Ring support link, Map B groups the concepts radially,
and Map C shows the misleading chain. Each choice gives concise Diffuse
feedback, records the selected map in the card, applies only a small penalty to
the weak maps, and waits for Next before continuing to the existing distortion.
No diagram library or forced retry was added.

Verified with desktop Chromium 153.0.8010.12 using the existing Playwright
tooling. The introduction displayed all six names and functions and the
imaginary-machine explanation. The map card displayed three choices; automated
text checks confirmed every map contained all six identical concept names.
Meaningful, radial, and misleading selections were each exercised. All three
produced selected-map feedback, stable dialogue after three seconds, correct
anxiety behavior, and a player-controlled Next transition into the distortion
phase. `node --check script.js` and `git diff --check` passed.

Issue #7 acceptance criteria are satisfied. Distortion ordering and corrected
retrieval remain scoped to later issues.
