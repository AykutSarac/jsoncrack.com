import React from "react";
import styled from "styled-components";
import { Graph } from "src/components/Graph";

const StyledLiveEditor = styled.div`
  position: relative;
  height: 100%;
`;

const LiveEditor: React.FC = () => {
  return (
    <StyledLiveEditor>
      <Graph />
    </StyledLiveEditor>
  );
};

export default LiveEditor;
