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
  window.location.href = "mission_hub.html";
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
