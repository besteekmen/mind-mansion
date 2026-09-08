# Mind Mansion --- Product Plan

> **Status:** Product scope for portfolio-quality completion\
> **Purpose:** Give a coding agent a stable source of truth before it
> creates `tasks.md` and GitHub issues.\
> **Repository:** https://github.com/besteekmen/mind-mansion\
> **Owner / creator:** Beste Ekmen

------------------------------------------------------------------------

## 1. Product vision

**Mind Mansion** is a short, desktop-first educational web game inspired
by *Learning How to Learn*. It teaches memory and learning techniques
through play rather than through lectures.

The player is trapped inside a collapsing "Mind Mansion" on the night
before an exam. Anxiety has shattered their memory into four fragments.
They must recover the fragments by learning and applying memory
techniques before time or anxiety causes a **Mind Collapse**.

The finished project should be strong enough to use as a **portfolio
project**, while staying deliberately small and understandable.

### Target experience

-   Approximately **15--20 minutes** for a first playthrough.
-   Desktop browser only.
-   Mouse-driven interaction.
-   Vanilla HTML, CSS, and JavaScript.
-   Five stages total.
-   Magical, dreamy, slightly mysterious visual-novel / escape-room
    atmosphere.
-   Learning happens through interaction and retrieval, not long
    explanations.
-   No numeric score, leaderboard, account system, backend, save system,
    or commercial-game complexity.

------------------------------------------------------------------------

# 2. Instructions for the coding agent

## Read before changing anything

**Do not begin implementation by rewriting or refactoring the project.**

First:

1.  Read the entire current repository.
2.  Read `index.html`.
3.  Read `style.css`.
4.  Read `script.js` from beginning to end.
5.  Read `style_dna.txt`.
6.  Inspect every existing file in `/assets`.
7.  Run the game locally and play all currently implemented content.
8.  Trace the current room/state flow, including:
    -   `currentRoom`
    -   game phases
    -   Room 1 state
    -   Room 2 state
    -   `setUIState`
    -   dialogue progression
    -   puzzle overlay behavior
    -   timer
    -   anxiety
    -   fragments
    -   Diffuse hints
    -   room transitions
9.  Identify what already works before proposing changes.
10. Treat existing working behavior as intentional unless this plan
    explicitly changes it.

The current repository is intentionally simple. Keep it that way.

After understanding the repo, the agent may create a separate
**`tasks.md`** containing implementation tasks. That file may later be
used to create GitHub issues.

------------------------------------------------------------------------

# 3. Do not change / preserve

These are explicit product decisions.

-   Keep **vanilla HTML + CSS + JavaScript**.
-   Keep the basic repository architecture:
    -   `index.html`
    -   `style.css`
    -   `script.js`
    -   `/assets`
-   Do not migrate to React, Vue, TypeScript, a game engine, a build
    system, or a framework.
-   Do not split the project into many modules unless a concrete
    technical problem makes it necessary.
-   **Room 1 core gameplay is locked.**
-   Preserve existing Room 1 interaction and learning flow.
-   Preserve the existing Diffuse character and existing artwork.
-   Preserve the current dialogue-panel interaction style.
-   Preserve persistent room titles/subtitles.
-   Preserve the top HUD across every gameplay room.
-   Dialogue should remain **player controlled**. Do not introduce timed
    auto-advancing Diffuse dialogue.
-   A dialogue change may occur because the player:
    -   clicks Next,
    -   selects an answer,
    -   asks Diffuse,
    -   or triggers a clear gameplay event.
-   Keep answer feedback primarily in the main Diffuse dialogue panel.
-   Keep the game desktop-only.
-   Keep mouse-first / mouse-only interaction. Keyboard gameplay is not
    required.
-   Do not add save/continue.
-   Do not add login/accounts.
-   Do not add backend services.
-   Do not add Pomodoro/procrastination gameplay.
-   Do not explicitly lecture about focused vs. diffuse modes. Diffuse
    implicitly represents the idea by helping when the player is stuck.
-   Do not turn the project into a complete survey of *Learning How to
    Learn*.
-   Do not add numeric scoring or ranks.
-   Avoid broad "cleanup" refactors while unfinished gameplay still
    exists.
-   Prefer surgical changes over abstractions.

------------------------------------------------------------------------

# 4. Current repository baseline

At planning time, the public repository contains:

-   `index.html`
-   `style.css`
-   `script.js`
-   `style_dna.txt`
-   `/assets/diffuse.png`
-   `/assets/diffuse_old.png`
-   `/assets/hallway-bg.png`
-   `/assets/room1-bg.png`
-   `/assets/room2-bg.png`

The current `script.js` is already substantial (GitHub currently reports
roughly 690 lines of code), so new work should reuse existing helpers
and patterns rather than starting over.

### Existing / substantially implemented

#### Room 0 --- Arrival / Introduction

-   Opening narrative exists.
-   Exam/anxiety/memory-fragment premise exists.
-   Keep it primarily cinematic/dialogue-based.
-   No tutorial mini-game is needed.

#### Room 1 --- Memory Forge

-   Consider the core gameplay complete.
-   Uses vivid/unusual association.
-   Includes interference/storm and retrieval.
-   Diffuse hints exist.
-   Only fix bugs, polish UX, add audio/visual feedback, and integrate
    global systems.

#### Room 2 --- Compression Library

-   Partially implemented.
-   Raw-list memory exercise exists.
-   BRIDGE demonstration exists.
-   LOCKE strategy-choice exercise exists or is in progress.
-   Distortion/retrieval logic exists or is partially implemented.
-   This room still requires content and flow completion described
    below.

------------------------------------------------------------------------

