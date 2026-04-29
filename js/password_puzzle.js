// Password groups sorted by difficulty
const passwords = {
  weak: ['123456', 'letmein', '0000', '1111', 'password', 'qwerty', 'admin', 'welcome', 'login', 'monkey'],
  medium: ['Summer2024', 'Dog12345!', 'Soccer99!', 'Jack123', 'BlueSky1', 'Happy12', 'Star123', 'London2023', 'Pizza88', 'School1'],
  strong: ['MyC@t1sBlue!', 'T!ger7Moon', 'F!sh&Chips9', 'R0ck$tar88', 'B@nana42Sky', 'Z3bra_Light', 'P!zza#Planet7', 'G@meOn2025!', 'Tr33HousE$', 'C@tRun5Fast', 'Sp@ce#Walk9'],
  veryStrong: ['Purple!Dragon$Jumps42', 'mCiCb1McIcB!', 'Rocket$FlyOverBlueOcean99', 'MyDogEatsPizza@Midnight7', '7Sunsets&3Mountains!', 'IceCream!DancesWithStars42', 'Galaxy#BearsRunFast2026', 'MoonLight$ShinesBright88', 'Pirates!HideTreasure@Sea9', 'SuperNova!Explodes#2025', 'FlyingCats$LoveRainbows77']
};

// Pick a random item from a list
const usedPasswords = new Set();

function getRandomItem(array) {
  const available = array.filter(item => !usedPasswords.has(item));

  const source = available.length > 0 ? available : array;
  const choice = source[Math.floor(Math.random() * source.length)];

  usedPasswords.add(choice);
  return choice;
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
// Get one password from each level and mix them up
function getPuzzleSetByLevels() {
  return [
    getRandomItem(passwords.weak),
    getRandomItem(passwords.medium),
    getRandomItem(passwords.strong),
    getRandomItem(passwords.veryStrong)
  ].sort(() => 0.5 - Math.random()); // shuffle order
}

// Store current passwords shown
let puzzlePasswords = [];

// Count how many correct answers the user has
let puzzleProgress = 0;

// Number needed to finish the puzzle
const requiredRounds = 3;

// Only very strong passwords are correct
const correctPasswords = passwords.veryStrong;

// Show the starter puzzle on the screen
function renderPuzzle() {
  puzzlePasswords = getPuzzleSetByLevels();

  const puzzleContainer = document.getElementById("password-selection");

  let html = `
    <h3>Starter Puzzle</h3>
    <p>Select the strongest password:</p>
  `;

  // Make a button for each password
  puzzlePasswords.forEach((pw) => {
    html += `<button onclick='checkPuzzle(${JSON.stringify(pw)})'>${pw}</button>`;
  });

  // Area to show messages
  html += `<p id="puzzleResult"></p>`;

  puzzleContainer.innerHTML = html;
}

// Check if the user picked the correct password
function checkPuzzle(selectedPassword) {
  const result = document.getElementById("puzzleResult");

  // If it is a very strong password
  if (correctPasswords.includes(selectedPassword)) {
    puzzleProgress++;

    result.textContent = `Correct! (${puzzleProgress}/${requiredRounds})`;
    result.style.color = "lightgreen";
    playSound("audio/correct.wav");

    // If finished all rounds
    if (puzzleProgress >= requiredRounds) {
      finishStarterPuzzle();
    } else {
      // Show a new set of passwords
      setTimeout(renderPuzzle, 1000);
    }

  } else {
    // Wrong answer
    result.textContent = "Incorrect. Try again.";
    result.style.color = "red";
    playSound("audio/incorrect3.wav");
  }
}

// What happens when the starter puzzle is finished
function finishStarterPuzzle() {
  setTimeout(() => {
    const result = document.getElementById("puzzleResult");

    result.textContent = "Starter puzzle complete! Now create a secure password.";
    result.style.color = "lightgreen";

    // Move to next section
    setTimeout(goToPasswordCreation, 1200);
  }, 800);
}

// Hide puzzle and show password creator
function goToPasswordCreation() {
  const selection = document.getElementById("password-selection");
  const creation = document.getElementById("password-creation");

  // Fade out old section
  selection.classList.add("fade-out");

  setTimeout(() => {
    selection.style.display = "none";

    // Show new section
    creation.style.display = "block";
    creation.classList.add("fade-in");

    setTimeout(() => {
      creation.classList.add("active");
    }, 50);

  }, 500);
}

// Check how strong the password is
function getPasswordStrength(password) {
  let strength = 0;

  // Check each rule
  const hasLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[£€+=~±§!@#$%^&*(),.?":{}|<>]/.test(password);

  // Add 1 point for each rule passed
  if (hasLength) strength++;
  if (hasUpper) strength++;
  if (hasLower) strength++;
  if (hasNumber) strength++;
  if (hasSpecial) strength++;

  return {
    strength,
    hasLength,
    hasUpper,
    hasLower,
    hasNumber,
    hasSpecial
  };
}

// Run when user clicks "Test Password"
function testPassword() {
  const password = document.getElementById("password").value;
  const result = getPasswordStrength(password);

  // Get each rule on screen
  const reqLength = document.getElementById("reqLength");
  const reqUpper = document.getElementById("reqUpper");
  const reqLower = document.getElementById("reqLower");
  const reqNumber = document.getElementById("reqNumber");
  const reqSpecial = document.getElementById("reqSpecial");

  // Show if each rule is passed or not
  reqLength.className = result.hasLength ? "valid" : "invalid";
  reqUpper.className = result.hasUpper ? "valid" : "invalid";
  reqLower.className = result.hasLower ? "valid" : "invalid";
  reqNumber.className = result.hasNumber ? "valid" : "invalid";
  reqSpecial.className = result.hasSpecial ? "valid" : "invalid";

  // Update strength bar
  updateStrengthBar(result.strength);

  // If all rules are passed
  if (result.strength === 5) {
    playSound("audio/correct.mp4");
    finishMission6();
  }
}

// Update the strength bar
function updateStrengthBar(strength) {
  const percent = (strength / 5) * 100;
  const fill = document.getElementById("strengthFill");

  fill.style.width = percent + "%";
  fill.textContent = Math.round(percent) + "%";

  // Change colour
  if (percent <= 40) {
    fill.style.background = "red";
  } else if (percent <= 80) {
    fill.style.background = "orange";
  } else {
    fill.style.background = "green";
  }
}

// Finish the mission
function finishMission6() {
  const creation = document.getElementById("password-creation");

  creation.innerHTML = `
    <h3>Mission Complete! Returning to HQ...</h3>
    <p style="color: lightgreen; margin-top: 10px;">
      Excellent work, Agent. The firewall is now protected.
    </p>
  `;

  // Save progress
  localStorage.setItem("mission6Complete", "true");
  localStorage.removeItem("mission6DialogueShown");

  // Go back to hub
  setTimeout(() => {
    window.location.href = "mission_hub.html";
  }, 1500);
}

// Clear input box
function clearPassword() {
  document.getElementById("password").value = "";
  testPassword();
}

// Start puzzle when page loads
window.onload = function () {
  renderPuzzle();
};