  <img src="https://github.com/AykutSarac/jsoncrack-vscode/assets/47941171/23b26537-7c4a-4029-af78-456dea0d0b04" width="300" alt="JSON Crack" />

<hr />

[JSON Crack](https://jsoncrack.com?utm_source=jsoncrack-vscode&utm_medium=readme)'s Official Visual Studio Code Extension that visualizes JSON data as an interactive diagram. The extension parses the open JSON file and displays its structure as a connected graph where nodes represent objects, arrays, and values.

## How to use?

1. Install the JSON Crack extension from the [VS Code marketplace](https://marketplace.visualstudio.com/items?itemName=AykutSarac.jsoncrack-vscode).
2. Open a JSON file.
3. Click on the JSON Crack icon in the menubar at top right.

<img width="600" alt="image" src="https://github.com/AykutSarac/jsoncrack-vscode/assets/47941171/06715ac1-2403-402f-b3fa-3d91e1c9196a">

## Privacy

The extension works **fully offline**. No data is sent to any server. All JSON parsing and visualization happens locally in your editor.

## Development

This extension lives in `apps/vscode` inside the [jsoncrack.com](https://github.com/AykutSarac/jsoncrack.com) monorepo.

**Prerequisites:** Node.js `>=20`, pnpm `>=10`

**Stack:** Vite (webview) + esbuild (extension host) + React 19

```sh
# Install dependencies from repo root
pnpm install

# Build the extension
cd apps/vscode
pnpm run build
```

### Debugging

1. Open the **monorepo root** in VS Code.
2. Press **F5** to launch the "Run VSCode Extension" config — it builds and opens the Extension Development Host.
3. After making changes, press `Cmd+R` (macOS) / `Ctrl+R` (Windows/Linux) in the host window to reload.

### Scripts

| Script | Description |
|---|---|
| `build` | Production build (minified, no sourcemaps) |
| `build:dev` | Dev build (sourcemaps, no minification) |
| `watch` | Watch extension host (`ext-src/`) for changes |
| `watch:webview` | Watch webview (`src/`) for changes |
| `dev` | Start Vite dev server (standalone webview in browser) |
| `lint` | Run ESLint + Prettier check |
| `clean` | Remove `build/` directory |
