// popup.js

const card = document.getElementById("toggleCard");
const pill = document.getElementById("pill");
const statusLabel = document.getElementById("statusLabel");
const description = document.getElementById("description");

function applyState(enabled) {
  if (enabled) {
    card.className = "toggle-card enabled";
    pill.className = "pill on";
    statusLabel.className = "status-label on";
    statusLabel.textContent = "ENABLED";
    description.className = "description enabled-desc";
    description.textContent = "New tabs will be focused automatically.";
  } else {
    card.className = "toggle-card disabled";
    pill.className = "pill off";
    statusLabel.className = "status-label off";
    statusLabel.textContent = "DISABLED";
    description.className = "description";
    description.textContent = "Click to start focusing new tabs.";
  }
}

// Load initial state from background
chrome.runtime.sendMessage({ type: "GET_STATE" }, (response) => {
  if (response) applyState(response.enabled);
});

// Toggle on card click
card.addEventListener("click", () => {
  chrome.runtime.sendMessage({ type: "TOGGLE" }, (response) => {
    if (response) applyState(response.enabled);
  });
});
