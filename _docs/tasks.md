# Mind Mansion MVP backlog

Source of truth: [plan.md](plan.md). This backlog follows option 1: preserve `index.html`, `style.css`, `script.js`, and `assets/`, extending existing functions with targeted fixes. Do not introduce frameworks, build tooling, a backend, save/continue, or a broad refactor. Tasks are ordered so shared behavior is available before dependent work; keep local verification within each implementation session.

## Current implementation compared with the plan

- **Implemented and to preserve:** Room 0's Next-driven narrative; Room 1's five association rounds, storm, five recalls, anxiety adjustments, and technique hint; the HUD, Diffuse dialogue panel, puzzle card, and shared transition effect. Room 1's core gameplay is locked, but completion behavior must change where the plan explicitly requires it.
- **Partially implemented:** Room 2 has raw-list study/recall, BRIDGE, four LOCKE strategies, distortion, and one recall. Aether Engine content is absent, and several feedback/progression details differ from the plan. Timer, anxiety, fragments, and hints exist but lack the required complete lifecycle.
- **Needs repair:** Repeated clicks can schedule duplicate work; delayed callbacks lack comprehensive cancellation; hints carry between rooms; raw recall exposes an inappropriate hint button; Room 2 dialogue changes on timers; fragments depend on performance/strategy; room exits are automatic; timer expiration is incomplete and anxiety 100% does not collapse the game. Titles are underneath the puzzle overlay, and selectable options lack the full feedback states.
- **Missing:** Room 3 and Room 4 gameplay, start overlay, checkpoints, recoverable collapse, restart confirmation, fragment artwork/assembly, ending/results/credits, audio/mute, atmospheric thresholds, reduced-motion support, README, and release QA/deployment evidence.
- **Assets inspected:** Existing Diffuse portraits and hallway/Room 1/Room 2 backgrounds remain intact. `assets/room3-bg.png` is now supplied and contains the five landmarks; integrate it instead of commissioning a replacement. `assets/room4-bg.png` was also supplied during backlog preparation and has been inspected; integrate its four scene anchors. Completed-memory artwork is absent; use a simple placeholder with the planned path until supplied. Do not generate substitute AI artwork.
- **Existing verification:** A local Chromium walkthrough reached the Room 3 placeholder through Rooms 0–2 without page errors, using accelerated waits. It confirmed hint carryover and missing anxiety collapse; it did not establish real-time pacing, all answer branches, or cross-browser readiness. Task 1 records a repeatable baseline before implementation.

## MVP boundary and execution rules

MVP means the **Must Have** scope in plan §24, as requested in this review. This is narrower than the full portfolio definition of done in §26: releasing this backlog does not claim that all portfolio polish is complete.

Audio sourcing/licensing, music/SFX/mute, animated fragment celebrations, new anxiety/low-time effects, a global answer-state polish pass, reduced-motion polish, and final-art replacement work are excluded from this MVP backlog. They remain in the product plan for later work. Retain basic readable feedback, selection/disabled cues needed for functional input, existing artwork, and a simple static fragment assembly; do not add new motion-heavy effects. Optional ending art and other Nice to Have work are not release dependencies.

Each implementation task includes checking its changed flow; the later QA tasks are bounded verification sessions, not open-ended “test and fix everything” tasks. Turn discovered defects or pacing changes into focused follow-up tasks, fix release blockers, and rerun affected cases before deployment. No automated test suite, framework, module migration, or broad cleanup is required.

**Dependency notes:** Finish Room 2 before adding spatial rooms; establish readable puzzle boundaries before placing scene targets. Add Enter Mansion and elapsed-time handling before snapshots/collapse/retry, and implement restart before integrating run statistics. Complete static fragment assembly and statistics before ending/results; complete local QA and any blocking follow-ups before publishing.

Tasks labeled **Fix** repair existing behavior; **Add** supplies missing behavior. Every task below is intended to have one focused-session outcome.

## Tasks

1. Verify: Establish the unchanged Room 0–2 baseline

Goal: Record a reproducible baseline of the current game before changing application files.

Description: Run the existing static project locally and follow Room 0 through Room 1 and every implemented Room 2 phase to the Room 3 placeholder, as required by plan §§2–4. Check hints, correct and wrong answers, HUD updates, transitions, and console output, recording working behavior and reproducible blocking bugs separately from missing planned features. Confirm successful startup without introducing changes to application code or assets.

