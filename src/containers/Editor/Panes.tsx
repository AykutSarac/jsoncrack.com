import { Allotment, LayoutPriority } from "allotment";
import React from "react";
import { JsonEditor } from "src/containers/Editor/JsonEditor";
import dynamic from "next/dynamic";
import useConfig from "src/hooks/store/useConfig";
import styled from "styled-components";
import "allotment/dist/style.css";

export const StyledEditor = styled(Allotment)`
  position: relative !important;
  display: flex;
  background: ${({ theme }) => theme.BACKGROUND_SECONDARY};
`;

const LiveEditor = dynamic(() => import("src/containers/Editor/LiveEditor"), {
  ssr: false,
});

const Panes: React.FC = () => {
  const hideEditor = useConfig((state) => state.hideEditor);
  const setConfig = useConfig((state) => state.setConfig);
  const isMobile = window.innerWidth <= 768;

  React.useEffect(() => {
    if (isMobile) setConfig("hideEditor", true);
  }, [isMobile, setConfig]);

  return (
    <StyledEditor proportionalLayout={false} vertical={isMobile}>
      <Allotment.Pane
        preferredSize={isMobile ? "100%" : 400}
        minSize={hideEditor ? 0 : 300}
        maxSize={isMobile ? Infinity : 500}
        visible={!hideEditor}
      >
        <JsonEditor />
      </Allotment.Pane>
      <Allotment.Pane
        minSize={0}
        maxSize={isMobile && !hideEditor ? 0 : Infinity}
      >
        <LiveEditor />
      </Allotment.Pane>
    </StyledEditor>
  );
};

export default Panes;
