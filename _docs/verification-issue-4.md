# Issue #4 verification

Implemented the narrow hint and BRIDGE corrections. Room 1 and Room 2 now
reset Diffuse to two uses and clear the Room 2 hint context on entry. Raw-list
recall no longer exposes Ask Diffuse. BRIDGE keeps the existing words and
immediate feedback while highlighting each initial in the puzzle card.

Verified with desktop Chromium 153.0.8010.12 using the existing Playwright
tooling. Exhausting Room 1 hints and entering Room 2 restored two uses; asking
Diffuse once reduced anxiety by five. Raw recall kept Diffuse hidden before and
after its delayed question reveal. Both raw-answer paths use the BRIDGE panel,
with six highlighted initials and Next still visible. `node --check script.js`
and `git diff --check` passed.

Issue #4 acceptance criteria are satisfied. Later completion and LOCKE feedback
changes remain scoped to Issues #5 and #6.
