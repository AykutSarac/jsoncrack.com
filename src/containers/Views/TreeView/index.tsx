import React from "react";
import { useTheme } from "styled-components";
import { JSONTree } from "react-json-tree";
import useJson from "src/store/useJson";
import { EditModal } from "./EditModal";
import { Label } from "./Label";
import { Value } from "./Value";

export const TreeView = () => {
  const theme = useTheme();
  const json = useJson(state => state.json);
  const [opened, setOpened] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState<string | number | null>(null);
  const [path, setPath] = React.useState<(string | number)[]>([]);
  const [value, setValue] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  return (
    <>
      <JSONTree
        hideRoot
        data={JSON.parse(json)}
        valueRenderer={(valueAsString, value) => <Value {...{ valueAsString, value }} />}
        labelRenderer={(keyPath, nodeType) => (
          <Label
            {...{
              keyPath,
              nodeType,
              setOpened,
              setSelectedValue,
              setPath,
              setValue,
            }}
          />
        )}
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
      <EditModal
        {...{
          opened,
          setOpened,
          selectedValue,
          path,
          value,
          setValue,
          errorMessage,
          setErrorMessage,
        }}
      />
    </>
  );
};
