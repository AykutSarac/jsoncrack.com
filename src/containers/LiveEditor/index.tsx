import React from "react";
import styled from "styled-components";
import {
  TransformWrapper,
  TransformComponent,
  ReactZoomPanPinchRef,
} from "react-zoom-pan-pinch";
import { Canvas } from "reaflow";

import { getEdgeNodes } from "./helpers";
import { CustomNode } from "./CustomNode";
import { useLoading } from "src/hooks/useLoading";
import { useConfig } from "src/hocs/config";
import { Tools } from "../Editor/Tools";
import { ConfigActionType } from "src/reducer/reducer";

const StyledLiveEditor = styled.div`
  position: relative;
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
    opacity: 0.7;
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
  const pageLoaded = useLoading();
  const wrapperRef = React.useRef<ReactZoomPanPinchRef | null>(null);
  const [data, setData] = React.useState({
    nodes: [],
    edges: [],
  });

  React.useEffect(() => {
    const { nodes, edges } = getEdgeNodes(json, settings.expand);

    setData({ nodes, edges });
  }, [json, settings.expand]);

  React.useEffect(() => {
    const wrapperRect = wrapperRef.current?.instance.wrapperComponent;

    const node = document.querySelector(
      `span[data-key*='${settings.searchNode}' i]`
    );

    document
      .querySelector("foreignObject.searched")
      ?.classList.remove("searched");

    if (wrapperRect && node && node.parentElement) {
      const newScale = 1;
      const x = Number(node.getAttribute("data-x"));
      const y = Number(node.getAttribute("data-y"));

      const newPositionX =
        (wrapperRect.offsetLeft - x) * newScale +
        node.getBoundingClientRect().width;
      const newPositionY =
        (wrapperRect.offsetTop - y) * newScale +
        node.getBoundingClientRect().height;

      node.parentElement.parentElement
        ?.closest("foreignObject")
        ?.classList.toggle("searched");

      wrapperRef.current?.setTransform(newPositionX, newPositionY, newScale);
    }
  }, [settings.searchNode]);

  const onCanvasClick = () => {
    const input = document.querySelector("input:focus") as HTMLInputElement;
    if (input) input.blur();
  };

  const onInit = (ref: ReactZoomPanPinchRef) =>
    dispatch({
      type: ConfigActionType.SET_ZOOM_PAN_PICNH_REF,
      payload: ref,
    });

  if (pageLoaded)
    return (
      <StyledLiveEditor>
        <Tools />
        <StyledEditorWrapper>
          <TransformWrapper
            maxScale={1.8}
            minScale={0.4}
            initialScale={0.8}
            ref={wrapperRef}
            limitToBounds={false}
            wheel={wheelOptions}
            onInit={onInit}
          >
            <TransformComponent>
              <Canvas
                nodes={data.nodes}
                node={CustomNode}
                edges={data.edges}
                maxWidth={20000}
                maxHeight={20000}
                center={false}
                zoomable={false}
                fit={true}
                direction={settings.layout}
                readonly
                key={settings.layout}
                onCanvasClick={onCanvasClick}
              />
            </TransformComponent>
          </TransformWrapper>
        </StyledEditorWrapper>
      </StyledLiveEditor>
    );

  return null;
});
