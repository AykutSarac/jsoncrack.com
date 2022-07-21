import React from "react";
import styled from "styled-components";
import {
  TransformWrapper,
  TransformComponent,
  ReactZoomPanPinchRef,
} from "react-zoom-pan-pinch";

import { Tools } from "src/containers/Editor/Tools";
import { Graph } from "src/components/Graph";
import useConfig from "src/hooks/store/useConfig";

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

const LiveEditor: React.FC = () => {
  const updateSetting = useConfig((state) => state.updateSetting);

  const onInit = (ref: ReactZoomPanPinchRef) => {
    updateSetting("zoomPanPinch", ref);
  };

  return (
    <StyledLiveEditor>
      <Tools />
      <StyledEditorWrapper>
        <TransformWrapper
          maxScale={1.8}
          minScale={0.4}
          initialScale={0.9}
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
            <Graph />
          </TransformComponent>
        </TransformWrapper>
      </StyledEditorWrapper>
    </StyledLiveEditor>
  );
};

export default LiveEditor;
