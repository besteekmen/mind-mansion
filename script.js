const dialogueText = document.getElementById("dialogue-text");
const nextBtn = document.getElementById("next-btn");
nextBtn.addEventListener("click", () => {
    console.log("NEXT CLICK FIRED", currentPhase);

    if (currentPhase === GAME_PHASE.INTRO) {
        dialogueIndex++;

        if (dialogueIndex < introDialogue.length) {
            updateDialogue(introDialogue[dialogueIndex]);
        } else {
            startRoom1();
        }

        return;
    }

    if (currentPhase === GAME_PHASE.COMPLETE) {
        updateDialogue("You are already inside the memory loop.");
        return;
    }
});
const timerDisplay = document.getElementById("timer");
const anxietyDisplay = document.getElementById("anxiety");
const timerBar = document.getElementById("timer-bar");
const anxietyBar = document.getElementById("anxiety-bar");
const puzzleOverlay = document.getElementById("puzzle-overlay");
const puzzleCard = document.getElementById("puzzle-card");
const fragmentsDisplay = document.getElementById("fragments");
const diffuseBtn = document.getElementById("diffuse-btn");

// -------------------- GAME STATE --------------------

const GAME_PHASE = {
    INTRO: "intro",
    FORGE: "forge",
    STORM: "storm",
    RECALL: "recall",
    COMPLETE: "complete"
};

let currentPhase = GAME_PHASE.INTRO;
let gamePaused = false;

// -------------------- CORE STATE --------------------

const totalTime = 15 * 60;
let timeRemaining = totalTime;

let anxiety = 20;
let fragments = 0;

let dialogueIndex = 0;

// Forge / recall state
let currentPairIndex = 0;
let recallIndex = 0;
let recallScore = 0;
let forgedMemories = [];
let diffuseUses = 2;

// Storm
let stormInterval = null;

// -------------------- DATA --------------------

const introDialogue = [
    "Welcome. You are inside Mind Mansion.",
    "Tomorrow is your exam.",
    "Your anxiety shattered your memory into fragments.",
    "Recover the fragments before time runs out.",
    "Or your mind will collapse."
];

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

// -------------------- UI CONTROL LAYER --------------------

function setUIState({ showNext = false, showDiffuse = false }) {
    nextBtn.classList.toggle("hidden", !showNext);
    diffuseBtn.classList.toggle("hidden", !showDiffuse);
}

// -------------------- TIMER --------------------

function updateTimer() {
    if (currentPhase === GAME_PHASE.COMPLETE) return;

    if (timeRemaining <= 0) {
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
    if (currentPhase !== GAME_PHASE.INTRO) return;

    dialogueIndex++;

    if (dialogueIndex < introDialogue.length) {
        updateDialogue(introDialogue[dialogueIndex]);
    } else {
        nextBtn.disabled = false;
        startRoom1();
    }
});

// -------------------- DIFFUSE --------------------

diffuseBtn.addEventListener("click", () => {
    if (diffuseUses <= 0) {
        updateDialogue("Diffuse is exhausted...");
        return;
    }

    diffuseUses--;
    applyAnxiety(-5);

    updateDialogue(`Hint: Focus on the strangest image. Uses left: ${diffuseUses}`);
});

// -------------------- ROOM START --------------------

function startRoom1() {
    currentPhase = GAME_PHASE.FORGE;

    // 🔥 HARD RESET UI STATE (IMPORTANT FIX)
    nextBtn.disabled = false;
    nextBtn.classList.remove("hidden");

    diffuseBtn.disabled = false;
    diffuseBtn.classList.add("hidden"); // will be shown via setUIState properly

    currentPairIndex = 0;
    recallIndex = 0;
    recallScore = 0;
    forgedMemories = [];

    setUIState({ showNext: false, showDiffuse: true });

    updateDialogue("Welcome to the Memory Forge. Strange images create stronger memories.");

    renderAssociationPuzzle();
}

// -------------------- PUZZLES --------------------

function renderAssociationPuzzle() {
    if (currentPhase !== GAME_PHASE.FORGE) return;

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

        button.onclick = () => selectAssociation(index);

        puzzleCard.appendChild(button);
    });
}

function selectAssociation(index) {
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
        setTimeout(() => renderAssociationPuzzle(), 700);
    } else {
        setTimeout(startRecallPhase, 900);
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

    stormInterval = setInterval(() => {
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
            clearInterval(stormInterval);
            setTimeout(endMemoryStorm, 600);
        }
    }, 700);
}

function endMemoryStorm() {
    gamePaused = false;

    applyAnxiety(+5);

    setTimeout(() => {
        renderRecallQuestion();
    }, 400);
}

// -------------------- RECALL --------------------

function renderRecallQuestion() {
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
        button.onclick = () => selectRecall(obj);
        puzzleCard.appendChild(button);
    });
}

function selectRecall(selected) {
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
        setTimeout(() => renderRecallQuestion(), 600);
    } else {
        finishRoom1();
    }
}

// -------------------- END --------------------

function finishRoom1() {
    currentPhase = GAME_PHASE.COMPLETE;
    puzzleOverlay.classList.add("hidden");

    if (recallScore >= 4) {
        fragments++;
        fragmentsDisplay.textContent = `${fragments} / 4`;
        updateDialogue(`Excellent! Fragment recovered. Score: ${recallScore}/5`);
    } else {
        updateDialogue(`You barely held on. Score: ${recallScore}/5`);
    }

    setUIState({ showNext: true, showDiffuse: false });
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
startRoom1();