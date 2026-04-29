// This object links each letter to an emoji
const emojiKey = {
    A: "⚔️", B: "🛡️", C: "🚢", D: "🪓", E: "🐺",
    F: "❄️", G: "🔥", H: "🍖", I: "🧩",
    J: "🗡️", K: "🧭", L: "🌊", M: "⛰️",
    N: "🌙", O: "👁️", P: "🐉", Q: "👑",
    R: "🏹", S: "🪶", T: "⚡️", U: "🪵",
    V: "🧔", W: "🌲", X: "❌", Y: "🦅", Z: "🪙"
};

// Get the table from the HTML
const table = document.getElementById("emojiTable");

// Get all letters (A–Z)
const letters = Object.keys(emojiKey);

// Split letters into 3 groups to fit in rows
const groupSize = Math.ceil(letters.length / 3);

// Create table rows
for (let i = 0; i < 3; i++) {
    const group = letters.slice(i * groupSize, (i + 1) * groupSize);

    // Row for letters
    const letterRow = document.createElement("tr"); 
    // Row for emojis
    const emojiRow = document.createElement("tr");  

    group.forEach(letter => {
        // Add letter cell
        const th = document.createElement("th");
        th.textContent = letter;
        letterRow.appendChild(th);

        // Add emoji cell
        const td = document.createElement("td");
        td.textContent = emojiKey[letter];
        emojiRow.appendChild(td);
    });

    // Add rows to table
    table.appendChild(letterRow);
    table.appendChild(emojiRow);
}

// Puzzle data grouped by difficulty
const emojiPuzzles = {
    easy: [
        { emojis: ["⛰️🐺🐺⚡️", "⚔️⚡️"], answer: ["meet at"] },
        { emojis: ["🔥👁️", "⚡️👁️"], answer: ["go to"] },
        { emojis: ["🌊👁️🚢⚔️⚡️🧩👁️🌙"], answer: ["location"] }
    ],
    medium: [
        { emojis: ["⚡️🍖🐺", "🪶🍖🧩🐉"], answer: ["the ship"] },
        { emojis: ["⚡️🍖🐺", "🪶🍖👁️🏹🐺"], answer: ["the shore"] },
        { emojis: ["⚡️🍖🐺", "🪓👁️🚢🧭"], answer: ["the dock"] }
    ],
    hard: [
        { emojis: ["❄️👁️🏹", "⛰️🧩🪶🪶🧩👁️🌙", "⚡️⚔️🧭🐺", "👁️❄️❄️"], answer: ["for mission take off"] },
        { emojis: ["❄️👁️🏹", "🏹⚔️🪓⚔️🏹", "🌊⚔️🪵🌙🚢🍖" ], answer: ["for radar launch"] },
        { emojis: ["❄️👁️🏹", "🪶⚔️⚡️🐺🌊🌊🧩⚡️🐺", "🌊⚔️🪵🌙🚢🍖"], answer: ["for satellite launch"] }
    ]
};

// Levels in order
const levels = ["easy", "medium", "hard"];

// Track current level
let currentLevelIndex = 0;

// Store current puzzle
let currentPuzzle = null;
// function to play sound effects for correct and incorrect answers 
function playSound(src) {
  try {
    const audio = new Audio(src);
    audio.volume = 0.5; // optional
    audio.play().catch(err => console.warn("Audio play failed:", err));
  } catch (err) {
    console.error("Error creating audio:", err);
  }
}
// Show a puzzle on the screen
function renderEmojiPuzzle() {
    const levelName = levels[currentLevelIndex];
    const puzzles = emojiPuzzles[levelName];

    // Pick a random puzzle
    currentPuzzle = puzzles[Math.floor(Math.random() * puzzles.length)];

    // Update level title
    document.getElementById("levelTitle").textContent =
        "Level " + (currentLevelIndex + 1);

    // Show emojis on screen
    const display = currentPuzzle.emojis
        .map(group => `<span class="emoji-group">${group}</span>`)
        .join("");

    document.getElementById("emojiDisplay").innerHTML = display;

    // Clear input and result
    document.getElementById("answerInput").value = "";
    document.getElementById("result").textContent = "";
}

// Check the user's answer
function checkAnswer() {
    const userInput = document
        .getElementById("answerInput").value.toLowerCase();

    const result = document.getElementById("result");

    // If answer is correct
    if (currentPuzzle.answer.includes(userInput)) {
        result.textContent = "Correct!";
        result.style.color = "lightgreen";
        playSound("audio/correct.wav");

        // Move to next level
        setTimeout(goToNextLevel, 1000);
    } else {
        // If wrong
        result.textContent = "Incorrect. Try again.";
        playSound("audio/incorrect3.wav");   
        result.style.color = "red";
    }
}

// Go to the next level
function goToNextLevel() {
    const result = document.getElementById("result");

    // If there are more levels
    if (currentLevelIndex < levels.length - 1) {
        result.textContent = "Level Complete! Advancing...";
        result.style.color = "lightgreen";

        setTimeout(() => {
            currentLevelIndex++;
            renderEmojiPuzzle();
        }, 1200);
    } else {
        // If all levels finished
        finishEmojiMission();
    }
}

// Finish the mission
function finishEmojiMission() {
    const result = document.getElementById("result");

    result.textContent = "Mission Complete! Returning to HQ...";
    result.style.color = "lightgreen";

    // Save progress
    localStorage.setItem("mission1Complete", "true");

    // Reset dialogue
    localStorage.removeItem("mission1DialogueShown");

    // Go back to mission hub
    setTimeout(() => {
        window.location.href = "mission_hub.html";
    }, 1500);
}

// Start puzzle when page loads
window.onload = function () {
    renderEmojiPuzzle();
};