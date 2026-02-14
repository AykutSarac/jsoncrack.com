# jsoncrack

Reusable JSONCrack graph canvas as a React component.

## Install

```bash
npm install jsoncrack
```

## Usage

```tsx
import React from "react";
import { JsonCrack } from "jsoncrack";

export default function App() {
  return (
    <div style={{ height: 700 }}>
      <JsonCrack
        json={{
          user: {
            id: 1,
            name: "Ada",
            tags: ["admin", "staff"],
          },
        }}
        theme="dark"
        direction="RIGHT"
      />
    </div>
  );
}
```

## Props

- `json`: `string | object | unknown[]` input data for visualization.
- `theme`: `"dark" | "light"` (default `"dark"`).
- `direction`: `"LEFT" | "RIGHT" | "DOWN" | "UP"` (default `"RIGHT"`).
- `showControls`: display built-in zoom controls (default `true`).
- `showGrid`: show ruler grid background (default `true`).
- `zoomOnScroll`: enable trackpad pinch/scroll gesture zoom behavior in `Space` (default `false`).
- `imagePreview`: render image URLs as image nodes (default `true`).
- `maxVisibleNodes`: cap node count before rendering a limit message (default `1500`).
- `fitViewOnLayout`: smart auto-fit viewport (initial render + major layout shifts) to avoid resetting view on small edits (default `true`).
- `className`, `style`: wrapper styling.
- `onNodeClick`: callback with clicked node data.
- `onGraphChange`: callback with parsed graph data.
- `onParseError`: callback for parser errors.
- `onViewPortCreate`: callback fired once `react-zoomable-ui` viewport is created.
- `renderTooLarge`: custom renderer for node-limit fallback.

## Imperative Ref

Use `ref` to call viewport actions:

- `zoomIn()`
- `zoomOut()`
- `setZoom(zoomFactor)`
- `centerView()`
- `focusFirstNode()`

## Build

```bash
pnpm exec tsc -p packages/jsoncrack/tsconfig.build.json
```
