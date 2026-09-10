# Issue #8 verification

Preserved Issue #7's Next-controlled connection from Aether map feedback to
Library Distortion. Hid Next and Ask Diffuse during interference, and changed
only the LOCKE retrieval prompt to “Which item was represented by K in LOCKE?”.
Crown, Kite (correct), Ocean, and Ember and the separate strategy/recall hints
remain intact. The existing five brief distortion messages stay in the puzzle
card; Diffuse dialogue does not cycle during distortion.

Validation used temporary Playwright tooling with desktop Chromium
153.0.8010.12, without adding application dependencies or a test suite:

- Clicked through Room 0, all five Room 1 associations and recalls, then the
  Room 2 raw list, BRIDGE, LOCKE selection, Aether learning/map selection,
  distortion, and LOCKE recall at normal speed before and after the change.
- Exercised all 12 strategy/map combinations with browser-clock advancement.
  Each reached exactly one distortion and one LOCKE recall. Map feedback held
  until Next; rapid Next clicks did not duplicate distortion. Controls were
  hidden during distortion, and Diffuse text remained stable.
- Checked exact recall prompt/options and both distinct hints, correct and
  incorrect recall answers, and duplicate answer clicks.
- Manually reviewed rendered introduction and recall screenshots at 1440×1000.
  Browser runs reported no console errors.
- `node --check script.js` and `git diff --check` passed.

Issue #8 acceptance criteria are satisfied. Existing timed post-answer
completion and strategy-gated rewards are deliberately left for Issue #9.
Chrome/Edge/Firefox release-wide QA remains in the later verification issues.