Done when: A baseline record includes launch steps, observed Room 0–2 flow, working behavior, and any blockers with reproduction steps. Application files remain unchanged during this task.

2. Fix: Prevent duplicate answers and transitions in existing rooms

Goal: Make each Room 0–2 interaction advance state at most once.

Description: Guard existing answer handlers and transition-triggering Next clicks while their action is pending, using the current UI helpers where appropriate. Preserve Room 1's choices, sequence, and anxiety values, and address baseline input blockers within this scope rather than redesigning input handling (plan §§3, 7, 23).

Done when: Rapid repeated clicks cannot skip rounds, apply an answer penalty twice, schedule duplicate room entry, or produce an out-of-range error. A normal Room 0–2 walkthrough still works.

3. Fix: Cancel obsolete room callbacks

Goal: Prevent delayed work from a previous room or phase from changing the active game.

Description: Track and cancel the existing storm intervals and delayed puzzle/transition callbacks with a small helper in `script.js`. Add guards where needed so later collapse, retry, and restart actions can invalidate pending work without introducing an engine or reorganizing the project (plan §§3, 5.4, 23).

Done when: Leaving a room during pending work prevents its callbacks from changing dialogue, anxiety, or puzzles afterward. Normal storms and transitions still run once and finish correctly.

4. Fix: Reset room hints and clarify the raw-list/BRIDGE flow

Goal: Make existing hint availability and the BRIDGE demonstration match the plan.

Description: Reset hint uses and stale context on entry to Rooms 1–2, preserving Room 1’s technique hint and anxiety reduction and the two distinct LOCKE hint contexts. In Room 2, remove Ask Diffuse from raw recall and highlight the initials forming BRIDGE while preserving the existing list, immediate answer feedback/reveal, and Next-controlled demonstration (plan §§5.5, 8.1–8.2).

Done when: Room 2 starts with two uses even after Room 1 exhausted its hints, and unavailable/exhausted hints do not change anxiety. Both raw-answer branches reveal BRIDGE immediately, without a hint button or timed dismissal.

5. Fix: Make Room 1 completion unconditional and player controlled

Goal: Award Fragment 1 once after recall and wait for Next before Room 2.

Description: Replace `finishRoom1`'s score threshold, visible score, timed dialogue replacement, and automatic room exit with the completion behavior in plan §§5.6 and 7. Preserve all association rounds, retrieval, storm behavior, and existing answer anxiety adjustments; keep final-answer feedback readable before the completion response.

Done when: Both low-accuracy and perfect surviving runs receive exactly one fragment without a numeric score. Room 2 starts only after the player clicks Next.

6. Fix: Keep LOCKE strategy feedback under player control

Goal: Show the selected LOCKE strategy in the puzzle card with stable contextual feedback.

Description: Preserve the existing four strategy options and selection hint, but replace the timed “Okay, you picked” sequence with a visible card selection and concise Diffuse feedback. Distinguish the vivid sentence, acceptable LOCKE acronym, unordered LOKCE, and raw list, then wait for Next; retain the existing continuation temporarily until Aether learning is connected (plan §8.3).

Done when: Each choice is visibly recorded inside the card with appropriate feedback. Waiting does not replace dialogue or automatically launch distortion.

7. Add: Teach Aether Engine relationships through map selection

Goal: Extend LOCKE practice with one complete meaningful-chunking exercise.

Description: After LOCKE feedback, introduce the imaginary Aether Engine and its six short component functions, then show the three candidate maps from plan §8.4. Use simple HTML/CSS or inline SVG for the meaningful flow with Cooling Ring support links, arbitrary radial grouping, and misleading chain; accept each choice with concise Diffuse feedback and player-controlled continuation. Keep any weak-map anxiety penalty modest and avoid a diagram library or forced retries.

Done when: All six functions and the imaginary-machine explanation are readable, and all maps contain identical concepts. Every selection reaches feedback, with the best map showing both the energy flow and cooling relationship.

8. Fix: Place Room 2 distortion before the corrected LOCKE retrieval

Goal: Reuse the existing distortion after all learning and ask the specified LOCKE question.

Description: Connect Aether map feedback to the existing brief distortion sequence and then to exactly one LOCKE retrieval. Change its prompt to “Which item was represented by K in LOCKE?”, preserve Kite and the specified distractors, and keep the retrieval hint separate from the strategy hint (plan §§8.5–8.6).

