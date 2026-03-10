// --- Caesar cipher setup ---
const lowerCaseAlphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');

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

  return arrayOfNewLetters.join('');
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const words = ["KEY", "HASH", "DATA", "CODE", "BYTE", "NODE", "LINK", "FILE", "USER"];
const encodedWords = words.map(word => {
  const shift = randomInt(1, 25);
  const encoded = caesarShift(word, shift);
  return { original: word, shift: shift, encoded: encoded };
});

let currentIndex = 0;

// Page definitions
const pages = [
  { type: 'info', content: '<h2>Info Page</h2><p>Welcome! This page explains how the Caesar Cipher challenge works.</p>' },
  { type: 'question', content: '<h2>Question Page</h2><p>Decode the encoded word below!</p>' }
];

// --- Update content ---
function updateContent() {
  const page = pages[currentIndex];
  const pageContent = document.getElementById('page_content');
  pageContent.innerHTML = page.content;

  const caesarControls = document.getElementById('caesar_controls');

  if (page.type === 'question') {
    // Show Caesar cipher controls
    caesarControls.style.display = 'block';
    displayRandomCaesar(); // show new challenge
  } else {
    // Hide Caesar controls on info page
    caesarControls.style.display = 'none';
  }
}

// --- Navigation ---
const backButton = document.getElementById('back_btn');
const forwardButton = document.getElementById('forward_btn');
const pageturn = document.getElementById('pageturn_sound');

backButton.addEventListener('click', () => {
  currentIndex = (currentIndex > 0) ? currentIndex - 1 : pages.length - 1;
  updateContent();
});

forwardButton.addEventListener('click', () => {
  currentIndex = (currentIndex < pages.length - 1) ? currentIndex + 1 : 0;
  updateContent();
});

// --- Caesar cipher page functionality ---
let caesarCurrentIndex = 0;
let currentCaesarChallenge = null;
function displayRandomCaesar() {
  // Only generate a new challenge if there isn’t one yet
  if (!currentCaesarChallenge) {
    const index = randomInt(0, encodedWords.length - 1);
    currentCaesarChallenge = encodedWords[index];
  }

  document.getElementById('page_content').innerHTML = `
    <h3>Decode the Caesar Cipher:</h3>
    <p><strong>Encoded:</strong> ${currentCaesarChallenge.encoded}</p>
  `;

  document.getElementById('encoded_input').value = currentCaesarChallenge.encoded;
  document.getElementById('original_input').value = currentCaesarChallenge.original;
  document.getElementById('shift').value = currentCaesarChallenge.shift;

  document.getElementById('word_feedback').innerHTML = '';
  document.getElementById('caesar_input').value = '';
}

function compareCaesarInput() {
  const userInput = document.getElementById('caesar_input').value.trim().toUpperCase();
  const feedback = document.getElementById('word_feedback');

  if (userInput === currentCaesarChallenge.original) {
    // Show correct message
    feedback.innerHTML = `<p style="color: green;">Correct! The word is "${currentCaesarChallenge.original}" with shift ${currentCaesarChallenge.shift}.</p>`;

    // Wait a short time before generating a new challenge (so user sees feedback)
    setTimeout(() => {
      const index = randomInt(0, encodedWords.length - 1);
      currentCaesarChallenge = encodedWords[index];
      displayRandomCaesar();
    }, 1000); // 1 second delay
  } else {
    feedback.innerHTML = `<p style="color: red;">Try again!</p>`;
  }
}

document.getElementById('submit_btn').addEventListener('click', compareCaesarInput);

// Initial display
updateContent();