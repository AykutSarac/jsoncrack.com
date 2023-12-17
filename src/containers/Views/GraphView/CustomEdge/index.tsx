import React from "react";
import dynamic from "next/dynamic";
import { EdgeProps } from "reaflow/dist/symbols/Edge";

const Edge = dynamic(() => import("reaflow").then(r => r.Edge), {
  ssr: false,
});

const CustomEdgeWrapper = (props: EdgeProps) => {
  return <Edge containerClassName={`edge-${props.id}`} {...props} />;
};

export const CustomEdge = React.memo(CustomEdgeWrapper);