# 5. Core game systems

## 5.1 HUD

HUD remains visible throughout gameplay and contains:

-   **Time Until Exam**
-   **Anxiety**
-   **Memory Fragments**

Do not hide the HUD during puzzles.

------------------------------------------------------------------------

## 5.2 Timer

-   Initial target: **15:00**.
-   Timer begins only after the player clicks **Enter Mansion** on the
    start overlay.
-   Timer continuously runs after the game starts.
-   No pause button.
-   Switching browser tabs does not intentionally pause the timer.
-   If time reaches `00:00`, trigger **Mind Collapse**.
-   Final timer length is a **playtesting decision**. If a normal
    first-time playthrough cannot reasonably fit, increase it (likely
    toward 18--20 minutes) rather than rushing content.

### Low-time feedback

Near the final \~2 minutes: - timer may pulse, - atmosphere may subtly
become more urgent, - audio may subtly intensify.

Do not let low-time effects make puzzles hard to read.

------------------------------------------------------------------------

## 5.3 Anxiety

-   Anxiety stays between 0% and 100%.
-   Wrong choices and stressful events may increase it.
-   Correct choices / suitable actions may reduce it where current
    gameplay already does so.
-   Penalties should remain broadly consistent across rooms.
-   Later rooms become harder through the puzzles, **not harsher
    punishment**.
-   At 100%, trigger **Mind Collapse**.

### Environmental feedback

Use subtle thresholds, approximately:

-   \~60%: mild vignette / atmosphere change.
-   \~85%: stronger distortion or tension.

Avoid excessive screen shake.

If low-time and high-anxiety effects occur together, **do not
aggressively stack them**. Prioritize/cap the stronger effect so
gameplay stays readable.

Honor reduced-motion preference by removing/reducing motion-heavy
effects.

------------------------------------------------------------------------

## 5.4 Mind Collapse / retry

Both conditions cause the same soft-failure system:

-   Timer reaches 00:00.
-   Anxiety reaches 100%.

Show an overlay:

**MIND COLLAPSE**

Also explain the cause: - "Anxiety overwhelmed the mansion." - or "Time
until the exam ran out."

Primary action:

**Retry Room**

### Room checkpoint

At entry to each room, checkpoint the room-start state.

Retry restores: - time at room entry, - anxiety at room entry, - room
puzzle state, - room progress, - Diffuse uses for that room.

Do not reset the whole game.

Room 4 can be retried indefinitely. There is no permanent bad ending.

------------------------------------------------------------------------

## 5.5 Diffuse

Diffuse is the player's companion and limited hint system.

### Rules

-   Diffuse hints reset **per room**.
-   Default target: **2 uses per room**, adjustable during playtesting.
-   Asking Diffuse should give a technique-oriented hint, not reveal the
    answer.
-   Preserve existing Room 1 behavior.
-   Diffuse should not automatically speak on timers.

### Room 2 LOCKE hints

During strategy selection:

> "Hint: Strong chunks are ordered and meaningful."

During LOCKE retrieval:

> "Hint: Recall what each letter in LOCKE stood for."

These are separate contexts; preserve both.

### Room 3 hint

During Memory Palace retrieval:

> "Mentally walk to that location. What strange image did you place
> there?"

Do not reveal the concept.

### Room 4

Use conceptual nudges, not direct solutions.

------------------------------------------------------------------------

## 5.6 Fragments

There are **4 Memory Fragments**.

-   Room 1 awards Fragment 1.
-   Room 2 awards Fragment 2.
-   Room 3 awards Fragment 3.
-   Room 4 combines what the player learned and restores Fragment 4.

Completing Rooms 1--3 awards the fragment even if the player made wrong
choices, provided they reach the end without Mind Collapse.

### Fragment visual

The four fragments are pieces of one larger illustration.

When assembled, they reveal an **original stylized brain/learning
illustration inspired by the visual feeling of the Learning How to Learn
course page**, adapted into Mind Mansion's magical style.

Do **not** copy official course artwork or logos. It should be original
and only evoke the connection.

Each fragment recovery: 1. plays a short visual/SFX celebration, 2.
updates the HUD, 3. Diffuse reacts, 4. player clicks **Next**, 5. room
transition occurs.

No automatic room transition after fragment recovery.

------------------------------------------------------------------------

# 6. Stage structure

## Stage 0 --- Arrival Hall

### Purpose

Establish story, stakes, and atmosphere.

### Core flow

-   Player enters through start overlay.
-   Existing introductory dialogue plays.
-   Player learns:
    -   exam is tomorrow,
    -   anxiety shattered memory,
    -   four fragments must be recovered,
    -   mansion may collapse.
-   Proceed to Memory Forge.

### Do not add

-   Tutorial mini-game.
-   Course theory lecture.
-   Pomodoro mechanic.

### Acceptance criteria

-   Intro is concise.
-   Next controls dialogue.
-   Timer begins only after Enter Mansion.
-   Transition to Room 1 works reliably.
-   HUD state is initialized correctly.

------------------------------------------------------------------------

# 7. Room 1 --- Memory Forge

**Subtitle:** `Visual memory & association`

### Learning purpose

Experience how vivid, unusual associations are easier to retrieve than
weak/passive ones.

### Scope

**Core gameplay is locked. Do not redesign it.**

Preserve: - existing association rounds, - existing choices, -
storm/interference, - retrieval, - anxiety behavior, - Diffuse hint
style.

Only: - fix bugs, - polish visual states, - add audio, - integrate
global checkpoint/failure systems, - ensure fragment celebration and
player-controlled transition.

### Acceptance criteria

