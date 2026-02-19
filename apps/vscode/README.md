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

## Debugging

This extension lives in `apps/vscode` inside the [jsoncrack.com](https://github.com/AykutSarac/jsoncrack.com) monorepo.

**Prerequisites:** Node.js `>=24`, pnpm `>=10`

```sh
# Install dependencies from repo root
pnpm install

# Watch mode — rebuilds on every change
pnpm dev:vscode
```

Then press **F5** in VS Code to launch the Extension Development Host. Keep the watch process running for live iteration.
