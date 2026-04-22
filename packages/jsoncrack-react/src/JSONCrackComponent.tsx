"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import type { JSONPath } from "jsonc-parser";
import type { ViewPort } from "react-zoomable-ui";
import { Space } from "react-zoomable-ui";
import { Canvas } from "reaflow";
import type { EdgeProps, ElkRoot, NodeProps } from "reaflow";
import { useLongPress } from "use-long-press";
import styles from "./JSONCrackStyles.module.css";
import {
  adjustViewPortZoom,
  buildCanvasClassName,
  buildCanvasStyle,
  buildEdgeTargetMap,
  fitGraphToViewPort,
  focusRootNode,
  parseJsonGraph,
  setCanvasDragging,
  setViewPortZoom,
  toJsonText,
  type JsonInput,
} from "./canvasHelpers";
import { CollapseContext, isNodeHidden, prunePaths } from "./components/CollapseContext";
import { Controls } from "./components/Controls";
import { CustomEdge } from "./components/CustomEdge";
import { CustomNode } from "./components/CustomNode";
import type { CanvasThemeMode, GraphData, LayoutDirection, NodeData } from "./types";

const layoutOptions = {
  "elk.layered.compaction.postCompaction.strategy": "EDGE_LENGTH",
  "elk.layered.nodePlacement.strategy": "NETWORK_SIMPLEX",
  "elk.spacing.edgeLabel": "15",
};

/** Imperative handle exposed via the component ref for viewport control. */
export interface JSONCrackRef {
  /** Nudge the current zoom factor up by one step while keeping center fixed. */
  zoomIn: () => void;
  /** Nudge the current zoom factor down by one step while keeping center fixed. */
  zoomOut: () => void;
  /** Set an absolute zoom factor at the current viewport center. */
  setZoom: (zoomFactor: number) => void;
  /** Fit-to-center the full graph inside the viewport. */
  centerView: () => void;
  /** Center and zoom on the root node of the graph. */
  focusFirstNode: () => void;
  /** Toggle collapse for a specific JSON path (uncontrolled mode only). */
  toggleCollapse: (path: JSONPath) => void;
  /** Collapse every first-level container of the root (uncontrolled mode only). */
  collapseAll: () => void;
  /** Clear all collapsed paths (uncontrolled mode only). */
  expandAll: () => void;
  /** Current collapsed-paths snapshot (serialized keys). */
  getCollapsedPaths: () => string[];
}

/** Props accepted by the `JSONCrack` component. */
export interface JSONCrackProps {
  /** JSON to visualize. Accepts a string or plain object. */
  json: JsonInput;
  /** Color theme applied to the canvas and nodes. Defaults to `dark`. */
  theme?: CanvasThemeMode;
  /** ELK layout direction for node placement. Defaults to `RIGHT`. */
  layoutDirection?: LayoutDirection;
  /** Whether to render the built-in zoom/focus control overlay. Defaults to `true`. */
  showControls?: boolean;
  /** Whether to draw the background grid. Defaults to `true`. */
  showGrid?: boolean;
  /** Treat two-finger trackpad gestures as touch (pinch-zoom, etc). Defaults to `false`. */
  trackpadZoom?: boolean;
  /** Auto fit-to-center after each ELK layout pass. Defaults to `true`. */
  centerOnLayout?: boolean;
  /** Hard cap on renderable nodes; exceeding it triggers the limit overlay. Defaults to `1500`. */
  maxRenderableNodes?: number;
  /** Additional class name appended to the canvas wrapper. */
  className?: string;
  /** Additional inline style merged onto the canvas wrapper. */
  style?: CSSProperties;
  /** Called when a node is clicked. */
  onNodeClick?: (node: NodeData) => void;
  /** Called with parsed `nodes`/`edges` after each successful parse. */
  onParse?: (graph: GraphData) => void;
  /** Called with any error thrown during JSON parsing or graph construction. */
  onParseError?: (error: Error) => void;
  /** Called once the internal `ViewPort` is created, before the first render. */
  onViewportCreate?: (viewPort: ViewPort) => void;
  /** Custom renderer shown when the graph exceeds `maxRenderableNodes`. */
  renderNodeLimitExceeded?: (nodeCount: number, maxRenderableNodes: number) => ReactNode;
  /**
   * Controlled collapsed-paths set (serialized via `pathKey` / `JSON.stringify`).
   * When provided, the component becomes controlled for collapse state and
   * `onToggleCollapse` is required to mutate it. When omitted, the component
   * manages collapse state internally.
   */
  collapsedPaths?: string[];
  /** Called with the `JSONPath` of a row's value when the user clicks a chevron (controlled mode). */
  onToggleCollapse?: (path: JSONPath) => void;
  /** Observe the internal collapsed-paths set (uncontrolled mode). */
  onCollapseChange?: (collapsedPaths: string[]) => void;
}

