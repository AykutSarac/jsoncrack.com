import React from "react";
import { ReactZoomPanPinchRef, TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { Canvas, Edge, ElkRoot } from "reaflow";
import { CustomNode } from "src/components/CustomNode";
import useGraph from "src/store/useGraph";
import useUser from "src/store/useUser";
import styled from "styled-components";
import { Loading } from "../Loading";
import { ErrorView } from "./ErrorView";
import { PremiumView } from "./PremiumView";

interface GraphProps {
  isWidget?: boolean;
  openNodeModal: () => void;
  setSelectedNode: (node: [string, string][]) => void;
  openEdgeModal: () => void;
  setSelectedEdge: (edgeInfo: string) => void;
}

const StyledEditorWrapper = styled.div<{ widget: boolean }>`
  position: absolute;
  width: 100%;
  height: ${({ widget }) => (widget ? "calc(100vh - 36px)" : "calc(100vh - 65px)")};
  background: ${({ theme }) => theme.BACKGROUND_SECONDARY};
  background-image: ${({ theme }) =>
    `radial-gradient(#505050 0.5px, ${theme.BACKGROUND_SECONDARY} 0.5px)`};
  background-size: 15px 15px;

  :active {
    cursor: move;
  }

  .dragging,
  .dragging button {
    pointer-events: none;
  }

  rect {
    fill: ${({ theme }) => theme.BACKGROUND_NODE};
  }

  @media only screen and (max-width: 320px) {
    height: 100vh;
  }
`;

const GraphComponent = ({
  isWidget = false,
  openNodeModal,
  setSelectedNode,
  openEdgeModal,
  setSelectedEdge,
}: GraphProps) => {
  const isPremium = useUser(state => state.isPremium);
  const setLoading = useGraph(state => state.setLoading);
  const setZoomPanPinch = useGraph(state => state.setZoomPanPinch);
  const centerView = useGraph(state => state.centerView);

  const loading = useGraph(state => state.loading);
  const direction = useGraph(state => state.direction);
  const nodes = useGraph(state => state.nodes);
  const edges = useGraph(state => state.edges);

  const [size, setSize] = React.useState({
    width: 1,
    height: 1,
  });

  const handleNodeClick = React.useCallback(
    (e: React.MouseEvent<SVGElement>, data: NodeData) => {
      if (setSelectedNode) setSelectedNode(data.text);
      if (openNodeModal) openNodeModal();
    },
    [openNodeModal, setSelectedNode]
  );

  const handleEdgeClick = React.useCallback(
    (e: React.MouseEvent<SVGElement>, data: EdgeData) => {
      let curFromId = data.from;
      let curToId = data.to;
      const path = [curFromId, curToId];
      while (curFromId !== "1") {
        curToId = curFromId;
        curFromId = edges.find(({ to }) => to === curFromId)?.from;
        if (curFromId === undefined) {
          break;
        }
        path.unshift(curFromId);
      }
      const rootArrayElementIds = ["1"];
      const edgeLength = edges.length;
      for (let i = 1; i < edgeLength; i++) {
        const curNodeId = edges[i].from!;
        if (rootArrayElementIds.find(id => id === curNodeId)) continue;
        let isRootArrayElement = true;
        for (let j = i - 1; j >= 0; j--) {
          if (curNodeId === edges[j]?.to) {
            isRootArrayElement = false;
          }
        }
        if (isRootArrayElement) {
          rootArrayElementIds.push(curNodeId);
        }
      }
      const pathLength = path.length;
      let resolvedPath = "";
      if (rootArrayElementIds.length > 1) {
        resolvedPath += `Root[${rootArrayElementIds.findIndex(id => id === path[0])}]`;
      } else {
        resolvedPath += "{Root}";
      }
      for (let i = 1; i < pathLength; i++) {
        const curId = path[i];
        if (curId === undefined) break;
        const curNode = nodes[+curId - 1];
        if (curNode?.data.parent === "array") {
          resolvedPath += `.${curNode.text}`;
          if (i !== pathLength - 1) {
            const idx = edges
              .filter(({ from }) => from === curId)
              .findIndex(({ to }) => to === path[i + 1]);
            resolvedPath += `[${idx}]`;
          }
        }
        if (curNode?.data.parent === "object") {
          resolvedPath += `.${curNode.text}`;
        }
      }

      if (setSelectedEdge) setSelectedEdge(resolvedPath);
      if (openEdgeModal) openEdgeModal();
    },
    [nodes, edges]
  );

  const onInit = React.useCallback(
    (ref: ReactZoomPanPinchRef) => {
      setZoomPanPinch(ref);
    },
    [setZoomPanPinch]
  );

  const onLayoutChange = React.useCallback(
    (layout: ElkRoot) => {
      if (layout.width && layout.height) {
        const areaSize = layout.width * layout.height;
        const changeRatio = Math.abs((areaSize * 100) / (size.width * size.height) - 100);

        setSize({
          width: (layout.width as number) + 400,
          height: (layout.height as number) + 400,
        });

        requestAnimationFrame(() => {
          setTimeout(() => {
            setLoading(false);
            setTimeout(() => {
              if (changeRatio > 70 || isWidget) centerView();
            });
          });
        });
      }
    },
    [centerView, isWidget, setLoading, size.height, size.width]
  );

  const onCanvasClick = React.useCallback(() => {
    const input = document.querySelector("input:focus") as HTMLInputElement;
    if (input) input.blur();
  }, []);

  if (nodes.length > 8_000) return <ErrorView />;

  if (nodes.length > 1_000 && !isWidget) {
    if (!isPremium()) return <PremiumView />;
  }

  return (
    <StyledEditorWrapper onContextMenu={e => e.preventDefault()} widget={isWidget}>
      <Loading message="Painting graph..." loading={loading} />
      <TransformWrapper
        maxScale={2}
        minScale={0.05}
        initialScale={0.4}
        wheel={{ step: 0.08 }}
        zoomAnimation={{ animationType: "linear" }}
        doubleClick={{ disabled: true }}
        onInit={onInit}
        onPanning={ref => ref.instance.wrapperComponent?.classList.add("dragging")}
        onPanningStop={ref => ref.instance.wrapperComponent?.classList.remove("dragging")}
      >
        <TransformComponent
          wrapperStyle={{
            width: "100%",
            height: "100%",
            overflow: "hidden",
            display: loading ? "none" : "block",
          }}
        >
          <Canvas
            className="jsoncrack-canvas"
            nodes={nodes}
            edges={edges}
            maxWidth={size.width}
            maxHeight={size.height}
            direction={direction}
            onLayoutChange={onLayoutChange}
            onCanvasClick={onCanvasClick}
            zoomable={false}
            animated={false}
            readonly={true}
            dragEdge={null}
            dragNode={null}
            fit={true}
            key={direction}
            node={props => <CustomNode {...props} onClick={handleNodeClick} />}
            edge={props => (
              <Edge {...props} onClick={handleEdgeClick} containerClassName={`edge-${props.id}`} />
            )}
          />
        </TransformComponent>
      </TransformWrapper>
    </StyledEditorWrapper>
  );
};

export const Graph = React.memo(GraphComponent);
