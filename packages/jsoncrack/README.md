# jsoncrack-react

Reusable JSON graph canvas component from [JSON Crack](https://jsoncrack.com) — visualize JSON, YAML, CSV and XML as interactive node graphs.

- React component API
- Built-in parsing from `string | object | unknown[]`
- Interactive canvas (pan/zoom + optional controls)
- TypeScript types included

[Live demo](https://jsoncrack.com) · [GitHub](https://github.com/AykutSarac/jsoncrack.com) · [npm](https://www.npmjs.com/package/jsoncrack-react)

## Install

```bash
npm install jsoncrack-react
```

Peer dependencies: `react >= 18`, `react-dom >= 18`

## Setup

Import the stylesheet once in your app entry point:

```ts
import "jsoncrack-react/style.css";
```

## Quick Start

```tsx
import { JsonCrack } from "jsoncrack-react";

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

The wrapper must have an explicit height.

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

## Performance

The component renders all nodes as SVG elements. For large inputs, rendering cost grows with the number of nodes.

- **Default limit:** `maxVisibleNodes` is set to `1500`. Graphs exceeding this render a fallback instead of the canvas.
- **Recommended range:** Up to ~300–500 nodes for smooth interaction. Beyond that, panning and zooming may feel sluggish depending on the device.
- **Reduce node count:** Flatten or trim your data before passing it in. Arrays of primitives become individual nodes, so large arrays expand the graph quickly.
- **Custom fallback:** Use `renderTooLarge` to show a message or alternative UI when the limit is hit.

```tsx
<JsonCrack
  json={data}
  maxVisibleNodes={300}
  renderTooLarge={(count, max) => (
    <p>Too large to render ({count} nodes, limit is {max})</p>
  )}
/>
```

## Imperative API (ref)

```tsx
import { useRef } from "react";
import { JsonCrack, type JsonCrackRef } from "jsoncrack-react";

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
import { parseGraph } from "jsoncrack-react";

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
