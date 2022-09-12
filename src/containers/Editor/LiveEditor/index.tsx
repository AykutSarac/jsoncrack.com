import React from "react";
import styled from "styled-components";
import { Tools } from "src/containers/Editor/Tools";
import { GraphCanvas } from "src/containers/Editor/LiveEditor/GraphCanvas";

const StyledLiveEditor = styled.div`
  position: relative;
`;

const LiveEditor: React.FC = () => {
  return (
    <StyledLiveEditor>
      <Tools />
      <GraphCanvas />
    </StyledLiveEditor>
  );
};

export default LiveEditor;
