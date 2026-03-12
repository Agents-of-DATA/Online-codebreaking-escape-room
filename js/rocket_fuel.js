// Creates a random integer between min and max (inclusive).
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Randomised puzzle targets generated each time the page is loaded.
const randomA = randomInt(20, 70);
const correctValues = {
    A: randomA,
    C: randomA + 15,
    B: randomA + 30
};

// Slider inputs for each chemical.
const inputs = {
    A: document.getElementById("inputA"),
    B: document.getElementById("inputB"),
    C: document.getElementById("inputC")
};

// Text elements that display current slider percentages.
const valueDisplays = {
    A: document.getElementById("valueA"),
    B: document.getElementById("valueB"),
    C: document.getElementById("valueC")
};

// Progress bar fill, back and launch button elements.
const progressFill = document.getElementById("progressFill");
const launchBtn = document.getElementById("launchBtn");
const backBtn = document.getElementById("backBtn");
const report1Text = document.getElementById("report1Text");
const report2Text = document.getElementById("report2Text");
const report3Text = document.getElementById("report3Text");

// // Update barrel visuals
// function updateBarrel(letter) {
//     const value = inputs[letter].value;
//     const fill = document.querySelector(`#fill${letter}::after`);
// }

// Updates barrel liquid height and percentage label for a given chemical.
function setFill(letter) {
    const value = inputs[letter].value;
    const barrel = document.getElementById(`fill${letter}`);

    // Show the current slider value as a percentage.
    valueDisplays[letter].textContent = `${value}%`;

    // Render a fill layer inside the barrel based on the current value.
    barrel.style.setProperty('--fill-height', value + "%");
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
    let score = 0;

    if (parseInt(inputs.A.value) === correctValues.A) score++;
    if (parseInt(inputs.B.value) === correctValues.B) score++;
    if (parseInt(inputs.C.value) === correctValues.C) score++;

    const percentage = (score / 3) * 100;
    progressFill.style.width = percentage + "%";

    launchBtn.disabled = score !== 3;
}

// Writes puzzle hints so reports 2 and 3 can be calculated from A.
function renderReportHints() {
    report1Text.textContent = `Chemical A must be set to ${correctValues.A}%.`;
    report2Text.textContent = "Chemical C is exactly 15% more than Chemical A.";
    report3Text.textContent = "Chemical B is exactly 15% more than Chemical C.";
}

// Listen to slider movement for all chemicals and update UI live.
Object.keys(inputs).forEach(letter => {
    inputs[letter].addEventListener("input", () => {
        setFill(letter);
        updateProgress();
    });

    // Initialize each barrel/label display on page load.
    setFill(letter);
});

// Initialize progress bar and launch button state on page load.
renderReportHints();
updateProgress();

// Launch button
launchBtn.addEventListener("click", () => {
    alert("Satellite Successfully Launched!");
});

// Return to mission hub.
backBtn?.addEventListener("click", () => {
    window.location.href = "mission_hub.html";
});

// Toggle visibility of each data report panel.
document.querySelectorAll(".accordion").forEach(button => {
    button.addEventListener("click", () => {
        const panel = button.nextElementSibling;
        panel.style.display =
            panel.style.display === "block" ? "none" : "block";
    });
});