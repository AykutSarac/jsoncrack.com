import React from "react";
import { Edge, EdgeProps } from "reaflow";

const CustomEdgeWrapper = (props: EdgeProps) => {
  return <Edge containerClassName={`edge-${props.id}`} {...props} />;
};

export const CustomEdge = React.memo(CustomEdgeWrapper);
