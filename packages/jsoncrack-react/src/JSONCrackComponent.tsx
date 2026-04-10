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

    // Unified viewport API: all five methods only need `viewPort`, so build them together and expose the same object to both the imperative handle and the built-in Controls.
    const viewPortApi = useMemo<JSONCrackRef>(
      () => ({
        zoomIn: () => adjustViewPortZoom(viewPort, 0.1),
        zoomOut: () => adjustViewPortZoom(viewPort, -0.1),
        setZoom: zoomFactor => setViewPortZoom(viewPort, zoomFactor),
        centerView: () => fitGraphToViewPort(viewPort, containerRef.current, layoutSizeRef.current),
        focusFirstNode: () => focusRootNode(viewPort, containerRef.current),
      }),
      [viewPort]
    );
    useImperativeHandle(ref, () => viewPortApi, [viewPortApi]);

    const edgeTargetById = useMemo(() => buildEdgeTargetMap(edges), [edges]);

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
      if (!viewPort || nodes.length === 0 || loading) return;
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
    }, [viewPort, nodes, loading, centerOnLayout, initialFitDone, paneWidth, paneHeight]);

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
          style={{ opacity: initialFitDone ? 1 : 0, transition: "opacity 120ms" }}
        >
          <Canvas
            className="jsoncrack-canvas"
            onLayoutChange={onLayoutChange}
            node={renderNode}
            edge={renderEdge}
            nodes={nodes}
            edges={edges}
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
            // pane. The default is `CanvasPosition.CENTER`, which translates
            // the content group by `(pane - layout) / 2` on every layout
            // pass. That plays poorly with our own fit-to-viewport logic:
            // at fit time the content is offset by the centering transform
            // inside a 2000×2000 default pane, so our measured client rect
            // lands hundreds of pixels below the container top, and the fit
            // computes a zoom/center based on that offset. Passing a nullish
            // `defaultPosition` makes reaflow leave the group at the svg
            // origin so our rect math matches reality.
            defaultPosition={null as unknown as undefined}
          />
        </Space>
      </div>
    );
  }
);

JSONCrack.displayName = "JSONCrack";
