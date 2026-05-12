# Tabward

![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)
![Manifest V3](https://img.shields.io/badge/Manifest-V3-blue.svg)
![Version](https://img.shields.io/badge/Version-1.0.0-orange.svg)

> A Chrome extension that, when activated, automatically brings new tabs into focus when they open. Toggle it on and off with a single click on the toolbar icon.

![Tabward screenshot](screenshots/tabward-screenshot.png)

---

## Features

- **Automatic focus:** New tabs come to the front the moment they open, no matter what opened them.
- **One-click toggle:** Click the toolbar icon to turn Tabward on (green) or off (gray). No menus, no settings pages.
- **Zero configuration:** Works immediately after installation.
- **Privacy first:** Collects no data, makes no network requests, and runs entirely in your browser.

---

## Installation

### From the Chrome Web Store
*(Coming soon)*

### Manual installation (Developer Mode)
1. Download or clone this repository.
2. Go to `chrome://extensions` in Chrome or `brave://extensions` in Brave.
3. Enable **Developer mode** using the toggle in the top right.
4. Click **Load unpacked** and select the repository folder.

---

## How to use it

1. Install the extension. It will be automatically active after installation. If you wish to toggle it off...
2. Pin it to your toolbar by clicking the puzzle-piece icon in the top right corner of Chrome and clicking the pin next to Tabward.
3. Click the Tabward icon to turn it off (gray) or back on (green).

---

## Browser compatibility

| Browser | Supported |
|---------|-----------|
| Chrome  | Yes |
| Brave   | Yes |
| Edge    | Yes |
| Firefox | No |

---

## Privacy

Tabward collects no data of any kind. It does not track your browsing, read your tab contents, or communicate with any server. Everything runs locally in your browser. The extension requests two permissions:

- `tabs` — required to detect when a new tab opens.
- `storage` — required to remember whether you have it turned on or off.

Neither permission is used for anything beyond those two functions.

---

## Changelog

**v1.0.0** — Initial release.

---

## Contributing

Contributions and bug reports are welcome. Open an issue or submit a pull request.

---

## License

[MIT](LICENSE)