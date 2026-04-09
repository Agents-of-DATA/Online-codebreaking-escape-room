// Creates a random integer between min and max (inclusive).
function randomInt(min, max) {
  // Scale Math.random() to the required range and include both endpoints.
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Randomised puzzle targets generated each time the page is loaded.
const randomA = randomInt(20, 70);
const correctValues = {
  A: randomA,
  C: randomA + 15,
  B: randomA + 30,
};

// Slider inputs for each chemical.
const inputs = {
  A: document.getElementById("inputA"),
  B: document.getElementById("inputB"),
  C: document.getElementById("inputC"),
};

// Text elements that display current slider values in units.
const valueDisplays = {
  A: document.getElementById("valueA"),
  B: document.getElementById("valueB"),
  C: document.getElementById("valueC"),
};

// Progress bar fill, back and launch button elements.
const progressFill = document.getElementById("progressFill");
const launchBtn = document.getElementById("launchBtn");
const backBtn = document.getElementById("backBtn");
const floatingClues = document.getElementById("floatingClues");
const successScreen = document.getElementById("successScreen");
const successHubBtn = document.getElementById("successHubBtn");
const stepButtons = document.querySelectorAll(".slider-step");

// Updates barrel liquid height and units label for a given chemical.
function setFill(letter) {
  // Read current numeric value from the chosen slider.
  const value = inputs[letter].value;
  // Find the visual barrel that matches the same chemical letter.
  const barrel = document.getElementById(`fill${letter}`);

  // Show the current slider value in units.
  valueDisplays[letter].textContent = `${value} units`;

  // Render a fill layer inside the barrel based on the current value.
  // Replacing innerHTML keeps the visual in sync with every slider move.
  barrel.style.setProperty("--fill-height", value + "%");
  barrel.style.position = "relative";
  barrel.innerHTML = `<div style="
        position:absolute;
        bottom:0;
        width:100%;
        height:${value}%;
        background:limegreen;
        transition:height 0.3s;
    "></div>`;
}

// Calculates readiness progress and enables launch only at exact values.
function updateProgress() {
  // Start with no matched chemicals.
  let score = 0;

  // Each chemical contributes one point only when it matches exactly.
  if (parseInt(inputs.A.value) === correctValues.A) score++;
  if (parseInt(inputs.B.value) === correctValues.B) score++;
  if (parseInt(inputs.C.value) === correctValues.C) score++;

  // Convert the number of correct chemicals into a 0-100 progress value.
  const percentage = (score / 3) * 100;
  progressFill.style.width = percentage + "%";

  // Launch is only available once all three chemicals are correct.
  launchBtn.disabled = score !== 3;
}

// Adjust a slider by a small step and keep visuals in sync.
function nudgeSlider(letter, step) {
  // Resolve which slider should be changed from the button metadata.
  const input = inputs[letter];
  if (!input) {
    return;
  }

  // Clamp stepped values so they stay inside the slider range.
  const min = Number(input.min);
  const max = Number(input.max);
  const current = Number(input.value);
  const next = Math.min(max, Math.max(min, current + step));

  // Persist the new value and re-render both barrel and readiness bar.
  input.value = String(next);
  setFill(letter);
  updateProgress();
}

// Creates a floating emoji clue with random screen placement.
function createFloatingClue({ emoji, label, text }) {
  // Build wrapper element that will hold both icon and clue text.
  const item = document.createElement("div");
  item.className = "clue-item";

  let isDragging = false;
  let movedDuringDrag = false;
  let dragOffsetX = 0;
  let dragOffsetY = 0;
  let startPointerX = 0;
  let startPointerY = 0;

  // Build the clickable emoji button used to reveal each clue panel.
  const button = document.createElement("button");
  button.type = "button";
  button.className = "emoji-toggle";
  button.setAttribute("aria-expanded", "false");
  button.setAttribute("aria-label", label);
  button.textContent = emoji;

  // Build the hidden clue panel and fill it with the supplied clue text.
  const panel = document.createElement("div");
  panel.className = "clue-panel";

  const paragraph = document.createElement("p");
  paragraph.textContent = text;

  // Compose the final clue structure before adding event handlers.
  panel.appendChild(paragraph);
  item.appendChild(button);
  item.appendChild(panel);

  button.addEventListener("click", () => {
    // Ignore the click immediately after a drag, so drag does not also toggle.
    if (button.dataset.skipClick === "true") {
      button.dataset.skipClick = "false";
      return;
    }

    const revealed = item.classList.toggle("revealed");
    button.setAttribute("aria-expanded", String(revealed));
  });

  button.addEventListener("pointerdown", (event) => {
    // Capture pointer so dragging continues smoothly even if pointer moves fast.
    isDragging = true;
    movedDuringDrag = false;
    startPointerX = event.clientX;
    startPointerY = event.clientY;

    const currentLeft = parseFloat(item.style.left) || 0;
    const currentTop = parseFloat(item.style.top) || 0;
    // Store pointer offset so element movement follows the grab point.
    dragOffsetX = event.clientX - currentLeft;
    dragOffsetY = event.clientY - currentTop;

    item.classList.add("dragging");
    button.setPointerCapture(event.pointerId);
  });

  button.addEventListener("pointermove", (event) => {
    if (!isDragging) {
      return;
    }

    let nextLeft = event.clientX - dragOffsetX;
    let nextTop = event.clientY - dragOffsetY;

    // Keep clues on screen by clamping movement to viewport edges.
    const edgePadding = 36;
    nextLeft = Math.min(
      Math.max(nextLeft, edgePadding),
      window.innerWidth - edgePadding,
    );
    nextTop = Math.min(
      Math.max(nextTop, edgePadding),
      window.innerHeight - edgePadding,
    );

    if (
      Math.abs(event.clientX - startPointerX) > 4 ||
      Math.abs(event.clientY - startPointerY) > 4
    ) {
      // Mark as a drag once movement passes a tiny threshold.
      movedDuringDrag = true;
    }

    item.style.left = `${nextLeft}px`;
    item.style.top = `${nextTop}px`;
  });

  button.addEventListener("pointerup", (event) => {
    if (!isDragging) {
      return;
    }

    isDragging = false;
    item.classList.remove("dragging");
    button.releasePointerCapture(event.pointerId);

    // Mark this interaction as drag so the next click is skipped once.
    if (movedDuringDrag) {
      button.dataset.skipClick = "true";
    }
  });

  button.addEventListener("pointercancel", (event) => {
    // Reset drag state safely if the browser cancels pointer tracking.
    isDragging = false;
    item.classList.remove("dragging");

    if (button.hasPointerCapture(event.pointerId)) {
      button.releasePointerCapture(event.pointerId);
    }
  });

  floatingClues.appendChild(item);

  // Start each clue at a random position so reports are scattered each game.
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const x = randomInt(10, 90);
  const y = randomInt(18, 84);

  item.style.left = `${(viewportWidth * x) / 100}px`;
  item.style.top = `${(viewportHeight * y) / 100}px`;
}

// Writes puzzle hints and decoy clues into floating emoji buttons.
function renderFloatingClues() {
  if (!floatingClues) {
    // Exit safely when the clues container is not present in the DOM.
    return;
  }

  // Clear old clues before creating a fresh randomised set.
  floatingClues.innerHTML = "";

  const clues = [
    {
      emoji: "🛰️",
      label: "Data Report 1",
      text: `Chemical A must be set to ${correctValues.A} units.`,
    },
    {
      emoji: "📡",
      label: "Data Report 2",
      text: "Chemical C is exactly 15 units more than Chemical A.",
    },
    {
      emoji: "🚀",
      label: "Data Report 3",
      text: "Chemical B is exactly 15 units more than Chemical C.",
    },
    {
      emoji: "🧪",
      label: "Decoy report: sample drift",
      text: "Temperature readings suggest no change to the chemical targets.",
    },
    {
      emoji: "🔭",
      label: "Decoy report: telescope log",
      text: "Orbital alignment looks impressive but does not affect the fuel mix.",
    },
    {
      emoji: "📘",
      label: "Decoy report: handbook note",
      text: "The blue manual is only a reference and has no clue about the chemical levels.",
    },
  ];

  // Shuffle clue order so the true reports are not always in the same places.
  clues.sort(() => Math.random() - 0.5).forEach(createFloatingClue);
}

// Listen to slider movement for all chemicals and update UI live.
Object.keys(inputs).forEach((letter) => {
  inputs[letter].addEventListener("input", () => {
    // Keep this chemical's barrel and global readiness in sync on drag.
    setFill(letter);
    updateProgress();
  });

  // Initialise each barrel/label display on page load.
  setFill(letter);
});

stepButtons.forEach((button) => {
  // Allow + and - buttons to change slider values precisely.
  button.addEventListener("click", () => {
    const letter = button.dataset.letter;
    const step = Number(button.dataset.step || 0);

    if (!letter || Number.isNaN(step)) {
      return;
    }

    nudgeSlider(letter, step);
  });
});

// Initialise progress bar, launch button state, and floating clues on page load.
renderFloatingClues();
updateProgress();

// Show the success modal when all values are correct and launch is pressed.
launchBtn.addEventListener("click", () => {
  localStorage.setItem("mission4Complete", "true");
  localStorage.removeItem("mission4DialogueShown");

  successScreen?.removeAttribute("hidden");

  setTimeout(() => {
    window.location.href = "mission_hub.html";
  }, 1800);
});

// Return to mission hub.
backBtn?.addEventListener("click", () => {
  window.location.href = "mission_hub.html";
});

// Return to mission hub from success screen.
successHubBtn?.addEventListener("click", () => {
  window.location.href = "mission_hub.html";
});