-   Existing puzzles behave as they currently do.
-   No regression in Room 1.
-   Diffuse hint works.
-   Correct/incorrect selection has clear visual/audio feedback.
-   Room can Mind Collapse and retry from its entry checkpoint.
-   Completion awards Fragment 1.
-   Player clicks Next to proceed.

------------------------------------------------------------------------

# 8. Room 2 --- Compression Library

**Subtitle:** `Chunking & memory compression`

### Learning purpose

Room 2 deliberately progresses from a simple mnemonic to deeper
meaningful structure:

1.  raw information overload,
2.  mnemonic compression,
3.  independent mnemonic choice,
4.  meaningful relationships,
5.  retrieval after interference.

The game should avoid implying that **chunking = acronyms**.

------------------------------------------------------------------------

## 8.1 Phase A --- Raw list

Use existing list:

-   Book
-   River
-   Ice
-   Door
-   Glass
-   Ember

Player studies the raw list.

Then ask:

**Which item was 4th?**

Correct: **Door**

Correct feedback:

> "Impressive. But notice how hard that felt... There is an easier way."

Wrong feedback:

> "That was difficult, wasn't it? Raw information overwhelms working
> memory quickly. There is an easier way."

Immediately reveal the BRIDGE structure.

Do not add another intermediate Diffuse line such as "Take a moment to
observe the structure."

------------------------------------------------------------------------

## 8.2 Phase B --- BRIDGE demonstration

Display:

-   **B**ook
-   **R**iver
-   **I**ce
-   **D**oor
-   **G**lass
-   **E**mber

and visually form:

**BRIDGE**

Highlight the first letters clearly. A restrained pulse/highlight is
enough.

The panel stays until the player clicks Next.

Diffuse:

> "A good chunk is compact, ordered, and meaningful."

BRIDGE is a demonstration, not another recall challenge.

**Do not add Ask Diffuse to the BRIDGE raw recall.**

------------------------------------------------------------------------

## 8.3 Phase C --- LOCKE practice

Words:

-   Lantern
-   Ocean
-   Crown
-   Kite
-   Ember

Choices:

-   Raw List
-   LOCKE
-   Lazy Owls Carry Kite Equipment
-   LOKCE

The player chooses the strategy they think is strongest.

Preferred strategy:

**Lazy Owls Carry Kite Equipment**

`LOCKE` is acceptable/decent but less vivid.

`LOKCE` breaks the order.

`Raw List` provides no compression.

### Diffuse help during strategy selection

> "Hint: Strong chunks are ordered and meaningful."

When the player chooses: - show the selected strategy **inside the
puzzle card**, - do not make Diffuse say "Okay, you picked...".

Give concise feedback, then continue.

------------------------------------------------------------------------

## 8.4 Phase D --- Meaningful chunking: The Aether Engine

This is the harder practice and teaches that chunking can come from
**understanding relationships**, not just acronyms.

Introduce:

> **The Aether Engine is an imaginary machine created for this memory
> exercise. Everything you need to know is shown here.**

### Information to learn

The imaginary Aether Engine has six concepts:

-   **Aether Core** --- produces raw energy.
-   **Prism Coil** --- converts raw energy into usable light.
-   **Lumen Cell** --- stores the converted light.
-   **Pulse Gate** --- controls when stored energy is released.
-   **Beacon Lens** --- focuses released energy into a beam.
-   **Cooling Ring** --- stabilizes the Core and Coil while the engine
    runs.

Keep this text short and visually readable.

### Concept-map choice

Show the same six concepts in **three candidate maps**.

#### Map A --- meaningful structure (best)

Central title: **Aether Engine**

Main energy flow:

`Aether Core → Prism Coil → Lumen Cell → Pulse Gate → Beacon Lens`

Supporting relationship:

`Cooling Ring → stabilizes Aether Core + Prism Coil`

This is the best map because it exposes both the main process and the
supporting relationship.

#### Map B --- arbitrary radial map

All six components appear equally around "Aether Engine" with no
meaningful arrows/relationships.

This groups the information visually but does not show how the system
works.

#### Map C --- misleading chain

Use all six components but place them in an incorrect single chain, for
example:

`Cooling Ring → Beacon Lens → Aether Core → Lumen Cell → Prism Coil → Pulse Gate`

This preserves all facts as labels but destroys the meaningful
relationships.

### Choice behavior

-   Accept whichever map the player chooses.
-   Do not force retry.
-   Give feedback in Diffuse dialogue.
-   A weak map may add a small Anxiety penalty.
-   Later retrieval demonstrates whether the organization was useful.

This is recognition rather than drag-and-drop to keep implementation
simple.

------------------------------------------------------------------------

## 8.5 Library Distortion

After LOCKE + Aether Engine learning:

-   trigger a short Library Distortion sequence,
-   use existing distortion/storm visual language,
-   do not auto-cycle Diffuse dialogue,
-   keep it brief.

The purpose is interference before retrieval.

------------------------------------------------------------------------

## 8.6 Retrieval 1 --- LOCKE

Ask:

**Which item was represented by K in LOCKE?**

Choices: - Crown - Kite - Ocean - Ember

Correct: **Kite**

Diffuse help is available:

> "Hint: Recall what each letter in LOCKE stood for."

------------------------------------------------------------------------

## 8.7 Retrieval 2 --- Aether Engine

Ask one question:

**Which component stores the light before it is released?**

Choices: - Prism Coil - Lumen Cell - Pulse Gate - Cooling Ring

Correct: **Lumen Cell**

If the player chose the meaningful map, the answer should be easier to
reconstruct from the process.

After feedback: - award Fragment 2, - celebrate, - Next transitions to
Room 3.

