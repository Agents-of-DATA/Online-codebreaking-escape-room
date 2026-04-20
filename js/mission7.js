// Get canvas elements from the page
const ctx = document.getElementById("canvas1");
const cty = document.getElementById("canvas2");

// Track if the charts have been clicked on
let barChart1Viewed = false;
let barChart2Viewed = false;

// City labels for charts
const cities = ["Glasgow", "Edinburgh", "Dundee", "Inverness"];

// Groups of datasets that can be used for the question
const datasets = [
  {
    total: [80, 80, 60, 60],
    encrypted: [20, 36, 18, 15],
    answer: "edinburgh"
  },
  {
    total: [100, 70, 60, 50],
    encrypted: [20, 28, 30, 10],
    answer: "dundee"
  },
  {
    total: [90, 85, 80, 75],
    encrypted: [30, 32, 28, 25],
    answer: "edinburgh"
  },
  {
    total: [60, 90, 60, 90],
    encrypted: [18, 27, 24, 20],
    answer: "dundee"
  },
  {
    total: [70, 70, 70, 70],
    encrypted: [28, 21, 18, 20],
    answer: "glasgow"
  },
  {
    total: [85, 85, 70, 70],
    encrypted: [20, 22, 15, 35],
    answer: "inverness"
  },
  {
    total: [100, 80, 60, 50],
    encrypted: [40, 30, 25, 15],
    answer: "glasgow"
  },
  {
    total: [90, 75, 75, 60],
    encrypted: [27, 24, 30, 18],
    answer: "dundee"
  }
];

// Pick a random dataset
const selectedDataset = datasets[Math.floor(Math.random() * datasets.length)];

// Store selected data
const totalTraffic = selectedDataset.total;
const encryptedTraffic = selectedDataset.encrypted;

// Store correct answer
window.correctCity = selectedDataset.answer;

// Create first chart (total traffic)
const myChart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: cities,
    datasets: [
      {
        label: "Total Traffic",
        data: totalTraffic,
        backgroundColor: ["#F7464A", "#46BFBD", "#FDB45C", "#949FB1"]
      }
    ]
  }
});

// Create second bar chart (encrypted data)
const myChart1 = new Chart(cty, {
  type: "bar",
  data: {
    labels: cities,
    datasets: [
      {
        label: "Encrypted Traffic",
        data: encryptedTraffic,
        backgroundColor: ["#F7464A", "#46BFBD", "#FDB45C", "#949FB1"]
      }
    ]
  }
});

// function to play sound effects for correct and incorrect answers
function playSound(src) {
  try {
    const audio = new Audio(src);
    audio.volume = 0.5;
    audio.play().catch(err => console.warn("Audio play failed:", err));
  } catch (err) {
    console.error("Error creating audio:", err);
  }
}

// Finish mission 7 and return to hub
function finishMission7() {
  localStorage.setItem("mission7Complete", "true");
  localStorage.removeItem("mission7DialogueShown");

  setTimeout(() => {
    window.location.href = "mission_hub.html";
  }, 1500);
}

// Show first chart popup
function showBarChart1() {
  document.getElementById("chartPopup").style.display = "block";
  document.getElementById("canvas1").style.display = "block";
  document.getElementById("canvas2").style.display = "none";

  drawBarChart("canvas1", totalTraffic, "Total Traffic");

  barChart1Viewed = true;
  checkIfUnlocked();
}

// Show second chart popup
function showBarChart2() {
  document.getElementById("chartPopup").style.display = "block";
  document.getElementById("canvas1").style.display = "none";
  document.getElementById("canvas2").style.display = "block";

  drawBarChart("canvas2", encryptedTraffic, "Encrypted Traffic");

  barChart2Viewed = true;
  checkIfUnlocked();
}

// Close the chart popup
function closeChart() {
  document.getElementById("chartPopup").style.display = "none";
}

// Check if both the charts have been clicked on
function checkIfUnlocked() {
  const message = document.getElementById("lockMessage");

  if (barChart1Viewed && barChart2Viewed) {
    document.querySelectorAll(".answer").forEach(btn => {
      btn.disabled = false;
      btn.classList.add("unlocked");
    });
    message.textContent = "";
  } else if (barChart1Viewed || barChart2Viewed) {
    message.textContent = "View the other chart to continue";
  }
}

// Check if the user has selected the correct answer
function checkAnswer(selected) {
  const feedback = document.getElementById("feedback");

  if (selected === window.correctCity) {
    feedback.textContent = "Correct! This region shows the highest suspicious encrypted activity.";
    feedback.style.color = "green";
    playSound("audio/correct.wav");
    finishMission7();
  } else {
    feedback.textContent = "Try again.";
    feedback.style.color = "red";
    playSound("audio/incorrect3.wav");
  }
}