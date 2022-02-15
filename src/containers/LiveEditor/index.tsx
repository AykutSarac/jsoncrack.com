import React from "react";
import styled from "styled-components";
import {
  TransformWrapper,
  TransformComponent,
  ReactZoomPanPinchRef,
} from "react-zoom-pan-pinch";
import { useLocalStorage } from "usehooks-ts";
import { Canvas, CanvasRef } from "reaflow";

import { StorageConfig } from "src/typings/global";
import { getEdgeNodes } from "./helpers";
import { CustomNode } from "./CustomNode";
import { Button } from "src/components/Button";
import {
  AiOutlineZoomIn,
  AiOutlineZoomOut,
  AiOutlineFullscreen,
  AiFillSave,
} from "react-icons/ai";
import { useLoading } from "src/hooks/useLoading";

const StyledLiveEditor = styled.div`
  position: relative;
  border-left: 3px solid ${({ theme }) => theme.SILVER_DARK};
`;

const StyledEditorWrapper = styled.div`
  position: absolute;
`;

const StyledControls = styled.div`
  position: fixed;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 8px;
  bottom: 8px;
  right: 8px;
  opacity: 0.9;

  button:hover {
    opacity: 0.5;
  }
`;

export const LiveEditor: React.FC<{
  json: string;
  setJson: React.Dispatch<React.SetStateAction<string>>;
}> = ({ json }) => {
  const pageLoaded = useLoading();

  const canvasRef = React.useRef<CanvasRef | null>(null);
  const wrapperRef = React.useRef<ReactZoomPanPinchRef | null>(null);
  const [config] = useLocalStorage<StorageConfig>("config", {
    layout: "LEFT",
    expand: true,
    controls: true,
  });

  React.useEffect(() => {
    if (wrapperRef.current) wrapperRef.current?.resetTransform();
  }, [json, wrapperRef]);

  const { nodes, edges } = getEdgeNodes(json, config.expand);

  const zoomIn = (scale: number) => {
    if (
      wrapperRef.current?.state.scale &&
      wrapperRef.current?.state.scale < 2
    ) {
      wrapperRef.current?.setTransform(
        wrapperRef.current.instance.transformState.positionX - 200,
        wrapperRef.current.instance.transformState.positionY - 200,
        wrapperRef.current.state.scale + scale
      );
    }
  };

  const zoomOut = (scale: number) => {
    if (
      wrapperRef.current?.state.scale &&
      wrapperRef.current?.state.scale > 0.4
    ) {
      wrapperRef.current?.setTransform(
        wrapperRef.current.instance.transformState.positionX + 200,
        wrapperRef.current.instance.transformState.positionY + 200,
        wrapperRef.current.state.scale - scale
      );
    }
  };

  if (pageLoaded)
    return (
      <StyledLiveEditor>
        <StyledEditorWrapper>
          <TransformWrapper
            maxScale={2}
            minScale={0.4}
            initialScale={0.8}
            ref={wrapperRef}
            limitToBounds={false}
            wheel={{
              step: 0.4,
            }}
          >
            <TransformComponent>
              <Canvas
                ref={canvasRef}
                nodes={nodes}
                edges={edges}
                layoutOptions={{
                  "elk.direction": config.layout,
                }}
                maxWidth={20000}
                maxHeight={20000}
                center={false}
                zoomable={false}
                fit
                readonly
                animated
                node={CustomNode}
              />
            </TransformComponent>
          </TransformWrapper>
        </StyledEditorWrapper>
        {config.controls && (
          <StyledControls>
            <Button onClick={() => zoomIn(0.5)}>
              <AiOutlineZoomIn size={24} />
            </Button>
            <Button onClick={() => zoomOut(0.4)}>
              <AiOutlineZoomOut size={24} />
            </Button>
            <Button onClick={() => wrapperRef.current?.resetTransform()}>
              <AiOutlineFullscreen size={24} />
            </Button>
            <Button onClick={() => localStorage.setItem("json", json)}>
              <AiFillSave size={24} />
            </Button>
          </StyledControls>
        )}
      </StyledLiveEditor>
    );

  return null;
};
