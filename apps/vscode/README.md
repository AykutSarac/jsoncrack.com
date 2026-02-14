# JSON Crack VS Code Extension

Development guide for `apps/vscode` inside this monorepo.

## Prerequisites

- Node.js `>=24`
- pnpm `>=10`

## Install

From repository root:

```sh
pnpm install
```

## Run and Build

From repository root:

```sh
# one-time production build for extension + webview
pnpm build:vscode

# watch mode (rebuild on change)
pnpm dev:vscode

# lint
pnpm lint:vscode
```

## Debug (F5 from Root Workspace)

1. Open the repository root in VS Code.
2. Press `F5`.
3. Select `Run VSCode Extension (apps/vscode)` if prompted.
4. In the Extension Development Host window, open a `.json` file and run:
   `JSON Crack: Enable JSON Crack visualization`.

For live iteration, keep `pnpm dev:vscode` running in a terminal while debugging.

## Packaging

From repository root:

```sh
pnpm --filter vscode package
```

This generates the extension bundle under `apps/vscode/build`.
