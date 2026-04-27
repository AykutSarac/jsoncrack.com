import type { CSSProperties } from "react";
import type { ViewPort } from "react-zoomable-ui";
import styles from "./JSONCrackStyles.module.css";
import { parseGraph } from "./parser";
import { themes } from "./theme";
import type { CanvasThemeMode, GraphData } from "./types";

export type JsonInput = string | object;

const objectJsonCache = new WeakMap<object, string>();

/** Normalize the `json` prop to a string, memoizing per object instance to avoid re-stringifying unchanged references. */
export const toJsonText = (json: JsonInput): string => {
  if (typeof json === "string") return json;

  if (json && typeof json === "object") {
    const cached = objectJsonCache.get(json);
    if (cached) return cached;

    const serialized = JSON.stringify(json, null, 2);
    objectJsonCache.set(json, serialized);
    return serialized;
  }

  return JSON.stringify(json, null, 2);
};

/** Compose the `className` applied to the canvas wrapper, stripping empty entries. */
export const buildCanvasClassName = (showGrid: boolean, userClassName?: string): string =>
  [styles.canvasWrapper, showGrid ? styles.showGrid : "", userClassName].filter(Boolean).join(" ");

/** Project theme tokens onto CSS custom properties for the canvas wrapper, merging any caller-provided style on top. */
export const buildCanvasStyle = (
  theme: CanvasThemeMode,
  userStyle?: CSSProperties
): CSSProperties => {
  const themeTokens = themes[theme];
  const isDark = theme === "dark";

  return {
    "--bg-color": themeTokens.GRID_BG_COLOR,
    "--line-color-1": themeTokens.GRID_COLOR_PRIMARY,
    "--line-color-2": themeTokens.GRID_COLOR_SECONDARY,
    "--edge-stroke": isDark ? "#444444" : "#BCBEC0",
    "--node-fill": isDark ? "#292929" : "#ffffff",
    "--node-stroke": isDark ? "#424242" : "#BCBEC0",
    "--interactive-normal": themeTokens.INTERACTIVE_NORMAL,
    "--background-node": themeTokens.BACKGROUND_NODE,
    "--node-text": themeTokens.NODE_COLORS.TEXT,
    "--node-key": themeTokens.NODE_COLORS.NODE_KEY,
    "--node-value": themeTokens.NODE_COLORS.NODE_VALUE,
    "--node-integer": themeTokens.NODE_COLORS.INTEGER,
    "--node-null": themeTokens.NODE_COLORS.NULL,
    "--node-bool-true": themeTokens.NODE_COLORS.BOOL.TRUE,
    "--node-bool-false": themeTokens.NODE_COLORS.BOOL.FALSE,
    "--node-child-count": themeTokens.NODE_COLORS.CHILD_COUNT,
    "--node-divider": themeTokens.NODE_COLORS.DIVIDER,
    "--text-positive": themeTokens.TEXT_POSITIVE,
    "--background-modifier-accent": themeTokens.BACKGROUND_MODIFIER_ACCENT,
    "--spinner-track": isDark ? "rgba(255, 255, 255, 0.3)" : "rgba(17, 24, 39, 0.2)",
    "--spinner-head": isDark ? "#FFFFFF" : "#111827",
    "--overlay-bg": isDark ? "rgba(0, 0, 0, 0.2)" : "rgba(255, 255, 255, 0.38)",
    ...userStyle,
  } as CSSProperties;
};

/** Discriminated result of parsing JSON text into a graph. */
export type ParseJsonGraphResult =
  | { kind: "ok"; graph: GraphData; syntaxErrorCount: number }
  | { kind: "above-limit"; total: number }
  | { kind: "error"; error: Error };

/** Parse a JSON text into a graph, returning a discriminated result instead of throwing or touching React state. */
export const parseJsonGraph = (
  jsonText: string,
  maxRenderableNodes: number
): ParseJsonGraphResult => {
  try {
    const graph = parseGraph(jsonText);
    if (graph.nodes.length > maxRenderableNodes) {
      return { kind: "above-limit", total: graph.nodes.length };
    }
    return { kind: "ok", graph, syntaxErrorCount: graph.errors.length };
  } catch (error) {
    return {
      kind: "error",
      error: error instanceof Error ? error : new Error("Unable to parse data."),
    };
  }
};

