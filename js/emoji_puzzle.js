const levels = [
    {
      // EASY (lots of clues)
      puzzle: "🐵🍎🍎🌳   🐵🍎",
      clues: ["🐵 = M", "🍎 = E", "🌳 = T"],
      answer: "MEET ME"
    },
    {
      // MEDIUM (fewer clues)
      puzzle: "🐸🍦⚡⚡🐶   🎉🐶🌟🌟",
      clues: ["🐸 = P", "⚡ = Z"],
      answer: "PIZZA PARTY"
    },
    {
      // HARD (minimal clues)
      puzzle: "🦊🌙🔥   🌙🍎🔥🔥",
      clues: ["🌙 = N"],
      answer: "FUN NIGHT"
    }
  ];

let currentLevel = 0;

function loadLevel() {
  const level = levels[currentLevel];

  document.getElementById("levelTitle").textContent = "Level " + (currentLevel + 1);
  document.getElementById("puzzle").textContent = level.puzzle;
  document.getElementById("clues").innerHTML =
    level.clues.map(c => `<p>${c}</p>`).join("");

  document.getElementById("answerInput").value = "";
  document.getElementById("result").textContent = "";
}

function checkAnswer() {
  const userAnswer = document.getElementById("answerInput").value.trim().toUpperCase();
  const correctAnswer = levels[currentLevel].answer;

  if (userAnswer === correctAnswer) {
    if (currentLevel < levels.length - 1) {
      document.getElementById("result").textContent = "Correct! Next level...";
      document.getElementById("result").style.color = "green";
      currentLevel++;
      setTimeout(loadLevel, 1000);
    } else {
      document.getElementById("result").textContent = "You completed all levels!";
      document.getElementById("result").style.color = "blue";
    }
  } else {
    document.getElementById("result").textContent = "Try again!";
    document.getElementById("result").style.color = "red";
  }
}

// Start game
loadLevel();