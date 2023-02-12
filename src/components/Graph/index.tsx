import React from "react";
import { ReactZoomPanPinchRef, TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { Canvas, Edge, ElkRoot, getParentsForNodeId } from "reaflow";
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

const GraphComponent = ({ isWidget = false, openNodeModal }: GraphProps) => {
  const isPremium = useUser(state => state.isPremium);
  const setLoading = useGraph(state => state.setLoading);
  const setZoomPanPinch = useGraph(state => state.setZoomPanPinch);
  const centerView = useGraph(state => state.centerView);
  const setSelectedNode = useGraph(state => state.setSelectedNode);

  const loading = useGraph(state => state.loading);
  const direction = useGraph(state => state.direction);
  const nodes = useGraph(state => state.nodes);
  const edges = useGraph(state => state.edges);

  const [size, setSize] = React.useState({
    width: 1,
    height: 1,
  });

  const handleNodeClick = React.useCallback(
    (_: React.MouseEvent<SVGElement>, data: NodeData) => {
      let resolvedPath = "";
      const parentIds = getParentsForNodeId(nodes, edges, data.id).map(n => n.id);
      const path = parentIds.reverse().concat(data.id);
      const rootArrayElementIds = ["1"];
      const edgesMap = new Map();

      for (const edge of edges) {
        if (!edgesMap.has(edge.from!)) {
          edgesMap.set(edge.from!, []);
        }
        edgesMap.get(edge.from!).push(edge.to);
      }

      for (let i = 1; i < edges.length; i++) {
        const curNodeId = edges[i].from!;
        if (rootArrayElementIds.includes(curNodeId)) continue;
        if (!edgesMap.has(curNodeId)) {
          rootArrayElementIds.push(curNodeId);
        }
      }

      if (rootArrayElementIds.length > 1) {
        resolvedPath += `Root[${rootArrayElementIds.findIndex(id => id === path[0])}]`;
      } else {
        resolvedPath += "{Root}";
      }

      for (let i = 1; i < path.length; i++) {
        const curId = path[i];
        const curNode = nodes[+curId - 1];

        if (!curNode) break;
        if (curNode.data.parent === "array") {
          resolvedPath += `.${curNode.text}`;
          if (i !== path.length - 1) {
            const toNodeId = path[i + 1];
            const idx = edgesMap.get(curId).indexOf(toNodeId);
            resolvedPath += `[${idx}]`;
          }
        }

        if (curNode.data.parent === "object") {
          resolvedPath += `.${curNode.text}`;
        }
      }

      if (setSelectedNode) setSelectedNode({ node: data.text, path: resolvedPath });
      if (openNodeModal) openNodeModal();
    },
    [edges, nodes, openNodeModal, setSelectedNode]
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
            edge={props => <Edge {...props} containerClassName={`edge-${props.id}`} />}
          />
        </TransformComponent>
      </TransformWrapper>
    </StyledEditorWrapper>
  );
};

export const Graph = React.memo(GraphComponent);