### Acceptance criteria

-   BRIDGE demonstration clearly connects initials to the word.
-   LOCKE strategy hint and LOCKE recall hint are separate and correct.
-   Selection is shown in the puzzle UI.
-   Aether Engine is explicitly labeled imaginary.
-   All Aether map choices contain identical concepts.
-   Only organization/relationships differ.
-   Player is not forced to retry a weak map.
-   Distortion happens after learning, before retrieval.
-   Exactly one LOCKE retrieval and one Aether retrieval question.
-   Completion always awards Fragment 2.
-   Transition remains player-controlled.

------------------------------------------------------------------------

# 9. Room 3 --- Memory Palace

**Subtitle:** `Spatial memory & retrieval`

### Learning purpose

The player creates a small Memory Palace, forms vivid mental
associations, then retrieves information by location.

The room uses **fictional exam content** so prior knowledge gives no
advantage.

No storm/interference sequence is needed here.

------------------------------------------------------------------------

## 9.1 Environment

Use one illustrated mansion room with five visually distinctive
clickable locations:

1.  **Glowing Fireplace**
2.  **Cracked Moon Mirror**
3.  **Sleeping Stone Gargoyle**
4.  **Floating Bookshelf**
5.  **Giant Star Clock**

Locations should be clearly separated in the background and remain
visually recognizable when highlighted.

------------------------------------------------------------------------

## 9.2 Fictional exam material

Introduce:

> "These are terms from an imaginary subject. You do not need any
> outside knowledge --- your job is simply to remember them."

Use five fictional terms with short definitions:

-   **Velora** --- a silver mineral that stores moonlight.
-   **Tarnix** --- a small creature that follows vibrations.
-   **Orin Bloom** --- a flower that opens only in cold air.
-   **Kestrel Rune** --- a symbol used to mark safe passages.
-   **Mira Dust** --- blue powder that glows near water.

The definitions exist to give the player imagery, not to test factual
understanding.

------------------------------------------------------------------------

## 9.3 Build the palace

Interaction:

**click concept → click location**

The player chooses their own placement.

Rules: - one concept per location, - five concepts / five locations, -
visibly show assignments while studying, - allow changing assignments
before confirming.

After all are placed, Diffuse prompts:

> "Now make each one strange. Imagine the concept interacting with its
> location in the most ridiculous way you can."

Do not generate the association for the player. They create it mentally.

Provide a **Ready** / **Test My Memory** action.

------------------------------------------------------------------------

## 9.4 Retrieval

Hide concept labels/assignments.

Randomly choose **3 of the 5 locations**.

For each: - highlight one location, - ask which concept the player
placed there, - show the five concept names as choices.

If wrong: - immediately reveal the correct concept they originally
assigned, - give brief corrective feedback, - continue.

If correct: - brief positive feedback, - continue.

Diffuse help:

> "Mentally walk to that location. What strange image did you place
> there?"

Do not reveal content.

After three retrievals: - award Fragment 3, - celebrate, - Next
transitions to Final Escape.

### Acceptance criteria

-   Player controls all five placements.
-   No drag-and-drop is required.
-   Assignments can be changed before confirmation.
-   Retrieval uses the player's actual stored assignments.
-   Exactly 3 unique locations are randomly tested.
-   Wrong recall reveals the correct original assignment immediately.
-   No storm sequence.
-   Completion awards Fragment 3 regardless of retrieval accuracy.
-   Retry reconstructs a clean room-entry state.

------------------------------------------------------------------------

# 10. Room 4 --- Final Escape

**Subtitle:** `Integration test`

### Purpose

A short cumulative finale that tests: - retention of earlier
experiences, - transfer to new information, - integrated use of learning
strategies.

Room 4 is not another long teaching room.

------------------------------------------------------------------------

## 10.1 Three micro-callbacks

Each should take roughly 20--30 seconds.

### Callback 1 --- Memory Forge

Retrieve one earlier Room 1 association.

Example:

**What launched into space powered by melting pizza cheese?**

Correct: **Rocket**

This gives the player the feeling that the vivid association survived
across rooms.

### Callback 2 --- Compression Library

Ask:

**In LOCKE, what did K stand for?**

Correct: **Kite**

### Callback 3 --- Memory Palace

Use one of the player's Room 3 assignments.

Highlight or name one of the locations that was tested/stored and ask
which concept they placed there.

This callback must use the player's actual earlier placement, not a
hard-coded answer.

Keep all three quick.

------------------------------------------------------------------------

## 10.2 Final integrated challenge --- Rebuild the Shattered Memory

The player receives **new fictional information**. This tests transfer
rather than memorization from previous rooms.

### Narrative

The final memory is shattered into pieces. Diffuse explains only:

> "You already know what to do. Make the pieces vivid. Find the
> structure. Give them a place."

Do not give a step-by-step tutorial.

### New memory

Use four fragments of a short fictional event:

1.  **A violet comet appeared above the North Tower.**
2.  **Its light awakened three crystal bells.**
3.  **The bells opened the hidden observatory door.**
4.  **Inside, a silver map revealed the path home.**

### Integrated interaction

Keep implementation simple and sequential while making it feel like one
puzzle.

#### Step 1 --- Association

Show the four fragments and ask the player to choose the most vivid
mental image from three options.

Best option should exaggerate the whole scene, e.g.:

> "A gigantic violet comet crashes light onto three screaming crystal
> bells while a hidden door bursts open onto a glowing silver map."

Other options should be passive/ordinary descriptions.

#### Step 2 --- Meaningful structure

Show three order/relationship structures using the same four fragments.

Correct:

