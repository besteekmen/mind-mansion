const dialogueText = document.getElementById("dialogue-text");
const nextBtn = document.getElementById("next-btn");
const timerDisplay = document.getElementById("timer");
const anxietyDisplay = document.getElementById("anxiety");
const timerBar = document.getElementById("timer-bar");
const anxietyBar = document.getElementById("anxiety-bar");
const puzzleOverlay = document.getElementById("puzzle-overlay");
const puzzleCard = document.getElementById("puzzle-card");
const fragmentsDisplay = document.getElementById("fragments");
const diffuseBtn = document.getElementById("diffuse-btn");
const transitionOverlay = document.getElementById("room-transition");
const sceneArea = document.querySelector(".scene-area");
const backgroundOverlay = document.querySelector(".background-overlay");

// -------------------- GAME STATE --------------------

const GAME_PHASE = {
    INTRO: "intro",
    FORGE: "forge",
    STORM: "storm",
    RECALL: "recall",
    RETRIEVAL: "retrieval",
    ROOM_COMPLETE: "room_complete",
    COMPLETE: "complete"
};

let currentPhase = GAME_PHASE.INTRO;
let gamePaused = false;
let currentRoom = 0;
let transitionPending = false;
let activePuzzle = 0;
let answerPending = true;

// -------------------- CORE STATE --------------------

const totalTime = 15 * 60;
const SPEED = {
    read: 2500,
    think: 1800,
    fast: 1200,
    reveal: 3000
};
let timeRemaining = totalTime;

let anxiety = 20;
let fragments = 0;

let dialogueIndex = 0;

let room1IntroStep = 0;

// Forge / recall state
let currentPairIndex = 0;
let recallIndex = 0;
let recallScore = 0;
let forgedMemories = [];
let diffuseUses = 2;

// Storm
let stormInterval = null;

// room 2
let room2Step = 0;
let room2FirstAnswerCorrect = false;
let selectedChunk = null;
let room2DiffuseContext = null;

// -------------------- DATA --------------------

// Room 0
const introDialogue = [
    "Welcome. You are inside Mind Mansion.",
    "Tomorrow is your exam.",
    "Your anxiety shattered your memory into fragments.",
    "Recover the fragments before time runs out.",
    "Or your mind will collapse."
];

// Room 1
const memoryForgeRounds = [
    {
        pair: "Dragon + Calculator",
        correctChoice: 1,
        linkedObject: "Calculator",
        choices: [
            "A dragon stands beside a calculator.",
            "A dragon breathes fire while a calculator screams equations!",
            "A calculator sits quietly on a desk."
        ]
    },
    {
        pair: "Banana + Crown",
        correctChoice: 0,
        linkedObject: "Crown",
        choices: [
            "A banana king wears a golden crown and shouts royal orders!",
            "A banana lies near a crown.",
            "A crown sits on the floor."
        ]
    },
    {
        pair: "Moon + Umbrella",
        correctChoice: 2,
        linkedObject: "Umbrella",
        choices: [
            "An umbrella lies under moonlight.",
            "A closed umbrella leans against a wall.",
            "The moon opens a giant umbrella and starts floating in the rain!"
        ]
    },
    {
        pair: "Tiger + Violin",
        correctChoice: 1,
        linkedObject: "Violin",
        choices: [
            "A tiger looks at a violin.",
            "A tiger passionately plays violin at a concert while roaring musically!",
            "A violin rests in its case."
        ]
    },
    {
        pair: "Pizza + Rocket",
        correctChoice: 0,
        linkedObject: "Rocket",
        choices: [
            "A rocket launches into space powered by melting pizza cheese!",
            "Pizza is placed near a rocket.",
            "A rocket stands on a launch pad."
        ]
    }
];

const correctReplies = [
    "Excellent. That memory feels stronger.",
    "Good. I can feel the fragment stabilizing.",
    "Well done. Your focus sharpens.",
    "Yes... that association is powerful.",
    "Impressive. You're resisting the collapse."
];

const wrongReplies = [
    "That link feels weak...",
    "Careful. That memory may fracture.",
    "No... your focus is slipping.",
    "The mansion trembles from uncertainty.",
    "Anxiety feeds on mistakes. Stay calm."
];

// Room 2

// -------------------- UI CONTROL LAYER --------------------

function setUIState({ showNext = false, showDiffuse = false }) {
    nextBtn.classList.toggle("hidden", !showNext);
    diffuseBtn.classList.toggle("hidden", !showDiffuse);
}

