import React from "react";
import {
  ReactZoomPanPinchRef,
  TransformComponent,
  TransformWrapper,
} from "react-zoom-pan-pinch";
import { Canvas, Edge, ElkRoot } from "reaflow";
import { CustomNode } from "src/components/CustomNode";
import { NodeModal } from "src/containers/Modals/NodeModal";
import useConfig from "src/hooks/store/useConfig";
import styled from "styled-components";
import shallow from "zustand/shallow";
import useGraph from "src/hooks/store/useGraph";
import { parser } from "src/utils/jsonParser";

interface LayoutProps {
  isWidget: boolean;
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

  .dragging {
    pointer-events: none;
  }

  rect {
    fill: ${({ theme }) => theme.BACKGROUND_NODE};
  }
`;

const MemoizedGraph = React.memo(function Layout({
  isWidget,
  openModal,
  setSelectedNode,
}: LayoutProps) {
  const json = useConfig((state) => state.json);
  const setConfig = useConfig((state) => state.setConfig);
  const nodes = useGraph((state) => state.nodes);
  const edges = useGraph((state) => state.edges);
  const setGraphValue = useGraph((state) => state.setGraphValue);

  const [size, setSize] = React.useState({
    width: 2000,
    height: 2000,
  });

  const [expand, layout] = useConfig(
    (state) => [state.expand, state.layout],
    shallow
  );

  const handleNodeClick = React.useCallback(
    (e: React.MouseEvent<SVGElement>, data: NodeData) => {
      setSelectedNode(data.text);
      openModal();
    },
    [openModal, setSelectedNode]
  );

  const onInit = React.useCallback(
    (ref: ReactZoomPanPinchRef) => {
      setConfig("zoomPanPinch", ref);
    },
    [setConfig]
  );

  const onLayoutChange = React.useCallback((layout: ElkRoot) => {
    if (layout.width && layout.height) {
      setSize({ width: layout.width + 400, height: layout.height + 400 });
    }
  }, []);

  const onCanvasClick = React.useCallback(() => {
    const input = document.querySelector("input:focus") as HTMLInputElement;
    if (input) input.blur();
  }, []);

  React.useEffect(() => {
    const { nodes, edges } = parser(json, expand);

    setGraphValue("nodes", nodes);
    setGraphValue("edges", edges);
  }, [expand, json, setGraphValue]);

  return (
    <StyledEditorWrapper isWidget={isWidget}>
      <TransformWrapper
        maxScale={2}
        minScale={0.5}
        initialScale={0.7}
        wheel={{ step: 0.05 }}
        zoomAnimation={{ animationType: "linear" }}
        doubleClick={{ disabled: true }}
        onInit={onInit}
        onPanning={(ref) =>
          ref.instance.wrapperComponent?.classList.add("dragging")
        }
        onPanningStop={(ref) =>
          ref.instance.wrapperComponent?.classList.remove("dragging")
        }
      >
        <TransformComponent
          wrapperStyle={{
            width: "100%",
            height: "100%",
            overflow: "hidden",
          }}
        >
          <Canvas
            nodes={nodes}
            edges={edges}
            maxWidth={size.width}
            maxHeight={size.height}
            direction={layout}
            onLayoutChange={onLayoutChange}
            onCanvasClick={onCanvasClick}
            key={layout}
            zoomable={false}
            animated={false}
            readonly={true}
            dragEdge={null}
            dragNode={null}
            fit={true}
            node={(props) => (
              <CustomNode {...props} onClick={handleNodeClick} />
            )}
            edge={(props) => (
              <Edge {...props} containerClassName={`edge-${props.id}`} />
            )}
          />
        </TransformComponent>
      </TransformWrapper>
    </StyledEditorWrapper>
  );
});

export const Graph = ({ isWidget = false }: { isWidget?: boolean }) => {
  const [isModalVisible, setModalVisible] = React.useState(false);
  const [selectedNode, setSelectedNode] = React.useState<[string, string][]>(
    []
  );

  const openModal = React.useCallback(() => setModalVisible(true), []);

  const collapsedNodes = useGraph((state) => state.collapsedNodes);
  const collapsedEdges = useGraph((state) => state.collapsedEdges);

  React.useEffect(() => {
    const nodeList = collapsedNodes.map((id) => `[id$="node-${id}"]`);
    const edgeList = collapsedEdges.map((id) => `[class$="edge-${id}"]`);

    const hiddenItems = document.querySelectorAll(".hide");
    hiddenItems.forEach((item) => item.classList.remove("hide"));

    if (nodeList.length) {
      const selectedNodes = document.querySelectorAll(nodeList.join(","));
      const selectedEdges = document.querySelectorAll(edgeList.join(","));

      selectedNodes.forEach((node) => node.classList.add("hide"));
      selectedEdges.forEach((edge) => edge.classList.add("hide"));
    }
  }, [collapsedNodes, collapsedEdges]);

  return (
    <>
      <MemoizedGraph
        openModal={openModal}
        setSelectedNode={setSelectedNode}
        isWidget={isWidget}
      />
      {!isWidget && (
        <NodeModal
          selectedNode={selectedNode}
          visible={isModalVisible}
          closeModal={() => setModalVisible(false)}
        />
      )}
    </>
  );
};
