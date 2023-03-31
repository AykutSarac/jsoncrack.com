import React from "react";
import styled from "styled-components";
import { ReactZoomPanPinchRef, TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { Canvas, Edge, EdgeProps, ElkRoot, NodeProps } from "reaflow";
import { CustomNode } from "src/components/CustomNode";
import useGraph from "src/store/useGraph";
import useUser from "src/store/useUser";
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
    `radial-gradient(#505050 1px, ${theme.BACKGROUND_SECONDARY} 1px)`};
  background-size: 25px 25px;

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

  @media only screen and (max-width: 1440px) {
    background-image: ${({ theme }) =>
      `radial-gradient(#505050 0.5px, ${theme.BACKGROUND_SECONDARY} 0.5px)`};
    background-size: 15px 15px;
  }

  @media only screen and (max-width: 320px) {
    height: 100vh;
  }
`;

export const Graph = ({ isWidget = false, openNodeModal }: GraphProps) => {
  const isPremium = useUser(state => state.isPremium);
  const setLoading = useGraph(state => state.setLoading);
  const setZoomPanPinch = useGraph(state => state.setZoomPanPinch);
  const centerView = useGraph(state => state.centerView);
  const setSelectedNode = useGraph(state => state.setSelectedNode);

  const loading = useGraph(state => state.loading);
  const direction = useGraph(state => state.direction);
  const nodes = useGraph(state => state.nodes);
  const edges = useGraph(state => state.edges);

  const collapsedNodes = useGraph(state => state.collapsedNodes);
  const collapsedEdges = useGraph(state => state.collapsedEdges);

  React.useEffect(() => {
    const nodeList = collapsedNodes.map(id => `[id$="node-${id}"]`);
    const edgeList = collapsedEdges.map(id => `[class$="edge-${id}"]`);

    const hiddenItems = document.querySelectorAll(".hide");
    hiddenItems.forEach(item => item.classList.remove("hide"));

    if (nodeList.length) {
      const selectedNodes = document.querySelectorAll(nodeList.join(","));
      selectedNodes.forEach(node => node.classList.add("hide"));
    }

    if (edgeList.length) {
      const selectedEdges = document.querySelectorAll(edgeList.join(","));
      selectedEdges.forEach(edge => edge.classList.add("hide"));
    }
  }, [collapsedNodes, collapsedEdges]);

  const [size, setSize] = React.useState({
    width: 1,
    height: 1,
  });

  const handleNodeClick = React.useCallback(
    (_: React.MouseEvent<SVGElement>, data: NodeData) => {
      if (setSelectedNode) setSelectedNode({ nodeData: data });
      if (openNodeModal) openNodeModal();
    },
    [openNodeModal, setSelectedNode]
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

        setTimeout(() => {
          setLoading(false);
          window.requestAnimationFrame(() => {
            if (changeRatio > 70 || isWidget) centerView();
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

  const memoizedNode = React.useCallback(
    (props: JSX.IntrinsicAttributes & NodeProps<any>) => (
      <CustomNode {...props} onClick={handleNodeClick} animated={false} />
    ),
    [handleNodeClick]
  );

  const memoizedEdge = React.useCallback(
    (props: JSX.IntrinsicAttributes & Partial<EdgeProps>) => (
      <Edge {...props} containerClassName={`edge-${props.id}`} />
    ),
    []
  );

  if (nodes.length > 8_000) return <ErrorView />;

  if (nodes.length > 1_000 && !isWidget) {
    if (!isPremium()) return <PremiumView />;
  }

  return (
    <>
      <Loading message="Painting graph..." loading={loading} />
      <StyledEditorWrapper onContextMenu={e => e.preventDefault()} widget={isWidget}>
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
              node={memoizedNode}
              edge={memoizedEdge}
              key={direction}
              zoomable={false}
              animated={false}
              readonly={true}
              dragEdge={null}
              dragNode={null}
              fit={true}
            />
          </TransformComponent>
        </TransformWrapper>
      </StyledEditorWrapper>
    </>
  );
};
