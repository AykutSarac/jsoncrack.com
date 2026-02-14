"use client";

import React from "react";
import type { ViewPort } from "react-zoomable-ui";
import { Space } from "react-zoomable-ui";
import { Canvas } from "reaflow";
import type { ElkRoot } from "reaflow";
import styles from "./JsonCrack.module.css";
import { Controls } from "./components/Controls";
import { CustomEdge } from "./components/CustomEdge";
import { CustomNode } from "./components/CustomNode";
import { parseGraph } from "./parser";
import { themes } from "./theme";
import type {
  CanvasThemeMode,
  GraphData,
  LayoutDirection,
  NodeData,
} from "./types";

const layoutOptions = {
  "elk.layered.compaction.postCompaction.strategy": "EDGE_LENGTH",
  "elk.layered.nodePlacement.strategy": "NETWORK_SIMPLEX",
  "elk.spacing.edgeLabel": "15",
};

const objectJsonCache = new WeakMap<object, string>();

export interface JsonCrackRef {
  zoomIn: () => void;
  zoomOut: () => void;
  setZoom: (zoomFactor: number) => void;
  centerView: () => void;
  focusFirstNode: () => void;
}

export interface JsonCrackProps {
  json: string | object | unknown[];
  theme?: CanvasThemeMode;
  direction?: LayoutDirection;
  showControls?: boolean;
  showGrid?: boolean;
  zoomOnScroll?: boolean;
  imagePreview?: boolean;
  fitViewOnLayout?: boolean;
  maxVisibleNodes?: number;
  className?: string;
  style?: React.CSSProperties;
  onNodeClick?: (node: NodeData) => void;
  onGraphChange?: (graph: GraphData) => void;
  onParseError?: (error: Error) => void;
  onViewPortCreate?: (viewPort: ViewPort) => void;
  renderTooLarge?: (
    nodeCount: number,
    maxVisibleNodes: number,
  ) => React.ReactNode;
}

