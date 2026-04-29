//track if the charts have been viewed
let barChart1Viewed = false;
let barChart2Viewed = false;

//labels for each bar on the chart
const cities = ["Glasgow", "Edinburgh", "Dundee", "Inverness"];

//different datasets used for the question (randomised each time)
const datasets = [
  { total: [80, 80, 60, 60], encrypted: [20, 36, 18, 15], answer: "edinburgh" },
  { total: [100, 70, 60, 50], encrypted: [20, 28, 30, 10], answer: "dundee" },
  { total: [90, 85, 80, 75], encrypted: [30, 32, 28, 25], answer: "edinburgh" },
  { total: [60, 90, 60, 90], encrypted: [18, 27, 24, 20], answer: "dundee" },
  { total: [70, 70, 70, 70], encrypted: [28, 21, 18, 20], answer: "glasgow" },
  { total: [85, 85, 70, 70], encrypted: [20, 22, 15, 35], answer: "inverness" },
  { total: [100, 80, 60, 50], encrypted: [40, 30, 25, 15], answer: "glasgow" },
  { total: [90, 75, 75, 60], encrypted: [27, 24, 30, 18], answer: "dundee" }
];

//pick a random dataset each time the page loads
const selectedDataset = datasets[Math.floor(Math.random() * datasets.length)];

//store traffic data
const totalTraffic = selectedDataset.total;
const encryptedTraffic = selectedDataset.encrypted;

//store the correct answer globally
window.correctCity = selectedDataset.answer;

//function to play sound effects
function playSound(src) {
  try {
    const audio = new Audio(src);
    audio.volume = 0.5;
    audio.play().catch(() => {});
  } catch (err) {
    console.error("Audio error:", err);
  }
}

//function to finish mission and return to hub
function finishMission7() {
  localStorage.setItem("mission7Complete", "true");
  localStorage.removeItem("mission7DialogueShown");

  setTimeout(() => {
    window.location.href = "mission_hub.html";
  }, 1500);
}

//show both charts side by side
function showCharts() {
  //draw charts using custom chart function
  drawBarChart("canvas1", totalTraffic, cities, "Total Traffic");
  drawBarChart("canvas2", encryptedTraffic, cities, "Encrypted Traffic");

  //mark charts as viewed
  barChart1Viewed = true;
  barChart2Viewed = true;

  //unlock answers
  checkIfUnlocked();
}

//unlocks answer buttons once charts are viewed
function checkIfUnlocked() {
  const message = document.getElementById("lockMessage");

  if (barChart1Viewed && barChart2Viewed) {
    document.querySelectorAll(".answer").forEach(btn => {
      btn.disabled = false;
      btn.classList.add("unlocked");
    });

    message.textContent = "Now choose the city with the highest suspicious encrypted activity.";
  }
}

//Checks if the selected answer is correct
function checkAnswer(selected) {
  const feedback = document.getElementById("feedback");

  if (selected === window.correctCity) {
    feedback.textContent = "Correct! This region shows the highest suspicious encrypted activity.";
    feedback.style.color = "lightgreen";

    playSound("audio/correct.wav");
    finishMission7();
  } else {
    feedback.textContent = "Try again.";
    feedback.style.color = "red";

    playSound("audio/incorrect3.wav");
  }
}