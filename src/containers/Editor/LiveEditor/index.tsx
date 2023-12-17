import React from "react";
import styled, { DefaultTheme, useTheme } from "styled-components";
import { Menu, Text } from "@mantine/core";
import { JSONTree } from "react-json-tree";
import { Graph } from "src/components/Graph";
import { TextRenderer } from "src/components/Graph/CustomNode/TextRenderer";
import { firaMono } from "src/constants/fonts";
import { ViewMode } from "src/enums/viewMode.enum";
import useConfig from "src/store/useConfig";
import useJson from "src/store/useJson";

const StyledLiveEditor = styled.div`
  position: relative;
  height: 100%;
  background: ${({ theme }) => theme.GRID_BG_COLOR};
  overflow: auto;

  & > ul {
    margin-top: 0 !important;
    padding: 12px !important;
    font-family: ${firaMono.style.fontFamily};
    font-size: 14px;
    font-weight: 500;
  }
`;

type TextColorFn = {
  theme: DefaultTheme;
  $value?: string | unknown;
};

function getValueColor({ $value, theme }: TextColorFn) {
  if ($value && !Number.isNaN(+$value)) return theme.NODE_COLORS.INTEGER;
  if ($value === "true") return theme.NODE_COLORS.BOOL.TRUE;
  if ($value === "false") return theme.NODE_COLORS.BOOL.FALSE;
  if ($value === "null") return theme.NODE_COLORS.NULL;

  // default
  return theme.NODE_COLORS.NODE_VALUE;
}

function getLabelColor({ $type, theme }: { $type?: string; theme: DefaultTheme }) {
  if ($type === "Object") return theme.NODE_COLORS.PARENT_OBJ;
  if ($type === "Array") return theme.NODE_COLORS.PARENT_ARR;
  return theme.NODE_COLORS.PARENT_OBJ;
}

const View = () => {
  const theme = useTheme();
  const json = useJson(state => state.json);
  const viewMode = useConfig(state => state.viewMode);

  if (viewMode === ViewMode.Graph) return <Graph />;

  if (viewMode === ViewMode.Tree)
    return (
      <JSONTree
        data={JSON.parse(json)}
        labelRenderer={(keyPath, nodeType, expanded, expandable) => {
          return (
            <span
              style={{
                color: getLabelColor({
                  theme,
                  $type: nodeType,
                }),
              }}
            >
              {keyPath[0]}:
            </span>
          );
        }}
        valueRenderer={(valueAsString, value) => {
          return (
            <span
              style={{
                color: getValueColor({
                  theme,
                  $value: valueAsString,
                }),
              }}
            >
              <TextRenderer>{JSON.stringify(value)}</TextRenderer>
            </span>
          );
        }}
        theme={{
          extend: {
            overflow: "scroll",
            height: "100%",
            scheme: "monokai",
            author: "wimer hazenberg (http://www.monokai.nl)",
            base00: theme.GRID_BG_COLOR,
          },
        }}
      />
    );
};

const LiveEditor: React.FC = () => {
  const viewMode = useConfig(state => state.viewMode);
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
