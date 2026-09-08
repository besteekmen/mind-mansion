# Working in Mind Mansion

## Repository and commands

This is an existing dependency-free static game: `index.html` holds the shared UI, `style.css` the styling, and `script.js` all room logic, state, and DOM rendering. Artwork lives in `assets/`; `style_dna.txt` describes the visual direction. Read `_docs/plan.md` for product decisions and `_docs/process.md` for the issue workflow.

Run commands from the repository root:

- Open `index.html` directly in a desktop browser for a basic local run; no build or dependency install is needed.
- For HTTP-based manual testing, run `python3 -m http.server 8000 --bind 127.0.0.1`, then visit `http://127.0.0.1:8000/`. Stop with Ctrl+C. Python 3 is a local serving convenience, not an application dependency.
- If Node.js is available, `node --check script.js` checks JavaScript syntax only; it does not execute the game or test DOM behavior.
- `git diff --check` checks patch whitespace; it is not a formatter or application test.

There is currently no automated test suite, package manifest, configured linter, or formatter. Do not invent npm scripts or add tooling merely to run checks. Manually validate the affected flow and browser console using `_docs/plan.md` §23; release support is desktop Chrome, Edge, and Firefox (§20).

## Implementation rules

- Read and understand existing HTML, CSS, JavaScript, relevant assets, and the selected issue before editing. Preserve working behavior unless the plan explicitly changes it.
- Keep vanilla HTML/CSS/JavaScript and the basic file structure. Reuse existing helpers; avoid frameworks, build systems, unnecessary modules, and broad refactors.
- Room 1 core gameplay is locked: preserve its choices, association/storm/recall sequence, hint style, and anxiety adjustments. Apply only explicitly required fixes and global integration changes.
- Keep dialogue and room progression player controlled. Preserve the Diffuse dialogue panel, persistent HUD, room titles/subtitles, and shared transition style; do not introduce timed auto-advancing dialogue.
- Keep the game desktop-first and mouse-only. Do not add mobile/keyboard gameplay, accounts, backend services, save/continue, or numeric scoring.
- Preserve supplied artwork. Keep simple placeholders for missing visuals at the planned paths until final files are supplied; do not generate or replace artwork without instruction.
- The owner has supplied the completed visuals, including `assets/memory-complete.png` and `assets/ending-morning.png`. Use current assets where relevant; older planning references to missing artwork are historical. Preserve `assets/old/` and all `_old` files, but ignore them for implementation and asset selection. Do not delete or regenerate them.
- GitHub Issues are the active backlog; `_docs/tasks.md` remains the original MVP planning artifact. Stay focused on the selected issue and its acceptance criteria; do not pull deferred polish into the MVP.
- Validate the relevant game flow after meaningful changes and before completing an issue. Record blockers, ambiguities, and plan conflicts in the issue rather than silently changing scope. Preserve unrelated user changes.
