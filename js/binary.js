// funciton to generate a random 4-bit binary number (limited to 0–9 only)
function generateBinaryChallenge() {
  const value = Math.floor(Math.random() * 10); // random number between 0–9 only
  const binary = value.toString(2).padStart(4, "0"); // convert to 4-bit binary

  return {
    binary: binary,
    answer: value.toString()
  };
}

// declaring the intro binary number (random each time)
let introChallenge = generateBinaryChallenge();

// declaring the 4 digit access code challenge (random each time)
let codeChallenge = [];

// funciton to generate a new 4 digit code challenge
function generateCodeChallenge() {
  codeChallenge = [];

  // generate 4 random binary numbers (each will be 0–9)
  for (let i = 0; i < 4; i++) {
    codeChallenge.push(generateBinaryChallenge());
  }
}

// declaration of variables to keep track of the current stage
let currentStage = "intro";

// generate the first 4 digit access code
generateCodeChallenge();

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

// function to finish the mission and return to the hub after completing the challenge
function finishMission2() {
  const binaryMessage = document.getElementById("binary_message");
  const feedback = document.getElementById("word_feedback");
  const input = document.getElementById("binary_input");
  const answerBtn = document.getElementById("answer_btn");

  // update the page to show mission complete and disable the inputs
  binaryMessage.innerHTML = `<h3>Access Granted! Returning to HQ...</h3>`;
  feedback.innerHTML = `<p style="color:green;">System unlocked. Excellent work, Agent.</p>`;

  input.disabled = true;
  answerBtn.disabled = true;

  // stores the mission completion status to update the hub and the dialogue
  localStorage.setItem("mission2Complete", "true");
  localStorage.removeItem("mission2DialogueShown");

  setTimeout(() => {
    window.location.href = "mission_hub.html";
  }, 1500);
}

// funciton to display the current binary challenge
function displayBinary() {
  const binaryMessage = document.getElementById("binary_message");
  const feedback = document.getElementById("word_feedback");
  const input = document.getElementById("binary_input");

  feedback.innerHTML = "";
  input.value = "";

  // show the training binary number first
  if (currentStage === "intro") {
    binaryMessage.innerHTML = `
      <h2>Binary Decoder Challenge</h2>
      <p>This mission uses binary numbers to unlock a secure system.</p>
      <p>The binary places are worth <strong>8, 4, 2, and 1</strong>.</p>
      <p>A <strong>1</strong> means use that value. A <strong>0</strong> means ignore that value.</p>

      <h3>Training Round</h3>
      <p>Decode this binary number before accessing the terminal.</p>
      <p><strong>Binary Code:</strong> ${introChallenge.binary}</p>
      <p>Enter the decimal number.</p>
    `;
  }

  // show the 4 digit access code challenge
  if (currentStage === "code") {
    binaryMessage.innerHTML = `
      <h2>Access Terminal</h2>
      <h3>Crack the 4-Digit Access Code</h3>
      <p>Each binary number below reveals one digit of the access code.</p>

      <p><strong>${codeChallenge[0].binary}</strong></p>
      <p><strong>${codeChallenge[1].binary}</strong></p>
      <p><strong>${codeChallenge[2].binary}</strong></p>
      <p><strong>${codeChallenge[3].binary}</strong></p>

      <p>Enter the full 4-digit access code.</p>
    `;
  }
}

// funciton to compare the users input with the correct answer
function compareBinaryInput() {
  const userInput = document.getElementById("binary_input").value.trim();
  const feedback = document.getElementById("word_feedback");
  const input = document.getElementById("binary_input");

  // check the training round answer first
  if (currentStage === "intro") {
    if (userInput === introChallenge.answer) {
      feedback.innerHTML = `<p style="color:green;">Correct! ${introChallenge.binary} equals ${introChallenge.answer}</p>`;
      playSound("audio/correct.wav");

      // move to the access code stage after the training round is complete
      currentStage = "code";
      input.value = "";

      setTimeout(displayBinary, 1000);
    } else {
      playSound("audio/incorrect3.wav");
      feedback.innerHTML = `<p style="color:red;">Try again!</p>`;
    }

    return;
  }

  // check the final 4 digit access code
  if (currentStage === "code") {
    const correctCode = codeChallenge.map(item => item.answer).join("");

    if (userInput === correctCode) {
      feedback.innerHTML = `<p style="color:green;">Access Granted! The code was ${correctCode}</p>`;
      playSound("audio/correct.wav");

      setTimeout(finishMission2, 1000);
    } else {
      playSound("audio/incorrect3.wav");
      feedback.innerHTML = `<p style="color:red;">Access Denied. Re-check your binary conversions.</p>`;
    }
  }
}

// event listener for the answer button to check the answer
document
  .getElementById("answer_btn")
  .addEventListener("click", compareBinaryInput);

// initialise the binary challenge page
displayBinary();