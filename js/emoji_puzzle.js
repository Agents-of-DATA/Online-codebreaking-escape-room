const emojiKey = {
    A: "⚔️", B: "🛡️", C: "🚢", D: "🪓", E: "🐺",
    F: "❄️", G: "🔥", H: "🍖", I: "🍺",
    J: "🗡️", K: "🧭", L: "🌊", M: "⛰️",
    N: "🌙", O: "👁️", P: "🐉", Q: "👑",
    R: "🏹", S: "🪶", T: "⚡️", U: "🪵",
    V: "🧔", W: "🌲", X: "❌", Y: "🦅", Z: "🪙"
};

const table = document.getElementById("emojiTable");
const letters = Object.keys(emojiKey);

const groupSize = Math.ceil(letters.length / 3);

for (let i = 0; i < 3; i++) {
    const group = letters.slice(i * groupSize, (i + 1) * groupSize);

    const letterRow = document.createElement("tr");
    const emojiRow = document.createElement("tr");

    group.forEach(letter => {
        const th = document.createElement("th");
        th.textContent = letter;
        letterRow.appendChild(th);

        const td = document.createElement("td");
        td.textContent = emojiKey[letter];
        emojiRow.appendChild(td);
    });

    table.appendChild(letterRow);
    table.appendChild(emojiRow);
}

// puzzles
const emojiPuzzles = {
    easy: [
        { emojis: "⛰️🐺🐺⚡️ ⚔️⚡️", answer: ["meet at"] },
        { emojis: "🔥👁️ ⚡️👁️", answer: ["go to"] },
        { emojis: "🌊👁️🚢⚔️⚡️🍺👁️🌙", answer: ["location"] }
    ],
    medium: [
        { emojis: "⚡️🍖🐺🪶 🍖🍺🐉", answer: ["the ship"] },
        { emojis: "⚡️🍖🐺🪶 🍖👁️🏹🐺", answer: ["the shore"] },
        { emojis: "⚡️🍖🐺🪓 👁️🚢🧭", answer: ["the dock"] }
    ],
    hard: [
        { emojis: "❄️👁️🏹 ⛰️🍺🪶🪶🍺👁️🌙 ⚡️⚔️🧭🐺 👁️❄️❄️", answer: ["for mission take off"] },
        { emojis: "❄️👁️🏹 🏹⚔️🪓⚔️🏹 🌊⚔️🪵🌙🚢🍖 👁️❄️❄️", answer: ["for radar launch off"] },
        { emojis: "❄️👁️🏹 🪶⚔️⚡️🐺🌊🌊🍺⚡️🐺 🌊⚔️🪵🌙🚢🍖", answer: ["for satellite launch"] }
    ]
};

const levels = ["easy", "medium", "hard"];
let currentLevelIndex = 0;
let currentPuzzle = null;

function renderEmojiPuzzle() {
    const levelName = levels[currentLevelIndex];
    const puzzles = emojiPuzzles[levelName];

    currentPuzzle = puzzles[Math.floor(Math.random() * puzzles.length)];

    document.getElementById("levelTitle").textContent =
        "Level " + (currentLevelIndex + 1);

    document.getElementById("emojiDisplay").textContent =
        currentPuzzle.emojis;

    document.getElementById("answerInput").value = "";
    document.getElementById("result").textContent = "";
}

function checkAnswer() {
    const userInput = document
        .getElementById("answerInput").value.toLowerCase();

    const result = document.getElementById("result");

    if (currentPuzzle.answer.includes(userInput)) {
        result.textContent = "Correct!";
        result.style.color = "lightgreen";

        setTimeout(goToNextLevel, 1000);
    } else {
        result.textContent = "Incorrect. Try again.";
        result.style.color = "red";
    }
}

function goToNextLevel() {
    const result = document.getElementById("result");

    if (currentLevelIndex < levels.length - 1) {
        result.textContent = "Level Complete! Advancing...";
        result.style.color = "lightgreen";

        setTimeout(() => {
            currentLevelIndex++;
            renderEmojiPuzzle();
        }, 1200);
    } else {
        finishEmojiMission();
    }
}

function finishEmojiMission() {
    const result = document.getElementById("result");

    result.textContent = "Mission Complete! Returning to HQ...";
    result.style.color = "lightgreen";

    // ✅ mark mission complete
    localStorage.setItem("mission1Complete", "true");

    // ✅ reset dialogue so it plays again
    localStorage.removeItem("mission1DialogueShown");

    // ✅ redirect back to mission hub
    setTimeout(() => {
        window.location.href = "mission_hub.html";
    }, 1500);
}

window.onload = function () {
    renderEmojiPuzzle();
};