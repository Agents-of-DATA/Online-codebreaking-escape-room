const nameForm = document.querySelector("#name-form");
//name input
const nameInput = document.querySelector("#agent-name");
const viking = document.querySelector(".viking");
//welcome message
const welcomeMessage = document.querySelector("#welcome-message");

//user submits agent nam
nameForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = nameInput?.value.trim();
//does not work if empty
  if (!name) {
    nameInput?.focus();
    return;
  }
  //saves agent name
  sessionStorage.setItem("agentName", name);
  //goes to avatar selection page
  window.location.href = "avatar.html";
});

//shows personalised welcome text
if (welcomeMessage) {
  const storedName = sessionStorage.getItem("agentName");
  welcomeMessage.textContent = storedName
    ? `Welcome, Agent ${storedName}`
    : "Welcome, Agent";
}


viking?.addEventListener("click", () => {
  viking.classList.toggle("enlarged");
});

//all avatar buttons
const avatarButtons = document.querySelectorAll(".avatar-option");
//continue button on avatar 
const continueBtn = document.querySelector("#continue-btn");
//runs only if on avatar page
if (avatarButtons.length && continueBtn) {
  const storedName = sessionStorage.getItem("agentName");
  if (!storedName) {
    window.location.href = "index.html";
  }

  let selectedAvatar = sessionStorage.getItem("agentAvatar");
//if avatar is select, becomes highlighted
  if (selectedAvatar) {
    avatarButtons.forEach((btn) => {
      if (btn.dataset.avatar === selectedAvatar) {
        btn.classList.add("selected");
      }
    });
    continueBtn.disabled = false;
  }
//when an avatar is clicked
  avatarButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      //removes previous selection highlight
      avatarButtons.forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");
      //keeps selected avatar highlighted
      selectedAvatar = btn.dataset.avatar;
      sessionStorage.setItem("agentAvatar", selectedAvatar);
      continueBtn.disabled = false;
    });
  });
//goes to mission hub once button is clicked
  continueBtn.addEventListener("click", () => {
    window.location.href = "mission_hub.html";
  });
}