const toJsonText = (json: JsonCrackProps["json"]): string => {
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

export const JsonCrack = React.forwardRef<JsonCrackRef, JsonCrackProps>(
  (
    {
      json,
      theme = "dark",
      direction = "RIGHT",
      showControls = true,
      showGrid = true,
      zoomOnScroll = false,
      imagePreview = true,
      fitViewOnLayout = true,
      maxVisibleNodes = 1500,
      className,
      style,
      onNodeClick,
      onGraphChange,
      onParseError,
      onViewPortCreate,
      renderTooLarge,
    },
    ref,
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
    const callbacksRef = React.useRef({ onGraphChange, onParseError });
    const onViewPortCreateRef = React.useRef(onViewPortCreate);
    const lastParsedInputRef = React.useRef<{
      jsonText: string;
      imagePreview: boolean;
      maxVisibleNodes: number;
    } | null>(null);

    React.useEffect(() => {
      callbacksRef.current = { onGraphChange, onParseError };
    }, [onGraphChange, onParseError]);

    React.useEffect(() => {
      onViewPortCreateRef.current = onViewPortCreate;
    }, [onViewPortCreate]);

    React.useEffect(() => {
      hasAutoFittedRef.current = false;
      previousLayoutAreaRef.current = null;
    }, [direction]);

    const centerView = React.useCallback(() => {
      const nextViewPort = viewPort;
      nextViewPort?.updateContainerSize();

      const canvas = containerRef.current?.querySelector(
        ".jsoncrack-canvas",
      ) as HTMLElement | null;
      if (canvas) {
        nextViewPort?.camera?.centerFitElementIntoView(canvas);
      }
    }, [viewPort]);

    const focusFirstNode = React.useCallback(() => {
      const rootNode = containerRef.current?.querySelector(
        "g[id$='node-1']",
      ) as HTMLElement | null;
      if (!rootNode) return;

      viewPort?.camera?.centerFitElementIntoView(rootNode, {
        elementExtraMarginForZoom: 100,
      });
    }, [viewPort]);

    const setZoom = React.useCallback(
      (zoomFactor: number) => {
        if (!viewPort) return;
        viewPort.camera?.recenter(
          viewPort.centerX,
          viewPort.centerY,
          zoomFactor,
        );
      },
      [viewPort],
    );

    const zoomIn = React.useCallback(() => {
      if (!viewPort) return;
      viewPort.camera?.recenter(
        viewPort.centerX,
        viewPort.centerY,
        viewPort.zoomFactor + 0.1,
      );
    }, [viewPort]);

    const zoomOut = React.useCallback(() => {
      if (!viewPort) return;
      viewPort.camera?.recenter(
        viewPort.centerX,
        viewPort.centerY,
        viewPort.zoomFactor - 0.1,
      );
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
      [centerView, focusFirstNode, setZoom, zoomIn, zoomOut],
    );

    React.useEffect(() => {
      try {
        const jsonText = toJsonText(json);
        const lastParsedInput = lastParsedInputRef.current;

        if (
          lastParsedInput &&
          lastParsedInput.jsonText === jsonText &&
          lastParsedInput.imagePreview === imagePreview &&
          lastParsedInput.maxVisibleNodes === maxVisibleNodes
        ) {
          return;
        }

        setLoading(true);

        const graph = parseGraph(jsonText, {
          imagePreviewEnabled: imagePreview,
        });

        if (graph.errors.length > 0) {
          callbacksRef.current.onParseError?.(
            new Error(
              `Failed to parse data (${graph.errors.length} syntax error(s)).`,
            ),
          );
        }

        setTotalNodes(graph.nodes.length);

        if (graph.nodes.length > maxVisibleNodes) {
          setAboveSupportedLimit(true);
          setNodes([]);
          setEdges([]);
          setLoading(false);
          lastParsedInputRef.current = {
            jsonText,
            imagePreview,
            maxVisibleNodes,
          };
          return;
        }

        setAboveSupportedLimit(false);
        setNodes(graph.nodes);
        setEdges(graph.edges);
        callbacksRef.current.onGraphChange?.({
          nodes: graph.nodes,
          edges: graph.edges,
        });
        lastParsedInputRef.current = {
          jsonText,
          imagePreview,
          maxVisibleNodes,
        };

        if (graph.nodes.length === 0) {
          setLoading(false);
        }
      } catch (error) {
        setNodes([]);
        setEdges([]);
        setLoading(false);
        callbacksRef.current.onParseError?.(
          error instanceof Error ? error : new Error("Unable to parse data."),
        );
      }
    }, [imagePreview, json, maxVisibleNodes]);

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
              Math.abs((currentLayoutArea * 100) / previousLayoutArea - 100) >
                70;
            const shouldAutoFit =
              fitViewOnLayout && (isFirstAutoFit || hasLargeLayoutChange);

            if (shouldAutoFit) {
              centerView();
              hasAutoFittedRef.current = true;
            }

            setLoading(false);
          });
        }, 0);
      },
      [centerView, fitViewOnLayout],
    );

    const tooLargeContent = renderTooLarge?.(totalNodes, maxVisibleNodes);
    const canvasClassName = [
      styles.canvasWrapper,
      showGrid ? styles.showGrid : "",
      className,
    ]
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
      "--spinner-track":
        theme === "dark" ? "rgba(255, 255, 255, 0.3)" : "rgba(17, 24, 39, 0.2)",
      "--spinner-head": theme === "dark" ? "#FFFFFF" : "#111827",
      "--overlay-bg":
        theme === "dark" ? "rgba(0, 0, 0, 0.2)" : "rgba(255, 255, 255, 0.38)",
      ...style,
    } as React.CSSProperties;

    return (
      <div
        ref={containerRef}
        className={canvasClassName}
        style={canvasStyle}
        onContextMenu={(event) => event.preventDefault()}
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
              {`This graph has ${totalNodes} nodes and exceeds the maxVisibleNodes limit (${maxVisibleNodes}).`}
            </div>
          ))}

        {loading && (
          <div className={styles.overlay}>
            <div className={styles.spinner} />
          </div>
        )}

        <Space
          onCreate={(nextViewPort) => {
            setViewPort(nextViewPort);
            onViewPortCreateRef.current?.(nextViewPort);
          }}
          onContextMenu={(event) => event.preventDefault()}
          treatTwoFingerTrackPadGesturesLikeTouch={zoomOnScroll}
          pollForElementResizing
          className="jsoncrack-space"
        >
          <Canvas
            className="jsoncrack-canvas"
            onLayoutChange={onLayoutChange}
            node={(nodeProps) => (
              <CustomNode
                {...nodeProps}
                imagePreviewEnabled={imagePreview}
                onNodeClick={onNodeClick}
              />
            )}
            edge={(edgeProps) => (
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
            direction={direction}
            layoutOptions={layoutOptions}
            key={direction}
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
  },
);

JsonCrack.displayName = "JsonCrack";
