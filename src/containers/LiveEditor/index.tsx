import React from "react";
import styled from "styled-components";
import {
  TransformWrapper,
  TransformComponent,
  ReactZoomPanPinchRef,
} from "react-zoom-pan-pinch";

import { getEdgeNodes } from "./helpers";
import { CustomNode } from "../../components/CustomNode";
import { useConfig } from "src/hocs/config";
import { Tools } from "../Editor/Tools";
import { ConfigActionType } from "src/reducer/reducer";
import { Canvas } from "reaflow";

const StyledLiveEditor = styled.div`
  position: relative;
`;

const StyledEditorWrapper = styled.div`
  position: absolute;
  width: 100%;
  height: calc(100vh - 36px);

  :active {
    cursor: move;
  }

  rect {
    fill: ${({ theme }) => theme.BACKGROUND_NODE};
  }
`;

const wheelOptions = {
  step: 0.05,
};

export const LiveEditor: React.FC = React.memo(function LiveEditor() {
  const {
    states: { json, settings },
    dispatch,
  } = useConfig();
  const [data, setData] = React.useState({
    nodes: [],
    edges: [],
  });
  const [size, setSize] = React.useState({
    width: 2000,
    height: 2000,
  });

  React.useEffect(() => {
    const { nodes, edges } = getEdgeNodes(json, settings.expand);

    setData({ nodes, edges });
  }, [json, settings.expand]);

  const onCanvasClick = () => {
    const input = document.querySelector("input:focus") as HTMLInputElement;
    if (input) input.blur();
  };

  const onInit = (ref: ReactZoomPanPinchRef) =>
    dispatch({
      type: ConfigActionType.SET_ZOOM_PAN_PICNH_REF,
      payload: ref,
    });

  return (
    <StyledLiveEditor>
      <Tools />
      <StyledEditorWrapper>
        <TransformWrapper
          maxScale={1.8}
          minScale={0.4}
          initialScale={0.8}
          wheel={wheelOptions}
          onInit={onInit}
        >
          <TransformComponent
            wrapperStyle={{
              width: "100%",
              height: "100%",
            }}
          >
            <Canvas
              nodes={data.nodes}
              node={(props) => <CustomNode {...props} />}
              edges={data.edges}
              maxWidth={size.width}
              maxHeight={size.height}
              zoomable={false}
              direction={settings.layout}
              readonly
              key={settings.layout}
              onCanvasClick={onCanvasClick}
              onLayoutChange={(lay) => {
                if (lay.width && lay.height)
                  setSize({ width: lay.width, height: lay.height });
              }}
            />
          </TransformComponent>
        </TransformWrapper>
      </StyledEditorWrapper>
    </StyledLiveEditor>
  );
});
