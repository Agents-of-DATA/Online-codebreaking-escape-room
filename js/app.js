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
function updateMissionLocks() {
  const missionCards = document.querySelectorAll(".mission-card-tile");

  if (!missionCards.length) return;

  const unlockedMissions = [
    true,
    localStorage.getItem("mission1Complete") === "true",
    localStorage.getItem("mission2Complete") === "true",
    localStorage.getItem("mission3Complete") === "true",
    localStorage.getItem("mission4Complete") === "true",
    localStorage.getItem("mission5Complete") === "true",
    localStorage.getItem("mission6Complete") === "true"
  ];

  missionCards.forEach((card) => {
    const missionNumber = parseInt(card.dataset.mission, 10);
    const isUnlocked = unlockedMissions[missionNumber - 1];
    const lockOverlay = card.querySelector(".lock-overlay");
    const button = card.querySelector(".read-more");

    if (isUnlocked) {
      card.classList.remove("locked");
      lockOverlay?.classList.add("hidden");
      if (button) {
        button.setAttribute("aria-disabled", "false");
        button.tabIndex = 0;
      }
    } else {
      card.classList.add("locked");
      lockOverlay?.classList.remove("hidden");
      if (button) {
        button.setAttribute("aria-disabled", "true");
        button.tabIndex = -1;
      }
    }
  });
}

updateMissionLocks();
// =========================
// MAJOR X DIALOGUE SYSTEM
// =========================


const majorXModal = document.querySelector("#majorx-modal");
const dialogueText = document.querySelector("#dialogue-text");
const dialogueNextBtn = document.querySelector("#dialogue-next-btn");

const firstVisit = localStorage.getItem("missionHubIntroShown");

const mission1Complete = localStorage.getItem("mission1Complete");
const mission1DialogueShown = localStorage.getItem("mission1DialogueShown");

const mission2Complete = localStorage.getItem("mission2Complete");
const mission2DialogueShown = localStorage.getItem("mission2DialogueShown");

const mission3Complete = localStorage.getItem("mission3Complete");
const mission3DialogueShown = localStorage.getItem("mission3DialogueShown");

const mission4Complete = localStorage.getItem("mission4Complete");
const mission4DialogueShown = localStorage.getItem("mission4DialogueShown");

const mission5Complete = localStorage.getItem("mission5Complete");
const mission5DialogueShown = localStorage.getItem("mission5DialogueShown");

const mission6Complete = localStorage.getItem("mission6Complete");
const mission6DialogueShown = localStorage.getItem("mission6DialogueShown");

const briefing1Audio = document.querySelector("#briefing1-audio");
const briefing2Audio = document.querySelector("#briefing2-audio");
const briefing3Audio = document.querySelector("#briefing3-audio");
const briefing4Audio = document.querySelector("#briefing4-audio");

function stopBriefingAudio() {
  [briefing1Audio, briefing2Audio, briefing3Audio, briefing4Audio].forEach((audio) => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  });
}

function playBriefingAudio(index) {
  stopBriefingAudio();

  const audioMap = [
    briefing1Audio,
    briefing2Audio,
    briefing3Audio,
    briefing4Audio
  ];

  const selectedAudio = audioMap[index];

  if (selectedAudio) {
    selectedAudio.play().catch(() => {});
  }
}

if (majorXModal && dialogueText && dialogueNextBtn) {
  let dialogueLines = null;
  let completionKey = null;

  if (firstVisit !== "true") {
    dialogueLines = [
      "Welcome, Agent!",
      "It seems like our rivals have jumped into the digital age and are sending their evil plans with emojis!",
      "We have intercepted an encrypted message and their decryption codex, but it is up to you to find out what messages they are sending!",
      "Best of luck, Agent!"
    ];
    completionKey = "missionHubIntroShown";
  } else if (mission6Complete === "true" && mission6DialogueShown !== "true") {
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
      "Great work deciphering those emojis, Agent! Now we finally know what the “poop” emoji truly means!",
      "Seems like you’re needed in the big brain department for this task! Our regular binary language analyst is off on holiday, and we need this message decrypted quickly!",
      "We have grabbed this DATA from those dastardly VIKINGS; can you work out they are saying?.",
      "We believe in you, Agent!"
    ];
    completionKey = "mission1DialogueShown";
  } else if (mission4Complete === "true" && mission4DialogueShown !== "true") {
    dialogueLines = [
      "Excellent work, Agent. The satellite is now in orbit.",
      "We now have full surveillance over the V.I.K.I.N.G.S network.",
      "Your calculations were precise. One mistake, and the launch would have failed.",
      "Stay sharp. The next mission will require both logic and speed."
    ];
    completionKey = "mission4DialogueShown";
  } else if (mission5Complete === "true" && mission5DialogueShown !== "true") {
    dialogueLines = [
      "Excellent work, Agent. The satellite alignment is now calibrated.",
      "Signal clarity has been restored across the entire network.",
      "The V.I.K.I.N.G.S can no longer hide within corrupted transmissions.",
      "Stay focused. We're getting closer to shutting them down for good."
    ];
    completionKey = "mission5DialogueShown";
  }

  if (dialogueLines) {
    let currentLine = 0;
    const isIntroBriefing = completionKey === "missionHubIntroShown";

    majorXModal.classList.remove("hidden");
    dialogueText.textContent = dialogueLines[currentLine];
    dialogueNextBtn.textContent = "Next";

    if (isIntroBriefing) {
      playBriefingAudio(0);
    }

    dialogueNextBtn.onclick = () => {
      currentLine++;

      if (currentLine < dialogueLines.length) {
        dialogueText.textContent = dialogueLines[currentLine];

        if (isIntroBriefing) {
          playBriefingAudio(currentLine);
        }

        if (currentLine === dialogueLines.length - 1) {
          dialogueNextBtn.textContent = isIntroBriefing ? "Begin" : "Continue";
        }
      } else {
        stopBriefingAudio();
        majorXModal.classList.add("hidden");
        localStorage.setItem(completionKey, "true");
      }
    };
  }
}