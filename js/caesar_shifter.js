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

// --- Words setup ---
const words = ["KEY", "HASH", "DATA", "CODE", "BYTE", "NODE", "LINK", "FILE", "USER"];

// Pick 2 random non-repeating words for the challenge
let challengeIndices = [];
while (challengeIndices.length < 2) {
    const idx = randomInt(0, words.length - 1);
    if (!challengeIndices.includes(idx)) challengeIndices.push(idx);
}

// Prepare encoded challenges
const encodedWords = challengeIndices.map(idx => {
    const shift = randomInt(1, 25);
    const word = words[idx];
    return { original: word, shift: shift, encoded: caesarShift(word, shift) };
});

// --- Page setup ---
let currentIndex = 0;
let questionsAnswered = 0;
const maxQuestions = 2;

const pages = [
    { type: 'info', content: '<h2>Info Page</h2><p>Welcome! This page explains how the Caesar Cipher challenge works.</p>' },
    { type: 'question', content: '<h2>Question Page</h2>' }
];

// --- Update content ---
function updateContent() {
    const page = pages[currentIndex];
    const pageContent = document.getElementById('page_content');
    pageContent.innerHTML = page.content;

    const caesarControls = document.getElementById('caesar_controls');

    if (page.type === 'question') {
        caesarControls.style.display = 'block';
        displayRandomCaesar();
    } else {
        caesarControls.style.display = 'none';
    }
}

// --- Navigation ---
document.getElementById('back_btn').addEventListener('click', () => {
    currentIndex = (currentIndex > 0) ? currentIndex - 1 : pages.length - 1;
    updateContent();
});

document.getElementById('forward_btn').addEventListener('click', () => {
    currentIndex = (currentIndex < pages.length - 1) ? currentIndex + 1 : 0;
    updateContent();
});

// --- Caesar cipher functionality ---
let currentCaesarChallenge = null;

function displayRandomCaesar() {
    const feedback = document.getElementById('word_feedback');

    if (questionsAnswered >= maxQuestions) {
        // Challenge completed
        document.getElementById('page_content').innerHTML = `
            <h3>Challenge Completed! Great job!</h3>
            <a href="index.html" style="color:blue; text-decoration:underline;">Return to Homepage</a>
        `;
        document.getElementById('caesar_controls').style.display = 'none';
        return;
    }

    // Get next challenge in the prepared array
    currentCaesarChallenge = encodedWords[questionsAnswered];

    document.getElementById('encoded_input').value = currentCaesarChallenge.encoded;
    document.getElementById('original_input').value = currentCaesarChallenge.original;
    document.getElementById('shift').value = currentCaesarChallenge.shift;

    feedback.innerHTML = '';
    document.getElementById('caesar_input').value = '';
}

function compareCaesarInput() {
    const userInput = document.getElementById('caesar_input').value.trim().toUpperCase();
    const feedback = document.getElementById('word_feedback');

    if (userInput === currentCaesarChallenge.original) {
        feedback.innerHTML = `<p style="color: green;">Correct! The word is "${currentCaesarChallenge.original}" with shift ${currentCaesarChallenge.shift}.</p>`;
        questionsAnswered++;
        setTimeout(displayRandomCaesar, 1000); // Move to next question or completion
    } else {
        feedback.innerHTML = `<p style="color: red;">Try again!</p>`;
    }
}

document.getElementById('submit_btn').addEventListener('click', compareCaesarInput);

// --- Initial display ---
updateContent();