`Violet comet → crystal bells → observatory door → silver map`

Distractors: - arbitrary radial grouping, - incorrect sequence.

Accept the choice and give feedback; do not create a long retry loop.

#### Step 3 --- Spatial anchor

Show four simple clickable anchors within the Final Escape scene: -
tower window, - bell pedestal, - sealed door, - map table.

Ask the player to connect each event fragment to the obvious spatial
anchor using click fragment → click location.

This reuses the Room 3 interaction pattern instead of inventing a new
mechanic.

Diffuse may give conceptual hints but never answers.

------------------------------------------------------------------------

## 10.3 Final retrieval

After the reconstructed memory is confirmed: - hide the fragment text, -
keep only the final scene/anchors.

Ask:

**What revealed the path home?**

Choices: - Violet comet - Crystal bells - Observatory door - Silver map

Correct: **Silver map**

Give feedback.

Then restore **Fragment 4**.

------------------------------------------------------------------------

## 10.4 Narrative ending

After Fragment 4:

-   the four-piece learning/brain image assembles,
-   the mansion stabilizes/restores,
-   visual tension fades,
-   morning arrives.

Final narrative idea:

> "Morning light reaches your desk. The exam is still ahead of you ---
> but the panic is quieter. You cannot know everything. You do know how
> to learn."

Do not show an exam grade or promise perfect performance.

Then show results.

### Acceptance criteria

-   Three callbacks are short.
-   Callback 3 uses actual Room 3 player data.
-   Final challenge uses completely new information.
-   Association, meaningful structure, and spatial anchoring all appear.
-   Diffuse lightly guides without solving.
-   Final retrieval happens after information is hidden.
-   Fragment 4 completes the assembled image.
-   One successful ending only.
-   Mind Collapse retries Room 4 from checkpoint.

------------------------------------------------------------------------

# 11. Ending / results / credits

No score, stars, grade, or rank.

Show neutral journey stats:

-   **Completion time**
-   **Rooms retried**
-   **Diffuse hints used**
-   **Fragments recovered: 4 / 4**
-   **Techniques practiced**
    -   Vivid Association
    -   Mnemonic Compression
    -   Meaningful Chunking
    -   Memory Palace
    -   Retrieval Practice

Do **not** label wrong answers as "Mistakes."

### Credits / learning connection

At the end, reveal:

**Inspired by Learning How to Learn**

Mention Barbara Oakley and Terrence Sejnowski and provide a link to the
original course/resource page.

Also show:

**Created by Beste Ekmen**

The game should not use course branding during gameplay.

------------------------------------------------------------------------

# 12. Start overlay

Add a very simple retro-game-style overlay over the existing opening
scene.

Suggested content:

**MIND MANSION**

*Recover your memory before the exam.*

**ENTER MANSION**

Small line:

`~15–20 min • Mouse`

Requirements: - no separate landing page, - background remains visible
but darkened/softened, - no How to Play button, - timer does not run
before Enter Mansion, - audio does not unexpectedly start before user
interaction.

------------------------------------------------------------------------

# 13. Persistent controls

Keep controls minimal.

### Mute

-   persistent,
-   clearly shows muted/unmuted state,
-   affects music + SFX.

### Restart Game

Persistent but unobtrusive.

Clicking opens confirmation:

> **Restart Mind Mansion?**\
> All progress in this run will be lost.

Actions: - Restart - Cancel

Do not add: - manual Pause, - Restart Room outside Mind Collapse, -
settings screen.

------------------------------------------------------------------------

# 14. Audio plan

Audio is a **Should Have** portfolio-polish feature, not a reason to
delay core gameplay.

Use only free-to-use audio with a license suitable for a public
portfolio website.

Recommended source: - **Mixkit** for free music/SFX:
https://mixkit.co/ - Backup: **Pixabay** audio:
https://pixabay.com/sound-effects/

At the time this plan was written, Mixkit states its sound effects can
be used in personal and commercial projects without required
attribution. Pixabay's Content License also permits free use and
modification subject to its prohibited uses. **Re-check the license on
the specific download page before adding any asset.**

### Keep the audio library tiny

Target files:

`assets/audio/ambient-mansion.mp3`\
- subtle mysterious ambient loop - no vocals - low intensity - should
not distract from reading

`assets/audio/ui-click.mp3`\
- quiet magical/soft UI click

`assets/audio/correct.mp3`\
- short gentle positive chime

`assets/audio/incorrect.mp3`\
- short muted low/error tone; not harsh

`assets/audio/fragment.mp3`\
- magical shimmer/reward

`assets/audio/transition.mp3`\
- soft whoosh

`assets/audio/collapse.mp3`\
- short low magical rumble / glassy collapse

Optional:

`assets/audio/urgency.mp3`\
- subtle tension layer for low time; only add if it improves playtesting

### Search terms

On Mixkit/Pixabay search for: - `mysterious ambient magical` -
`dark fantasy ambience` - `magic chime` - `soft UI click` -
`magic shimmer` - `soft whoosh` - `low rumble` - `glitch magical` -
`game success soft` - `game error soft`

Prefer MP3 for small deployed assets unless the downloaded effect is
tiny enough that WAV size is irrelevant.

Keep volumes restrained. Music should sit well below SFX.

### Licensing hygiene

Create:

`assets/audio/LICENSES.md`

For every downloaded audio asset record: - filename in repo, - original
title, - creator, - source page, - source platform, - license
name/link, - download date.

Even when attribution is not required, this keeps the public repository
defensible and maintainable.

------------------------------------------------------------------------

# 15. Visual asset plan

## Existing visuals to preserve