// Each rendered question accepts one answer, including queued clicks on old buttons.
function beginPuzzleAnswers() {
    answerPending = false;
    return ++activePuzzle;
}

function acceptPuzzleAnswer(puzzle) {
    if (answerPending || puzzle !== activePuzzle || transitionPending) return false;

    answerPending = true;
    puzzleCard.querySelectorAll("button").forEach(button => {
        button.disabled = true;
    });
    return true;
}

// -------------------- ROOM CALLBACK LIFETIME --------------------

let roomWorkVersion = 0;
const roomTimeouts = new Set();
const roomIntervals = new Set();

function clearRoomInterval(id) {
    clearInterval(id);
    roomIntervals.delete(id);
}

function scheduleRoomCallback(callback, delay, repeat = false) {
    const version = roomWorkVersion;
    const room = currentRoom;
    const phase = currentPhase;
    const run = () => {
        if (!repeat) roomTimeouts.delete(id);
        if (version !== roomWorkVersion || room !== currentRoom || phase !== currentPhase) {
            if (repeat) clearRoomInterval(id);
            return;
        }
        callback();
    };
    const id = repeat ? setInterval(run, delay) : setTimeout(run, delay);
    (repeat ? roomIntervals : roomTimeouts).add(id);
    return id;
}

// Also call this before future collapse/retry/restart resets, including same-room resets.
function cancelRoomWork() {
    roomWorkVersion++;
    roomTimeouts.forEach(id => clearTimeout(id));
    roomIntervals.forEach(id => clearInterval(id));
    roomTimeouts.clear();
    roomIntervals.clear();
    stormInterval = null;
    answerPending = true;
    activePuzzle++;
    transitionPending = false;
    nextBtn.disabled = false;
    gamePaused = false;
    transitionOverlay.classList.remove("active");
    puzzleOverlay.classList.add("hidden");
}

// -------------------- TIMER --------------------

function updateTimer() {
    if (currentPhase === GAME_PHASE.COMPLETE) return;

    if (timeRemaining <= 0) {
        cancelRoomWork();
        currentPhase = GAME_PHASE.COMPLETE;
        updateDialogue("Time is up. Mind collapse.");
        return;
    }

    timeRemaining--;

    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;

    timerDisplay.textContent =
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

    const timerPercent = (timeRemaining / totalTime) * 100;
    timerBar.style.width = timerPercent + "%";
}

// -------------------- ANXIETY SYSTEM --------------------

function changeAnxiety(amount) {
    anxiety = Math.max(0, Math.min(100, anxiety + amount));
}

function renderAnxiety() {
    anxietyDisplay.textContent = anxiety + "%";
    anxietyBar.style.width = anxiety + "%";
}

function applyAnxiety(amount) {
    changeAnxiety(amount);
    renderAnxiety();
}

// -------------------- DIALOGUE --------------------

function updateDialogue(text) {
    dialogueText.textContent = text;

    dialogueText.classList.remove("dialogue-update");
    void dialogueText.offsetWidth;
    dialogueText.classList.add("dialogue-update");
}

function randomReply(list) {
    return list[Math.floor(Math.random() * list.length)];
}

// -------------------- INTRO --------------------

nextBtn.addEventListener("click", () => {
    if (transitionPending || nextBtn.disabled || nextBtn.classList.contains("hidden")) return;
    console.log("NEXT CLICK FIRED", currentPhase);

    if (currentRoom === 1 && currentPhase === GAME_PHASE.FORGE && room1IntroStep === 0) {
        room1IntroStep = 1;

        updateDialogue("Strange images create stronger memories...");

        return;
    }

    if (currentRoom === 1 && currentPhase === GAME_PHASE.FORGE && room1IntroStep === 1) {
        room1IntroStep = 2;

        updateDialogue("Focus on the most unusual association.");

        setUIState({ showNext: false, showDiffuse: true });

        scheduleRoomCallback(() => {
            renderAssociationPuzzle();
        }, 1200);

        return;
    }
    
    if (currentPhase === GAME_PHASE.INTRO) {
        dialogueIndex++;

        if (dialogueIndex < introDialogue.length) {
            updateDialogue(introDialogue[dialogueIndex]);
        } else {
            transitionToRoom("assets/room1-bg.png", () => {
                goToRoom(1);
            });
        }

        return;
    }

    if (currentRoom === 2) {
        if (room2Step === 0) {
            room2Step = 1;
            updateDialogue("Raw information overwhelms working memory.");
            return;
        }

        if (room2Step === 1) {
            room2Step = 2;
            updateDialogue("You will learn how to compress it.");
            return;
        }

        if (room2Step === 2) {
            room2Step = 3;
            startRoom2PhaseA();
            return;
        }

        if (room2Step === 4) {
            room2Step = 5;
            updateDialogue("A good chunk is compact, ordered, and meaningful.");
            return;
        }

        if (room2Step === 5) {
            room2Step = 6;
            startRoom2PhaseC();
            return;
        }
    }

    if (currentPhase === GAME_PHASE.COMPLETE) {
        updateDialogue("Room complete. Room 2 comes next.");
        return;
    }
});

