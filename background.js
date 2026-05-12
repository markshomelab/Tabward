// background.js — service worker for Tabward

const ENABLED_KEY = "focusEnabled";

// Initialize state on install and default to ON
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(ENABLED_KEY, (result) => {
    if (result[ENABLED_KEY] === undefined) {
      chrome.storage.local.set({ [ENABLED_KEY]: true });
    }
    updateIcon(result[ENABLED_KEY] === true);
  });
});

// Restore icon state on service worker startup
chrome.storage.local.get(ENABLED_KEY, (result) => {
  updateIcon(result[ENABLED_KEY] === true);
});

// Listen for new tabs being created
chrome.tabs.onCreated.addListener((tab) => {
  chrome.storage.local.get(ENABLED_KEY, (result) => {
    const isEnabled = result[ENABLED_KEY] === true;
    if (isEnabled && tab.id !== undefined) {
      // Small delay to let Chrome finish creating the tab before focusing
      setTimeout(() => {
        chrome.tabs.update(tab.id, { active: true }, () => {
          if (chrome.runtime.lastError) {
            // Tab may have been closed already; ignore the error
            return;
          }
          // Also bring the tab's window to focus
          if (tab.windowId !== undefined) {
            chrome.windows.update(tab.windowId, { focused: true });
          }
        });
      }, 50);
    }
  });
});

// Toggle state on toolbar icon click
chrome.action.onClicked.addListener(() => {
  chrome.storage.local.get(ENABLED_KEY, (result) => {
    const newState = !(result[ENABLED_KEY] === true);
    chrome.storage.local.set({ [ENABLED_KEY]: newState }, () => {
      updateIcon(newState);
    });
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