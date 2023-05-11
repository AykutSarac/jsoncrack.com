import React from "react";
import { Graph } from "src/components/Graph";

export const GraphCanvas: React.FC<{ isWidget?: boolean }> = ({ isWidget = false }) => {
  return <Graph isWidget={isWidget} />;
};

export type GraphCanvasType = typeof GraphCanvas;