/** Build a map from edge id → target node id for O(1) lookups in edge renderers. */
export const buildEdgeTargetMap = (edges: GraphData["edges"]): Map<string, string> => {
  const targetById = new Map<string, string>();
  for (let i = 0; i < edges.length; i += 1) {
    const edge = edges[i];
    targetById.set(edge.id, edge.to);
  }
  return targetById;
};

/** Toggle reaflow's `dragging` class on the canvas div to suppress pointer events during long-press panning. */
export const setCanvasDragging = (container: HTMLElement | null, dragging: boolean): void => {
  const canvas = container?.querySelector(".jsoncrack-canvas") as HTMLElement | null;
  if (!canvas) return;
  canvas.classList.toggle("dragging", dragging);
};

/** Breathing room around the measured graph rect, expressed as a fraction of the rect's own dimensions. Using a fraction (instead of a fixed pixel value) is scale-invariant: whether we measure the graph at zoom 1 or at zoom 0.27, the padded rect expands by the same *proportion*, so translating through `translateClientRectToVirtualSpace` produces the same virtual rect regardless of current zoom. A fixed client-pixel padding would blow up in virtual space as zoom decreases and make manual Fit clicks land at a different zoom than the initial auto-fit. */
const GRAPH_FIT_PADDING_RATIO = 0.02;

/** Union the on-screen client rects of every reaflow-assigned leaf (`g[id]`) inside the content group. Measuring leaves instead of the motion wrapper avoids two measurement bugs: (a) `getBoundingClientRect()` on the outer motion `<g>` can under-report stroke extents when framer-motion's CSS transform is applied, and (b) curved edge paths can bulge past the straight-line endpoint box. Each reaflow node/edge is wrapped in a `g` with an id; their leaf rects are stroke-inclusive and collectively cover everything that actually paints. */
const unionContentGroupLeafRects = (
  contentGroup: SVGGElement
): { left: number; top: number; width: number; height: number } | null => {
  const leaves = contentGroup.querySelectorAll("g[id]");
  let left = Number.POSITIVE_INFINITY;
  let top = Number.POSITIVE_INFINITY;
  let right = Number.NEGATIVE_INFINITY;
  let bottom = Number.NEGATIVE_INFINITY;
  let found = false;

  for (let i = 0; i < leaves.length; i += 1) {
    const rect = leaves[i].getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) continue;
    if (rect.left < left) left = rect.left;
    if (rect.top < top) top = rect.top;
    if (rect.right > right) right = rect.right;
    if (rect.bottom > bottom) bottom = rect.bottom;
    found = true;
  }

  if (!found) return null;
  return { left, top, width: right - left, height: bottom - top };
};

/** Project a user-space rectangle through a DOMMatrix to an axis-aligned client-space rect. */
const projectRectThroughMatrix = (
  svg: SVGSVGElement,
  matrix: DOMMatrix,
  x: number,
  y: number,
  width: number,
  height: number
): { left: number; top: number; width: number; height: number } => {
  const origin = svg.createSVGPoint();
  origin.x = x;
  origin.y = y;
  const corner = svg.createSVGPoint();
  corner.x = x + width;
  corner.y = y + height;
  const a = origin.matrixTransform(matrix);
  const b = corner.matrixTransform(matrix);
  return {
    left: Math.min(a.x, b.x),
    top: Math.min(a.y, b.y),
    width: Math.abs(b.x - a.x),
    height: Math.abs(b.y - a.y),
  };
};

