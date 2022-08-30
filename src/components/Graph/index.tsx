import React from "react";
import {
  ReactZoomPanPinchRef,
  TransformComponent,
  TransformWrapper,
} from "react-zoom-pan-pinch";
import { Canvas, Edge, ElkRoot, NodeData } from "reaflow";
import { CustomNode } from "src/components/CustomNode";
import { NodeModal } from "src/containers/Modals/NodeModal";
import { getEdgeNodes } from "src/containers/Editor/LiveEditor/helpers";
import useConfig from "src/hooks/store/useConfig";
import styled from "styled-components";
import shallow from "zustand/shallow";
import useGraph from "src/hooks/store/useGraph";

interface LayoutProps {
  isWidget: boolean;
  openModal: () => void;
  setSelectedNode: (node: object) => void;
}

const StyledEditorWrapper = styled.div<{ isWidget: boolean }>`
  position: absolute;
  width: 100%;
  height: ${({ isWidget }) => (isWidget ? "100vh" : "calc(100vh - 36px)")};
  background: ${({ theme }) => theme.BACKGROUND_SECONDARY};

  :active {
    cursor: move;
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
  const nodes = useGraph((state) => state.nodes);
  const edges = useGraph((state) => state.edges);
  const setGraphValue = useGraph((state) => state.setGraphValue);

  const [size, setSize] = React.useState({
    width: 2000,
    height: 2000,
  });

  const setConfig = useConfig((state) => state.setConfig);
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

  const onInit = (ref: ReactZoomPanPinchRef) => {
    setConfig("zoomPanPinch", ref);
  };

  const onLayoutChange = (layout: ElkRoot) => {
    if (layout.width && layout.height)
      setSize({ width: layout.width, height: layout.height });
  };

  React.useEffect(() => {
    const { nodes, edges } = getEdgeNodes(json, expand);

    setGraphValue("nodes", nodes);
    setGraphValue("edges", edges);
  }, [expand, json, setGraphValue]);

  return (
    <StyledEditorWrapper isWidget={isWidget}>
      <TransformWrapper
        onInit={onInit}
        maxScale={1.8}
        minScale={0.4}
        initialScale={0.7}
        wheel={{
          step: 0.05,
        }}
        doubleClick={{
          disabled: true,
        }}
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
            maxWidth={size.width + 400}
            maxHeight={size.height + 400}
            direction={layout}
            key={layout}
            onLayoutChange={onLayoutChange}
            node={(props) => (
              <CustomNode {...props} onClick={handleNodeClick} />
            )}
            edge={(props) => (
              <Edge {...props} containerClassName={`edge-${props.id}`} />
            )}
            zoomable={false}
            readonly
          />
        </TransformComponent>
      </TransformWrapper>
    </StyledEditorWrapper>
  );
});

export const Graph = ({ isWidget = false }: { isWidget?: boolean }) => {
  const [isModalVisible, setModalVisible] = React.useState(false);
  const [selectedNode, setSelectedNode] = React.useState<object>({});

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
