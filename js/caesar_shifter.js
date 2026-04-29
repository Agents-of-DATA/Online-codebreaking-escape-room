// caesar cipher setup
const lowerCaseAlphabet = "abcdefghijklmnopqrstuvwxyz".split("");
// function to shift the letters in the input text by a given number and direction forward back wards
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

// wrapping functions fo rencoding and decoding
function encodeCaesar(text, shift) {
  return caesarShift(text, shift);
}

function decodeCaesar(text, shift) {
  return caesarShift(text, shift);
}

// random int generator
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomShift() {
  // shifts between 1–5
  return randomInt(1, 5); 
}
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

// direction cycle to alternate between forward and backward shifts for the challenges
let directionCycle = ["forward", "backward"];
let directionIndex = 0;
// function to get the next direction for the challenge and cycle through forward and backward
function getNextDirection() {
  const dir = directionCycle[directionIndex];
  directionIndex = (directionIndex + 1) % directionCycle.length;
  return dir;
}

// list of words
const words = ["AGENT","RADAR","SIGNAL","ROCKET","PLANET","ORBIT","SPACE","SECRET","MISSION","VIKING"];


// how many questions you want
const numberOfChallenges = 3; 
// generate random numbers for the challenges
let shuffledWords = [...words].sort(() => Math.random() - 0.5);
// select the words for the challenges and assign random shifts 
const challengeWords = shuffledWords.slice(0, numberOfChallenges).map(word => ({
  word: word,
  shift: getRandomShift(),
  // cycles forward, backward, forward...
  direction: getNextDirection()  
}));

// encode challenges 
const encodedWords = challengeWords.map(ch => {
  const actualShift = ch.direction === "forward" ? ch.shift : -ch.shift;
  return {
   
    shift: ch.shift,
    direction: ch.direction,
    encoded: encodeCaesar(ch.word, actualShift)
  };
});

// page setup
let currentIndex = 0;
let questionsAnswered = 0;
const maxQuestions = encodedWords.length;



// update content function to show the current page content and controls based on the page type
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

// caesar cipher challenge logic 
let currentCaesarChallenge = null;

function displayNextChallenge() {
  
  const feedback = document.getElementById("word_feedback");
  // if all questions answered finish the mission and return to the hub
  if (questionsAnswered >= maxQuestions) {
    finishMission();
    return;
  }

  currentCaesarChallenge = encodedWords[questionsAnswered];

  // update the page to show the encoded word and the shift and direction for the current challenge
  document.getElementById("encoded_input").value = currentCaesarChallenge.encoded;

  document.getElementById("shift").value = currentCaesarChallenge.shift;
  document.getElementById("direction").value = currentCaesarChallenge.direction;

  feedback.innerHTML = "";
  document.getElementById("caesar_input").value = "";
}
// function to check the users input against the correct decoded word and provide feedback
function checkCaesarInput() {
  const userInput = document.getElementById("caesar_input").value.trim().toUpperCase();
  const feedback = document.getElementById("word_feedback");
  // determine the actual shift to decode based on the direction of the challenge
  const actualShift = currentCaesarChallenge.direction === "forward"
    ? -currentCaesarChallenge.shift
    : currentCaesarChallenge.shift;
  // decode the encoded word using the actual shift to get the correct answer for comparison
  const decoded = decodeCaesar(currentCaesarChallenge.encoded, actualShift).toUpperCase();
  // compare the user's input with the correct decoded word and provide feedback
  if (userInput === decoded) {
    feedback.innerHTML = `<p style="color: green;">
      Correct! "${currentCaesarChallenge.encoded}" decodes to "${decoded}" 
      (Shift ${currentCaesarChallenge.shift} ${currentCaesarChallenge.direction})
    </p>`;
    //play correct sound effect 
    playSound("audio/correct.wav");  
    // increment the counter and display the next challenge after a short delay
    questionsAnswered++;
    setTimeout(displayNextChallenge, 1000);
  } else {
      //play incorrect sound effect
      playSound("audio/incorrect3.wav");
    feedback.innerHTML = `<p style="color: red;">Incorrect. Try again!</p>`;
  }
}
// function to finish the mission and return to the mission hub after all questions are answered
function finishMission() {
  const pageContent = document.getElementById("page_content");
  const controls = document.getElementById("caesar_controls");

  pageContent.innerHTML = `<h3>Mission Complete! Returning to mission hub...</h3>`;
  controls.style.display = "none";

  localStorage.setItem("mission3Complete", "true");
  localStorage.removeItem("mission3DialogueShown");

  setTimeout(() => {
    window.location.href = "mission_hub.html";
  }, 1500);
}

// event lsitener
document.getElementById("submit_btn").addEventListener("click", checkCaesarInput);

displayNextChallenge();