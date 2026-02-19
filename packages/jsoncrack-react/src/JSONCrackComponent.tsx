"use client";

import React from "react";
import type { ViewPort } from "react-zoomable-ui";
import { Space } from "react-zoomable-ui";
import { Canvas } from "reaflow";
import type { ElkRoot } from "reaflow";
import styles from "./JSONCrackStyles.module.css";
import { Controls } from "./components/Controls";
import { CustomEdge } from "./components/CustomEdge";
import { CustomNode } from "./components/CustomNode";
import { parseGraph } from "./parser";
import { themes } from "./theme";
import type { CanvasThemeMode, GraphData, LayoutDirection, NodeData } from "./types";

const layoutOptions = {
  "elk.layered.compaction.postCompaction.strategy": "EDGE_LENGTH",
  "elk.layered.nodePlacement.strategy": "NETWORK_SIMPLEX",
  "elk.spacing.edgeLabel": "15",
};

const objectJsonCache = new WeakMap<object, string>();

export interface JSONCrackRef {
  zoomIn: () => void;
  zoomOut: () => void;
  setZoom: (zoomFactor: number) => void;
  centerView: () => void;
  focusFirstNode: () => void;
}

export interface JSONCrackProps {
  json: string | object | unknown[];
  theme?: CanvasThemeMode;
  layoutDirection?: LayoutDirection;
  showControls?: boolean;
  showGrid?: boolean;
  trackpadZoom?: boolean;
  centerOnLayout?: boolean;
  maxRenderableNodes?: number;
  className?: string;
  style?: React.CSSProperties;
  onNodeClick?: (node: NodeData) => void;
  onParse?: (graph: GraphData) => void;
  onParseError?: (error: Error) => void;
  onViewportCreate?: (viewPort: ViewPort) => void;
  renderNodeLimitExceeded?: (nodeCount: number, maxRenderableNodes: number) => React.ReactNode;
}