Done when: Distortion occurs once after LOCKE and Aether learning and before recall. LOCKE retrieval uses the K prompt, correct options, and retrieval-specific hint without timed Diffuse dialogue cycling.

9. Add: Finish Room 2 with Aether retrieval and Fragment 2

Goal: Complete Room 2 with its second retrieval and guaranteed surviving-room reward.

Description: After LOCKE feedback, add the single light-storage question with Lumen Cell as the answer and the distractors from plan §8.7. Replace the existing strategy-gated `finishRoom2` reward and timed exit with a once-only fragment award and Next-controlled transition, preserving readable answer feedback (plan §§5.6, 8.7).

Done when: Every strategy/map route reaches exactly one LOCKE and one Aether retrieval and awards Fragment 2 if the player survives. Next alone advances to Room 3.

10. Fix: Establish usable shared puzzle boundaries

Goal: Keep the HUD, room headings, and dialogue readable before adding spatial rooms.

Description: Adjust existing overlay boundaries and stacking using the current Room 1 and completed Room 2 layouts as checks. Resolve only CSS conflicts needed to preserve the HUD, titles/subtitles, Diffuse feedback, and controls at representative desktop sizes; later room tasks must use these boundaries (plan §§3, 5.1, 19–20).

Done when: At 1366×768 and 1920×1080, Room 1 and dense Aether cards leave the required shared interface visible and every action reachable. The existing dialogue-panel style is preserved without a mobile redesign.

11. Add: Establish the Room 3 scene and selectable landmarks

Goal: Replace the Room 3 placeholder with the supplied Memory Palace scene.

Description: Integrate `assets/room3-bg.png` through the existing transition system and use the subtitle “Spatial memory & retrieval,” resetting hints to two uses on entry. Add clearly highlighted click targets for Glowing Fireplace, Cracked Moon Mirror, Sleeping Stone Gargoyle, Floating Bookshelf, and Giant Star Clock, keeping their alignment correct when the scene scales (plan §§9.1, 15, 18).

Done when: All five landmarks remain visible, distinguishable, and clickable at supported desktop sizes. Room 3 uses the supplied artwork and preserves the HUD and dialogue panel.

12. Add: Let players build and revise their Memory Palace

Goal: Store five player-chosen concept-to-location assignments in Room 3.

Description: Introduce Velora, Tarnix, Orin Bloom, Kestrel Rune, and Mira Dust with the definitions and fictional-subject explanation from plan §§9.2–9.3. Implement click concept → click location, visible assignments, and revision before confirmation, enforcing one concept per location. Once all are placed, show the vivid-imagery prompt and enable Test My Memory without generating associations for the player.

Done when: The player can create and revise a complete one-to-one mapping, with confirmation unavailable while incomplete. The confirmed mapping is stored as run data for both Room 3 recall and the Room 4 callback.

13. Add: Retrieve three Memory Palace assignments

Goal: Test the player's actual Room 3 placements at three unique random locations.

Description: After confirmation, hide assignment labels and randomly select three distinct locations, presenting five concept choices for each. Reveal the original assignment immediately after a wrong answer, provide brief feedback and the technique-only palace hint, and use no storm sequence (plan §§5.5, 9.4).

Done when: Exactly three unique locations are tested against the stored player mapping with correct wrong-answer reveals. Completion awards Fragment 3 once regardless of accuracy and waits for Next to enter Room 4.

14. Add: Establish the Final Escape scene

Goal: Replace the Room 4 placeholder with a usable scene for the finale.

Description: Add Room 4 entry using the existing transition helper, title, and Integration test subtitle, resetting hints to two uses on entry. Integrate the supplied `assets/room4-bg.png`, retaining a simple missing-file fallback, and define four readable anchors—tower window, bell pedestal, sealed door, and map table—independently of final artwork (plan §§10.2, 15–16).

Done when: Room 3's Next enters Final Escape with four distinct anchor targets and the persistent HUD/dialogue. Missing artwork does not block entry or interaction.

15. Add: Implement the three Final Escape callbacks

Goal: Retrieve one memory from each earlier learning room.

Description: Add short callbacks for the Room 1 pizza-powered Rocket association, K → Kite in LOCKE, and one actual stored Room 3 assignment. Give concise feedback and player-controlled continuation, with conceptual hints that do not disclose answers (plan §§5.5, 10.1).

Done when: All three callbacks run once and the palace answer changes correctly with different earlier player mappings. Correct and wrong answers can continue without turning the callbacks into long retry loops.

