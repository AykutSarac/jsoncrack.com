import React from "react";
import { useTheme } from "styled-components";
import { JSONTree } from "react-json-tree";
import useJson from "src/store/useJson";
import { Label } from "./Label";
import { Value } from "./Value";

export const TreeView = () => {
  const theme = useTheme();
  const json = useJson(state => state.json);

  return (
    <>
      <JSONTree
        hideRoot
        data={JSON.parse(json)}
        valueRenderer={(valueAsString, value) => <Value {...{ valueAsString, value }} />}
        labelRenderer={(keyPath, nodeType) => <Label {...{ keyPath, nodeType }} />}
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
    </>
  );
};