Keep and reuse: - `assets/diffuse.png` - `assets/hallway-bg.png` -
`assets/room1-bg.png` - `assets/room2-bg.png`

Do not ask the coding agent to regenerate them.

Missing artwork should use **simple placeholders** until Beste adds the
final Microsoft Designer files.

------------------------------------------------------------------------

## Global Microsoft Designer settings

Use these consistently for new room backgrounds:

-   **Aspect ratio:** 16:9 landscape
-   **Target size:** ideally 1920×1080
-   **Style:** polished fantasy digital illustration / magical
    visual-novel game background
-   **No text**
-   **No logos**
-   **No UI elements**
-   **No people**
-   **No character portrait**
-   **Camera:** straight-on / readable game-scene composition
-   **Palette:** deep indigo, midnight blue, violet, muted lavender,
    cyan magical highlights, restrained warm gold
-   **Lighting:** cinematic but readable
-   **Composition:** leave visual breathing room for game overlays and
    dialogue UI
-   Avoid photorealism; match the illustrated existing assets as closely
    as Designer allows.

If Designer gives several results, choose the one with the clearest
layout rather than the most detailed image.

------------------------------------------------------------------------

## Visual 1 --- Room 3 background

**Filename:**\
`assets/room3-bg.png`

**Purpose:** Memory Palace clickable scene.

**Prompt:**

> A wide 16:9 fantasy visual-novel game background showing one
> mysterious magical memory chamber inside an enchanted mansion. Deep
> indigo and midnight-blue atmosphere with violet shadows, subtle cyan
> magical glow and restrained warm gold accents. The room must contain
> exactly five clearly separated memorable landmarks: a glowing
> fireplace on the left, a tall cracked moon-shaped mirror, a small
> sleeping stone gargoyle on a pedestal, a floating bookshelf suspended
> magically in the air, and a giant ornate star clock. Make every
> landmark visually distinct and easy to click in a desktop game.
> Elegant fantasy digital illustration, dreamy but slightly mysterious,
> cinematic lighting, readable composition, no people, no character, no
> text, no labels, no interface, no logos, not photorealistic. Leave
> some calm negative space so game overlays remain readable.

**Important:** choose an output where all five landmarks are visible
simultaneously and do not overlap.

------------------------------------------------------------------------

## Visual 2 --- Room 4 background

**Filename:**\
`assets/room4-bg.png`

**Purpose:** Final Escape / integrated challenge.

**Prompt:**

> A wide 16:9 fantasy visual-novel game background of the final chamber
> of an enchanted mind mansion, dramatic but elegant, deep indigo and
> midnight blue with violet atmosphere, cyan magical light and
> restrained gold accents. The room is an old observatory-like tower
> chamber and must contain four clearly separated interactive landmarks:
> a tall tower window showing a faint violet night sky, a crystal bell
> pedestal, a large sealed ornate door, and a map table. The room should
> feel damaged and unstable but capable of being restored, with subtle
> floating magical particles and faint cracks of light. Make all four
> landmarks clearly visible and easy to click in a desktop game.
> Polished fantasy digital illustration, cinematic, dreamy, mysterious,
> no people, no text, no labels, no UI, no logos, not photorealistic.

------------------------------------------------------------------------

## Visual 3 --- Completed four-fragment learning image

**Filename:**\
`assets/memory-complete.png`

**Purpose:** Image revealed when all four fragments assemble.

**Prompt:**

> An original magical illustration symbolizing learning how to learn: a
> luminous stylized human brain formed from elegant connected pathways,
> small glowing nodes, abstract learning symbols and flowing neural
> patterns, designed as a beautiful emblem inside the fantasy world of
> Mind Mansion. Deep indigo and violet background tones, cyan and warm
> gold luminous connections, intelligent and inspiring rather than
> medical. The composition should subtly evoke the visual feeling of an
> online learning course about the brain and learning, but must be
> completely original: do not copy any existing course artwork, logo,
> layout, branding, text, or copyrighted graphic. Centered composition,
> clean silhouette, polished fantasy digital illustration, no words, no
> logo, no people.

**Preferred:** square (1:1) or near-square output if Designer allows it.

------------------------------------------------------------------------

## Visual 4 --- Four fragment pieces

Best implementation option: **do not ask Designer to generate four
separate inconsistent fragments.**

Use `memory-complete.png` as the source and have the coding agent
display it through four clipped/masked puzzle-piece regions or four
rectangular/shard sections.

This guarantees that the four pieces actually assemble into one image.

If clipping becomes unnecessarily complex, fallback: - create four
cropped sections manually from `memory-complete.png`, - name: -
`assets/fragment-1.png` - `assets/fragment-2.png` -
`assets/fragment-3.png` - `assets/fragment-4.png`

Do not generate those four independently.

------------------------------------------------------------------------

## Optional Visual 5 --- Morning ending

**Priority:** Nice to Have

**Filename:**\
`assets/ending-morning.png`

The ending can instead be implemented by changing lighting/overlay on an
existing scene. Only create this if the ending feels weak without it.

**Prompt:**

> A wide 16:9 illustrated quiet student desk at early morning after a
> long night of studying, soft sunrise light entering through a window,
> calm notebook and study materials on the desk, peaceful hopeful
> atmosphere, subtle visual echoes of deep indigo fading into warm gold
> morning light. The feeling is prepared and calmer, not triumphant or
> perfect. Polished storybook visual-novel digital illustration, no
> visible person, no readable text, no logos, no UI, not photorealistic.

------------------------------------------------------------------------

# 16. Visual placeholders

The coding agent must **not block implementation waiting for final
artwork**.

