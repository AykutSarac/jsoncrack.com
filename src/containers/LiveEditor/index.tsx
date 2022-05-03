import React from "react";
import styled from "styled-components";
import {
  TransformWrapper,
  TransformComponent,
  ReactZoomPanPinchRef,
} from "react-zoom-pan-pinch";

import { useConfig } from "src/hocs/config";
import { Tools } from "src/containers/Editor/Tools";
import { ConfigActionType } from "src/reducer/reducer";
import { Graph } from "src/components/Graph";

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
  const { dispatch } = useConfig();

  const onInit = (ref: ReactZoomPanPinchRef) => {
    dispatch({
      type: ConfigActionType.SET_ZOOM_PAN_PICNH_REF,
      payload: ref,
    });
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
          centerOnInit
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
});
