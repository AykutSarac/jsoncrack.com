import React from "react";
import type { DefaultTheme } from "styled-components";
import { useTheme } from "styled-components";
import { TextRenderer } from "src/modules/GraphView/CustomNode/TextRenderer";

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
};
