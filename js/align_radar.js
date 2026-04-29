// ── Helper ────────────────────────────────────────────────────
/** Returns a random whole number between min and max (inclusive). */
function randomInt(min, max) {
  // Scale random decimal to an integer range that includes min and max.
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ── Puzzle Data ───────────────────────────────────────────────
/*
 * Speed table — each row maps an orbital speed to:
 *   offset : how many extra degrees the radar must lead the satellite
 *   code   : the frequency code the student must select
 *
 * The student reads the satellite speed from Report 2, looks it up here
 * in Report 3, then uses: Radar Angle = Satellite Position + Offset
 */
var SPEED_TABLE = [
  { speed: 7, offset: 3, code: "A" },
  { speed: 8, offset: 5, code: "B" },
  { speed: 9, offset: 7, code: "C" },
];

/*
 * Possible satellite positions (degrees from horizontal).
 * 0° = east of Earth · 90° = directly overhead · 180° = west.
 * The range 40–130° keeps the satellite visible in the diagram.
 */
var SAT_POSITIONS = [
  40, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 120, 130,
];

// Pick random values each page load — produces 48 different combinations.
var satelliteAngle = SAT_POSITIONS[randomInt(0, SAT_POSITIONS.length - 1)];
var chosenSpeed = SPEED_TABLE[randomInt(0, SPEED_TABLE.length - 1)];

// The one correct radar angle the student must find.
var correctAngle = satelliteAngle + chosenSpeed.offset;
var correctCode = chosenSpeed.code;

// ── Scene Layout Constants ────────────────────────────────────
/*
 * These values describe the fixed 560 × 320 px .space-scene div.
 * EARTH_X / EARTH_Y  — must match `left` / `top` of .earth in align_radar.css.
 * ORBIT_R            — must match the orbit-path circle size in align_radar.css.
 */
var EARTH_X = 280; // Earth centre X (pixels)
var EARTH_Y = 270; // Earth centre Y (pixels)
var ORBIT_R = 200; // Orbit radius   (pixels)
var ARM_LEN = 70; // Orange radar arm length (pixels)

// ── DOM References ────────────────────────────────────────────
var angleInput = document.getElementById("angleInput");
var angleMinusBtn = document.getElementById("angleMinusBtn");
var anglePlusBtn = document.getElementById("anglePlusBtn");
var angleDisplay = document.getElementById("angleDisplay");
var freqSelect = document.getElementById("freqSelect");
var progressFill = document.getElementById("progressFill");
var statusMsg = document.getElementById("statusMsg");
var contactBtn = document.getElementById("contactBtn");
var satelliteEl = document.getElementById("satellite");
var beamEl = document.getElementById("beam");
var radarArmEl = document.getElementById("radarArm");

// ── Satellite Placement ───────────────────────────────────────
/*
 * Places the satellite emoji on the orbit arc using basic trigonometry.
 * cos(angle) gives the horizontal offset, sin(angle) gives vertical.
 * The minus on sin is needed because CSS Y increases downward.
 */
function placeSatellite() {
  // Convert from degrees to radians before using trig functions.
  var rad = (satelliteAngle * Math.PI) / 180;

  // Position the emoji on the orbit using polar-to-cartesian conversion.
  satelliteEl.style.left = EARTH_X + ORBIT_R * Math.cos(rad) + "px";
  satelliteEl.style.top = EARTH_Y - ORBIT_R * Math.sin(rad) + "px";
}

// ── Radar Visual ──────────────────────────────────────────────
/*
 * Rotates the beam and the radar arm so they point from Earth
 * toward the chosen angle.  The angle is negated because a positive
 * maths angle goes anti-clockwise, but CSS rotate goes clockwise.
 *
 * transform-origin: 0 50%  →  rotation pivots at the left edge
 *                               of the element, which sits at Earth centre.
 */
function updateRadarVisual(angle) {
  // Negative rotation aligns CSS direction with puzzle angle direction.
  var rotation = "rotate(" + -angle + "deg)";

  // Anchor and rotate the yellow beam from Earth's centre.
  beamEl.style.left = EARTH_X + "px";
  beamEl.style.top = EARTH_Y + "px";
  beamEl.style.width = ORBIT_R + "px";
  beamEl.style.transform = rotation;

  // Anchor and rotate the short radar arm with the same angle.
  radarArmEl.style.left = EARTH_X + "px";
  radarArmEl.style.top = EARTH_Y + "px";
  radarArmEl.style.width = ARM_LEN + "px";
  radarArmEl.style.transform = rotation;
}

// ── Answer Check ──────────────────────────────────────────────
/*
 * Reads the current slider and dropdown values, updates the
 * progress bar colour, status text, satellite glow, and the
 * contact button state.
 */
function updateState() {
  // Read current user selections from slider and dropdown.
  var angle = parseInt(angleInput.value);
  var code = freqSelect.value;

  // Reflect current angle text and rotate visuals immediately.
  angleDisplay.textContent = angle + "°";
  updateRadarVisual(angle);

  // Evaluate each part of the answer independently.
  var angleOk = angle === correctAngle;
  var codeOk = code === correctCode;
  var score = (angleOk ? 1 : 0) + (codeOk ? 1 : 0);

  // Update progress bar width and colour.
  progressFill.style.width = (score / 2) * 100 + "%";

  if (score === 2) {
    // Full match: show success state and enable final button.
    progressFill.style.background = "#4ade80";
    statusMsg.textContent =
      "✅ Perfect alignment! Signal locked on to the satellite!";
    satelliteEl.classList.add("locked");
    beamEl.classList.add("locked");
    contactBtn.disabled = false;
  } else {
    // Any mismatch keeps the button disabled and removes lock visuals.
    satelliteEl.classList.remove("locked");
    beamEl.classList.remove("locked");
    contactBtn.disabled = true;

    if (score === 1) {
      // Half-correct: keep the hint specific to what is still wrong.
      progressFill.style.background = "#f97316";
      if (angleOk) {
        // Angle is done; prompt user to focus on code selection.
        statusMsg.textContent =
          "📐 Angle is correct! Double-check the frequency code.";
      } else {
        // Code is done; prompt user to focus on aiming angle.
        statusMsg.textContent =
          "📻 Frequency code confirmed! Adjust the radar angle.";
      }
    } else {
      // Nothing correct yet: show the default retry guidance.
      progressFill.style.background = "#ef4444";
      statusMsg.textContent =
        "📡 No signal detected. Adjust the angle and frequency code.";
    }
  }
}

function stepAngle(delta) {
  // Keep manual button steps within the slider's allowed range.
  var min = parseInt(angleInput.min);
  var max = parseInt(angleInput.max);
  var next = parseInt(angleInput.value) + delta;

  if (next < min) {
    // Prevent moving below the configured lower bound.
    next = min;
  }
  if (next > max) {
    // Prevent moving above the configured upper bound.
    next = max;
  }

  // Write back the clamped value, then refresh puzzle state.
  angleInput.value = String(next);
  updateState();
}

// ── Data Report Content ───────────────────────────────────────
/*
 * Fills the three accordion panels with puzzle-specific data.
 * Reports 1 and 2 give the clues; Report 3 provides the lookup table.
 * The correct answer is never shown directly — students must work it out.
 */
function renderReports() {
  // Report 1 gives current satellite position.
  document.getElementById("report1Text").innerHTML =
    "The satellite is currently tracked at " +
    "<strong class='report-related-red' style='font-size:1.1em'>" +
    satelliteAngle +
    "°</strong>" +
    " in its orbital path around Earth.<br>" +
    "<small style='color:#64748b'>" +
    "(0° = east of Earth &nbsp;·&nbsp; 90° = directly overhead &nbsp;·&nbsp; 180° = west of Earth)" +
    "</small><br>" +
    "<br>" +
    "Open <strong>Data Report 2</strong> to find out how fast the satellite is moving and " +
    "why that matters for aiming your radar dish.";

  // Report 2 gives current speed and explains leading the target.
  document.getElementById("report2Text").innerHTML =
    "The satellite is travelling at " +
    "<strong style='color:#fbbf24;font-size:1.1em'>" +
    chosenSpeed.speed +
    " km/s</strong>." +
    "<br><br>" +
    "Because the satellite is moving, your signal will arrive too late unless the radar " +
    "is aimed <em>slightly ahead</em> of the satellite's current position." +
    "<br><br>" +
    "Open <strong>Data Report 3</strong> to find the correct angle adjustment " +
    "and frequency code for this speed.";

  // Report 3 provides the lookup table used to solve the puzzle.
  document.getElementById("report3Panel").innerHTML =
    "<p>Find the satellite's speed in the table to get the adjustment and frequency code:</p>" +
    "<table>" +
    "<thead><tr>" +
    "<th>Satellite Speed</th>" +
    "<th>Angle Adjustment</th>" +
    "<th>Frequency Code</th>" +
    "</tr></thead>" +
    "<tbody>" +
    "<tr><td>7 km/s</td><td>+3°</td><td>A</td></tr>" +
    "<tr><td>8 km/s</td><td>+5°</td><td>B</td></tr>" +
    "<tr><td>9 km/s</td><td>+7°</td><td>C</td></tr>" +
    "</tbody>" +
    "</table>" +
    "<div class='formula-box'>" +
    "<strong class='report-related-red'>Formula:</strong><br>" +
    "<span style='color:aqua'>Radar Angle</span> = <span class='report-related-red'>Satellite Position</span> + <span style='color:#a78bfa'>Angle Adjustment</span>" +
    "</div>";

  // All reports are regenerated on load so values match this round only.
}

// ── Accordion Panels ──────────────────────────────────────────
function setAccordionState(btn, open) {
  var panel = btn.nextElementSibling;
  if (!panel) {
    return;
  }

  panel.style.display = open ? "block" : "none";
  btn.classList.toggle("open", open);
  btn.setAttribute("aria-expanded", String(open));
}

document.querySelectorAll(".accordion").forEach(function (btn) {
  btn.addEventListener("click", function () {
    var panel = this.nextElementSibling;
    if (!panel) {
      return;
    }

    // Use computed style so this works even when CSS (not inline styles)
    // controls the initial open/closed state.
    var isOpen = window.getComputedStyle(panel).display !== "none";
    setAccordionState(this, !isOpen);
  });
});

// ── Contact Button ────────────────────────────────────────────
contactBtn.addEventListener("click", function () {
  document.body.innerHTML =
    "<div class='success-screen'>" +
    "<div class='sat-icon'>🛰️</div>" +
    "<h1>Contact Established!</h1>" +
    "<p>" +
    "Excellent work, Agent! You successfully aligned the radar dish to " +
    "<span class='highlight'>" +
    correctAngle +
    "°</span> " +
    "using Frequency Code <span class='highlight'>" +
    correctCode +
    "</span>." +
    "</p>" +
    "<p>" +
    "The satellite is now transmitting encrypted mission data back to base. " +
    "The operation against the V.I.K.I.N.G.S continues..." +
    "</p>" +
    "<button onclick=\"window.location.href='mission_hub.html'\">" +
    "Return to Mission Hub" +
    "</button>" +
    "</div>";
});

// ── Back Button ───────────────────────────────────────────────
document.getElementById("backBtn").addEventListener("click", function () {
  window.location.href = "mission_hub.html";
});

// ── Initialise ────────────────────────────────────────────────
placeSatellite();
renderReports();

// Start with all data reports expanded (but still togglable).
document.querySelectorAll(".accordion").forEach(function (btn) {
  setAccordionState(btn, true);
});

updateRadarVisual(0);
updateState();

// Keep puzzle state synced as the user changes controls.
angleInput.addEventListener("input", updateState);
freqSelect.addEventListener("change", updateState);
angleMinusBtn.addEventListener("click", function () {
  stepAngle(-1);
});
anglePlusBtn.addEventListener("click", function () {
  stepAngle(1);
});
