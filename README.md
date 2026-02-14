# JSON Crack Monorepo

JSON Crack is now managed as a Turborepo + pnpm workspace monorepo.

- Website: https://jsoncrack.com
- Issues: https://github.com/AykutSarac/jsoncrack.com/issues
- VS Code extension: https://marketplace.visualstudio.com/items?itemName=AykutSarac.jsoncrack-vscode

## Prerequisites

- Node.js `>=24.x`
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
pnpm --filter www dev
pnpm --filter www build

# Canvas package only
pnpm --filter jsoncrack build
pnpm --filter jsoncrack lint

# VS Code extension app only
pnpm --filter vscode build
pnpm --filter vscode lint
```

## Docker (Web App)

Docker assets are in `apps/www`.

```sh
cd apps/www
docker compose build
docker compose up
# http://localhost:8888
```

## License

See `LICENSE.md`.
