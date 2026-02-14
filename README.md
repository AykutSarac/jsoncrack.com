# JSON Crack Monorepo

JSON Crack is now managed as a Turborepo + pnpm workspace monorepo.

- Website: https://jsoncrack.com
- Discord: https://discord.gg/yVyTtCRueq
- Issues: https://github.com/AykutSarac/jsoncrack.com/issues
- VS Code extension: https://marketplace.visualstudio.com/items?itemName=AykutSarac.jsoncrack-vscode

## Repository Layout

```text
.
├─ apps/
│  └─ www/                    # Next.js web application (json-crack)
├─ packages/
│  └─ react-jsoncrack/        # Reusable canvas package (@jsoncrack/react-canvas)
├─ turbo.json                 # Turborepo task graph
├─ pnpm-workspace.yaml        # Workspace package globs
└─ package.json               # Root scripts that delegate to turbo
```

## Prerequisites

- Node.js `>=24.x` (required by `apps/www`)
- pnpm `>=10`

## Getting Started

```sh
git clone https://github.com/AykutSarac/jsoncrack.com.git
cd jsoncrack.com
pnpm install
```

## Monorepo Commands (Root)

All root scripts are Turborepo delegates:

```sh
pnpm dev
pnpm build
pnpm lint
pnpm lint:fix
pnpm start
pnpm analyze
pnpm clean
```

## Package-Scoped Commands

Run a command for only one workspace package:

```sh
# Web app only
pnpm --filter json-crack dev
pnpm --filter json-crack build

# Canvas package only
pnpm --filter @jsoncrack/react-canvas build
pnpm --filter @jsoncrack/react-canvas lint
```

## Docker (Web App)

Docker assets are in `apps/www`.

```sh
cd apps/www
docker compose build
docker compose up
# http://localhost:8888
```

## CI/CD

GitHub Actions workflows are monorepo-aware:

- `.github/workflows/pull-request.yml`
- `.github/workflows/deploy.yml`

## Internal Packages

- `apps/www`: JSON Crack web app (Next.js)
- `packages/react-jsoncrack`: reusable React canvas package published as `@jsoncrack/react-canvas`

## License

See `apps/www/LICENSE.md`.
