import React from "react";
import styled from "styled-components";
import { Tools } from "src/containers/Editor/Tools";
import { Graph } from "src/components/Graph";
import useConfig from "src/hooks/store/useConfig";

const StyledLiveEditor = styled.div`
  position: relative;
`;

const LiveEditor: React.FC = () => {
  const json = useConfig((state) => state.json);

  return (
    <StyledLiveEditor>
      <Tools />
      <Graph json={json} />
    </StyledLiveEditor>
  );
};

export default LiveEditor;
