// --- Caesar cipher setup ---
const lowerCaseAlphabet = "abcdefghijklmnopqrstuvwxyz".split("");

function caesarShift(inputText, shiftDegrees) {
  const inputTextToLowerCase = inputText.toLowerCase();
  let result = [];

  for (let i = 0; i < inputTextToLowerCase.length; i++) {
    const char = inputTextToLowerCase[i];
    if (lowerCaseAlphabet.includes(char)) {
      let idx = lowerCaseAlphabet.indexOf(char);
      let newIdx = (idx + shiftDegrees) % 26;
      if (newIdx < 0) newIdx += 26;
      result.push(lowerCaseAlphabet[newIdx]);
    } else {
      result.push(char);
    }
  }
  return result.join("");
}

function encodeCaesar(text, shift) {
  return caesarShift(text, shift);
}

function decodeCaesar(text, shift) {
  return caesarShift(text, shift);
}

// --- Random helpers ---
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomShift() {
  return randomInt(1, 5); // shifts between 1–5
}

// --- Direction cycle setup ---
let directionCycle = ["forward", "backward"];
let directionIndex = 0;

function getNextDirection() {
  const dir = directionCycle[directionIndex];
  directionIndex = (directionIndex + 1) % directionCycle.length;
  return dir;
}

// --- Word bank ---
const words = ["KEY", "HASH", "DATA", "CODE", "BYTE", "NODE", "LINK", "FILE", "USER"];

// --- Generate random challenges ---
const numberOfChallenges = 3; // how many questions you want
let shuffledWords = [...words].sort(() => Math.random() - 0.5);

const challengeWords = shuffledWords.slice(0, numberOfChallenges).map(word => ({
  word: word,
  shift: getRandomShift(),
  direction: getNextDirection()  // cycles forward, backward, forward...
}));

// --- Encode challenges ---
const encodedWords = challengeWords.map(ch => {
  const actualShift = ch.direction === "forward" ? ch.shift : -ch.shift;
  return {
    original: ch.word,
    shift: ch.shift,
    direction: ch.direction,
    encoded: encodeCaesar(ch.word, actualShift)
  };
});

// --- Page setup ---
let currentIndex = 0;
let questionsAnswered = 0;
const maxQuestions = encodedWords.length;

const pages = [
  {
    type: "info",
    content: `<h2>Info Page</h2>
      <p>Welcome! Solve the Caesar Cipher challenge.</p>
      <p>Decode the scrambled word using the shift and direction.</p>
      <p><strong>Forward</strong> = move letters forward<br>
         <strong>Backward</strong> = move letters backward</p>`
  },
  {
    type: "question",
    content: "<h2>Question Page</h2>"
  }
];

// --- Update content ---
function updateContent() {
  const page = pages[currentIndex];
  const pageContent = document.getElementById("page_content");
  const controls = document.getElementById("caesar_controls");

  pageContent.innerHTML = page.content;

  if (page.type === "question") {
    controls.style.display = "block";
    displayNextChallenge();
  } else {
    controls.style.display = "none";
  }
}

// --- Navigation ---
document.getElementById("back_btn").addEventListener("click", () => {
  currentIndex = currentIndex > 0 ? currentIndex - 1 : pages.length - 1;
  updateContent();
});

document.getElementById("forward_btn").addEventListener("click", () => {
  currentIndex = currentIndex < pages.length - 1 ? currentIndex + 1 : 0;
  updateContent();
});

// --- Caesar challenge logic ---
let currentCaesarChallenge = null;

function displayNextChallenge() {
  const feedback = document.getElementById("word_feedback");

  if (questionsAnswered >= maxQuestions) {
    finishMission();
    return;
  }

  currentCaesarChallenge = encodedWords[questionsAnswered];

  // Fill demo/reference inputs
  document.getElementById("encoded_input").value = currentCaesarChallenge.encoded;
  document.getElementById("original_input").value = currentCaesarChallenge.original;
  document.getElementById("shift").value = currentCaesarChallenge.shift;
  document.getElementById("direction").value = currentCaesarChallenge.direction;

  feedback.innerHTML = "";
  document.getElementById("caesar_input").value = "";
}

function checkCaesarInput() {
  const userInput = document.getElementById("caesar_input").value.trim().toUpperCase();
  const feedback = document.getElementById("word_feedback");

  const actualShift = currentCaesarChallenge.direction === "forward"
    ? -currentCaesarChallenge.shift
    : currentCaesarChallenge.shift;

  const decoded = decodeCaesar(currentCaesarChallenge.encoded, actualShift).toUpperCase();

  if (userInput === decoded) {
    feedback.innerHTML = `<p style="color: green;">
      Correct! "${currentCaesarChallenge.encoded}" decodes to "${decoded}" 
      (Shift ${currentCaesarChallenge.shift} ${currentCaesarChallenge.direction})
    </p>`;

    questionsAnswered++;
    setTimeout(displayNextChallenge, 1000);
  } else {
    feedback.innerHTML = `<p style="color: red;">Incorrect. Try again!</p>`;
  }
}

function finishMission() {
  const pageContent = document.getElementById("page_content");
  const controls = document.getElementById("caesar_controls");

  pageContent.innerHTML = `<h3>Mission Complete! Returning to index page...</h3>`;
  controls.style.display = "none";

  setTimeout(() => {
    window.location.href = "mission_hub.html";
  }, 1500);
}

// --- Event listener ---
document.getElementById("submit_btn").addEventListener("click", checkCaesarInput);

// --- Start ---
updateContent();