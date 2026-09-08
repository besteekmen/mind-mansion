# Issue #3 — obsolete room callbacks

Verified 2026-09-08 using the launch steps in baseline-room-0-2.md.

All existing delayed room work and both storm intervals now use one small
scheduler in script.js. It records timeout/interval handles and captures the
room, game phase, and cancellation generation. Obsolete callbacks are ignored;
completed timeouts and stopped intervals leave their registries.

`cancelRoomWork()` clears pending handles, invalidates old answer cards, releases
transition/storm flags, and hides obsolete overlays. Room entry (including entry
to the same room), transition start, and the existing timer-expiration path call
it. Explicit room entry can supersede a pending transition; player-triggered
transitions remain guarded by Issue #2. Future collapse/retry/restart reset code
can call this helper before resetting state. Those features were not implemented.

The two existing global timer/passive-anxiety loops remain untouched and are
neither cancelled nor recreated. Questions, timings, hints, anxiety adjustments,
fragment conditions, and normal progression remain as recorded in the baseline.

## Acceptance verification

Used desktop Chromium 153.0.8010.12 with existing external Playwright tooling in
`/tmp`; no repository test suite or dependencies were added. Console-forced room
entry simulates interruptions because retry/restart controls do not yet exist.

For each case below, entered Room 3 while work was pending, captured room/phase,
dialogue, puzzle HTML/visibility, title, background, and fragments, then advanced
the controlled browser clock by ten seconds. Those values stayed unchanged;
only the existing global +1 passive-anxiety increments occurred. Both room
callback registries were empty, with no transition or storm flag left active.

- Intro transition; first association reveal; association feedback; delayed
  storm start.
- Room 1 storm before its first tick, after two ticks, after its last tick but
  before its ending adjustment, and before its delayed recall render.
- Room 1 recall feedback and completion dialogue/room-exit delays.
- Library transition and its separate 50 ms startup callback.
- Raw-list recall reveal; LOCKE feedback and delayed distortion start.
- Library storm before its first tick, after two ticks, after its last tick but
  before its ending adjustment, and before its delayed recall render.
- Delayed library completion and room exit.

Additional checks passed:

- Same-room Room 1 re-entry during pending association feedback remained at its
  fresh welcome, without old puzzle rendering.
- Calling `cancelRoomWork()` twice safely invalidated an active storm.
- Changing the game phase while a storm or association timeout was pending
  prevented stale execution; the obsolete interval removed itself.
- Forcing the existing timer to expire during a storm preserved the time-expired
  dialogue/phase and left no pending room callbacks after ten seconds.
- Original baseline reproduction `goToRoom(1); startRecallPhase(); goToRoom(2);`
  no longer changes library dialogue, phase, or puzzle after entry.
- Repeated all Issue #2 stress cases: twelve handler invocations per question,
  stale buttons, rapid Next, single anxiety changes, bounds, fragment awards,
  and exactly one entry into each of Rooms 1, 2, 3. No regression.
- Two normal-speed mouse walkthroughs, with all-correct and all-wrong Room 1
  answers, Door/Ice raw recall, preferred/Raw List strategy, Kite/Crown retrieval,
  Room 1 and both Room 2 hint contexts, reached the Room 3 placeholder. Both
  storms ran once and finished; correct path ended at 2/4 fragments, wrong path
  at 0/4, matching the unchanged completion rules. Reviewed browser screenshots.
- No page exceptions or console errors during either walkthrough; no page
  exceptions during the interruption/stress checks.
- `node --check script.js` and `git diff --check` passed. Source review confirmed
  no untracked room timeouts/intervals remain outside the scheduler.

All Issue #3 acceptance criteria are satisfied. Verification is browser-driven
functional testing, not a human pacing study or cross-browser release sign-off.
The wrong-answer run reached anxiety 100 without collapse; that existing gap is
already tracked by #22 and remains unchanged. All other deferred behavior listed
in the baseline remains outside this issue. Work stops after #3.
