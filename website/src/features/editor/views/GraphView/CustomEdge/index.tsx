import React from "react";
import { useComputedColorScheme } from "@mantine/core";
import type { EdgeProps } from "reaflow";
import { Edge } from "reaflow";

const CustomEdgeWrapper = (props: EdgeProps) => {
  const colorScheme = useComputedColorScheme();

  return (
    <Edge
      containerClassName={`edge-${props.id}`}
      style={{
        stroke: colorScheme === "dark" ? "#444444" : "#BCBEC0",
        strokeWidth: 1.5,
      }}
      {...props}
    />
  );
};

export const CustomEdge = React.memo(CustomEdgeWrapper);