// -------------------- DIFFUSE --------------------

diffuseBtn.addEventListener("click", () => {
    if (transitionPending) return;
    if (diffuseUses <= 0) {
        updateDialogue("Diffuse is exhausted...");
        return;
    }

    diffuseUses--;
    applyAnxiety(-5);

    if (currentRoom === 1) {
        updateDialogue(
            `Hint: Focus on the strangest image. Uses left: ${diffuseUses}`
        );
        return;
    }

    if (currentRoom === 2) {
        if (room2DiffuseContext === "chunk") {
            updateDialogue(
                `Hint: Strong chunks are ordered and meaningful. Uses left: ${diffuseUses}`
            );
            return;
        }

        if (room2DiffuseContext === "recall") {
            updateDialogue(
                `Hint: Recall what each letter in LOCKE stood for. Uses left: ${diffuseUses}`
            );
            return;
        }
    }
});

// -------------------- SCENE TRANSITION --------------------

function transitionToRoom(backgroundPath, callback) {
    if (transitionPending) return;
    cancelRoomWork();
    transitionPending = true;
    answerPending = true;
    nextBtn.disabled = true;
    transitionOverlay.classList.add("active");

    scheduleRoomCallback(() => {
        try {
            sceneArea.style.background = `
                linear-gradient(rgba(10,10,30,0.25), rgba(10,10,30,0.25)),
                url("${backgroundPath}")
            `;

            sceneArea.style.backgroundSize = "cover";
            sceneArea.style.backgroundPosition = "center";
            sceneArea.style.backgroundRepeat = "no-repeat";

            transitionOverlay.classList.remove("active");

            transitionPending = false;
            nextBtn.disabled = false;
            if (callback) callback();

        } catch (e) {
            transitionPending = false;
            nextBtn.disabled = false;
            console.error("Transition error:", e);
            transitionOverlay.classList.remove("active");
        }

    }, 500);
}

function setRoomTitle(title, subtitle = "") {
    document.getElementById("room-title").textContent = title;
    document.getElementById("room-subtitle").textContent = subtitle;
}

// -------------------- ROOM START --------------------

function goToRoom(roomNumber) {
    cancelRoomWork();
    currentRoom = roomNumber;

    // make sure title is visible again
    backgroundOverlay.style.display = "block";

    switch (roomNumber) {
        case 1:
            setRoomTitle("Memory Forge", "Visual memory & association");
            startRoom1();
            break;

        case 2:
            transitionToRoom("assets/room2-bg.png", () => {
                setRoomTitle("Compression Library", "Chunking & memory compression");
                nextBtn.disabled = true;
                scheduleRoomCallback(() => {
                    startRoom2();
                }, 50);
            });
            break;

        case 3:
            setRoomTitle("Memory Palace", "Spatial memory & navigation");
            updateDialogue("Room 3 not built yet.");
            break;

        case 4:
            setRoomTitle("Final Escape", "Integration test");
            updateDialogue("Final escape not built yet.");
            break;
    }
}

function startRoom1() {
    currentPhase = GAME_PHASE.FORGE;

    nextBtn.disabled = false;
    nextBtn.classList.remove("hidden");

    diffuseBtn.disabled = false;
    diffuseBtn.classList.add("hidden");

    currentPairIndex = 0;
    recallIndex = 0;
    recallScore = 0;
    forgedMemories = [];

    setUIState({ showNext: true, showDiffuse: false });

    setRoomTitle("Memory Forge", "Visual memory & association");

    updateDialogue("Welcome to the Memory Forge.");

    // STEP FLOW CONTROL FLAG
    room1IntroStep = 0;
}

