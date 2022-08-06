import React from "react";
import {
  ReactZoomPanPinchRef,
  TransformComponent,
  TransformWrapper,
} from "react-zoom-pan-pinch";
import {
  Canvas,
  CanvasContainerProps,
  EdgeData,
  ElkRoot,
  NodeData,
  NodeProps,
} from "reaflow";
import { CustomNode } from "src/components/CustomNode";
import { getEdgeNodes } from "src/containers/Editor/LiveEditor/helpers";
import useConfig from "src/hooks/store/useConfig";
import styled from "styled-components";
import shallow from "zustand/shallow";
import toast from "react-hot-toast";

interface GraphProps {
  json: string;
  isWidget?: boolean;
}

const wheelOptions = {
  step: 0.05,
};

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

export const Graph: React.FC<GraphProps & CanvasContainerProps> = ({
  json,
  isWidget = false,
  ...props
}) => {
  const updateSetting = useConfig((state) => state.updateSetting);
  const [expand, layout] = useConfig(
    (state) => [state.settings.expand, state.settings.layout],
    shallow
  );

  const onInit = (ref: ReactZoomPanPinchRef) => {
    updateSetting("zoomPanPinch", ref);
  };

  const [nodes, setNodes] = React.useState<NodeData[]>([]);
  const [edges, setEdges] = React.useState<EdgeData[]>([]);
  const [size, setSize] = React.useState({
    width: 2000,
    height: 2000,
  });

  React.useEffect(() => {
    const { nodes, edges } = getEdgeNodes(json, expand);

    setNodes(nodes);
    setEdges(edges);
  }, [json, expand]);

  const onCanvasClick = () => {
    const input = document.querySelector("input:focus") as HTMLInputElement;
    if (input) input.blur();
  };

  const onLayoutChange = (layout: ElkRoot) => {
    if (layout.width && layout.height)
      setSize({ width: layout.width, height: layout.height });
  };

  const handleNodeClick = (
    e: React.MouseEvent<SVGElement>,
    props: NodeProps
  ) => {
    if (e.detail === 2) {
      toast("Object copied to clipboard!");
      navigator.clipboard.writeText(JSON.stringify(props.properties.text));
    }
  };

  return (
    <StyledEditorWrapper isWidget={isWidget}>
      <TransformWrapper
        maxScale={1.8}
        minScale={0.4}
        initialScale={0.7}
        wheel={wheelOptions}
        onInit={onInit}
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
            onCanvasClick={onCanvasClick}
            onLayoutChange={onLayoutChange}
            node={(props) => (
              <CustomNode
                onClick={(e) => handleNodeClick(e, props)}
                {...props}
              />
            )}
            zoomable={false}
            readonly
            {...props}
          />
        </TransformComponent>
      </TransformWrapper>
    </StyledEditorWrapper>
  );
};
