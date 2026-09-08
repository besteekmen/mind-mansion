# Issue #2 — duplicate answers and transitions

Verified 2026-09-08 using the launch steps in baseline-room-0-2.md.

Each answerable card now has a generation number and accepts one answer. All
options disable immediately on submission; retained handlers from earlier cards
are rejected. Transition-triggering Next clicks are guarded while the transition
is pending, including the library's 50 ms startup delay. Room completion rejects
repeat calls. Disabled controls have a minimal visible cue.

Room 1 choices, association/storm/recall order, delays, hint text, anxiety values,
and completion rules remain unchanged. Room 2's planned content/progression fixes
remain deferred to their existing issues. No application dependencies were added.

## Acceptance verification

Used existing external Playwright tooling in `/tmp` with desktop Chromium
153.0.8010.12. No repository test suite was introduced.

- Repeated the normal-speed mouse walkthrough from Room 0 through every Room 1
  and Room 2 phase to the Room 3 placeholder. Correct answers, hints, storms,
  HUD updates, 1/4 then 2/4 fragments, and transitions matched the baseline.
  Screenshot inspection confirmed HUD, dialogue, and BRIDGE still render.
- Reproduced the baseline first-option double-click with actual mouse events:
  the first round now advances only once and anxiety changes from 20 to 25.
- With a controlled browser clock, dispatched twelve rapid Next events on the
  final intro line. Exactly one Room 1 entry occurred. Also attempted Next
  between the Room 2 transition and its delayed start; welcome remained step 0.
- Invoked each option handler twelve times on all five association and all five
  recall rounds, both Room 2 recall cards, and LOCKE strategy selection. This
  bypasses native disabled-button suppression to verify the state guard itself.
  Indexes advanced once, correct Room 1 adjustments remained -3/-2, wrong raw
  recall added +3 once, and wrong LOCKE recall added +4 once. Options disabled.
- Retained handlers from prior association/raw-recall cards and invoked them
  after the next card appeared: no state change or skipped question.
- Repeated completion calls did not award extra fragments. Instrumented room
  entry calls recorded exactly [1, 2, 3]. Both storms finished and recall appeared.
- No out-of-range errors, JavaScript exceptions, or console errors on the
  normal walkthrough. Stress verification also had no page exceptions.
- `node --check script.js` and `git diff --check` passed.

All Issue #2 acceptance criteria are satisfied. Obsolete callback cancellation
is intentionally left for Issue #3. This is browser-driven functional validation;
Chrome/Edge/Firefox release testing and human pacing assessment remain later work.
