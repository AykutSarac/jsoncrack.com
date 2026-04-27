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
        stroke: colorScheme === "dark" ? "#3a3a3d" : "#c9cdd3",
        ...(hovered && { stroke: colorScheme === "dark" ? "#60a5fa" : "#3b82f6" }),
        strokeWidth: hovered ? 2 : 1.25,
        transition: "stroke 120ms ease, stroke-width 120ms ease",
      }}
      {...props}
    />
  );
};

export const CustomEdge = React.memo(CustomEdgeWrapper);
