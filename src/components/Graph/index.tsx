import React from "react";
import {
  ReactZoomPanPinchRef,
  TransformComponent,
  TransformWrapper,
} from "react-zoom-pan-pinch";
import { Canvas, Edge, ElkRoot, useSelection } from "reaflow";
import { CustomNode } from "src/components/CustomNode";
import { NodeModal } from "src/containers/Modals/NodeModal";
import { getEdgeNodes } from "src/containers/Editor/LiveEditor/helpers";
import useConfig from "src/hooks/store/useConfig";
import styled from "styled-components";
import shallow from "zustand/shallow";
import useNodeTools from "src/hooks/store/useNodeTools";

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

  const [nodes, edges, newNodes, newEdges, selectedNode] = useNodeTools(
    (state) => [
      state.nodes,
      state.edges,
      state.newNodes,
      state.newEdges,
      state.selectedNode,
    ],
    shallow
  );
  const setNodeTools = useNodeTools((state) => state.setNodeTools);

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

    setNodeTools("nodes", nodes);
    setNodeTools("edges", edges);
    setNodeTools("newNodes", nodes);
    setNodeTools("newEdges", edges);
  }, [json, expand, setNodeTools]);

  const onInit = (ref: ReactZoomPanPinchRef) => {
    setConfig("zoomPanPinch", ref);
  };

  const onLayoutChange = (layout: ElkRoot) => {
    if (layout.width && layout.height)
      setSize({ width: layout.width, height: layout.height });
  };

  const { selections, onClick, removeSelection } = useSelection({
    nodes,
    edges,
    onSelection: (s) => {
      if (!isWidget) {
        if (s[0] === selectedNode) {
          removeSelection(selectedNode);
        } else {
          setNodeTools("selectedNode", s[0]);
        }
      }
    },
  });

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
            selections={selections}
            node={(props) => <CustomNode {...props} />}
            edge={(props) =>
              newEdges.find((e) => e.id === props.id) ? <Edge /> : <></>
            }
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
