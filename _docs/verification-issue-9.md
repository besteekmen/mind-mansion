# Issue #9 verification

Room 2 now proceeds from LOCKE answer feedback to one Aether retrieval on Next.
The Aether question is “Which component stores the light before it is released?”
with Prism Coil, Lumen Cell (correct), Pulse Gate, and Cooling Ring. Correct and
incorrect answers explain the storage/release relationship in Diffuse's panel;
feedback remains until Next. The existing answer-token guard prevents repeat
submissions, and the Aether anxiety adjustment matches LOCKE (-3/+4).

Next after Aether feedback awards Fragment 2 regardless of strategy, map, or
answer accuracy. Completion requires the final room step and active retrieval
phase, then changes phase to prevent repeated awards. The fragment message and
updated HUD remain until Next starts the shared transition to the existing
Room 3 placeholder using its supplied background. Room 3 gameplay is unchanged.

Validation used temporary Playwright tooling and desktop Chromium
153.0.8010.12; no dependency or test suite was added to the repository:

- Clicked the entire Room 0–2 flow at normal speed, including all five Room 1
  associations/recalls, raw-list recall, BRIDGE, LOCKE strategy, Aether learning
  and map selection, distortion, both retrievals, fragment recovery, and Next
  to Room 3. Paused at both answer feedback stages and fragment recovery.
- Exercised all 12 strategy/map combinations with browser-clock advancement.
  Every route reached exactly one distortion, one LOCKE retrieval, and one
  Aether retrieval, including correct and incorrect answers to both questions.
- Checked exact prompts/options, distinct LOCKE hints, stable feedback after
  four seconds, and no automatic exit after five seconds on fragment recovery.
- Double-clicked answers and transition controls; each route awarded one
  fragment (1 → 2), and repeated finishRoom2 calls did not award another.
- Manually reviewed screenshots of the new Aether feedback and fragment state
  at 1440×1000. HUD, Diffuse feedback, and Next remained visible/readable.
- No browser console errors. `node --check script.js` and `git diff --check`
  passed.

Issue #9 acceptance criteria are satisfied for the current room flow. The
existing timer-collapse phase cannot advance via the Room 2 Next handler.
Global anxiety collapse/retry remains deferred to its existing backlog issues;
this change does not implement that system. Full Chrome/Edge/Firefox release
QA also remains deferred. No Issue #10 or later gameplay was implemented.
