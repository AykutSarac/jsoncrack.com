import React from "react";
import dynamic from "next/dynamic";
import { Allotment } from "allotment";
import "allotment/dist/style.css";
import { JsonEditor } from "src/containers/Editor/JsonEditor";
import useConfig from "src/store/useConfig";
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
  const fullscreen = useConfig(state => state.fullscreen);
  const setConfig = useConfig(state => state.setConfig);
  const isMobile = React.useMemo(() => window.innerWidth <= 768, []);

  React.useEffect(() => {
    if (isMobile) setConfig("fullscreen", true);
  }, [isMobile, setConfig]);

  return (
    <StyledEditor proportionalLayout={false} vertical={isMobile}>
      <Allotment.Pane
        preferredSize={isMobile ? "100%" : 400}
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
