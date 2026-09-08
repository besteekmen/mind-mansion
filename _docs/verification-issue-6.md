# Issue #6 verification

LOCKE strategy selection now records the selected strategy directly in the
puzzle card and gives one stable, concise Diffuse response. The four existing
options and strategy hint remain unchanged. Timed feedback and automatic
distortion launch were removed; Next advances the existing continuation to the
Library Distortion.

Verified with desktop Chromium 153.0.8010.12 using the existing Playwright
tooling. The isolated strategy check exercised Raw List, LOCKE, Lazy Owls Carry
Kite Equipment, and LOKCE. Each choice appeared in a selected-strategy card,
its contextual dialogue remained unchanged after three seconds, and no storm
appeared until Next. Next advanced the room step and the existing distortion
started normally. `node --check script.js` and `git diff --check` passed.

Issue #6 acceptance criteria are satisfied. Aether learning and later Room 2
content remain deferred to their existing issues.
