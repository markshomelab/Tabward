// background.js — event page for Tabward (Firefox MV3)

const ENABLED_KEY = "focusEnabled";
let isEnabled = true; // in-memory cache of current state

// Load state on startup. Runs on every event-page wake-up.
chrome.storage.local.get(ENABLED_KEY, (result) => {
  if (result[ENABLED_KEY] === undefined) {
    // First run, default to enabled.
    chrome.storage.local.set({ [ENABLED_KEY]: true });
    isEnabled = true;
  } else {
    isEnabled = result[ENABLED_KEY] === true;
  }
  updateIcon(isEnabled);
});

// Listen for new tabs being created
chrome.tabs.onCreated.addListener((tab) => {
  if (!isEnabled || tab.id === undefined) return;

  // Small delay to let the browser finish creating the tab before focusing
  setTimeout(() => {
    chrome.tabs.update(tab.id, { active: true }, () => {
      if (chrome.runtime.lastError) {
        // Tab may have been closed already; ignore the error
        return;
      }
      if (tab.windowId !== undefined) {
        chrome.windows.update(tab.windowId, { focused: true });
      }
    });
  }, 50);
});

// Toggle state on toolbar icon click
chrome.action.onClicked.addListener(() => {
  isEnabled = !isEnabled;
  chrome.storage.local.set({ [ENABLED_KEY]: isEnabled }, () => {
    updateIcon(isEnabled);
  });
});

// Update the toolbar icon and tooltip to reflect current state
function updateIcon(enabled) {
  const suffix = enabled ? "on" : "off";
  chrome.action.setIcon({
    path: {
      16: `icons/icon16_${suffix}.png`,
      32: `icons/icon32_${suffix}.png`,
      48: `icons/icon48_${suffix}.png`,
      128: `icons/icon128_${suffix}.png`
    }
  });
  chrome.action.setTitle({
    title: enabled
      ? "Tabward: ON (click to disable)"
      : "Tabward: OFF (click to enable)"
  });
}
