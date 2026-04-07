function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const randomA = randomInt(20, 70);
const correctValues = {
  A: randomA,
  C: randomA + 15,
  B: randomA + 30
};

const inputs = {
  A: document.getElementById("inputA"),
  B: document.getElementById("inputB"),
  C: document.getElementById("inputC")
};

const valueDisplays = {
  A: document.getElementById("valueA"),
  B: document.getElementById("valueB"),
  C: document.getElementById("valueC")
};

const progressFill = document.getElementById("progressFill");
const launchBtn = document.getElementById("launchBtn");
const report1Text = document.getElementById("report1Text");
const report2Text = document.getElementById("report2Text");
const report3Text = document.getElementById("report3Text");
const launchMessage = document.getElementById("launchMessage");

function setFill(letter) {
  const value = inputs[letter].value;
  const barrel = document.getElementById(`fill${letter}`);

  valueDisplays[letter].textContent = `${value}%`;

  barrel.innerHTML = `<div class="fill-level" style="height: ${value}%;"></div>`;
}

function updateProgress() {
  let score = 0;

  if (parseInt(inputs.A.value) === correctValues.A) score++;
  if (parseInt(inputs.B.value) === correctValues.B) score++;
  if (parseInt(inputs.C.value) === correctValues.C) score++;

  const percentage = (score / 3) * 100;
  progressFill.style.width = percentage + "%";
  progressFill.textContent = `${percentage}%`;

  launchBtn.disabled = score !== 3;
}

function renderReportHints() {
  report1Text.textContent = `Chemical A must be set to ${correctValues.A}%.`;
  report2Text.textContent = "Chemical C is exactly 15% more than Chemical A.";
  report3Text.textContent = "Chemical B is exactly 15% more than Chemical C.";
}

function finishMission4() {
  launchMessage.textContent = "Mission Complete! Satellite launched successfully. Returning to HQ...";
  launchMessage.style.color = "lightgreen";
  launchBtn.disabled = true;

  Object.values(inputs).forEach((input) => {
    input.disabled = true;
  });

  localStorage.setItem("mission4Complete", "true");
  localStorage.removeItem("mission4DialogueShown");

  setTimeout(() => {
    window.location.href = "mission_hub.html";
  }, 1800);
}

Object.keys(inputs).forEach((letter) => {
  inputs[letter].addEventListener("input", () => {
    setFill(letter);
    updateProgress();
  });

  setFill(letter);
});

renderReportHints();
updateProgress();

launchBtn.addEventListener("click", () => {
  finishMission4();
});

document.querySelectorAll(".accordion").forEach((button) => {
  button.addEventListener("click", () => {
    const panel = button.nextElementSibling;
    panel.style.display = panel.style.display === "block" ? "none" : "block";
  });
});