16. Add: Reconstruct the final event through imagery and structure

Goal: Implement the two consecutive choice steps for the new final memory.

Description: Present the comet, three crystal bells, observatory door, and silver map event with the brief guidance from plan §10.2. Offer three imagery choices, then three organizations of the same four facts, reusing the existing choice-card patterns and simple map presentation. Give stable Diffuse feedback and Next-controlled continuation for all choices without a tutorial or forced retry.

Done when: Both choice steps accept every option, and the vivid whole-scene image and comet → bells → door → map sequence receive appropriate feedback. All required new facts appear and no dialogue advances on a timer.

17. Add: Anchor the final event in the Room 4 scene

Goal: Reuse the Memory Palace placement pattern for the final memory.

Description: Adapt the existing Room 3 click-item-then-location interaction to connect the four event fragments to the four obvious Room 4 anchors. Keep this adaptation small, permit correction before confirmation, and provide only conceptual Diffuse nudges (plan §10.2).

Done when: All four event fragments can be assigned and confirmed using mouse clicks with unambiguous visible placement. The interaction works with the supplied Room 4 scene and its missing-file fallback and requires no drag-and-drop or new interaction framework.

18. Add: Complete final retrieval and recover Fragment 4

Goal: Finish the integrated challenge by recalling the hidden final memory.

Description: Hide the event text after spatial confirmation while retaining the scene and anchors, then ask “What revealed the path home?” with the four specified choices. Give feedback and restore Fragment 4 once, allowing surviving completion to proceed toward the single ending (plan §§10.3–10.4).

Done when: Retrieval occurs only after learning text is hidden and Silver map is the correct answer. Completion reaches 4 / 4 once without a grade, rank, or additional failure ending.

19. Add: Gate the opening with Enter Mansion

Goal: Start the existing game only after an explicit player click.

Description: Add the small start overlay over the existing hallway scene with the title, tagline, Enter Mansion action, and “~15–20 min • Mouse” line from plan §12. Keep the countdown and gameplay inactive before entry, then initialize the HUD and reveal the existing Room 0 dialogue without adding a landing page or tutorial.

Done when: Waiting on the opening overlay leaves time at 15:00 and prevents underlying gameplay clicks. Enter Mansion starts the existing introduction exactly once with initialized anxiety and fragments.

20. Fix: Account for elapsed exam time

Goal: Make the countdown accurate during normal play and browser callback delays.

Description: After Enter Mansion gating is implemented, measure elapsed running time rather than assuming every interval fires once per second (plan §5.2). Keep the timer running during dialogue and storms, expose a small way to restore remaining time for the later checkpoint work, and retain the current expiry path until Mind Collapse is connected. Do not add a manual pause control.

Done when: The timer stays at 15:00 before entry and reflects actual elapsed time after returning from a background tab. Starting or restoring its value cannot duplicate ticking or display negative time.

21. Add: Capture room-entry checkpoints

Goal: Record the state needed to restart only the current room.

Description: Extend existing room-entry functions to snapshot time, anxiety, fragment progress, hint allowance, and the data needed for a clean room start (plan §5.4). Distinguish room-local data from earlier-room memories, particularly the Room 3 assignments needed by Room 4, without moving all state into a new architecture.

Done when: Each room has an independent room-entry snapshot that is not changed by subsequent play. Room 4's snapshot preserves the actual earlier palace mapping while Room 3's entry snapshot has no new placements.

22. Add: Trigger recoverable Mind Collapse from both limits

Goal: Enter one safe failure state when time or anxiety reaches its limit.

Description: Replace the timer's dialogue-only failure and add the missing 100% anxiety check, both showing the Mind Collapse overlay with the appropriate cause. Cancel pending work with the existing helper and disable gameplay while collapsed so pending storms, answers, or transitions cannot continue the run (plan §§5.2–5.4).

Done when: Either limit opens the overlay exactly once with the correct cause and no subsequent gameplay mutation. Anxiety stays clamped to 0–100 and simultaneous triggers cannot create duplicate collapse handling.

23. Add: Retry the existing Rooms 0–2 from checkpoints

Goal: Make the collapse overlay restore the current early room safely.

Description: Using the checkpoint snapshots and collapse state, wire Retry Room to the existing Room 0–2 initialization paths (plan §5.4). Restore entry time, anxiety, fragments/progress, and hints; clear local puzzle state and cancel pending work while retaining completed earlier-room memories. Test both failure causes during dialogue, answers, and storms.

