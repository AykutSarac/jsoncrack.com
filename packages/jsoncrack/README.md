# jsoncrack

Reusable JSON graph canvas component from JSON Crack.

- React component API
- Built-in parsing from `string | object | unknown[]`
- Interactive canvas (pan/zoom + optional controls)
- TypeScript types included

## Install

```bash
npm install jsoncrack
```

Peer dependencies:

- `react >= 18`
- `react-dom >= 18`

## Quick Start

```tsx
import { JsonCrack } from "jsoncrack";

export function Example() {
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
      />
    </div>
  );
}
```

Important: the wrapper must have an explicit height.

## Next.js (App Router)

`JsonCrack` is a client component. Use it in a `"use client"` file.

```tsx
"use client";

import { JsonCrack } from "jsoncrack";

export default function Graph() {
  return (
    <div style={{ height: "70vh" }}>
      <JsonCrack json='{"hello":"world"}' />
    </div>
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `json` | `string \| object \| unknown[]` | - | Input data to visualize |
| `theme` | `"dark" \| "light"` | `"dark"` | Canvas theme |
| `direction` | `"LEFT" \| "RIGHT" \| "DOWN" \| "UP"` | `"RIGHT"` | Layout direction |
| `showControls` | `boolean` | `true` | Show built-in camera controls |
| `showGrid` | `boolean` | `true` | Show grid background |
| `zoomOnScroll` | `boolean` | `false` | Enables touch/trackpad gesture behavior |
| `imagePreview` | `boolean` | `true` | Render image URLs as image nodes |
| `fitViewOnLayout` | `boolean` | `true` | Auto-fit on first/major layout changes |
| `maxVisibleNodes` | `number` | `1500` | Node rendering safety limit |
| `className` | `string` | - | Wrapper class |
| `style` | `React.CSSProperties` | - | Wrapper inline style |
| `onNodeClick` | `(node: NodeData) => void` | - | Node click callback |
| `onGraphChange` | `(graph: GraphData) => void` | - | Parsed graph callback |
| `onParseError` | `(error: Error) => void` | - | Parse error callback |
| `onViewPortCreate` | `(viewPort: ViewPort) => void` | - | Viewport ready callback |
| `renderTooLarge` | `(nodeCount: number, maxVisibleNodes: number) => React.ReactNode` | - | Custom fallback when node limit is exceeded |

## Imperative API (ref)

```tsx
import { useRef } from "react";
import { JsonCrack, type JsonCrackRef } from "jsoncrack";

export function WithRef({ json }: { json: string }) {
  const ref = useRef<JsonCrackRef>(null);

  return (
    <>
      <button onClick={() => ref.current?.centerView()}>Center</button>
      <button onClick={() => ref.current?.zoomIn()}>+</button>
      <button onClick={() => ref.current?.zoomOut()}>-</button>
      <div style={{ height: 600 }}>
        <JsonCrack ref={ref} json={json} />
      </div>
    </>
  );
}
```

`JsonCrackRef` methods:

- `zoomIn()`
- `zoomOut()`
- `setZoom(zoomFactor: number)`
- `centerView()`
- `focusFirstNode()`

## Utility: `parseGraph`

If you only need parser output:

```ts
import { parseGraph } from "jsoncrack";

const result = parseGraph('{"a":[1,2,3]}', { imagePreviewEnabled: true });
// result: { nodes, edges, errors }
```

## Exported Types

- `JsonCrackProps`
- `JsonCrackRef`
- `ParseGraphOptions`
- `ParseGraphResult`
- `CanvasThemeMode`
- `LayoutDirection`
- `NodeData`
- `EdgeData`
- `GraphData`
- `NodeRow`

## License

Apache-2.0
