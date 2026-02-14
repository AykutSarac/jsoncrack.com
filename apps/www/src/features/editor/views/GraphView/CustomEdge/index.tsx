import React from "react";
import { useComputedColorScheme } from "@mantine/core";
import type { EdgeProps } from "reaflow";
import { Edge } from "reaflow";
import useGraph from "../stores/useGraph";

const CustomEdgeWrapper = (props: EdgeProps) => {
  const colorScheme = useComputedColorScheme();
  const viewPort = useGraph(state => state.viewPort);
  const [hovered, setHovered] = React.useState(false);

  const handeClick = () => {
    const targetNodeId = (props.properties as { to?: string } | undefined)?.to;
    const targetNodeDom = document.querySelector(
      `[data-id$="node-${targetNodeId}"]`
    ) as HTMLElement;
    if (targetNodeDom && targetNodeDom.parentElement) {
      viewPort?.camera.centerFitElementIntoView(targetNodeDom.parentElement, {
        elementExtraMarginForZoom: 150,
      });
    }
  };

  return (
    <Edge
      containerClassName={`edge-${props.id}`}
      onClick={handeClick}
      onEnter={() => setHovered(true)}
      onLeave={() => setHovered(false)}
      style={{
        stroke: colorScheme === "dark" ? "#444444" : "#BCBEC0",
        ...(hovered && { stroke: "#3B82F6" }),
        strokeWidth: 1.5,
      }}
      {...props}
    />
  );
};

export const CustomEdge = React.memo(CustomEdgeWrapper);