function startRoom2() {
    currentPhase = GAME_PHASE.RETRIEVAL;

    // safety reset (IMPORTANT)
    puzzleOverlay.classList.add("hidden");
    transitionOverlay.classList.remove("active");
    gamePaused = false;

    room2Step = 0;
    selectedChunk = null;

    nextBtn.classList.remove("hidden");
    nextBtn.disabled = false;

    diffuseBtn.classList.add("hidden");

    setUIState({ showNext: true, showDiffuse: false });

    setRoomTitle("Compression Library", "Chunking & memory compression");

    updateDialogue("Welcome to the Compression Library.");
}

// -------------------- PUZZLES --------------------

function renderAssociationPuzzle() {
    if (currentPhase !== GAME_PHASE.FORGE) return;

    const puzzle = beginPuzzleAnswers();
    const round = memoryForgeRounds[currentPairIndex];
    puzzleOverlay.classList.remove("hidden");

    puzzleCard.innerHTML = `
        <div style="font-size: 18px; margin-bottom: 10px;">
            🔮 Forge Memory ${currentPairIndex + 1} / ${memoryForgeRounds.length}
        </div>

        <div style="font-size: 28px; font-weight: bold; margin-bottom: 14px;">
            ${round.pair}
        </div>

        <div style="margin-bottom: 12px;">
            Choose the strongest mental image:
        </div>
    `;

    round.choices.forEach((choice, index) => {
        const button = document.createElement("button");
        button.className = "puzzle-option";
        button.textContent = choice;

        button.onclick = () => selectAssociation(index, puzzle);

        puzzleCard.appendChild(button);
    });
}

function selectAssociation(index, puzzle) {
    if (!acceptPuzzleAnswer(puzzle)) return;
    const round = memoryForgeRounds[currentPairIndex];

    forgedMemories.push({
        pair: round.pair,
        linkedObject: round.linkedObject,
        usedStrongImage: index === round.correctChoice
    });

    if (index === round.correctChoice) {
        updateDialogue(randomReply(correctReplies));
        applyAnxiety(-3);
    } else {
        updateDialogue(randomReply(wrongReplies));
        applyAnxiety(+5);
    }

    currentPairIndex++;

    if (currentPairIndex < memoryForgeRounds.length) {
        scheduleRoomCallback(() => renderAssociationPuzzle(), 700);
    } else {
        scheduleRoomCallback(startRecallPhase, 900);
    }
}

// -------------------- STORM --------------------

function startRecallPhase() {
    currentPhase = GAME_PHASE.STORM;
    gamePaused = true;

    updateDialogue("Hold on... something is breaking.");

    puzzleOverlay.classList.remove("hidden");

    let messages = [
        "What if you fail?",
        "You forgot everything.",
        "Everyone else is ahead.",
        "Focus is slipping...",
        "Too many thoughts..."
    ];

    let i = 0;

    stormInterval = scheduleRoomCallback(() => {
        puzzleCard.innerHTML = `
            <div class="storm-container">
                <div class="storm-icon">🌪️</div>
                <div class="storm-title">MEMORY STORM</div>
                <div class="storm-text">${messages[i]}</div>
            </div>
        `;

        applyAnxiety(+3);

        i++;

        if (i >= messages.length) {
            clearRoomInterval(stormInterval);
            scheduleRoomCallback(endMemoryStorm, 600);
        }
    }, 700, true);
}

function endMemoryStorm() {
    gamePaused = false;

    applyAnxiety(+5);

    scheduleRoomCallback(() => {
        renderRecallQuestion();
    }, 400);
}

// -------------------- RECALL --------------------

function renderRecallQuestion() {
    const puzzle = beginPuzzleAnswers();
    currentPhase = GAME_PHASE.RECALL;

    const round = memoryForgeRounds[recallIndex];

    const options = shuffleArray([
        "Calculator",
        "Crown",
        "Umbrella",
        "Violin",
        "Rocket"
    ]);

    puzzleCard.innerHTML = `
        <div style="font-size: 18px; margin-bottom: 10px;">
            🧠 Recall ${recallIndex + 1} / ${memoryForgeRounds.length}
        </div>

        <div style="font-size: 28px; font-weight: bold; margin-bottom: 14px;">
            What was paired with ${round.pair.split(" + ")[0]}?
        </div>
    `;

    options.forEach(obj => {
        const button = document.createElement("button");
        button.className = "puzzle-option";
        button.textContent = obj;
        button.onclick = () => selectRecall(obj, puzzle);
        puzzleCard.appendChild(button);
    });
}

