# Room 0–2 baseline — Issue #1

Verified 2026-09-08 against application commit `a96eefb`, before application edits.
The owner's existing artwork changes and untracked guidance/assets were present
and left untouched. This task changes only this record.

## Launch and verification method

From the repository root, run `python3 -m http.server 8000 --bind 127.0.0.1`
and open `http://127.0.0.1:8000/`. No build or installation is needed. Stop the
server with Ctrl+C. `index.html` also supports direct opening (not separately
browser-tested here).

Read AGENTS.md, plan.md, process.md, index.html, style.css, script.js from start
to end, style_dna.txt, and the planning backlog. Inspected all eight current PNGs;
ignored historical assets as instructed. Used existing external Playwright tooling
in `/tmp` to drive desktop Chromium 153.0.8010.12 at 1440×1000 with mouse clicks.
Two full walkthroughs used real application delays, with state/console inspection
and screenshot review. Targeted duplicate/cancellation probes used a controlled
browser clock and console calls. No tooling or application changes were added.
This is browser-driven functional verification, not a human pacing study or
Chrome/Edge/Firefox release certification.

`node --check script.js` and `git diff --check` passed. Both ordinary walkthroughs
had no JavaScript exceptions or console errors. Startup, Diffuse, backgrounds,
HUD, and puzzle cards rendered successfully. HUD and dialogue remained accessible;
room titles sit behind the puzzle overlay (already tracked by #10).

## Observed flow and working behavior

1. Room 0 starts immediately with 15:00, anxiety 20%, fragments 0/4, and two hints.
   The timer starts on page load. Five introductory lines advance via Next; the
   fifth Next starts the 500 ms white transition to Memory Forge.
2. Room 1 begins with a welcome, then two Next-controlled instructions. The first
   association appears 1200 ms after the second click. The five pairs are Dragon
   + Calculator, Banana + Crown, Moon + Umbrella, Tiger + Violin, Pizza + Rocket.
   Strong choices (zero-based indexes 1,0,2,1,0) reduce anxiety by 3; weak choices
   add 5. Choices advance after 700 ms, with a 900 ms wait before the storm.
3. The Memory Storm shows five messages every 700 ms, adding 3 anxiety each.
   A 600 ms ending delay adds 5, then 400 ms leads to recall. `gamePaused` pauses
   passive anxiety during the storm, not the exam timer.
4. Five shuffled recall questions ask for Calculator, Crown, Umbrella, Violin,
   Rocket in that order. Correct answers reduce anxiety by 2, wrong answers add
   4; successive questions wait 600 ms. A Room 1 hint gives the strangest-image
   nudge and reduces anxiety by 5. Hints have two uses shared across rooms today.
5. Five correct recalls yielded score 5/5 and Fragment 1; five wrong recalls
   yielded score 0/5 and no fragment. Both paths hide the puzzle, automatically
   change dialogue at 1800 ms, and enter Room 2 at 3500 ms plus its transition.
6. Room 2 welcome and two Next instructions lead to Book, River, Ice, Door,
   Glass, Ember. After four seconds, recall asks which item was fourth. Door
   reduces anxiety by 2; Ice adds 3. Both immediately reveal the same BRIDGE
   panel with corresponding feedback. Next gives the compact/ordered/meaningful
   line; another Next opens LOCKE strategy selection.
7. Strategy choices are Raw List, LOCKE, Lazy Owls Carry Kite Equipment, LOKCE.
   The available hint says strong chunks are ordered and meaningful. The selected
   strategy is echoed in dialogue, feedback replaces it after 900 ms, and
   distortion starts at 1800 ms. Preferred and Raw List branches were exercised.
8. Library Distortion shows five messages at 900 ms intervals, adding 2 anxiety
   each; its ending adds 4 after 700 ms, then recall starts 500 ms later. Recall
   asks which item was fourth; Kite reduces anxiety by 3, Crown adds 4. The recall
   hint separately says to recall what each LOCKE letter stood for.
9. After 1500 ms, the preferred strategy awards Fragment 2; Raw List does not.
   At another 2500 ms, Room 3 displays “Room 3 not built yet.” with the Memory
   Palace title. The library background persists. Correct run ended with 2/4
   fragments; wrong run with 0/4. Both reached this implemented endpoint.

Anxiety is clamped to 0–100 and normally rises by 1 every eight seconds outside
intro/storm pauses. HUD updates tracked the choices and passive increments.
Using one hint in Room 1 left one in Room 2; consuming it during strategy choice
made recall report exhaustion. A fresh run reserving both hints for Room 2
confirmed the two distinct hint texts and their -5 adjustments.

## Reproducible defects within Issues #2–#3

- **Duplicate association (#2):** reach Forge Memory 1 and double-click its first
  option within 700 ms. The visible Dragon question advances `currentPairIndex`
  from 0 to 2, stores two memories, and applies +5 then -3 (the second click is
  evaluated against the unseen Banana round). Seven immediate clicks on that
  retained button exceed the five-round array and raise a TypeError reading
  `pair`; delayed renders also fail. This can break progression.
- **Duplicate room entry (#2):** advance Room 0 to its last line, then click Next
  repeatedly during the 500 ms transition. A console counter around startRoom1
  recorded six entries for six rapid clicks. The overlay does not intercept
  pointer input. Recall and Room 2 handlers also lack pending-answer guards on
  inspection; test those during #2's fix.
- **Obsolete storm (#3):** on a fresh page use the console to run
  `goToRoom(1); startRecallPhase(); goToRoom(2);`. After 600 ms the library welcome
  appears at anxiety 20. After another 4100 ms the old storm has raised anxiety
  to 40, changed the phase to recall, and written the Dragon recall puzzle into
  the library's hidden card. Console-forced departure is necessary because
  retry/restart controls are not implemented yet. This demonstrates the missing
  invalidation boundary without adding those later features.

## Existing planned gaps, not new baseline blockers

Hint reset/raw-list hint/BRIDGE initials (#4), conditional and automatic Room 1
completion (#5), timed LOCKE feedback (#6), Aether learning/retrieval (#7–#9),
shared puzzle/title boundaries (#10), Room 3/4 gameplay (#11–#18), start gate
(#19), elapsed-time handling (#20), checkpoints/collapse/retry/restart (#21–#25),
and remaining ending/release work are already in the backlog. They are not fixes
for this verification issue. Source inspection also confirms time expiration only
sets COMPLETE with a dialogue line, while anxiety 100 has no collapse action.
The supplied later-room/ending artwork exists but is not integrated yet.

## Acceptance result

Startup and all implemented Room 0–2 phases through the Room 3 placeholder were
verified on both correct and wrong paths. The record includes launch steps,
working behavior, and reproduced blockers, separated from missing features.
Application files and assets remained unchanged by this task. Issue #1 is satisfied;
the reproduced defects are the explicit scope of #2 and #3.
