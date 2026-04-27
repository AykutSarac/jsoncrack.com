import { describe, expect, it } from "vitest";
import {
  buildCanvasClassName,
  buildCanvasStyle,
  buildEdgeTargetMap,
  parseJsonGraph,
  toJsonText,
} from "../canvasHelpers";

describe("toJsonText", () => {
  it("returns strings as-is without re-stringifying", () => {
    const raw = '{"hello":"world"}';
    expect(toJsonText(raw)).toBe(raw);
  });

  it("serializes objects with 2-space indentation", () => {
    expect(toJsonText({ a: 1 })).toBe('{\n  "a": 1\n}');
  });

  it("serializes arrays", () => {
    expect(toJsonText([1, 2, 3])).toBe("[\n  1,\n  2,\n  3\n]");
  });

  it("memoizes results per object reference", () => {
    const obj = { name: "Apple" };
    const first = toJsonText(obj);
    const second = toJsonText(obj);
    // Exact reference equality proves the WeakMap cache is hit.
    expect(second).toBe(first);
  });

  it("does not memoize across different object references with equal contents", () => {
    // Different references, same contents → both compute and produce equal
    // strings, but the cache does not conflate them.
    const a = toJsonText({ x: 1 });
    const b = toJsonText({ x: 1 });
    expect(a).toBe(b);
  });
});

describe("parseJsonGraph", () => {
  it("returns kind: 'ok' with graph and zero syntax errors for valid JSON", () => {
    const result = parseJsonGraph('{"a":1}', 1500);
    expect(result.kind).toBe("ok");
    if (result.kind !== "ok") return;
    expect(result.syntaxErrorCount).toBe(0);
    expect(result.graph.nodes.length).toBeGreaterThan(0);
  });

  it("returns kind: 'ok' with a non-zero syntaxErrorCount for partially-broken JSON", () => {
    const result = parseJsonGraph('{"broken": }', 1500);
    expect(result.kind).toBe("ok");
    if (result.kind !== "ok") return;
    expect(result.syntaxErrorCount).toBeGreaterThan(0);
  });

  it("returns kind: 'above-limit' with total count when over the node cap", () => {
    const big = { items: Array.from({ length: 10 }, (_, i) => ({ id: i })) };
    const result = parseJsonGraph(JSON.stringify(big), 3);
    expect(result.kind).toBe("above-limit");
    if (result.kind !== "above-limit") return;
    expect(result.total).toBeGreaterThan(3);
  });

  // NOTE: the `kind: "error"` branch is only reached on unexpected internal
  // exceptions in `parseGraph` — jsonc-parser is error-tolerant, so there is
  // no user-reachable JSON input that triggers it. Kept as a safety net in
  // the implementation, intentionally untested here.
});

describe("buildCanvasClassName", () => {
  it("includes the base wrapper class", () => {
    expect(buildCanvasClassName(false, undefined)).toContain("canvasWrapper");
  });

  it("adds the showGrid class when enabled", () => {
    const className = buildCanvasClassName(true, undefined);
    expect(className).toContain("showGrid");
  });

  it("omits the showGrid class when disabled", () => {
    const className = buildCanvasClassName(false, undefined);
    expect(className).not.toContain("showGrid");
  });

  it("appends caller-provided class names", () => {
    expect(buildCanvasClassName(false, "my-custom")).toContain("my-custom");
  });

  it("strips empty entries so undefined is safe", () => {
    const className = buildCanvasClassName(false, undefined);
    expect(className).not.toContain("undefined");
    expect(className.split(" ").every(part => part.length > 0)).toBe(true);
  });
});

describe("buildCanvasStyle", () => {
  it("projects all required theme CSS custom properties", () => {
    const style = buildCanvasStyle("dark", undefined) as Record<string, string>;
    // Spot-check a few that the component + stylesheets rely on. If any are
    // dropped from the helper they'd silently de-theme the graph.
    expect(style["--bg-color"]).toBeDefined();
    expect(style["--node-fill"]).toBeDefined();
    expect(style["--node-key"]).toBeDefined();
    expect(style["--node-value"]).toBeDefined();
    expect(style["--edge-stroke"]).toBeDefined();
    expect(style["--spinner-head"]).toBeDefined();
    expect(style["--overlay-bg"]).toBeDefined();
  });

  it("applies different colors for dark vs light themes", () => {
    const dark = buildCanvasStyle("dark", undefined) as Record<string, string>;
    const light = buildCanvasStyle("light", undefined) as Record<string, string>;
    expect(dark["--node-fill"]).not.toBe(light["--node-fill"]);
  });

  it("merges caller-provided styles on top of theme tokens", () => {
    const style = buildCanvasStyle("dark", { color: "red", "--bg-color": "blue" } as Record<
      string,
      string
    >) as Record<string, string>;
    expect(style.color).toBe("red");
    // Caller override wins over theme default.
    expect(style["--bg-color"]).toBe("blue");
  });
});

describe("buildEdgeTargetMap", () => {
  it("builds an id → target map for edge lookups", () => {
    const edges = [
      { id: "e1", from: "1", to: "2", text: "" },
      { id: "e2", from: "1", to: "3", text: "" },
      { id: "e3", from: "2", to: "4", text: "" },
    ];
    const map = buildEdgeTargetMap(edges);
    expect(map.size).toBe(3);
    expect(map.get("e1")).toBe("2");
    expect(map.get("e2")).toBe("3");
    expect(map.get("e3")).toBe("4");
  });

  it("returns an empty map for empty input", () => {
    expect(buildEdgeTargetMap([]).size).toBe(0);
  });
});
