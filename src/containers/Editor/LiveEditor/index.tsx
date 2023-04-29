import React from "react";
import styled from "styled-components";
import { GraphCanvas } from "src/containers/Editor/LiveEditor/GraphCanvas";

const StyledLiveEditor = styled.div`
  position: relative;
  height: 100%;
`;

const LiveEditor: React.FC = () => {
  return (
    <StyledLiveEditor>
      <GraphCanvas />
    </StyledLiveEditor>
  );
};

export default LiveEditor;
