# JSON Crack Chrome Extension

Chrome Extension (Manifest v3) that injects a segmented control on JSON-only pages.
Parsed mode renders with local `jsoncrack-react` (no iframe).

- `Raw`: browser's default JSON response view
- `Parsed`: JSON Crack graph view

## Development

From repository root:

```sh
pnpm --filter chrome-extension dev
```

This runs `vite build --watch` and updates `apps/chrome-extension/dist`.

## Build

From repository root:

```sh
pnpm --filter chrome-extension build
```

Then load the extension in Chrome:

1. Open `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select `apps/chrome-extension/dist`

## Usage

1. Open a URL that responds with raw JSON.
2. Use the floating `Raw | Parsed` segmented control.
3. Press `Esc` to quickly return to `Raw`.