/** Interactive JSON-to-graph visualization. Forwards a `JSONCrackRef` for imperative viewport control. */
export const JSONCrack = forwardRef<JSONCrackRef, JSONCrackProps>(
  (
    {
      json,
      theme = "dark",
      layoutDirection = "RIGHT",
      showControls = true,
      showGrid = true,
      trackpadZoom = false,
      centerOnLayout = true,
      maxRenderableNodes = 1500,
      className,
      style,
      onNodeClick,
      onParse,
      onParseError,
      onViewportCreate,
      renderNodeLimitExceeded,
      collapsedPaths: controlledCollapsedPaths,
      onToggleCollapse: controlledOnToggle,
      onCollapseChange,
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [viewPort, setViewPort] = useState<ViewPort | null>(null);
    const [nodes, setNodes] = useState<GraphData["nodes"]>([]);
    const [edges, setEdges] = useState<GraphData["edges"]>([]);
    const [loading, setLoading] = useState(true);
    const [initialFitDone, setInitialFitDone] = useState(false);
    const [aboveSupportedLimit, setAboveSupportedLimit] = useState(false);
    const [totalNodes, setTotalNodes] = useState(0);
    const [paneWidth, setPaneWidth] = useState(2000);
    const [paneHeight, setPaneHeight] = useState(2000);
    const layoutSizeRef = useRef<{ width: number; height: number } | null>(null);

    // Ref-mirror consumer callbacks so the parse effect / onCreate callbacks can read the latest without re-running.
    const callbacksRef = useRef({ onParse, onParseError });
    const onViewportCreateRef = useRef(onViewportCreate);
    useEffect(() => {
      callbacksRef.current = { onParse, onParseError };
    }, [onParse, onParseError]);
    useEffect(() => {
      onViewportCreateRef.current = onViewportCreate;
    }, [onViewportCreate]);

    // Memoize the class/style so reaflow doesn't see a new style object every render.
    const canvasClassName = useMemo(
      () => buildCanvasClassName(showGrid, className),
      [showGrid, className]
    );
    const canvasStyle = useMemo(() => buildCanvasStyle(theme, style), [theme, style]);

    // Normalize `json` to a string once per reference. Memoized so the parse effect can depend on a primitive.
    const jsonText = useMemo(() => toJsonText(json), [json]);

    // Parse → dispatch to React state. The pure helper keeps the effect body tiny.
    useEffect(() => {
      setLoading(true);
      setInitialFitDone(false);
      const result = parseJsonGraph(jsonText, maxRenderableNodes);

      if (result.kind === "error") {
        setNodes([]);
        setEdges([]);
        setLoading(false);
        callbacksRef.current.onParseError?.(result.error);
        return;
      }

      if (result.kind === "above-limit") {
        setTotalNodes(result.total);
        setAboveSupportedLimit(true);
        setNodes([]);
        setEdges([]);
        setLoading(false);
        return;
      }

      const { graph, syntaxErrorCount } = result;
      if (syntaxErrorCount > 0) {
        callbacksRef.current.onParseError?.(
          new Error(`Failed to parse data (${syntaxErrorCount} syntax error(s)).`)
        );
      }
      setTotalNodes(graph.nodes.length);
      setAboveSupportedLimit(false);
      setNodes(graph.nodes);
      setEdges(graph.edges);
      callbacksRef.current.onParse?.({ nodes: graph.nodes, edges: graph.edges });
      if (graph.nodes.length === 0) setLoading(false);
    }, [jsonText, maxRenderableNodes]);

    // Keep the viewport in sync with container resizes — react-zoomable-ui snapshots dimensions at creation and does not re-measure on its own.
    useEffect(() => {
      if (!viewPort) return;
      const container = containerRef.current;
      if (!container || typeof ResizeObserver === "undefined") return;

      const observer = new ResizeObserver(() => {
        if (container.clientWidth === 0 || container.clientHeight === 0) return;
        viewPort.updateContainerSize();
      });

      observer.observe(container);
      return () => observer.disconnect();
    }, [viewPort]);

    const viewPortApi = useMemo(
      () => ({
        zoomIn: () => adjustViewPortZoom(viewPort, 0.1),
        zoomOut: () => adjustViewPortZoom(viewPort, -0.1),
        setZoom: (zoomFactor: number) => setViewPortZoom(viewPort, zoomFactor),
        centerView: () => fitGraphToViewPort(viewPort, containerRef.current, layoutSizeRef.current),
        focusFirstNode: () => focusRootNode(viewPort, containerRef.current),
      }),
      [viewPort]
    );

    // Uncontrolled collapse state. `controlledCollapsedPaths` takes precedence when provided.
    const [internalCollapsedPaths, setInternalCollapsedPaths] = useState<string[]>([]);
    const isControlled = controlledCollapsedPaths !== undefined;
    const collapsedPaths = isControlled ? controlledCollapsedPaths : internalCollapsedPaths;

    const onCollapseChangeRef = useRef(onCollapseChange);
    useEffect(() => {
      onCollapseChangeRef.current = onCollapseChange;
    }, [onCollapseChange]);

    // Prune internally-held collapsed paths that no longer resolve to an
    // object/array in the current data (e.g., after a JSON edit).
    useEffect(() => {
      if (isControlled) return;
      if (internalCollapsedPaths.length === 0) return;
      const kept = prunePaths(jsonText, internalCollapsedPaths);
      if (kept.length !== internalCollapsedPaths.length) setInternalCollapsedPaths(kept);
    }, [jsonText, internalCollapsedPaths, isControlled]);

    const collapsedSet = useMemo(() => new Set(collapsedPaths ?? []), [collapsedPaths]);

    // Pre-parse the serialized paths once per collapsedSet change so the
    // per-node prefix check doesn't re-parse on every iteration.
    const collapsedPrefixes = useMemo<JSONPath[]>(() => {
      if (collapsedSet.size === 0) return [];
      const out: JSONPath[] = [];
      for (const key of collapsedSet) {
        try {
          out.push(JSON.parse(key) as JSONPath);
        } catch {
          // skip malformed entries
        }
      }
      return out;
    }, [collapsedSet]);

    const { visibleNodes, visibleEdges } = useMemo(() => {
      if (collapsedPrefixes.length === 0) return { visibleNodes: nodes, visibleEdges: edges };
      const hiddenIds = new Set<string>();
      const keptNodes: typeof nodes = [];
      for (const node of nodes) {
        if (isNodeHidden(collapsedPrefixes, node.path)) {
          hiddenIds.add(node.id);
        } else {
          keptNodes.push(node);
        }
      }
      const keptEdges = edges.filter(edge => !hiddenIds.has(edge.from) && !hiddenIds.has(edge.to));
      return { visibleNodes: keptNodes, visibleEdges: keptEdges };
    }, [nodes, edges, collapsedPrefixes]);

    // Remember where a collapse button sat on screen at click time so the
    // post-layout camera pan can pin it back under the cursor.
    const pendingRecenterRef = useRef<{
      key: string;
      clientX: number;
      clientY: number;
    } | null>(null);
    // While a collapse-toggle is mid-flight (ELK running, pan pending) we
    // fade the canvas to hide the intermediate shifted layout — otherwise the
    // user sees a flash of the un-pinned graph before the camera recenters.
    const [isRelayouting, setIsRelayouting] = useState(false);

    const findCollapseButton = useCallback((key: string): HTMLElement | null => {
      const container = containerRef.current;
      if (!container) return null;
      const buttons = container.querySelectorAll<HTMLElement>("[data-collapse-path]");
      for (let i = 0; i < buttons.length; i += 1) {
        if (buttons[i].getAttribute("data-collapse-path") === key) return buttons[i];
      }
      return null;
    }, []);

    const wrappedToggleCollapse = useCallback(
      (path: JSONPath) => {
        const key = JSON.stringify(path);
        const btn = findCollapseButton(key);
        if (btn) {
          const rect = btn.getBoundingClientRect();
          pendingRecenterRef.current = {
            key,
            clientX: rect.left + rect.width / 2,
            clientY: rect.top + rect.height / 2,
          };
          setIsRelayouting(true);
        } else {
          pendingRecenterRef.current = null;
        }
        if (isControlled) {
          controlledOnToggle?.(path);
          return;
        }
        setInternalCollapsedPaths(prev => {
          const next = prev.includes(key) ? prev.filter(p => p !== key) : [...prev, key];
          onCollapseChangeRef.current?.(next);
          return next;
        });
      },
      [isControlled, controlledOnToggle, findCollapseButton]
    );

    const collapseContextValue = useMemo(
      () => ({ collapsedSet, onToggleCollapse: wrappedToggleCollapse }),
      [collapsedSet, wrappedToggleCollapse]
    );

    const collapsedPathsRef = useRef(collapsedPaths);
    collapsedPathsRef.current = collapsedPaths;

    const collapseApi = useMemo(
      () => ({
        toggleCollapse: (path: JSONPath) => wrappedToggleCollapse(path),
        collapseAll: () => {
          if (isControlled) return;
          let parsed: unknown;
          try {
            parsed = JSON.parse(jsonText);
          } catch {
            return;
          }
          if (!parsed || typeof parsed !== "object") return;
          const keys = Array.isArray(parsed)
            ? parsed.map((_, i) => i)
            : Object.keys(parsed as Record<string, unknown>);
          const next: string[] = [];
          for (const k of keys) {
            const v = (parsed as Record<string | number, unknown>)[k as string & number];
            if (v && typeof v === "object") {
              if (Array.isArray(v) && v.length === 0) continue;
              if (!Array.isArray(v) && Object.keys(v).length === 0) continue;
              next.push(JSON.stringify([k]));
            }
          }
          setInternalCollapsedPaths(next);
          onCollapseChangeRef.current?.(next);
        },
        expandAll: () => {
          if (isControlled) return;
          setInternalCollapsedPaths([]);
          onCollapseChangeRef.current?.([]);
        },
        getCollapsedPaths: () => collapsedPathsRef.current ?? [],
      }),
      [isControlled, jsonText, wrappedToggleCollapse]
    );

    useImperativeHandle(ref, () => ({ ...viewPortApi, ...collapseApi }), [
      viewPortApi,
      collapseApi,
    ]);

    const edgeTargetById = useMemo(() => buildEdgeTargetMap(visibleEdges), [visibleEdges]);

    // Signal "relayouting" whenever the collapsed-set changes so the spinner
    // appears immediately on collapse/expand. JSON edits already route
    // through the parse effect which handles `setLoading(true)` on its own,
    // so we scope this trigger to collapse toggles only.
    const visibleNodesRef = useRef(visibleNodes);
    visibleNodesRef.current = visibleNodes;
    const isFirstCollapsedPassRef = useRef(true);
    useEffect(() => {
      if (isFirstCollapsedPassRef.current) {
        isFirstCollapsedPassRef.current = false;
        return;
      }
      if (visibleNodesRef.current.length > 0) setLoading(true);
    }, [collapsedSet]);

    const onLayoutChange = useCallback((layout: ElkRoot) => {
      if (!layout.width || !layout.height) {
        setLoading(false);
        return;
      }

      layoutSizeRef.current = { width: layout.width, height: layout.height };
      setPaneWidth(layout.width + 50);
      setPaneHeight(layout.height + 50);
      setLoading(false);
    }, []);

    // After a collapse toggle triggers relayout, pin the clicked button back
    // under the cursor. We poll each rAF until the button's rect is stable
    // for two consecutive frames (reaflow runs ELK + framer-motion commits
    // the new transforms over several frames on large graphs), then shift
    // the camera by the measured screen-pixel delta.
    useEffect(() => {
      const pending = pendingRecenterRef.current;
      if (!pending) return;
      pendingRecenterRef.current = null;

      let cancelled = false;
      let attempts = 0;
      let lastX: number | null = null;
      let lastY: number | null = null;
      let movementSeen = false;
      const MAX_ATTEMPTS = 180;

      const finish = (x?: number, y?: number) => {
        if (x !== undefined && y !== undefined) {
          const dx = x - pending.clientX;
          const dy = y - pending.clientY;
          if (Math.abs(dx) >= 1 || Math.abs(dy) >= 1) {
            viewPort?.camera?.moveByInClientSpace(dx, dy);
          }
        }
        setIsRelayouting(false);
      };

      const tick = () => {
        if (cancelled) return;
        attempts += 1;
        const btn = findCollapseButton(pending.key);
        if (!btn) {
          if (attempts < MAX_ATTEMPTS) requestAnimationFrame(tick);
          else finish();
          return;
        }
        const rect = btn.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;

        if (lastX !== null) {
          const moved = Math.abs(x - lastX) >= 0.5 || Math.abs(y - (lastY ?? 0)) >= 0.5;
          if (moved) {
            movementSeen = true;
          } else if (movementSeen) {
            // Stabilised after detected movement — safe to apply.
            finish(x, y);
            return;
          }
        }

        lastX = x;
        lastY = y;

        if (attempts < MAX_ATTEMPTS) {
          requestAnimationFrame(tick);
        } else if (movementSeen) {
          finish(x, y);
        } else {
          finish();
        }
      };

      const rafId = requestAnimationFrame(tick);
      return () => {
        cancelled = true;
        cancelAnimationFrame(rafId);
        setIsRelayouting(false);
      };
    }, [visibleNodes, visibleEdges, viewPort, findCollapseButton]);

    // Auto-fit on initial load / new data. Gated on `paneWidth`/`paneHeight`
    // as deps: `onLayoutChange` batches the pane-size state updates with
    // `setLoading(false)` in the same commit, so by the time this effect
    // runs the svg has its final width/height attributes and reaflow has
    // finished reconciling. A single rAF then lets paint catch up before
    // measurement.
    useEffect(() => {
      if (initialFitDone) return;
      if (!centerOnLayout) {
        setInitialFitDone(true);
        return;
      }
      if (!viewPort || visibleNodes.length === 0 || loading) return;
      if (!layoutSizeRef.current) return;

      let cancelled = false;
      const rafId = window.requestAnimationFrame(() => {
        if (cancelled) return;
        fitGraphToViewPort(viewPort, containerRef.current, layoutSizeRef.current);
        setInitialFitDone(true);
      });
      return () => {
        cancelled = true;
        window.cancelAnimationFrame(rafId);
      };
    }, [viewPort, visibleNodes, loading, centerOnLayout, initialFitDone, paneWidth, paneHeight]);

    // Stable render factories so reaflow doesn't re-key nodes/edges on every parent render.
    const renderNode = useCallback(
      (nodeProps: NodeProps) => <CustomNode {...nodeProps} onNodeClick={onNodeClick} />,
      [onNodeClick]
    );
    const renderEdge = useCallback(
      (edgeProps: EdgeProps) => (
        <CustomEdge
          {...edgeProps}
          viewPort={viewPort}
          edgeTargetById={edgeTargetById}
          hostElement={containerRef.current}
        />
      ),
      [viewPort, edgeTargetById]
    );

    const bindLongPress = useLongPress(() => setCanvasDragging(containerRef.current, true), {
      threshold: 150,
      onFinish: () => setCanvasDragging(containerRef.current, false),
    });

    const tooLargeContent = renderNodeLimitExceeded?.(totalNodes, maxRenderableNodes);

    return (
      <div
        ref={containerRef}
        className={canvasClassName}
        style={canvasStyle}
        role="img"
        aria-label="JSON data visualization"
        onContextMenu={event => event.preventDefault()}
        {...bindLongPress()}
      >
        {showControls && (
          <Controls
            onFocusRoot={viewPortApi.focusFirstNode}
            onCenterView={viewPortApi.centerView}
            onZoomOut={viewPortApi.zoomOut}
            onZoomIn={viewPortApi.zoomIn}
          />
        )}

        {aboveSupportedLimit &&
          (tooLargeContent ? (
            tooLargeContent
          ) : (
            <div className={styles.tooLarge}>
              {`This graph has ${totalNodes} nodes and exceeds the maxRenderableNodes limit (${maxRenderableNodes}).`}
            </div>
          ))}

        {loading && (
          <div className={styles.overlay}>
            <div className={styles.spinner} />
          </div>
        )}

        <Space
          onCreate={nextViewPort => {
            setViewPort(nextViewPort);
            onViewportCreateRef.current?.(nextViewPort);
          }}
          onContextMenu={event => event.preventDefault()}
          treatTwoFingerTrackPadGesturesLikeTouch={trackpadZoom}
          className="jsoncrack-space"
          style={{
            opacity: initialFitDone && !isRelayouting ? 1 : 0,
            visibility: isRelayouting ? "hidden" : "visible",
            transition: "opacity 120ms",
          }}
        >
          <CollapseContext.Provider value={collapseContextValue}>
            <Canvas
              className="jsoncrack-canvas"
              onLayoutChange={onLayoutChange}
              node={renderNode}
              edge={renderEdge}
              nodes={visibleNodes}
              edges={visibleEdges}
              arrow={null}
              maxHeight={paneHeight}
              maxWidth={paneWidth}
              height={paneHeight}
              width={paneWidth}
              direction={layoutDirection}
              layoutOptions={layoutOptions}
              key={layoutDirection}
              pannable={false}
              zoomable={false}
              animated={false}
              readonly
              dragEdge={null}
              dragNode={null}
              // Disable reaflow's built-in auto-centering of content inside the
              // pane. Passing a nullish `defaultPosition` makes reaflow leave
              // the group at the svg origin so our fit-to-viewport rect math
              // matches reality.
              defaultPosition={null as unknown as undefined}
            />
          </CollapseContext.Provider>
        </Space>
      </div>
    );
  }
);

JSONCrack.displayName = "JSONCrack";