/** Derive the graph's on-screen client rect. Measurement cascade: (1) union of each direct child of the reaflow content group's client rect — ground truth for whatever is actually painted; (2) `getBoundingClientRect()` on the content group itself — accurate for most shapes but under-reports curved-edge bulges on some browsers; (3) `getBBox()` projected through the group's `getScreenCTM()` — layout-based, works through `visibility: hidden`; (4) ELK layout box through the svg CTM — last-resort fallback before layout has geometry. The result is inflated by {@link GRAPH_FIT_PADDING_RATIO} on each side. */
export const computeGraphClientRect = (
  container: HTMLElement | null,
  layoutSize: { width: number; height: number } | null
): DOMRect | null => {
  if (!container) return null;

  const svg = container.querySelector(".jsoncrack-canvas svg") as SVGSVGElement | null;
  if (!svg) return null;

  let raw: { left: number; top: number; width: number; height: number } | null = null;
  const contentGroup = svg.querySelector(":scope > g") as SVGGElement | null;

  if (contentGroup) {
    raw = unionContentGroupLeafRects(contentGroup);
  }

  if (!raw && contentGroup) {
    const rect = contentGroup.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      raw = { left: rect.left, top: rect.top, width: rect.width, height: rect.height };
    }
  }

  if (!raw && contentGroup && typeof contentGroup.getScreenCTM === "function") {
    try {
      const bbox = contentGroup.getBBox();
      const ctm = contentGroup.getScreenCTM();
      if (ctm && bbox.width > 0 && bbox.height > 0) {
        raw = projectRectThroughMatrix(svg, ctm, bbox.x, bbox.y, bbox.width, bbox.height);
      }
    } catch {
      // getBBox can throw on detached / display:none elements; fall through.
    }
  }

  if (
    !raw &&
    layoutSize &&
    layoutSize.width > 0 &&
    layoutSize.height > 0 &&
    typeof svg.getScreenCTM === "function"
  ) {
    const ctm = svg.getScreenCTM();
    if (ctm) {
      raw = projectRectThroughMatrix(svg, ctm, 0, 0, layoutSize.width, layoutSize.height);
    }
  }

  if (!raw || raw.width <= 0 || raw.height <= 0) return null;

  const padX = raw.width * GRAPH_FIT_PADDING_RATIO;
  const padY = raw.height * GRAPH_FIT_PADDING_RATIO;
  return DOMRect.fromRect({
    x: raw.left - padX,
    y: raw.top - padY,
    width: raw.width + padX * 2,
    height: raw.height + padY * 2,
  });
};

/** Fit-to-center the graph inside the viewport using the derived content rect. No-op if the rect can't be computed — the caller is expected to retry on the next render. */
export const fitGraphToViewPort = (
  viewPort: ViewPort | null,
  container: HTMLElement | null,
  layoutSize: { width: number; height: number } | null
): void => {
  if (!viewPort || !container) return;

  viewPort.updateContainerSize();

  const rect = computeGraphClientRect(container, layoutSize);
  if (!rect) return;

  const virtualRect = viewPort.translateClientRectToVirtualSpace(rect);
  viewPort.camera?.centerFitAreaIntoView(virtualRect);
};

/** Center and zoom on the graph's root node with a 100px breathing margin. */
export const focusRootNode = (viewPort: ViewPort | null, container: HTMLElement | null): void => {
  if (!viewPort || !container) return;
  const rootNode = container.querySelector("g[id$='node-1']") as HTMLElement | null;
  if (!rootNode) return;
  viewPort.camera?.centerFitElementIntoView(rootNode, {
    elementExtraMarginForZoom: 100,
  });
};

/** Recenter the camera at its current center with a new absolute zoom factor. */
export const setViewPortZoom = (viewPort: ViewPort | null, zoomFactor: number): void => {
  if (!viewPort) return;
  viewPort.camera?.recenter(viewPort.centerX, viewPort.centerY, zoomFactor);
};

/** Nudge the current zoom factor by `delta` while keeping the center fixed. */
export const adjustViewPortZoom = (viewPort: ViewPort | null, delta: number): void => {
  if (!viewPort) return;
  viewPort.camera?.recenter(viewPort.centerX, viewPort.centerY, viewPort.zoomFactor + delta);
};
