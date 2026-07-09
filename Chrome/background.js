// background.js — service worker for Tabward

const ENABLED_KEY = "focusEnabled";

// Read the current state directly from storage every time.
// We deliberately do NOT cache this in a variable: MV3 service
// workers are killed and restarted constantly, and a cached value
// can be stale in the window between wake-up and the storage read.
// That was the cause of the v1.0.0 race condition.
async function getEnabled() {
  const result = await chrome.storage.local.get(ENABLED_KEY);
  return result[ENABLED_KEY] === true;
}

// Write the new state and refresh the icon to match.
async function setEnabled(value) {
  await chrome.storage.local.set({ [ENABLED_KEY]: value });
  updateIcon(value);
}

// Flip the state. Reads from storage first so the toggle always
// starts from the real current value, never a stale default.
async function toggle() {
  const enabled = await getEnabled();
  await setEnabled(!enabled);
}

// First install: default to enabled.
chrome.runtime.onInstalled.addListener(async (details) => {
  const result = await chrome.storage.local.get(ENABLED_KEY);
  if (result[ENABLED_KEY] === undefined) {
    await setEnabled(true);
  } else {
    updateIcon(result[ENABLED_KEY] === true);
  }
});

// On every service worker startup, sync the icon with stored state.
getEnabled().then(updateIcon);

// Focus new tabs when enabled.
chrome.tabs.onCreated.addListener(async (tab) => {
  if (tab.id === undefined) return;

  const enabled = await getEnabled();
  if (!enabled) return;

  // Small delay to let Chrome finish creating the tab before focusing
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

// Toggle on toolbar icon click.
chrome.action.onClicked.addListener(() => {
  toggle();
});

// Update the toolbar icon and tooltip to reflect current state.
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