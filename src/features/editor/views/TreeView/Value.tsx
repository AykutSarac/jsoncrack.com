import React from "react";
import type { DefaultTheme } from "styled-components";
import { useTheme } from "styled-components";
import { TextRenderer } from "../GraphView/CustomNode/TextRenderer";
import { Popover, Button } from "@mantine/core";

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

interface ValueProps {
  valueAsString: unknown;
  value: unknown;
}

export const Value = (props: ValueProps) => {
  const theme = useTheme();
  const { valueAsString, value } = props;
  const [opened, setOpened] = React.useState(false);
  
  return (
    <Popover
      opened={opened}
      onChange={setOpened}
      position="right"
      withArrow
      shadow="md"
      withinPortal
    >
      <Popover.Target>
        <span
          style={{
            color: getValueColor({
              theme,
              $value: valueAsString,
            }),
            cursor: "pointer",
          }}
          onClick={() => setOpened((o) => !o)}
        >
          <TextRenderer>{JSON.stringify(value)}</TextRenderer>
        </span>
      </Popover.Target>
      <Popover.Dropdown>
        <Button
          size="xs"
          onClick={() => {
            setOpened(false);
            // Add your edit logic here
            alert("Edit clicked!");
          }}
        >
          Edit
        </Button>
      </Popover.Dropdown>
    </Popover>
  );
};
