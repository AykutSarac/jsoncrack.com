import React from "react";
import dynamic from "next/dynamic";
import { Allotment } from "allotment";
import "allotment/dist/style.css";
import { JsonEditor } from "src/containers/Editor/JsonEditor";
import useGraph from "src/store/useGraph";
import styled from "styled-components";

export const StyledEditor = styled(Allotment)`
  position: relative !important;
  display: flex;
  background: ${({ theme }) => theme.BACKGROUND_SECONDARY};
`;

const LiveEditor = dynamic(() => import("src/containers/Editor/LiveEditor"), {
  ssr: false,
});

const Panes: React.FC = () => {
  const fullscreen = useGraph(state => state.fullscreen);
  const toggleFullscreen = useGraph(state => state.toggleFullscreen);
  const isMobile = React.useMemo(() => window.innerWidth <= 768, []);

  React.useEffect(() => {
    if (isMobile) toggleFullscreen(true);
  }, [isMobile, toggleFullscreen]);

  return (
    <StyledEditor proportionalLayout={false} vertical={isMobile}>
      <Allotment.Pane
        preferredSize={isMobile ? "100%" : 410}
        minSize={fullscreen ? 0 : 300}
        maxSize={isMobile ? Infinity : 800}
        visible={!fullscreen}
      >
        <JsonEditor />
      </Allotment.Pane>
      <Allotment.Pane minSize={0} maxSize={isMobile && !fullscreen ? 0 : Infinity}>
        <LiveEditor />
      </Allotment.Pane>
    </StyledEditor>
  );
};

export default Panes;
