// Grab key elements used across the entry and mission hub pages.
const nameForm = document.querySelector("#name-form");
const nameInput = document.querySelector("#agent-name");
const viking = document.querySelector(".viking");
const welcomeMessage = document.querySelector("#welcome-message");

// On the landing page: validate name, store it, then continue to mission hub.
nameForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = nameInput?.value.trim();

  // Keep the user on the page until a non-empty name is entered.
  if (!name) {
    nameInput?.focus();
    return;
  }

  // Persist name for use on the next page in the same browser session.
  sessionStorage.setItem("agentName", name);
  window.location.href = "avatar.html";
});

// On the mission hub page: greet the user with their stored agent name.
if (welcomeMessage) {
  const storedName = sessionStorage.getItem("agentName");
  welcomeMessage.textContent = storedName
    ? `Welcome, Agent ${storedName}`
    : "Welcome, Agent";
}

// Optional visual interaction for the viking image (where present).
viking?.addEventListener("click", () => {
  viking.classList.toggle("enlarged");
});

// Mission card details toggle — works for every card on the mission hub.
document
  .querySelectorAll(".mission-card-tile .read-more")
  .forEach((readMore) => {
    readMore.addEventListener("click", (event) => {
      event.preventDefault();
      const tile = readMore.closest(".mission-card-tile");
      const details = document.getElementById(
        readMore.getAttribute("aria-controls"),
      );
      const isExpanded = tile?.classList.toggle("expanded");
      readMore.textContent = isExpanded ? "Read Less" : "Read More";
      readMore.setAttribute("aria-expanded", String(Boolean(isExpanded)));
      details?.setAttribute("aria-hidden", String(!isExpanded));
    });
  });

// --- Avatar selection page logic ---
const avatarButtons = document.querySelectorAll(".avatar-option");
const continueBtn = document.querySelector("#continue-btn");

// If we're on avatar.html, allow selection and store in sessionStorage
if (avatarButtons.length && continueBtn) {
  // Optional: if user lands here without a name, send them back
  const storedName = sessionStorage.getItem("agentName");
  if (!storedName) {
    window.location.href = "index.html";
  }

  let selectedAvatar = sessionStorage.getItem("agentAvatar"); // e.g. "agent3.png"

  // Restore selection if they already picked one
  if (selectedAvatar) {
    avatarButtons.forEach((btn) => {
      if (btn.dataset.avatar === selectedAvatar) btn.classList.add("selected");
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

  const steps = document.querySelectorAll(".step");
  if (steps.length) {
    steps.forEach((btn) => {
      btn.addEventListener("click", () => {
        steps.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
      });
    });
  }
}