function selectRecall(selected, puzzle) {
    if (!acceptPuzzleAnswer(puzzle)) return;
    const round = memoryForgeRounds[recallIndex];

    if (selected === round.linkedObject) {
        recallScore++;
        updateDialogue(randomReply(correctReplies));
        applyAnxiety(-2);
    } else {
        updateDialogue(randomReply(wrongReplies));
        applyAnxiety(+4);
    }

    recallIndex++;

    if (recallIndex < memoryForgeRounds.length) {
        scheduleRoomCallback(() => renderRecallQuestion(), 600);
    } else {
        finishRoom1();
    }
}

// -------------------- ROOM 2 -----------------

function startRoom2PhaseA() {
    const words = ["Book", "River", "Ice", "Door", "Glass", "Ember"];

    puzzleOverlay.classList.remove("hidden");

    puzzleCard.innerHTML = `
        <div style="font-size:18px; margin-bottom:12px;">
            📚 Memory Overload
        </div>

        <div style="font-size:28px; margin-bottom:20px;">
            ${words.join(" • ")}
        </div>

        <div>Memorize...</div>
    `;

    setUIState({ showNext: false, showDiffuse: true });

    scheduleRoomCallback(() => {
        puzzleCard.innerHTML = `
            <div style="font-size:18px; margin-bottom:12px;">
                ❓ Recall
            </div>
            <div style="margin-bottom:20px;">
                Which item was 4th?
            </div>
        `;

        const puzzle = beginPuzzleAnswers();
        ["Ice", "Door", "River", "Ember"].forEach(choice => {
            const btn = document.createElement("button");
            btn.className = "puzzle-option";
            btn.textContent = choice;

            btn.onclick = () => {
                if (!acceptPuzzleAnswer(puzzle)) return;
                room2FirstAnswerCorrect = choice === "Door";

                if (room2FirstAnswerCorrect) {
                    applyAnxiety(-2);
                    updateDialogue(
                        "Impressive. But notice how hard that felt... There is an easier way."
                    );
                } else {
                    applyAnxiety(+3);
                    updateDialogue(
                        "That was difficult, wasn’t it? Raw information overwhelms working memory quickly. There is an easier way."
                    );
                }

                setUIState({ showNext: true, showDiffuse: false });

                // SHOW BRIDGE PANEL IMMEDIATELY
                startRoom2PhaseB();

                // Next click should continue from here
                room2Step = 4;
            };

            puzzleCard.appendChild(btn);
        });
    }, 4000);
}

function startRoom2PhaseB() {

    puzzleOverlay.classList.remove("hidden");

    puzzleCard.innerHTML = `
        <div style="font-size:18px; margin-bottom:12px;">
            🧩 Compression
        </div>

        <div style="font-size:26px;">
            Book • River • Ice • Door • Glass • Ember
        </div>

        <div style="margin-top:20px; font-size:32px; color:#60a5fa;">
            BRIDGE
        </div>
    `;
}

function startRoom2PhaseC() {
    const puzzle = beginPuzzleAnswers();
    room2DiffuseContext = "chunk";
    setUIState({ showNext: false, showDiffuse: true });

    const words = ["Lantern", "Ocean", "Crown", "Kite", "Ember"];

    puzzleCard.innerHTML = `
        <div style="font-size:18px; margin-bottom:12px;">
            🧠 Choose your chunk strategy
        </div>

        <div style="margin-bottom:20px;">
            ${words.join(" • ")}
        </div>
    `;

    const choices = [
        "Raw List",
        "LOCKE",
        "Lazy Owls Carry Kite Equipment",
        "LOKCE"
    ];

    choices.forEach(choice => {
        const btn = document.createElement("button");
        btn.className = "puzzle-option";
        btn.textContent = choice;

        btn.onclick = () => handleRoom2Choice(choice, puzzle);
        puzzleCard.appendChild(btn);
    });
}

function handleRoom2Choice(choice, puzzle) {
    if (!acceptPuzzleAnswer(puzzle)) return;
    selectedChunk = choice;

    setUIState({ showNext: true, showDiffuse: false });

    updateDialogue(`Okay, you picked: "${choice}".`);

    scheduleRoomCallback(() => {
        if (choice === "Lazy Owls Carry Kite Equipment") {
            updateDialogue("Great choice. Meaning and imagery make memory stronger.");
        } else if (choice === "LOCKE") {
            updateDialogue("Good. That’s a decent chunk — we can still strengthen it.");
        } else {
            updateDialogue("That’s fine. Let’s see how it performs.");
        }
    }, 900);

    scheduleRoomCallback(() => {
        startRoom2DistortionStorm();
    }, 1800);
}