If an expected asset is missing: - use a gradient/background
placeholder, - preserve the intended filename/path, - implement
interaction regions independently where possible, - clearly note that
the placeholder should be replaced.

Do not generate substitute AI art without Beste's request.

------------------------------------------------------------------------

# 17. Visual interaction consistency

Across all rooms:

Selectable options use the same core states: - default, - hover, -
selected, - correct, - incorrect, - disabled if necessary.

Puzzle layouts may differ, but interaction language stays consistent.

Correct/incorrect feedback: - subtle option-state change, - small
sound, - Diffuse dialogue.

Avoid large green/red screens or arcade-style scoring.

------------------------------------------------------------------------

# 18. Room transitions

Preserve one consistent transition system across the game.

Allow small room-specific: - title, - subtitle, - background, -
atmospheric variation.

Do not build a unique transition animation for every room.

------------------------------------------------------------------------

# 19. Accessibility / comfort

Scope is basic portfolio accessibility, not full WCAG certification.

Include: - readable text size, - strong enough contrast, - clear mouse
hover/selected states, - avoid relying only on color for
correct/incorrect, - mute control, - `prefers-reduced-motion` support, -
suppress/reduce shaking, pulsing, and heavy transitions when reduced
motion is enabled.

Not required: - keyboard gameplay, - mobile layout, -
screen-reader-complete game flow.

------------------------------------------------------------------------

# 20. Browser / device scope

Support current desktop versions of: - Chrome - Edge - Firefox

Desktop only.

No requirement for: - mobile, - tablet, - Safari, - touch-first layout.

A narrow browser window may show a simple "Best experienced on desktop"
message if layout becomes unusable, but do not build a responsive mobile
game.

------------------------------------------------------------------------

# 21. Free public deployment

The finished game must be playable from a public URL without downloading
the repository.

Use **Netlify Free** and connect it to the GitHub repository.

This project is static HTML/CSS/JS, so it does not need: - server
functions, - database, - paid hosting, - backend.

At the time this plan was written, Netlify advertises a **\$0 Free
plan** with Git deployment and global CDN, subject to monthly usage
credits/limits. The owner should verify current limits before launch.

### Deployment requirements

-   GitHub repo remains the source.
-   Netlify deploys from the production branch.
-   Public HTTPS URL.
-   No secrets/API keys.
-   All asset paths work on deployed site.
-   Audio works after user clicks Enter Mansion.
-   No console errors during a full deployed playthrough.
-   Test Chrome, Edge, Firefox.
-   Complete at least one full playthrough on the deployed URL.

If Netlify's free plan later becomes unsuitable, use another genuinely
free static host such as GitHub Pages rather than adding paid
infrastructure.

------------------------------------------------------------------------

# 22. README requirements

Create a portfolio-ready `README.md`.

Include: - title and short description, - playable public link, -
screenshot/GIF, - project motivation, - learning goals, - gameplay
overview, - five-stage structure, - technologies (HTML/CSS/JS), -
controls, - how to run locally, - project structure, - key design
decisions, - accessibility scope, - audio/art credits, -
inspiration/attribution to *Learning How to Learn*, - creator credit, -
optional short "What I learned building this" section.

Do not make README longer than the project warrants.

------------------------------------------------------------------------

# 23. Manual QA checklist

No automated test suite is required.

Before calling the project complete, manually test:

### Start / global

-   Start overlay appears.
-   Timer does not run before Enter.
-   Enter starts game.
-   HUD initializes correctly.
-   Mute works.
-   Restart Game confirmation works.
-   Cancel does not reset game.
-   Restart fully resets game.

### Timer / anxiety

-   Timer reaches 00:00 → correct Mind Collapse cause.
-   Anxiety reaches 100% → correct Mind Collapse cause.
-   Retry restores room-entry timer.
-   Retry restores room-entry anxiety.
-   Retry restores puzzle state.
-   Retry restores Diffuse uses.
-   No duplicated timers/intervals after retry.

### Room 1

-   Full existing flow still works.
-   All association choices work.
-   Storm completes.
-   Recall completes.
-   Fragment 1 awarded once only.
-   Next transitions correctly.

### Room 2

-   Raw list → recall.
-   BRIDGE display is clear.
-   BRIDGE remains until Next.
-   LOCKE selection works.
-   Correct Diffuse hint appears during selection.
-   LOCKE selection is shown in puzzle card.
-   Aether Engine introduction clearly says imaginary.
-   Three concept maps contain the same six concepts.
-   Map selection is accepted without forced retry.
-   Distortion runs.
-   LOCKE retrieval works.
-   Recall Diffuse hint differs from strategy hint.
-   Aether retrieval works.
-   Fragment 2 awarded once.

### Room 3

-   Five locations are clickable.
-   Five concepts can each be assigned once.
-   Assignments can be changed before confirmation.
-   Player's actual mapping is stored.
-   Three unique locations are selected for retrieval.
-   Correct answers work.
-   Wrong answers reveal correct original assignment.
-   Diffuse gives technique hint only.
-   Fragment 3 awarded once.

### Room 4

-   Three callbacks work.
-   Memory Palace callback uses player-specific data.
-   New final memory appears.
-   Association choice works.
-   Structure choice works.
-   Spatial anchor interaction works.
-   Final information hides before retrieval.
-   Final retrieval works.
-   Fragment 4 assembles final visual.
-   Ending triggers once.

### Ending

-   Morning narrative appears.
-   Results show correct completion time.
-   Rooms retried count is correct.
-   Diffuse hints used count is correct.
-   No wrong-answer/mistake score.
-   Techniques list appears.
-   Course inspiration/learn-more link works.
-   Creator credit appears.

### Browser/deployment

