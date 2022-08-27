import React from "react";
import {
  ReactZoomPanPinchRef,
  TransformComponent,
  TransformWrapper,
} from "react-zoom-pan-pinch";
import { Canvas, Edge, ElkRoot, NodeData, useSelection } from "reaflow";
import { CustomNode } from "src/components/CustomNode";
import { NodeModal } from "src/containers/Modals/NodeModal";
import { getEdgeNodes } from "src/containers/Editor/LiveEditor/helpers";
import useConfig from "src/hooks/store/useConfig";
import styled from "styled-components";
import shallow from "zustand/shallow";
import useNodeTools from "src/hooks/store/useNodeTools";
import useGraph from "src/hooks/store/useGraph";

interface LayoutProps {
  isWidget: boolean;
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

const MemoizedGraph = React.memo(function Layout({ isWidget }: LayoutProps) {
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

  React.useEffect(() => {
    const { nodes, edges } = getEdgeNodes(json, expand);

    setGraphValue("nodes", nodes);
    setGraphValue("edges", edges);
    setGraphValue("initialNodes", nodes);
    setGraphValue("initialEdges", edges);
  }, [expand, json, setGraphValue]);

  const onInit = (ref: ReactZoomPanPinchRef) => {
    setConfig("zoomPanPinch", ref);
  };

  const onLayoutChange = (layout: ElkRoot) => {
    if (layout.width && layout.height)
      setSize({ width: layout.width, height: layout.height });
  };

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
            maxWidth={size.width + 100}
            maxHeight={size.height + 100}
            direction={layout}
            key={layout}
            onLayoutChange={onLayoutChange}
            node={(props) => <CustomNode {...props} />}
            zoomable={false}
            readonly
          />
        </TransformComponent>
      </TransformWrapper>
    </StyledEditorWrapper>
  );
});

export const Graph = ({ isWidget = false }: { isWidget?: boolean }) => {
  const [newNodes, selectedNode, copySelectedNode] = useNodeTools(
    (state) => [state.nodes, state.selectedNode, state.copySelectedNode],
    shallow
  );
  const setNodeTools = useNodeTools((state) => state.setNodeTools);
  const selectedNodeObject = newNodes.find((n) => n.id === selectedNode);
  return (
    <>
      <MemoizedGraph isWidget={isWidget} />
      {!isWidget && (
        <NodeModal
          selectedNode={selectedNodeObject?.text}
          visible={copySelectedNode}
          closeModal={() => setNodeTools("copySelectedNode", false)}
        />
      )}
    </>
  );
};
