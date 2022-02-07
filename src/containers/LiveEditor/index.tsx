import React from "react";
import styled from "styled-components";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { useLocalStorage } from "usehooks-ts";
import { Canvas, CanvasRef } from "reaflow/dist/index";

import { StorageConfig } from "src/typings/global";
import { defaultValue } from "../JsonEditor";
import { getEdgeNodes } from "./helpers";

const StyledLiveEditor = styled.div`
  position: relative;
  border-left: 3px solid ${({ theme }) => theme.SILVER_DARK};
`;

const StyledEditorWrapper = styled.div`
  position: absolute;
`;

export const LiveEditor: React.FC = () => {
  const canvasRef = React.useRef<CanvasRef | null>(null);
  const [json] = useLocalStorage("json", JSON.stringify(defaultValue));
  const [config] = useLocalStorage<StorageConfig>("config", {
    layout: "LEFT",
    minimap: true,
    controls: true,
  });

  const { nodes, edges } = getEdgeNodes(json);

  return (
    <StyledLiveEditor>
      <StyledEditorWrapper>
        <TransformWrapper
          maxScale={2}
          limitToBounds={false}
          minScale={0.5}
          initialScale={0.8}
          initialPositionX={-600}
          initialPositionY={-600}
        >
          <TransformComponent>
            <Canvas
              ref={canvasRef}
              nodes={nodes}
              edges={edges}
              layoutOptions={{
                "elk.direction": config.layout,
                "elk.layout": "mrtree",
              }}
              width={5000}
              height={5000}
              zoomable={false}
              center
            />
          </TransformComponent>
        </TransformWrapper>
      </StyledEditorWrapper>
    </StyledLiveEditor>
  );
};
