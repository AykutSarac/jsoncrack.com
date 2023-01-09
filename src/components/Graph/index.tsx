import React from "react";
import { Button } from "src/components/Button";
import { ReactZoomPanPinchRef, TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { Canvas, Edge, ElkRoot, hasLink } from "reaflow";
import { CustomNode } from "src/components/CustomNode";
import useGraph from "src/store/useGraph";
import useJson from "src/store/useJson";
import styled from "styled-components";
import { Loading } from "../Loading";
import { ErrorView } from "./ErrorView";
import { parseDataToJSON } from "src/utils/core/jsonParser";


interface GraphProps {
  isWidget?: boolean;
  openModal: () => void;
  setSelectedNode: (node: [string, string][]) => void;
}

const StyledEditorWrapper = styled.div<{ isWidget: boolean }>`
  position: absolute;
  width: 100%;
  height: ${({ isWidget }) => (isWidget ? "100vh" : "calc(100vh - 36px)")};
  background: ${({ theme }) => theme.BACKGROUND_SECONDARY};
  background-image: ${({ theme }) =>
    `radial-gradient(#505050 0.5px, ${theme.BACKGROUND_SECONDARY} 0.5px)`};
  background-size: 15px 15px;

  :active {
    cursor: move;
  }

  /* .dragging,
  .dragging button {
    pointer-events: none;
  } */

  rect {
    fill: ${({ theme }) => theme.BACKGROUND_NODE};
  }
`;

const GraphComponent = ({ isWidget = false, openModal, setSelectedNode }: GraphProps) => {
  const setLoading = useGraph(state => state.setLoading);
  const setZoomPanPinch = useGraph(state => state.setZoomPanPinch);
  const centerView = useGraph(state => state.centerView);
  // const setGraphValue = useGraph(state => state.setGraph);
  const setEdges = useGraph(state => state.setEdges);
  const setJson = useJson(state => state.setJson);


  const loading = useGraph(state => state.loading);
  const direction = useGraph(state => state.direction);
  const nodes = useGraph(state => state.nodes);
  const edges = useGraph(state => state.edges);

  const [size, setSize] = React.useState({
    width: 1,
    height: 1,
  });

  const [dragging, setDragging] = React.useState(false);
  const [updatedJSON, setUpdatedJSON] = React.useState("");

  const updateJSON = () => {
    setJson(updatedJSON); // this could evidently be done through setGraph
    setUpdatedJSON("");
  };

  const handleNodeClick = React.useCallback(
    (e: React.MouseEvent<SVGElement>, data: NodeData) => {
      if (setSelectedNode) setSelectedNode(data.text);
      if (openModal) openModal();
    },
    [openModal, setSelectedNode]
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

  return (
    <StyledEditorWrapper isWidget={isWidget} onContextMenu={e => e.preventDefault()}>
      <Loading message="Painting graph..." loading={loading} />
      {updatedJSON && <Button onClick={updateJSON}>Update JSON</Button>}
      <TransformWrapper
        maxScale={2}
        minScale={0.05}
        initialScale={0.4}
        wheel={{ step: 0.08 }}
        zoomAnimation={{ animationType: "linear" }}
        doubleClick={{ disabled: true }}
        onInit={onInit}
        disabled={dragging}
        // onPanning={ref => ref.instance.wrapperComponent?.classList.add("dragging")}
        // onPanningStop={ref => ref.instance.wrapperComponent?.classList.remove("dragging")}
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
            readonly={false} // this has to be false to drag and drop the nodes of the graph
            dragEdge={null}
            dragNode={null}
            fit={true}
            key={direction}
            node={props => <CustomNode {...props} onClick={handleNodeClick} onDrag={() => setDragging(true)} onDragEnd={() => setDragging(false)} dragType="node" />}
            edge={props => <Edge {...props} containerClassName={`edge-${props.id}`} />}
            onNodeLinkCheck={(_event, from: NodeData, to: NodeData) => from.id !== to.id && !hasLink(edges, to, from)}
            onNodeLink={(_event, from: NodeData, to: NodeData) => {
              const edgeToRemove = edges.find((edg) => edg.to === from.id);
              const edgeToAdd = {id: `e${to.id}-${from.id}`, from: `${to.id}`, to: `${from.id}`};
              const newEdges = [...edges.filter(edge => edgeToRemove && edge.id !== edgeToRemove.id), edgeToAdd];
              const newJsonStr = parseDataToJSON(nodes, newEdges);
              setUpdatedJSON(newJsonStr);
              setEdges(newEdges); // rewrite graph edges
            }} 
          />
        </TransformComponent>
      </TransformWrapper>
    </StyledEditorWrapper>
  );
};

export const Graph = React.memo(GraphComponent);