function startRoom2DistortionStorm() {
    puzzleOverlay.classList.remove("hidden");
    gamePaused = true;

    const messages = [
        "Pages are rewriting themselves...",
        "Your chunk is unstable...",
        "Memory interference detected...",
        "Focus is breaking apart...",
        "Reconstruction in progress..."
    ];

    let i = 0;

    const interval = scheduleRoomCallback(() => {
        puzzleCard.innerHTML = `
            <div class="storm-container">
                <div class="storm-icon">📚</div>
                <div class="storm-title">LIBRARY DISTORTION</div>
                <div class="storm-text">${messages[i]}</div>
            </div>
        `;

        applyAnxiety(+2);
        i++;

        if (i >= messages.length) {
            clearRoomInterval(interval);

            scheduleRoomCallback(() => {
                endRoom2DistortionStorm();
            }, 700);
        }
    }, 900, true);
}

function endRoom2DistortionStorm() {
    gamePaused = false;

    applyAnxiety(+4);

    scheduleRoomCallback(() => {
        startRoom2RecallTest();
    }, 500);
}

function startRoom2RecallTest() {
    const puzzle = beginPuzzleAnswers();
    room2DiffuseContext = "recall";
    setUIState({ showNext: false, showDiffuse: true });

    const options = ["Crown", "Kite", "Ocean", "Ember"];

    puzzleCard.innerHTML = `
        <div style="font-size:18px; margin-bottom:12px;">
            🧠 Can you remember now?
        </div>

        <div style="margin-bottom:20px;">
            Which item was 4th?
        </div>
    `;

    options.forEach(opt => {
        const btn = document.createElement("button");
        btn.className = "puzzle-option";
        btn.textContent = opt;

        btn.onclick = () => {
            if (!acceptPuzzleAnswer(puzzle)) return;
            setUIState({ showNext: true, showDiffuse: false });

            const correct = opt === "Kite";

            updateDialogue(
                correct
                    ? "Good. The structure helped stabilize memory."
                    : "Not quite. But notice how the chunk still helps guide recall."
            );

            applyAnxiety(correct ? -3 : +4);

            scheduleRoomCallback(finishRoom2, 1500);
        };

        puzzleCard.appendChild(btn);
    });
}

// -------------------- END --------------------

function finishRoom1() {
    if (currentRoom !== 1 || currentPhase !== GAME_PHASE.RECALL) return;
    answerPending = true;
    currentPhase = GAME_PHASE.ROOM_COMPLETE;
    puzzleOverlay.classList.add("hidden");

    if (recallScore >= 4) {
        fragments++;
        fragmentsDisplay.textContent = `${fragments} / 4`;
        updateDialogue(`Excellent! Fragment recovered. Score: ${recallScore}/5`);
    } else {
        updateDialogue(`You barely held on. Score: ${recallScore}/5`);
    }

    setUIState({ showNext: false, showDiffuse: false });

    scheduleRoomCallback(() => {
        updateDialogue("A second door opens... The Compression Library awaits.");
    }, 1800);

    scheduleRoomCallback(() => {
        goToRoom(2);
    }, 3500);
}

function finishRoom2() {
    if (currentRoom !== 2 || currentPhase !== GAME_PHASE.RETRIEVAL) return;
    answerPending = true;
    puzzleOverlay.classList.add("hidden");

    currentPhase = GAME_PHASE.ROOM_COMPLETE;

    if (selectedChunk === "Lazy Owls Carry Kite Equipment") {
        fragments++;
        fragmentsDisplay.textContent = `${fragments} / 4`;
        updateDialogue("Excellent. Strong chunk created. Fragment recovered.");
    } else {
        updateDialogue("You completed the task. But chunk strength could improve.");
    }

    scheduleRoomCallback(() => {
        goToRoom(3);
    }, 2500);
}

// -------------------- UTIL --------------------

function shuffleArray(arr) {
    return [...arr].sort(() => Math.random() - 0.5);
}

// -------------------- LOOPS --------------------

setInterval(updateTimer, 1000);

setInterval(() => {
    if (!gamePaused && currentPhase !== GAME_PHASE.INTRO) {
        applyAnxiety(+1);
    }
}, 8000);

renderAnxiety();
updateDialogue(introDialogue[0]);
setUIState({ showNext: true, showDiffuse: false });
