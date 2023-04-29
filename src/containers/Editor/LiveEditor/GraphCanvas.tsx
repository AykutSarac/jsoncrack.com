import React from "react";
import { Graph } from "src/components/Graph";

export const GraphCanvas = ({ isWidget = false }: { isWidget?: boolean }) => {
  return <Graph isWidget={isWidget} />;
};
