import React from "react";
import { Button, ButtonGroup } from "@mantine/core";
import styled from "styled-components";
import { MdAdd } from "react-icons/md";
import { VscLock } from "react-icons/vsc";
import { ViewMode } from "src/enums/viewMode.enum";
import { GraphView } from "src/modules/GraphView";
import { TreeView } from "src/modules/TreeView";
import useConfig from "src/store/useConfig";
import useModal from "src/store/useModal";

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

  .tab-group {
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 2;
  }
`;

const View = () => {
  const viewMode = useConfig(state => state.viewMode);

  if (viewMode === ViewMode.Graph) return <GraphView />;
  if (viewMode === ViewMode.Tree) return <TreeView />;
  return null;
};

const LiveEditor = () => {
  const setVisible = useModal(state => state.setVisible);

  return (
    <StyledLiveEditor onContextMenuCapture={e => e.preventDefault()}>
      <ButtonGroup className="tab-group">
        <Button
          fw={500}
          c="gray"
          miw={80}
          size="xs"
          variant="default"
          rightSection={<VscLock />}
          onClick={() => setVisible("upgrade")(true)}
        >
          Tab 1
        </Button>
        <Button size="xs" variant="default" onClick={() => setVisible("upgrade")(true)}>
          <MdAdd />
        </Button>
      </ButtonGroup>
      <View />
    </StyledLiveEditor>
  );
};

export default LiveEditor;
