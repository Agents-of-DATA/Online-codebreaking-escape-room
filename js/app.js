const nameForm = document.querySelector("#name-form");
const nameInput = document.querySelector("#agent-name");
const viking = document.querySelector(".viking");
const welcomeMessage = document.querySelector("#welcome-message");

// =========================
// NAME ENTRY
// =========================
nameForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = nameInput?.value.trim();

  if (!name) {
    nameInput?.focus();
    return;
  }

  sessionStorage.setItem("agentName", name);
  window.location.href = "avatar.html";
});

// =========================
// WELCOME MESSAGE
// =========================
if (welcomeMessage) {
  const storedName = sessionStorage.getItem("agentName");
  welcomeMessage.textContent = storedName
    ? `Welcome, Agent ${storedName}`
    : "Welcome, Agent";
}

// =========================
// VIKING CLICK EFFECT
// =========================
viking?.addEventListener("click", () => {
  viking.classList.toggle("enlarged");
});

// =========================
// AVATAR SELECTION
// =========================
const avatarButtons = document.querySelectorAll(".avatar-option");
const continueBtn = document.querySelector("#continue-btn");

if (avatarButtons.length && continueBtn) {
  const storedName = sessionStorage.getItem("agentName");
  if (!storedName) {
    window.location.href = "index.html";
  }

  let selectedAvatar = sessionStorage.getItem("agentAvatar");

  if (selectedAvatar) {
    avatarButtons.forEach((btn) => {
      if (btn.dataset.avatar === selectedAvatar) {
        btn.classList.add("selected");
      }
    });
    continueBtn.disabled = false;
  }

  avatarButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      avatarButtons.forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");

      selectedAvatar = btn.dataset.avatar;
      sessionStorage.setItem("agentAvatar", selectedAvatar);
      continueBtn.disabled = false;
    });
  });

  continueBtn.addEventListener("click", () => {
    window.location.href = "mission_hub.html";
  });
}

// =========================
// MISSION STEP BUTTONS
// =========================
const steps = document.querySelectorAll(".step");

function updateMissionSteps() {
  if (!steps.length) return;

  const missionFlags = [
    localStorage.getItem("mission1Complete") === "true",
    localStorage.getItem("mission2Complete") === "true",
    localStorage.getItem("mission3Complete") === "true",
    localStorage.getItem("mission4Complete") === "true",
    localStorage.getItem("mission5Complete") === "true",
    localStorage.getItem("mission6Complete") === "true",
    localStorage.getItem("mission7Complete") === "true"
  ];

  steps.forEach((step, index) => {
    if (missionFlags[index]) {
      step.classList.add("active");   // green
    } else {
      step.classList.remove("active"); // red
    }
  });
}

updateMissionSteps();

// =========================
// MAJOR X DIALOGUE SYSTEM
// =========================
const majorXModal = document.querySelector("#majorx-modal");
const dialogueText = document.querySelector("#dialogue-text");
const dialogueNextBtn = document.querySelector("#dialogue-next-btn");

const mission1Complete = localStorage.getItem("mission1Complete");
const mission1DialogueShown = localStorage.getItem("mission1DialogueShown");

const mission2Complete = localStorage.getItem("mission2Complete");
const mission2DialogueShown = localStorage.getItem("mission2DialogueShown");

const mission3Complete = localStorage.getItem("mission3Complete");
const mission3DialogueShown = localStorage.getItem("mission3DialogueShown");

const mission6Complete = localStorage.getItem("mission6Complete");
const mission6DialogueShown = localStorage.getItem("mission6DialogueShown");

if (majorXModal && dialogueText && dialogueNextBtn) {
  let dialogueLines = null;
  let completionKey = null;

  if (mission6Complete === "true" && mission6DialogueShown !== "true") {
    dialogueLines = [
      "Excellent work, Agent. You've secured the firewall with a strong password.",
      "The V.I.K.I.N.G.S will have a far harder time breaking through our defenses now.",
      "Security is never just about code. It's about smart choices, strong habits, and constant vigilance.",
      "Stay ready. The final stages of this operation are approaching."
    ];
    completionKey = "mission6DialogueShown";
  } else if (mission3Complete === "true" && mission3DialogueShown !== "true") {
    dialogueLines = [
      "Exceptional work, Agent. You've broken through the Caesar encryption.",
      "The V.I.K.I.N.G.S are adapting quickly, but so are we.",
      "Every decoded message brings us closer to exposing their full operation.",
      "Stay focused. Mission 4 will push your skills even further."
    ];
    completionKey = "mission3DialogueShown";
  } else if (mission2Complete === "true" && mission2DialogueShown !== "true") {
    dialogueLines = [
      "Outstanding work, Agent. You've successfully decoded the binary transmission.",
      "We've intercepted critical intelligence from the V.I.K.I.N.G.S network.",
      "They are escalating their encryption methods, which means our next move must be precise.",
      "Stand by. Mission 3 is now unlocked."
    ];
    completionKey = "mission2DialogueShown";
  } else if (mission1Complete === "true" && mission1DialogueShown !== "true") {
    dialogueLines = [
      "Excellent work, Agent. You've cracked the code to the first mission.",
      "The V.I.K.I.N.G.S now know we are onto them. Time is no longer on our side.",
      "Their next encryption will be harder to break. You must be sharper, faster, and more precise.",
      "Prepare yourself. Mission 2 begins now."
    ];
    completionKey = "mission1DialogueShown";
  }

  if (dialogueLines) {
    let currentLine = 0;

    majorXModal.classList.remove("hidden");
    dialogueText.textContent = dialogueLines[currentLine];
    dialogueNextBtn.textContent = "Next";

    dialogueNextBtn.onclick = () => {
      currentLine++;

      if (currentLine < dialogueLines.length) {
        dialogueText.textContent = dialogueLines[currentLine];

        if (currentLine === dialogueLines.length - 1) {
          dialogueNextBtn.textContent = "Continue";
        }
      } else {
        majorXModal.classList.add("hidden");
        localStorage.setItem(completionKey, "true");
      }
    };
  }
}