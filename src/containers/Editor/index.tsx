import React from "react";
import dynamic from "next/dynamic";
import styled from "styled-components";
import { Allotment } from "allotment";
import "allotment/dist/style.css";
import useGraph from "src/modules/GraphView/stores/useGraph";

export const StyledEditor = styled(Allotment)`
  position: relative !important;
  display: flex;
  background: ${({ theme }) => theme.BACKGROUND_SECONDARY};
  height: calc(100vh - 67px);

  @media only screen and (max-width: 320px) {
    height: 100vh;
  }
`;

const TextEditor = dynamic(() => import("src/containers/Editor/TextEditor"), {
  ssr: false,
});

const LiveEditor = dynamic(() => import("src/containers/Editor/LiveEditor"), {
  ssr: false,
});

export const Editor = () => {
  const fullscreen = useGraph(state => state.fullscreen);

  return (
    <StyledEditor proportionalLayout={false}>
      <Allotment.Pane
        preferredSize={450}
        minSize={fullscreen ? 0 : 300}
        maxSize={800}
        visible={!fullscreen}
      >
        <TextEditor />
      </Allotment.Pane>
      <Allotment.Pane minSize={0}>
        <LiveEditor />
      </Allotment.Pane>
    </StyledEditor>
  );
};
