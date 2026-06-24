# Tests

Alle Tests sind in **[`apps/www/src/__tests__/`](apps/www/src/__tests__/)** zu finden.

Die Tests wurden für `apps/www` geschrieben da es dafür noch keine Tests gab.

Die Unit und Integration Tests sind mit Jest und die E2E Tests mit Playwright und Load Tests mit k6.

## Stefan Czepl

| Datei                         | Art         |
| ----------------------------- | ----------- |
| `json-adapater.test.ts`       | Unit        |
| `useFile.integration.test.ts` | Integration |
| `e2e/editor.e2e.ts`           | E2E         |
| `load/editor.load.js`         | Last (k6)   |

## Fabian Eberhardt

| Datei                                                           | Art                |
| --------------------------------------------------------------- | ------------------ |
| `json2go.test.ts`                                               | Unit               |
| `useJsonQuery.integration.test.ts`                              | Integration        |
| `e2e/tools.e2e.ts`                                              | E2E                |
| `load/loadbalancer/editor.lb.load.js`                           | Last (k6 + Docker) |

## Ausführen

Befehle müssen in `apps/www` ausgeführt werden.

```bash
pnpm --filter www test                     # Unit + Integration
pnpm --filter www test:e2e                 # E2E
```

Für den Last Test `editor.load.js` muss der Server laufen, mit:

```bash
pnpm --filter www dev
```

Ausführen des Last Tests:

```bash
k6 run src/__tests__/load/editor.load.js   # Last Test
```

Last Test mit Load Balancer und Replikas dafür muss nur der folgende Befehl verwendet werden:

```bash
docker compose -f src/__tests__/load/loadbalancer/docker-compose.loadtest.yml up --build --scale web=3 --abort-on-container-exit --exit-code-from k6
```

