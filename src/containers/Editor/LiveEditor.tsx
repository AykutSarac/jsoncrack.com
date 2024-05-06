import React from "react";
import styled from "styled-components";
import { Graph } from "src/containers/Views/GraphView";
import { TreeView } from "src/containers/Views/TreeView";
import { ViewMode } from "src/enums/viewMode.enum";
import useConfig from "src/store/useConfig";

const StyledLiveEditor = styled.div`
  position: relative;
  height: 100%;
  background: ${({ theme }) => theme.GRID_BG_COLOR};
  overflow: auto;
  cursor: url("/assets/cursor.svg"), auto;

  & > ul {
    margin-top: 0 !important;
    padding: 12px !important;
    font-family: monospace;
    font-size: 14px;
    font-weight: 500;
  }
`;

const View = () => {
  const viewMode = useConfig(state => state.viewMode);

  if (viewMode === ViewMode.Graph) return <Graph />;
  if (viewMode === ViewMode.Tree) return <TreeView />;
  return null;
};

const LiveEditor: React.FC = () => {
  return (
    <StyledLiveEditor onContextMenuCapture={e => e.preventDefault()}>
      <View />
    </StyledLiveEditor>
  );
};

export default LiveEditor;
