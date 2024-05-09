import React from "react";
import type { EdgeProps } from "reaflow";
import { Edge } from "reaflow";

const CustomEdgeWrapper = (props: EdgeProps) => {
  return <Edge containerClassName={`edge-${props.id}`} {...props} />;
};

export const CustomEdge = React.memo(CustomEdgeWrapper);
