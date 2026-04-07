localStorage.setItem("mission5Complete", "true");
localStorage.removeItem("mission5DialogueShown");
function randomInt(min, max) {
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
  var rad = (satelliteAngle * Math.PI) / 180;
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
  var rotation = "rotate(" + -angle + "deg)";

  beamEl.style.left = EARTH_X + "px";
  beamEl.style.top = EARTH_Y + "px";
  beamEl.style.width = ORBIT_R + "px";
  beamEl.style.transform = rotation;

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
  var angle = parseInt(angleInput.value);
  var code = freqSelect.value;

  angleDisplay.textContent = angle + "°";
  updateRadarVisual(angle);

  var angleOk = angle === correctAngle;
  var codeOk = code === correctCode;
  var score = (angleOk ? 1 : 0) + (codeOk ? 1 : 0);

  // Update progress bar width and colour.
  progressFill.style.width = (score / 2) * 100 + "%";

  if (score === 2) {
    progressFill.style.background = "#4ade80";
    statusMsg.textContent =
      "✅ Perfect alignment! Signal locked on to the satellite!";
    satelliteEl.classList.add("locked");
    beamEl.classList.add("locked");
    contactBtn.disabled = false;
  } else {
    satelliteEl.classList.remove("locked");
    beamEl.classList.remove("locked");
    contactBtn.disabled = true;

    if (score === 1) {
      progressFill.style.background = "#f97316";
      if (angleOk) {
        statusMsg.textContent =
          "📐 Angle is correct! Double-check the frequency code.";
      } else {
        statusMsg.textContent =
          "📻 Frequency code confirmed! Adjust the radar angle.";
      }
    } else {
      progressFill.style.background = "#ef4444";
      statusMsg.textContent =
        "📡 No signal detected. Adjust the angle and frequency code.";
    }
  }
}

// ── Data Report Content ───────────────────────────────────────
/*
 * Fills the three accordion panels with puzzle-specific data.
 * Reports 1 and 2 give the clues; Report 3 provides the lookup table.
 * The correct answer is never shown directly — students must work it out.
 */
function renderReports() {
  document.getElementById("report1Text").innerHTML =
    "The satellite is currently tracked at " +
    "<strong style='color:#fbbf24;font-size:1.1em'>" +
    satelliteAngle +
    "°</strong>" +
    " in its orbital path around Earth.<br>" +
    "<small style='color:#64748b'>" +
    "(0° = east of Earth &nbsp;·&nbsp; 90° = directly overhead &nbsp;·&nbsp; 180° = west of Earth)" +
    "</small>";

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
    "<strong>Formula:</strong><br>" +
    "Radar Angle = Satellite Position + Angle Adjustment" +
    "</div>";
}

// ── Accordion Panels ──────────────────────────────────────────
document.querySelectorAll(".accordion").forEach(function (btn) {
  btn.addEventListener("click", function () {
    var panel = this.nextElementSibling;
    var isOpen = panel.style.display === "block";
    panel.style.display = isOpen ? "none" : "block";
    this.classList.toggle("open", !isOpen);
    this.setAttribute("aria-expanded", String(!isOpen));
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
updateRadarVisual(0);
updateState();

angleInput.addEventListener("input", updateState);
freqSelect.addEventListener("change", updateState);