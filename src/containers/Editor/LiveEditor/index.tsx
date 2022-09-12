import React from "react";
import { GraphCanvas } from "src/containers/Editor/LiveEditor/GraphCanvas";
import { Tools } from "src/containers/Editor/Tools";
import styled from "styled-components";

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