Done when: Each of Rooms 0–2 can collapse and retry from its own entry without restarting the run or duplicating rewards. Repeated retries leave one active set of loops and no obsolete callbacks.

24. Add: Extend checkpoint retry to the spatial rooms

Goal: Restore Rooms 3–4 without losing the earlier memories needed by the finale.

Description: Extend the working early-room retry path to Room 3 placements/retrieval and Room 4 callbacks/reconstruction (plan §§5.4, 9.4, 10.4). Room 3 retry must discard its failed placements, while Room 4 retry must preserve the confirmed earlier palace mapping and clear only finale progress. Allow unlimited Room 4 retries.

Done when: Collapse in placement, retrieval, or finale steps restores a clean current-room entry with its saved time, anxiety, hints, and fragments. Repeated Room 4 retries use the actual earlier palace data and never duplicate Fragment 4.

25. Add: Provide confirmed full-game restart

Goal: Let the player intentionally discard the current run and return to the start overlay.

Description: Add the unobtrusive persistent Restart Game control and the Restart/Cancel confirmation text from plan §13. Cancel must leave progress intact without creating a pause feature; Restart must cancel pending work and clear room progress, memories, checkpoints, fragments, and hint state.

Done when: Cancel preserves the active run and confirmed Restart returns to the initialized opening overlay. Restarting during a storm, transition, collapse, or ending cannot resurrect earlier callbacks or data.

26. Add: Track neutral journey statistics

Goal: Maintain reliable completion-time, retry, and hint totals for the ending.

Description: Record run duration separately from the restorable exam countdown so retrying does not produce an incorrect completion time. Count actual Retry Room actions and successful hint uses across attempts, reset totals on full restart, and freeze duration at successful completion; document the duration convention used (plan §11).

Done when: A run with retries and hints reports reproducible totals without counting exhausted hint clicks or rolling totals back with checkpoints. Full restart clears all journey totals.

27. Add: Display four pieces of one restored memory

Goal: Represent fragment recovery and final assembly with a simple static visual.

Description: Show four sections of `assets/memory-complete.png` if supplied, otherwise use one coherent four-part placeholder with that documented replacement path (plan §§5.6, 15–16). Reveal each section at its existing once-only reward event and show the complete image after Fragment 4, preserving player-controlled progression. Use simple rectangular sections rather than animation or elaborate masks.

Done when: Each room reveals its own section exactly once, and 4 / 4 produces one complete image or intentional placeholder. Missing final artwork does not block the ending or create a broken image.

28. Add: Restore the mansion and show the morning ending

Goal: Resolve the story once after the fourth fragment is recovered.

Description: Add the calm morning narrative from plan §10.4, fading tension and stopping gameplay changes after success. Use lighting or an overlay on an existing scene instead of requiring the optional morning illustration, and keep narrative advancement player controlled before results.

Done when: Fragment 4 leads to one successful morning ending and stable final gameplay state. The narrative makes no promise of a perfect exam result and shows no grade.

29. Add: Present results and learning credits

Goal: Finish the game with descriptive journey results and the required attribution.

Description: Display completion time, rooms retried, hints used, 4 / 4 fragments, and all five practiced techniques using the recorded journey totals. Add “Inspired by Learning How to Learn,” Barbara Oakley, Terrence Sejnowski, a verified original course/resource link, and “Created by Beste Ekmen” at the end rather than during gameplay (plan §11).

Done when: Results match the completed run and contain every required technique and credit. There is no score, stars, rank, grade, or “Mistakes” statistic, and the resource link works.

30. Verify: Check Room 0–2 regression and learning flow

Goal: Record whether the completed early rooms preserve intended behavior.

Description: Run the early-room cases from plan §23, including Room 1’s original choices, storm, recall and anxiety adjustments, every Room 2 strategy/map choice, both retrieval answer outcomes, hints, and player-controlled exits. Check rapid clicks and once-only rewards, recording defects with reproduction steps as separate focused fix tasks rather than bundling unknown repair work into QA.

Done when: The early-room checklist has pass/fail evidence and reproducible defects for any failures. Room 1 preservation and every Room 2 route are explicitly covered.

31. Verify: Check spatial rooms and final progression

Goal: Validate player-specific memory data and the complete finale.

