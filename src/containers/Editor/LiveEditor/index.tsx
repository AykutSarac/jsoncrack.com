import React from "react";
import styled from "styled-components";
import { Tools } from "src/containers/Editor/Tools";
import { Graph } from "src/components/Graph";

const StyledLiveEditor = styled.div`
  position: relative;
`;

const LiveEditor: React.FC = () => {
  return (
    <StyledLiveEditor>
      <Tools />
      <Graph />
    </StyledLiveEditor>
  );
};

export default LiveEditor;
