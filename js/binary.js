// decalring the words
const words = [
  "KEY", "HASH", "DATA", "CODE", "BYTE", "NODE", "LINK", "FILE", "USER"
];
// declaring the binary values for each word
const binaryValues = [
  "01001011 01000101 01011001",
  "01001000 01000001 01010011 01001000",
  "01000100 01000001 01010100 01000001",
  "01000011 01001111 01000100 01000101",
  "01000010 01011001 01010100 01000101",
  "01001110 01001111 01000100 01000101",
  "01001100 01001001 01001110 01001011",
  "01000110 01001001 01001100 01000101",
  "01010101 01010011 01000101 01010010"
];

// declaration of variables to keep track of the current challenge and progress
let currentBinaryChallenge = null;
let currentIndex = 0;
let questionsAnswered = 0;
const maxQuestions = 2;

// pages content info 

const pages = [
  {
    type: "info",
    content: `
      <h2>Info Page</h2>
      <p>This challenge shows a word encoded in ASCII Binary.</p>
      <p>Convert each 8-bit binary value into a letter.</p>
    `
  },
  {
    type: "question",
    content: `<h2>Question Page</h2>`
  }
];
// funciton to update the page content based on the current page or challenge 
function updateContent() {
  const page = pages[currentIndex];
  document.getElementById("page_content").innerHTML = page.content;

  const controls = document.getElementById("binary_controls");

  if (page.type === "question") {
    controls.style.display = "block";
    displayBinary();
  } else {
    controls.style.display = "none";
  }
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
// random int generator for the binary challenges
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// function to finish the mission and return to the hub after completing the binary challenge

function finishMission2() {
  const binaryMessage = document.getElementById("binary_message");
  const feedback = document.getElementById("word_feedback");
  const input = document.getElementById("binary_input");
  const answerBtn = document.getElementById("answer_btn");
// update the page to show mission complete and disable the inputs
  binaryMessage.innerHTML = `<h3>Mission Complete! Returning to HQ...</h3>`;
  feedback.innerHTML = `<p style="color:green;">Excellent decoding, Agent.</p>`;

  input.disabled = true;
  answerBtn.disabled = true;
  //stores the mission completion status to update the hub and the dialogue 
  localStorage.setItem("mission2Complete", "true");
  localStorage.removeItem("mission2DialogueShown");

  setTimeout(() => {
    window.location.href = "mission_hub.html";
  }, 1500);
}

// funciton to display the next binary question

function displayBinary() {
  if (questionsAnswered >= maxQuestions) {
    finishMission2();
    return;
  }
  // randomly select a binary challenge from the list and display it
  const index = randomInt(0, words.length - 1);
  currentBinaryChallenge = {
    word: words[index],
    binary: binaryValues[index]
  };
  // update the page to show the binary challenge
  document.getElementById("binary_message").innerHTML = `
    <h3>Decode the Binary</h3>
    <p><strong>Binary:</strong> ${currentBinaryChallenge.binary}</p>
  `;
}

// funciton to compare the users input with the correct answer 
function compareBinaryInput() {
  const userInput = document.getElementById("binary_input").value.trim().toUpperCase();
  const feedback = document.getElementById("word_feedback");
  // if answer correct show success move to next question increment the counter
  if (userInput === currentBinaryChallenge.word) {
    feedback.innerHTML = `<p style="color:green;">Correct! The word is ${currentBinaryChallenge.word}</p>`;
    playSound("audio/correct.wav");
    questionsAnswered++;
    document.getElementById("binary_input").value = "";

    setTimeout(displayBinary, 1000);
  } else {
    playSound("audio/incorrect3.wav");
    feedback.innerHTML = `<p style="color:red;">Try again!</p>`;
  }
}

// event listeners for the nav buttons to move between info and question page
document.getElementById("back_btn").addEventListener("click", () => {
  currentIndex = (currentIndex > 0) ? currentIndex - 1 : pages.length - 1;
  updateContent();
});

document.getElementById("forward_btn").addEventListener("click", () => {
  currentIndex = (currentIndex < pages.length - 1) ? currentIndex + 1 : 0;
  updateContent();
});

// event listener for the answer button to check the answer
document
  .getElementById("answer_btn")
  .addEventListener("click", compareBinaryInput);



updateContent();