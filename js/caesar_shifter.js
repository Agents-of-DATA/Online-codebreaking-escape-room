// --- Caesar cipher setup ---
const lowerCaseAlphabet = "abcdefghijklmnopqrstuvwxyz".split("");

function caesarShift(inputText, shiftDegrees) {
  const inputTextToLowerCase = inputText.toLowerCase();
  let arrayOfNewLetters = [];

  for (let i = 0; i < inputTextToLowerCase.length; i++) {
    const currentChar = inputTextToLowerCase[i];
    if (lowerCaseAlphabet.includes(currentChar)) {
      let idx = lowerCaseAlphabet.indexOf(currentChar);
      let newIdx = (idx + shiftDegrees) % 26;
      if (newIdx < 0) newIdx += 26;
      arrayOfNewLetters.push(lowerCaseAlphabet[newIdx]);
    } else {
      arrayOfNewLetters.push(currentChar);
    }
  }
  return arrayOfNewLetters.join("");
}

function encodeCaesar(text, shift) {
  return caesarShift(text, shift);
}

function decodeCaesar(text, shift) {
  return caesarShift(text, shift);
}

// --- Words setup ---
const words = ["KEY", "HASH", "DATA", "CODE", "BYTE", "NODE", "LINK", "FILE", "USER"];

// --- Prepare 2 fixed challenges: 1 forward, 1 backward ---
const challengeWords = [
  { word: words[0], shift: 3, direction: "forward" }, // e.g., "KEY" forward +3
  { word: words[1], shift: 2, direction: "backward" } // e.g., "HASH" backward -2
];

const encodedWords = challengeWords.map(ch => {
  const actualShift = ch.direction === "forward" ? ch.shift : -ch.shift;
  const encoded = encodeCaesar(ch.word, actualShift);
  return {
    original: ch.word,
    shift: ch.shift,
    direction: ch.direction,
    encoded: encoded
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
    <p>See the scrambled word and decode it using the shift and direction.</p>
    <p>Forward shift: move letters forward in the alphabet<br>
       Backward shift: move letters backward</p>`
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
  pageContent.innerHTML = page.content;

  const caesarControls = document.getElementById("caesar_controls");

  if (page.type === "question") {
    caesarControls.style.display = "block";
    displayNextChallenge();
  } else {
    caesarControls.style.display = "none";
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

// --- Caesar cipher functionality ---
let currentCaesarChallenge = null;

function finishMission() {
  const pageContent = document.getElementById("page_content");
  const caesarControls = document.getElementById("caesar_controls");

  pageContent.innerHTML = `<h3>Mission Complete! Returning to index page...</h3>`;
  caesarControls.style.display = "none";

  setTimeout(() => {
    window.location.href = "index.html"; // Go back to index page
  }, 1500);
}

function displayNextChallenge() {
  const feedback = document.getElementById("word_feedback");

  if (questionsAnswered >= maxQuestions) {
    finishMission();
    return;
  }

  currentCaesarChallenge = encodedWords[questionsAnswered];

  // Fill HTML inputs for demo / reference
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

  // Determine shift for decoding
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

document.getElementById("submit_btn").addEventListener("click", checkCaesarInput);

// --- Initial display ---
updateContent();