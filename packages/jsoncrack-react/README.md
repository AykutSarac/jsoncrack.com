# jsoncrack-react

Reusable JSON graph canvas component from [JSON Crack](https://jsoncrack.com) — visualize JSON as interactive node graphs.

- React component API
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
import { JSONCrack } from "jsoncrack-react";

export function Example() {
  return (
    <div style={{ height: 700 }}>
      <JSONCrack
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
| `json` | `string \| object \| unknown[]` | - | JSON input data to visualize |
| `theme` | `"dark" \| "light"` | `"dark"` | Canvas theme |
| `layoutDirection` | `"LEFT" \| "RIGHT" \| "DOWN" \| "UP"` | `"RIGHT"` | Layout direction |
| `showControls` | `boolean` | `true` | Show built-in camera controls |
| `showGrid` | `boolean` | `true` | Show grid background |
| `trackpadZoom` | `boolean` | `false` | Enables two-finger trackpad gesture zoom behavior |
| `centerOnLayout` | `boolean` | `true` | Auto-center on first/major layout changes |
| `maxRenderableNodes` | `number` | `1500` | Node rendering safety limit |
| `className` | `string` | - | Wrapper class |
| `style` | `React.CSSProperties` | - | Wrapper inline style |
| `onNodeClick` | `(node: NodeData) => void` | - | Node click callback |
| `onParse` | `(graph: GraphData) => void` | - | Parsed graph callback |
| `onParseError` | `(error: Error) => void` | - | Parse error callback |
| `onViewportCreate` | `(viewPort: ViewPort) => void` | - | Viewport ready callback |
| `renderNodeLimitExceeded` | `(nodeCount: number, maxRenderableNodes: number) => React.ReactNode` | - | Custom fallback when node limit is exceeded |

## Performance

The component renders all nodes as SVG elements. For large inputs, rendering cost grows with the number of nodes.

- **Default limit:** `maxRenderableNodes` is set to `1500`. Graphs exceeding this render a fallback instead of the canvas.
- **Recommended range:** Up to ~300–500 nodes for smooth interaction. Beyond that, panning and zooming may feel sluggish depending on the device.
- **Reduce node count:** Flatten or trim your data before passing it in. Arrays of primitives become individual nodes, so large arrays expand the graph quickly.
- **Custom fallback:** Use `renderNodeLimitExceeded` to show a message or alternative UI when the limit is hit.

```tsx
<JSONCrack
  json={data}
  maxRenderableNodes={300}
  renderNodeLimitExceeded={(count, max) => (
    <p>Too large to render ({count} nodes, limit is {max})</p>
  )}
/>
```

## Imperative API (ref)

```tsx
import { useRef } from "react";
import { JSONCrack, type JSONCrackRef } from "jsoncrack-react";

export function WithRef({ json }: { json: string }) {
  const ref = useRef<JSONCrackRef>(null);

  return (
    <>
      <button onClick={() => ref.current?.centerView()}>Center</button>
      <button onClick={() => ref.current?.zoomIn()}>+</button>
      <button onClick={() => ref.current?.zoomOut()}>-</button>
      <div style={{ height: 600 }}>
        <JSONCrack ref={ref} json={json} />
      </div>
    </>
  );
}
```

`JSONCrackRef` methods:

- `zoomIn()`
- `zoomOut()`
- `setZoom(zoomFactor: number)`
- `centerView()`
- `focusFirstNode()`

## Utility: `parseGraph`

If you only need parser output:

```ts
import { parseGraph } from "jsoncrack-react";

const result = parseGraph('{"a":[1,2,3]}');
// result: { nodes, edges, errors }
```

## Exported Types

- `JSONCrackProps`
- `JSONCrackRef`
- `ParseGraphResult`
- `CanvasThemeMode`
- `LayoutDirection`
- `NodeData`
- `EdgeData`
- `GraphData`
- `NodeRow`

## License

Apache-2.0
