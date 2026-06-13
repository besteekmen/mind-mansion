const dialogueText = document.getElementById("dialogue-text");
const nextBtn = document.getElementById("next-btn");
const timerDisplay = document.getElementById("timer");
const anxietyDisplay = document.getElementById("anxiety");
const timerBar = document.getElementById("timer-bar");
const anxietyBar = document.getElementById("anxiety-bar");
const puzzleOverlay = document.getElementById("puzzle-overlay");
const puzzleCard = document.getElementById("puzzle-card");

// -------------------- GAME STATE --------------------

const totalTime = 15 * 60;

let timeRemaining = totalTime;
let anxiety = 20;

let stormActive = false;
let stormInterval;

let dialogueIndex = 0;

let recallIndex = 0;
let recallScore = 0;

let currentRoom = 0;
let currentPairIndex = 0;
let forgedMemories = [];

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

// -------------------- TIMER --------------------

function updateTimer() {
    if (timeRemaining <= 0) {
        dialogueText.textContent = "Time is up. Mind collapse.";
        nextBtn.disabled = true;
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

// -------------------- ANXIETY SYSTEM (FIXED) --------------------

// ONLY changes value
function changeAnxiety(amount) {
    anxiety = Math.max(0, Math.min(100, anxiety + amount));
}

// ONLY updates UI
function renderAnxiety() {
    anxietyDisplay.textContent = anxiety + "%";
    anxietyBar.style.width = anxiety + "%";
}

// convenience wrapper
function applyAnxiety(amount) {
    changeAnxiety(amount);
    renderAnxiety();
}

// -------------------- INTRO --------------------

nextBtn.addEventListener("click", () => {
    dialogueIndex++;

    if (dialogueIndex < introDialogue.length) {
        dialogueText.textContent = introDialogue[dialogueIndex];
    } else {
        dialogueText.textContent = "Room 1 starting...";
        nextBtn.disabled = true;
        startRoom1();
    }
});

// -------------------- ROOM START --------------------

function startRoom1() {
    currentRoom = 1;
    currentPairIndex = 0;
    recallIndex = 0;
    recallScore = 0;
    forgedMemories = [];

    dialogueText.textContent =
        "Diffuse: Welcome to the Memory Forge. Strange images create stronger memories.";

    renderAssociationPuzzle();
}

// -------------------- FORGE PHASE --------------------

function renderAssociationPuzzle() {
    if (currentPairIndex >= memoryForgeRounds.length) {
        console.warn("Forge phase already completed.");
        return;
    }

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

function selectAssociation(selectedIndex) {
    const round = memoryForgeRounds[currentPairIndex];

    forgedMemories.push({
        pair: round.pair,
        linkedObject: round.linkedObject,
        usedStrongImage: selectedIndex === round.correctChoice
    });

    if (selectedIndex === round.correctChoice) {
        dialogueText.textContent =
            "Excellent. Strange, vivid links strengthen memory.";
        applyAnxiety(-3);
    } else {
        dialogueText.textContent =
            "That link is weaker. It may be harder to recall later.";
        applyAnxiety(+5);
    }

    currentPairIndex++;

    if (currentPairIndex < memoryForgeRounds.length) {
        setTimeout(renderAssociationPuzzle, 1200);
    } else {
        setTimeout(startRecallPhase, 1200);
    }
}

// -------------------- MEMORY STORM --------------------

function startRecallPhase() {
    recallIndex = 0;
    recallScore = 0;

    dialogueText.textContent = "Diffuse: Hold on... something is breaking.";

    puzzleOverlay.classList.remove("hidden");

    // start storm sequence
    stormActive = true;

    let stormMessages = [
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
                <div class="storm-text">${stormMessages[i]}</div>
            </div>
        `;

        applyAnxiety(+3);

        i++;

        if (i >= stormMessages.length) {
            clearInterval(stormInterval);

            setTimeout(() => {
                endMemoryStorm();
            }, 600);
        }

    }, 700);
}

function endMemoryStorm() {
    stormActive = false;

    puzzleCard.innerHTML = "";

    applyAnxiety(+5); // final spike

    setTimeout(() => {
        renderRecallQuestion();
    }, 400);
}

// -------------------- RECALL PHASE --------------------

function renderRecallQuestion() {
    const round = memoryForgeRounds[recallIndex];

    const allObjects = ["Calculator", "Crown", "Umbrella", "Violin", "Rocket"];

    puzzleCard.innerHTML = `
        <div style="font-size: 18px; margin-bottom: 10px;">
            🧠 Recall ${recallIndex + 1} / ${memoryForgeRounds.length}
        </div>

        <div style="font-size: 28px; font-weight: bold; margin-bottom: 14px;">
            What was paired with ${round.pair.split(" + ")[0]}?
        </div>
    `;

    allObjects.forEach(object => {
        const button = document.createElement("button");
        button.className = "puzzle-option";
        button.textContent = object;

        button.onclick = () => selectRecallAnswer(object);

        puzzleCard.appendChild(button);
    });
}

function selectRecallAnswer(selectedObject) {
    const round = memoryForgeRounds[recallIndex];

    if (selectedObject === round.linkedObject) {
        recallScore++;
        dialogueText.textContent = "Correct! The memory holds.";
        applyAnxiety(-2);
    } else {
        dialogueText.textContent = "Memory slipping...";
        applyAnxiety(+4);
    }

    recallIndex++;

    if (recallIndex < memoryForgeRounds.length) {
        setTimeout(renderRecallQuestion, 1000);
    } else {
        setTimeout(finishRoom1, 1000);
    }
}

// -------------------- END --------------------

function finishRoom1() {
    puzzleOverlay.classList.add("hidden");

    if (recallScore >= 4) {
        dialogueText.textContent =
            `Excellent! You recovered a memory fragment. Score: ${recallScore}/5`;
    } else {
        dialogueText.textContent =
            `You barely held on. Score: ${recallScore}/5`;
    }
}

// -------------------- LOOPS --------------------

setInterval(updateTimer, 1000);
setInterval(() => applyAnxiety(+1), 8000); // passive anxiety (FIXED)
renderAnxiety();

// START
startRoom1();