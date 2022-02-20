import React from "react";
import { Label, Node, Port, NodeProps } from "reaflow";
import ArrayNode from "./ArrayNode";
import BondNode from "./BondNode";
import ObjectNode from "./ObjectNode";

export interface CustomNodeProps<T> {
  width: number;
  height: number;
  value: T;
}

const baseLabelStyle = {
  fill: "transparent",
  stroke: "transparent",
  strokeWidth: 0,
};

const basePortStyle = {
  fill: "black",
};

export const CustomNode = (nodeProps: NodeProps) => {
  const { properties: data } = nodeProps;

  return (
    <Node
      {...nodeProps}
      label={<Label style={baseLabelStyle} />}
      port={<Port style={basePortStyle} rx={10} ry={10} />}
    >
      {(nodeProps: NodeProps) => {
        const { width, height } = nodeProps;

        if (data.text instanceof Object) {
          if (Object.keys(data.text).every((val) => !isNaN(+val))) {
            const text = Object.values(data.text).join("");
            return <ArrayNode width={width} height={height} value={text} />;
          }

          const entries = Object.entries(data.text);
          return <ObjectNode width={width} height={height} value={entries} />;
        }

        return <BondNode width={width} height={height} value={data.text} />;
      }}
    </Node>
  );
};
