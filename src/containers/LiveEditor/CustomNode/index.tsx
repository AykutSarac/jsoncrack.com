import React from "react";
import { Label, Node, Port, NodeProps } from "reaflow";
import ObjectNode from "./ObjectNode";
import TextNode from "./TextNode";

export interface CustomNodeProps<T> {
  width: number;
  height: number;
  value: T;
  isParent?: boolean;
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
          const entries = Object.entries(data.text);
          return <ObjectNode width={width} height={height} value={entries} />;
        }

        return (
          <TextNode
            isParent={data.data.isParent}
            width={width}
            height={height}
            value={data.text}
          />
        );
      }}
    </Node>
  );
};
