const passwords = {
    weak: ['123456', 'letmein', '0000', '1111', 'password', 'qwerty', 'admin', 'welcome', 'login', 'monkey'],
    medium: ['Summer2024', 'Dog12345!', 'Soccer99!', 'Jack123', 'BlueSky1', 'Happy12', 'Star123', 'London2023', 'Pizza88', 'School1'],
    strong: ['MyC@t1sBlue!', 'T!ger7Moon', 'F!sh&Chips9', 'R0ck$tar88', 'B@nana42Sky', 'Z3bra_Light', 'P!zza#Planet7', 'G@meOn2025!', 'Tr33HousE$', 'C@tRun5Fast', 'Sp@ce#Walk9'],
    veryStrong: ['Purple!Dragon$Jumps42', 'mCiCb1McIcB!', 'Rocket$FlyOverBlueOcean99', 'MyDogEatsPizza@Midnight7', '7Sunsets&3Mountains!', 'IceCream!DancesWithStars42', 'Galaxy#BearsRunFast2026', 'MoonLight$ShinesBright88', 'Pirates!HideTreasure@Sea9', 'SuperNova!Explodes#2025', 'FlyingCats$LoveRainbows77']
};

function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function getPuzzleSetByLevels() {
    return [
        getRandomItem(passwords.weak),
        getRandomItem(passwords.medium),
        getRandomItem(passwords.strong),
        getRandomItem(passwords.veryStrong)
    ].sort(() => 0.5 - Math.random()); 
}

let puzzlePasswords = [];

function renderPuzzle() {
    puzzlePasswords = getPuzzleSetByLevels();
  
    const puzzleContainer = document.getElementById('password-selection');
  
    let html = `
      <h3>Starter Puzzle</h3>
      <p>Select the strongest password:</p>
    `;
  
    puzzlePasswords.forEach(pw => {
        html += `<button onclick='checkPuzzle(${JSON.stringify(pw)})'>${pw}</button>`;
    });
  
    html += `<p id="puzzleResult"></p>`;
  
    puzzleContainer.innerHTML = html;
}

let puzzleProgress = 0;
const requiredRounds = 3;
const correctPasswords = passwords.veryStrong;

function checkPuzzle(selectedPassword) {
    const result = document.getElementById('puzzleResult');

    if (correctPasswords.includes(selectedPassword)) {
        puzzleProgress++;

        result.textContent = `Correct! (${puzzleProgress}/${requiredRounds})`;
        result.style.color = "lightgreen";

        if (puzzleProgress >= requiredRounds) {
            finishMission();
        } else {
            setTimeout(renderPuzzle, 1000);
        }

    } else {
        result.textContent = "Incorrect. Try again.";
        result.style.color = "red";
    }
}

function finishMission() {
    setTimeout(() => {
        const result = document.getElementById('puzzleResult');
        result.textContent = "Mission Complete! System unlocked.";
        result.style.color = "lightgreen";
    
        setTimeout(() => {
            goToPasswordCreation();
        }, 1200);
    }, 800);
}

function goToPasswordCreation() {
    const selection = document.getElementById('password-selection');
    const creation = document.getElementById('password-creation');
    
    selection.classList.add('fade-out');
    
    setTimeout(() => {
        selection.style.display = 'none';
    
        creation.style.display = 'block';
        creation.classList.add('fade-in');
    
        setTimeout(() => {
            creation.classList.add('active');
        }, 50);
    }, 500);
}

function testPassword() {
    const password = document.getElementById('password').value;

    const reqLength = document.getElementById('reqLength');
    const reqUpper = document.getElementById('reqUpper');
    const reqLower = document.getElementById('reqLower');
    const reqNumber = document.getElementById('reqNumber');
    const reqSpecial = document.getElementById('reqSpecial');

    reqLength.className = password.length >= 8 ? 'valid' : 'invalid';
    reqUpper.className = /[A-Z]/.test(password) ? 'valid' : 'invalid';
    reqLower.className = /[a-z]/.test(password) ? 'valid' : 'invalid';
    reqNumber.className = /[0-9]/.test(password) ? 'valid' : 'invalid';
    reqSpecial.className = /[£€+=~±§!@#$%^&*(),.?":{}|<>]/.test(password) ? 'valid' : 'invalid';

    let strength = 0;

    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;

    updateStrengthBar(strength);
}

function updateStrengthBar(strength) {
    const percent = (strength / 5) * 100;
    const fill = document.getElementById('strengthFill');

    fill.style.width = percent + '%';
    fill.textContent = Math.round(percent) + '%';

    if (percent <= 40) {
        fill.style.background = 'red';
    } else if (percent <= 80) {
        fill.style.background = 'orange';
    } else {
        fill.style.background = 'green';
    }
}
  
function clearPassword() {
    document.getElementById('password').value = '';
    testPassword();
}

window.onload = function () {
    renderPuzzle();
};