import React from "react";
import { Label, Node, NodeProps } from "reaflow";
import ObjectNode from "./ObjectNode";
import TextNode from "./TextNode";

export interface CustomNodeProps<T> {
  width: number;
  height: number;
  value: T;
  isParent?: boolean;
  x: number;
  y: number;
}

const baseLabelStyle = {
  fill: "transparent",
  stroke: "transparent",
  strokeWidth: 0,
};

export const CustomNode = (nodeProps: NodeProps) => {
  const { properties } = nodeProps;

  return (
    <Node {...nodeProps} label={<Label style={baseLabelStyle} />}>
      {({ width, height, x, y, node }) => {
        if (Array.isArray(properties.text)) {
          return (
            <ObjectNode
              value={properties.text}
              width={width}
              height={height}
              x={x}
              y={y}
            />
          );
        }

        return (
          <TextNode
            node={node as NodeData}
            isParent={properties.data.isParent}
            value={properties.text}
            width={width}
            height={height}
            hasCollapse={properties.data.hasChild}
            x={x}
            y={y}
          />
        );
      }}
    </Node>
  );
};
