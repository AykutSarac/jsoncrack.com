import React from "react";
import { Menu, Text } from "@mantine/core";
import styled from "styled-components";
import { firaMono } from "src/constants/fonts";
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
    font-family: ${firaMono.style.fontFamily};
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
  const [contextOpened, setContextOpened] = React.useState(false);
  const [contextPosition, setContextPosition] = React.useState({
    x: 0,
    y: 0,
  });

  return (
    <StyledLiveEditor
      onContextMenuCapture={e => {
        e.preventDefault();
        setContextOpened(true);
        setContextPosition({ x: e.pageX, y: e.pageY });
      }}
      onClick={() => setContextOpened(false)}
    >
      <div
        style={{
          position: "fixed",
          top: contextPosition.y,
          left: contextPosition.x,
          zIndex: 100,
        }}
      >
        <Menu opened={false} shadow="sm">
          <Menu.Dropdown>
            <Menu.Item>
              <Text size="xs">Download as Image</Text>
            </Menu.Item>
            <Menu.Item>
              <Text size="xs">Zoom to Fit</Text>
            </Menu.Item>
            <Menu.Item>
              <Text size="xs">Rotate</Text>
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </div>

      <View />
    </StyledLiveEditor>
  );
};

export default LiveEditor;