Description: Run the Room 3–4 and ending cases from plan §23 using different palace mappings, assignment revisions, correct/wrong answers, and exhausted hints. Confirm three unique palace retrieval locations, the actual mapping in the finale callback, hidden study information during final retrieval, once-only fragments, ending, and neutral results. Record failures as separate focused fix tasks.

Done when: The spatial-room and ending checklist has pass/fail evidence for each required case. Any failed data mapping, reward, or progression case has clear reproduction steps.

32. Verify: Check collapse, retry, and restart interruptions

Goal: Validate the shared lifecycle independently of puzzle correctness.

Description: Exercise both collapse causes in every room, repeated Room 4 retries, background-tab expiry, and restart/cancel during dialogue, storms, transitions, placement, and completion (plan §23). Check restored time/anxiety/hints, earlier-room data, single active loops, and journey totals; record any failures as separate focused fix tasks.

Done when: All lifecycle cases have recorded pass/fail evidence, including simultaneous limits and stale-callback checks. Any failure identifies its trigger and incorrect restored or retained state.

33. Verify: Assess real-time first-playthrough pacing

Goal: Determine whether the MVP fits its intended duration without rushed reading.

Description: Observe an unaccelerated first-time playthrough and record total time, room durations, hint use, and collapse points (plan §§1, 5.2–5.3, 10.1). Record any specific tuning needed as a separate focused task, preferring a global timer toward 18–20 minutes over rushed content and preserving Room 1’s locked mechanics. Recheck timing after any accepted tuning before release.

Done when: A pacing record states whether the roughly 15–20 minute target and short finale callbacks are met. Required tuning has an explicit acceptance check, and unresolved pacing blockers prevent release.

34. Verify: Complete desktop Chrome and Edge playthroughs

Goal: Validate the MVP in current desktop Chrome and Edge.

Description: Complete a full local playthrough in Chrome and Edge, recording browser versions and checking asset loading, readable shared UI, Room 3–4 target alignment, and representative collapse/retry behavior (plan §§20, 23). Check 1366×768 and 1920×1080 layouts and record compatibility defects as separate focused fixes, without adding mobile, Safari, or audio scope.

Done when: A full playthrough in each named browser has recorded results and console output. Every compatibility failure has a reproduction case and must be fixed and rechecked before release.

35. Verify: Complete desktop Firefox playthroughs

Goal: Validate the MVP in current desktop Firefox.

Description: Complete a full local playthrough in Firefox, recording browser versions and checking asset loading, readable shared UI, Room 3–4 target alignment, and representative collapse/retry behavior (plan §§20, 23). Check 1366×768 and 1920×1080 layouts and record compatibility defects as separate focused fixes, without adding mobile, Safari, or audio scope.

Done when: A full playthrough in each named browser has recorded results and console output. Every compatibility failure has a reproduction case and must be fixed and rechecked before release.

36. Document: Write the MVP portfolio README

Goal: Explain the implemented game, local launch, and learning purpose accurately.

Description: Write the concise README required by plan §22 with motivation, five stages, learning goals, vanilla technologies, mouse controls, local launch steps, actual structure, design decisions, and accessibility scope. Include a representative screenshot/GIF, art and inspiration credits, creator attribution, and explicit placeholder or MVP limitations; reserve the public link for deployment. Do not claim deferred audio or polish is implemented.

Done when: A reader can run the existing static game using the documented steps and understand its implemented scope. All required credits and a representative visual are present.

37. Deploy: Publish the static game through Netlify

Goal: Make the finished repository playable from a public HTTPS URL.

Description: Verify current free-hosting limits, connect the GitHub production branch to Netlify, and deploy the existing static files without introducing a build system, server functions, or secrets. Confirm the intended game and assets are included in the deployment and update the README's playable link (plan §21).

Done when: A public HTTPS URL loads the production game and GitHub branch deployment is configured. The README points to that working URL and no paid infrastructure is required.

38. Verify: Smoke-test the public MVP

Goal: Confirm that hosting has not broken the tested static game.

Description: After local QA blockers and required pacing fixes are resolved, play the deployed URL from Enter Mansion to results and check asset paths, course links, restart, and recoverable collapse. Smoke-test loading and deployment-sensitive behavior in Chrome, Edge, and Firefox; repeat full browser playthroughs only if deployment differences or fixes warrant them. Record failures as focused fixes and rerun their cases before marking the MVP released.

Done when: The public URL has a successful full playthrough, working assets/links, and no console errors or game-blocking defects. Required local and deployed checks pass, and the README accurately describes MVP scope and links to the game.
