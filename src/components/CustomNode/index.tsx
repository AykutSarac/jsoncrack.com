import React from "react";
import { Node, NodeProps } from "reaflow";
import useGraph from "src/hooks/store/useGraph";
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

export const CustomNode = (nodeProps: NodeProps) => {
  const { properties } = nodeProps;

  return (
    <Node {...nodeProps} label={<React.Fragment />}>
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