const toJsonText = (json: JSONCrackProps["json"]): string => {
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

export const JSONCrack = React.forwardRef<JSONCrackRef, JSONCrackProps>(
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
    const themeTokens = themes[theme];
    const containerRef = React.useRef<HTMLDivElement | null>(null);
    const [viewPort, setViewPort] = React.useState<ViewPort | null>(null);
    const [nodes, setNodes] = React.useState<GraphData["nodes"]>([]);
    const [edges, setEdges] = React.useState<GraphData["edges"]>([]);
    const [loading, setLoading] = React.useState(true);
    const [aboveSupportedLimit, setAboveSupportedLimit] = React.useState(false);
    const [totalNodes, setTotalNodes] = React.useState(0);
    const [paneWidth, setPaneWidth] = React.useState(2000);
    const [paneHeight, setPaneHeight] = React.useState(2000);
    const hasAutoFittedRef = React.useRef(false);
    const previousLayoutAreaRef = React.useRef<number | null>(null);
    const callbacksRef = React.useRef({ onParse, onParseError });
    const onViewportCreateRef = React.useRef(onViewportCreate);
    const lastParsedInputRef = React.useRef<{
      jsonText: string;
      maxRenderableNodes: number;
    } | null>(null);

    React.useEffect(() => {
      callbacksRef.current = { onParse, onParseError };
    }, [onParse, onParseError]);

    React.useEffect(() => {
      onViewportCreateRef.current = onViewportCreate;
    }, [onViewportCreate]);

    React.useEffect(() => {
      hasAutoFittedRef.current = false;
      previousLayoutAreaRef.current = null;
    }, [layoutDirection]);

    const centerView = React.useCallback(() => {
      const nextViewPort = viewPort;
      nextViewPort?.updateContainerSize();

      const canvas = containerRef.current?.querySelector(".jsoncrack-canvas") as HTMLElement | null;
      if (canvas) {
        nextViewPort?.camera?.centerFitElementIntoView(canvas);
      }
    }, [viewPort]);

    const focusFirstNode = React.useCallback(() => {
      const rootNode = containerRef.current?.querySelector("g[id$='node-1']") as HTMLElement | null;
      if (!rootNode) return;

      viewPort?.camera?.centerFitElementIntoView(rootNode, {
        elementExtraMarginForZoom: 100,
      });
    }, [viewPort]);

    const setZoom = React.useCallback(
      (zoomFactor: number) => {
        if (!viewPort) return;
        viewPort.camera?.recenter(viewPort.centerX, viewPort.centerY, zoomFactor);
      },
      [viewPort]
    );

    const zoomIn = React.useCallback(() => {
      if (!viewPort) return;
      viewPort.camera?.recenter(viewPort.centerX, viewPort.centerY, viewPort.zoomFactor + 0.1);
    }, [viewPort]);

    const zoomOut = React.useCallback(() => {
      if (!viewPort) return;
      viewPort.camera?.recenter(viewPort.centerX, viewPort.centerY, viewPort.zoomFactor - 0.1);
    }, [viewPort]);

    React.useImperativeHandle(
      ref,
      () => ({
        zoomIn,
        zoomOut,
        setZoom,
        centerView,
        focusFirstNode,
      }),
      [centerView, focusFirstNode, setZoom, zoomIn, zoomOut]
    );

    React.useEffect(() => {
      try {
        const jsonText = toJsonText(json);
        const lastParsedInput = lastParsedInputRef.current;

        if (
          lastParsedInput &&
          lastParsedInput.jsonText === jsonText &&
          lastParsedInput.maxRenderableNodes === maxRenderableNodes
        ) {
          return;
        }

        setLoading(true);

        const graph = parseGraph(jsonText);

        if (graph.errors.length > 0) {
          callbacksRef.current.onParseError?.(
            new Error(`Failed to parse data (${graph.errors.length} syntax error(s)).`)
          );
        }

        setTotalNodes(graph.nodes.length);

        if (graph.nodes.length > maxRenderableNodes) {
          setAboveSupportedLimit(true);
          setNodes([]);
          setEdges([]);
          setLoading(false);
          lastParsedInputRef.current = {
            jsonText,
            maxRenderableNodes,
          };
          return;
        }

        setAboveSupportedLimit(false);
        setNodes(graph.nodes);
        setEdges(graph.edges);
        callbacksRef.current.onParse?.({
          nodes: graph.nodes,
          edges: graph.edges,
        });
        lastParsedInputRef.current = {
          jsonText,
          maxRenderableNodes,
        };

        if (graph.nodes.length === 0) {
          setLoading(false);
        }
      } catch (error) {
        setNodes([]);
        setEdges([]);
        setLoading(false);
        callbacksRef.current.onParseError?.(
          error instanceof Error ? error : new Error("Unable to parse data.")
        );
      }
    }, [json, maxRenderableNodes]);

    const edgeTargetById = React.useMemo(() => {
      const targetById = new Map<string, string>();

      for (let i = 0; i < edges.length; i += 1) {
        const edge = edges[i];
        targetById.set(edge.id, edge.to);
      }

      return targetById;
    }, [edges]);

    const onLayoutChange = React.useCallback(
      (layout: ElkRoot) => {
        if (!layout.width || !layout.height) {
          setLoading(false);
          return;
        }

        const currentLayoutArea = layout.width * layout.height;
        const previousLayoutArea = previousLayoutAreaRef.current;
        previousLayoutAreaRef.current = currentLayoutArea;

        setPaneWidth(layout.width + 50);
        setPaneHeight(layout.height + 50);

        setTimeout(() => {
          window.requestAnimationFrame(() => {
            const isFirstAutoFit = !hasAutoFittedRef.current;
            const hasLargeLayoutChange =
              previousLayoutArea !== null &&
              previousLayoutArea > 0 &&
              Math.abs((currentLayoutArea * 100) / previousLayoutArea - 100) > 70;
            const shouldAutoFit = centerOnLayout && (isFirstAutoFit || hasLargeLayoutChange);

            if (shouldAutoFit) {
              centerView();
              hasAutoFittedRef.current = true;
            }

            setLoading(false);
          });
        }, 0);
      },
      [centerView, centerOnLayout]
    );

    const tooLargeContent = renderNodeLimitExceeded?.(totalNodes, maxRenderableNodes);
    const canvasClassName = [styles.canvasWrapper, showGrid ? styles.showGrid : "", className]
      .filter(Boolean)
      .join(" ");
    const canvasStyle = {
      "--bg-color": themeTokens.GRID_BG_COLOR,
      "--line-color-1": themeTokens.GRID_COLOR_PRIMARY,
      "--line-color-2": themeTokens.GRID_COLOR_SECONDARY,
      "--edge-stroke": theme === "dark" ? "#444444" : "#BCBEC0",
      "--node-fill": theme === "dark" ? "#292929" : "#ffffff",
      "--node-stroke": theme === "dark" ? "#424242" : "#BCBEC0",
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
      "--spinner-track": theme === "dark" ? "rgba(255, 255, 255, 0.3)" : "rgba(17, 24, 39, 0.2)",
      "--spinner-head": theme === "dark" ? "#FFFFFF" : "#111827",
      "--overlay-bg": theme === "dark" ? "rgba(0, 0, 0, 0.2)" : "rgba(255, 255, 255, 0.38)",
      ...style,
    } as React.CSSProperties;

    return (
      <div
        ref={containerRef}
        className={canvasClassName}
        style={canvasStyle}
        onContextMenu={event => event.preventDefault()}
      >
        {showControls && (
          <Controls
            onFocusRoot={focusFirstNode}
            onCenterView={centerView}
            onZoomOut={zoomOut}
            onZoomIn={zoomIn}
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
          pollForElementResizing
          className="jsoncrack-space"
        >
          <Canvas
            className="jsoncrack-canvas"
            onLayoutChange={onLayoutChange}
            node={nodeProps => <CustomNode {...nodeProps} onNodeClick={onNodeClick} />}
            edge={edgeProps => (
              <CustomEdge
                {...edgeProps}
                viewPort={viewPort}
                edgeTargetById={edgeTargetById}
                hostElement={containerRef.current}
              />
            )}
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
            fit
          />
        </Space>
      </div>
    );
  }
);

JSONCrack.displayName = "JSONCrack";