-   Chrome full playthrough.
-   Edge full playthrough.
-   Firefox full playthrough.
-   Netlify public URL works.
-   No missing assets.
-   No console errors.
-   Audio license records exist.

------------------------------------------------------------------------

# 24. Priorities

## MUST HAVE

Required before the project is considered complete:

-   Agent reads and understands current code first.
-   Preserve Room 1.
-   Finish Room 2 full flow.
-   Build Room 3.
-   Build Room 4.
-   Four-fragment progression.
-   Final integrated retrieval.
-   Player-controlled room progression.
-   Timer and Anxiety Mind Collapse.
-   Room-entry checkpoints and Retry Room.
-   Start overlay.
-   Restart Game confirmation.
-   Persistent HUD.
-   Diffuse per-room hint system.
-   Final ending/results/credits.
-   Missing-asset placeholders.
-   Desktop Chrome/Edge/Firefox.
-   Manual QA.
-   Portfolio README.
-   Free public deployment.
-   Successful deployed playthrough.

## SHOULD HAVE

Important portfolio polish:

-   Ambient music.
-   Core SFX.
-   Mute control.
-   Fragment animation.
-   Anxiety visual thresholds.
-   Low-time urgency feedback.
-   Consistent answer states.
-   Reduced-motion support.
-   Polished transitions.
-   Final Microsoft Designer artwork integrated.
-   Audio license documentation.

## NICE TO HAVE

Only if Must/Should items are stable:

-   Separate morning ending illustration.
-   More sophisticated fragment masking/assembly animation.
-   Additional subtle room ambience particles.
-   Extra visual flourish on final mansion restoration.
-   Minor dialogue polish after playtesting.

Do not delay publication for Nice to Have items.

------------------------------------------------------------------------

# 25. Recommended implementation sequence

This is guidance, **not a rigid task dependency list**. The coding agent
should derive a more detailed `tasks.md`.

Suggested order:

1.  **Repository comprehension**

    -   read files,
    -   run game,
    -   document current flow,
    -   identify existing bugs/regressions.

2.  **Stabilize existing Rooms 0--2**

    -   preserve Room 1,
    -   remove accidental auto-dialogue/transition behavior where it
        conflicts with established behavior,
    -   finish Room 2.

3.  **Build Room 3**

    -   use placeholder background until `room3-bg.png` is supplied.

4.  **Build Room 4**

    -   use placeholder background until `room4-bg.png` is supplied.

5.  **Complete global progression**

    -   fragments,
    -   player-controlled room transitions,
    -   final assembly,
    -   ending.

6.  **Failure/retry system**

    -   checkpoints,
    -   timer collapse,
    -   anxiety collapse,
    -   retry.

7.  **Start/restart/global controls**

    -   start overlay,
    -   restart confirmation,
    -   mute.

8.  **Visual polish**

    -   answer states,
    -   anxiety/low-time effects,
    -   transitions,
    -   reduced motion,
    -   final supplied artwork.

9.  **Audio**

    -   small licensed library,
    -   audio manager kept simple,
    -   license record.

10. **Ending/results/credits**

11. **README**

12. **Manual QA + browser testing**

13. **Netlify deployment + deployed QA**

------------------------------------------------------------------------

# 26. Definition of Done

Mind Mansion is complete when:

-   A new player can open a public URL and understand how to begin.
-   They can play all five stages from beginning to end without
    developer intervention.
-   The learning progression is coherent:
    -   vivid association,
    -   mnemonic compression,
    -   meaningful chunking,
    -   Memory Palace,
    -   retrieval,
    -   transfer/integration.
-   Room 1 still behaves as intended.
-   Room 2 is complete and no longer equates chunking only with
    acronyms.
-   Room 3 lets the player construct and retrieve from their own Memory
    Palace.
-   Room 4 tests retention and transfer and ends with final retrieval.
-   Timer and Anxiety can cause recoverable Mind Collapse.
-   Retry correctly restores room-entry state.
-   All four fragments are recovered and assemble into the final
    learning image.
-   Ending returns to morning before the exam without showing a grade.
-   Results are descriptive, not judgmental.
-   The game credits *Learning How to Learn* and Beste Ekmen.
-   Audio is legally documented and muteable.
-   Core artwork is present or intentionally substituted by placeholders
    during development.
-   Chrome, Edge, and Firefox complete a full playthrough.
-   Netlify deployment is public and functional.
-   README is portfolio-ready.
-   There are no known game-blocking bugs or console errors.

------------------------------------------------------------------------

# 27. Out of scope

Explicitly do **not** build:

-   mobile version,
-   tablet-specific version,
-   keyboard gameplay,
-   user accounts,
-   cloud saves,
-   local save/continue,
-   backend,
-   database,
-   multiplayer,
-   leaderboard,
-   numeric score,
-   achievements,
-   branching endings,
-   permanent bad ending,
-   procedural puzzles,
-   voice acting,
-   localization,
-   full accessibility certification,
-   commercial analytics stack,
-   complex settings menu,
-   React/framework migration,
-   elaborate game-engine architecture,
-   Pomodoro/procrastination mini-game,
-   separate focused-vs-diffuse theory lesson.

------------------------------------------------------------------------

# 28. External resources / current planning references

Repository: https://github.com/besteekmen/mind-mansion

Free deployment: https://www.netlify.com/pricing/

Mixkit free audio: https://mixkit.co/free-sound-effects/
https://mixkit.co/license/

Pixabay audio/license backup: https://pixabay.com/sound-effects/
https://pixabay.com/service/license-summary/

**Important:** External pricing and licenses can change. Re-check them
at the time an asset is downloaded or the game is published.
