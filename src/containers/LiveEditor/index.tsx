import React from "react";
import styled from "styled-components";
import {
  TransformWrapper,
  TransformComponent,
  ReactZoomPanPinchRef,
} from "react-zoom-pan-pinch";
import { useLocalStorage } from "usehooks-ts";
import { Canvas, CanvasRef } from "reaflow/dist/index";

import { StorageConfig } from "src/typings/global";
import { defaultValue } from "../JsonEditor";
import { getEdgeNodes } from "./helpers";
import { NodeWrapper } from "./CustomNode";

const StyledLiveEditor = styled.div`
  position: relative;
  border-left: 3px solid ${({ theme }) => theme.SILVER_DARK};
`;

const StyledEditorWrapper = styled.div`
  position: absolute;
`;

export const LiveEditor: React.FC = () => {
  const canvasRef = React.useRef<CanvasRef | null>(null);
  const wrapperRef = React.useRef<ReactZoomPanPinchRef | null>(null);
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
          ref={wrapperRef}
        >
          <TransformComponent>
            <Canvas
              ref={canvasRef}
              animated
              pannable
              zoomable={false}
              nodes={nodes}
              edges={edges}
              layoutOptions={{
                "elk.direction": config.layout,
              }}
              maxWidth={20000}
              maxHeight={20000}
              fit={true}
              center={false}
              readonly
              node={NodeWrapper}
              onLayoutChange={() => {
                canvasRef.current?.centerCanvas && canvasRef.current?.centerCanvas()
              }}
            />
          </TransformComponent>
        </TransformWrapper>
      </StyledEditorWrapper>
    </StyledLiveEditor>
  );
};