//progress on the top
const steps = document.querySelectorAll(".step");
//turns circles green if mission is completed
function updateMissionSteps() {
  if (!steps.length) return;
//checks if mission is completed from localstorage
  const missionFlags = [
    localStorage.getItem("mission1Complete") === "true",
    localStorage.getItem("mission2Complete") === "true",
    localStorage.getItem("mission3Complete") === "true",
    localStorage.getItem("mission4Complete") === "true",
    localStorage.getItem("mission5Complete") === "true",
    localStorage.getItem("mission6Complete") === "true",
    localStorage.getItem("mission7Complete") === "true"
  ];
//active mission class
  steps.forEach((step, index) => {
    if (missionFlags[index]) {
      step.classList.add("active");   
    } else {
      step.classList.remove("active"); 
    }
  });
}
//run as soon as script runs
updateMissionSteps();
//locks mission until previous is completed
function updateMissionLocks() {
  const missionCards = document.querySelectorAll(".mission-card-tile");

  if (!missionCards.length) return;
  //unlock order
  const unlockedMissions = [
    true,
    localStorage.getItem("mission1Complete") === "true",
    localStorage.getItem("mission2Complete") === "true",
    localStorage.getItem("mission3Complete") === "true",
    localStorage.getItem("mission4Complete") === "true",
    localStorage.getItem("mission5Complete") === "true",
    localStorage.getItem("mission6Complete") === "true",
    localStorage.getItem("mission7Complete") === "true"
  ];
//mission card attributes to check mission number, ready to unlock, lock overlay and mission button
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
//major x container, paragraph of text and next button
updateMissionLocks();
const majorXModal = document.querySelector("#majorx-modal");
const dialogueText = document.querySelector("#dialogue-text");
const dialogueNextBtn = document.querySelector("#dialogue-next-btn");
const finalPopup = document.querySelector("#final-popup");
const finalListenBtn = document.querySelector("#final-listen-btn");


//first time vising mission hub 
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

const mission7Complete = localStorage.getItem("mission7Complete");
const mission7DialogueShown = localStorage.getItem("mission7DialogueShown");
//audio set for dialogue
//map for for each sequence
const audioSets = {
  missionHubIntroShown: [
    document.querySelector("#briefing1-audio"),
    document.querySelector("#briefing2-audio"),
    document.querySelector("#briefing3-audio"),
    document.querySelector("#briefing4-audio")
  ],
  mission1DialogueShown: [
    document.querySelector("#mission2briefing1-audio"),
    document.querySelector("#mission2briefing2-audio"),
    document.querySelector("#mission2briefing3-audio"),
    document.querySelector("#mission2briefing4-audio")
  ],
  mission2DialogueShown: [
    document.querySelector("#mission3briefing1-audio"),
    document.querySelector("#mission3briefing2-audio"),
    document.querySelector("#mission3briefing3-audio"),
    document.querySelector("#mission3briefing4-audio")
  ],
  mission3DialogueShown: [
    document.querySelector("#mission4briefing1-audio"),
    document.querySelector("#mission4briefing2-audio"),
    document.querySelector("#mission4briefing3-audio"),
    document.querySelector("#mission4briefing4-audio")
  ],
  mission4DialogueShown: [
    document.querySelector("#mission5briefing1-audio"),
    document.querySelector("#mission5briefing2-audio"),
    document.querySelector("#mission5briefing3-audio"),
    document.querySelector("#mission5briefing4-audio")
  ],
  mission5DialogueShown: [
    document.querySelector("#mission6briefing1-audio"),
    document.querySelector("#mission6briefing2-audio"),
    document.querySelector("#mission6briefing3-audio"),
    document.querySelector("#mission6briefing4-audio")
  ],
  mission6DialogueShown: [
    document.querySelector("#mission7briefing1-audio"),
    document.querySelector("#mission7briefing2-audio"),
    document.querySelector("#mission7briefing3-audio"),
    document.querySelector("#mission7briefing4-audio")
  ],
  finalBrief: [
  document.querySelector("#finalBrief1-audio"),
  document.querySelector("#finalBrief2-audio"),
  document.querySelector("#finalBrief3-audio"),
  document.querySelector("#finalBrief4-audio"),
  document.querySelector("#finalBrief5-audio")
]
};
//stops dialogue audio clips
function stopAllDialogueAudio() {
  Object.values(audioSets).flat().forEach((audio) => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  });
}
//plays when a specific one is selected
function playDialogueAudio(completionKey, index) {
  stopAllDialogueAudio();

  const selectedSet = audioSets[completionKey];
  if (!selectedSet) return;

  const selectedAudio = selectedSet[index];
  if (selectedAudio) {
    selectedAudio.play().catch(() => {});
  }
}
if (majorXModal && dialogueText && dialogueNextBtn) {
  let dialogueLines = null;
  let completionKey = null;

if (mission7Complete === "true" && mission7DialogueShown !== "true") {
  majorXModal.classList.add("hidden");

  if (finalPopup) {
    finalPopup.classList.remove("hidden");
  }

  if (finalListenBtn) {
    finalListenBtn.disabled = false;
    finalListenBtn.textContent = "Hear Major X’s Final Speech";
    finalListenBtn.onclick = () => {
      window.location.href = "mission_complete.html";
    };
  }

  localStorage.setItem("mission7DialogueShown", "true");
}

    localStorage.setItem("mission7DialogueShown", "true");
  } else if (firstVisit !== "true") {
    dialogueLines = [
      "Welcome, Agent!",
      "It seems like our rivals have jumped into the digital age and are sending their evil plans with emojis!",
      "We have intercepted an encrypted message and their decryption codex, but it is up to you to find out what messages they are sending!",
      "Best of luck, Agent!"
    ];
    completionKey = "missionHubIntroShown";
  } else if (mission6Complete === "true" && mission6DialogueShown !== "true") {
    dialogueLines = [
      "Wow, that was one strong Password! No-one will be able to steal your DATA now! I should be taking notes…",
      "This is it Agent, The ultimate battle has commenced! There is a location in Scotland where the VIKINGS have their ground base!",
      "We need you to Trace the Signal and find which Scottish City they are hiding in. Once you have the location, we can stop the signal remotely, and it’s goodnight VIKINGS!",
      "Let’s Finish This, Agent!"
    ];
    completionKey = "mission6DialogueShown";
  } else if (mission5Complete === "true" && mission5DialogueShown !== "true") {
    dialogueLines = [
      "Excellent work, Agent. The satellite alignment is now calibrated. Signal clarity has been restored across the entire network.",
      "Password security is vital these days, Agent. Keeping your data safe is of the utmost importance in this digital DATA age!",
      "It looks like the VIKINGS are trying to hack into your account, little do they know you are a Password Master! Show them what you’ve got and make a super hard Password!",
      "Do us proud, Agent!"
    ];
    completionKey = "mission5DialogueShown";
  } else if (mission4Complete === "true" && mission4DialogueShown !== "true") {
    dialogueLines = [
      "That fuel was something else! Super-fast launch! Shame about the smell though...",
      "It seems like we have lost communication with that Satellite we sent rocketing into space… Woops! That fuel might have worked too well!",
      "We need to reconnect with the Satellite to send instructions to stop those VIKINGS. Use the DATA provided to align our Radar Dish to get us back on track!",
      "Stay sharp. The next mission will require both logic and speed. Best of luck, Agent!"
    ];
    completionKey = "mission4DialogueShown";
  } else if (mission3Complete === "true" && mission3DialogueShown !== "true") {
    dialogueLines = [
      "Exceptional work, Agent. You've broken through the Caesar encryption.",
      "The V.I.K.I.N.G.S are adapting quickly, but so are we.",
      "We need you to launch a rocket that will spy on their systems. We have acquired information on a new type of fuel; can you figure out the right amount of chemicals to mix to make the fuel?",
      "Stay focused. Mission 4 will push your skills even further."
    ];
    completionKey = "mission3DialogueShown";
  } else if (mission2Complete === "true" && mission2DialogueShown !== "true") {
    dialogueLines = [
      "Incredible decryption work, Agent! After this is all done, we can send YOU on holiday!",
      "We've intercepted critical intelligence from the V.I.K.I.N.G.S network. This task will really shift our DATA into gear! We have a complex cipher that we need to decode, and you’re the person for the job!",
      "You need to decode the “Caesar Cipher” by shifting the Cipher numbers to decode their cryptic clues!",
      "You’re the best Agent for the job!"
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
  }

  if (dialogueLines) {
    let currentLine = 0;

    majorXModal.classList.remove("hidden");
    dialogueText.textContent = dialogueLines[currentLine];
    dialogueNextBtn.textContent = "Next";

    playDialogueAudio(completionKey, 0);

    dialogueNextBtn.onclick = () => {
      currentLine++;

      if (currentLine < dialogueLines.length) {
        dialogueText.textContent = dialogueLines[currentLine];
        playDialogueAudio(completionKey, currentLine);

        if (currentLine === dialogueLines.length - 1) {
          dialogueNextBtn.textContent =
            completionKey === "missionHubIntroShown" ? "Begin" : "Continue";
        }
      } else {
        stopAllDialogueAudio();
        majorXModal.classList.add("hidden");
        localStorage.setItem(completionKey, "true");
      }
    };
}