import React from "react";
import { DefaultTheme, useTheme } from "styled-components";
import { JSONTree } from "react-json-tree";
import { TextRenderer } from "src/containers/Views/GraphView/CustomNode/TextRenderer";
import useJson from "src/store/useJson";

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

export const TreeView = () => {
  const theme = useTheme();
  const json = useJson(state => state.json);

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
