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

export const CustomNode = React.memo((nodeProps: NodeProps) => {
  const { properties: data } = nodeProps;

  return (
    <Node {...nodeProps} label={<Label style={baseLabelStyle} />}>
      {() => {
        const { width, height } = nodeProps;

        if (data.text instanceof Object) {
          const entries = Object.entries(data.text);
          return (
            <ObjectNode
              x={nodeProps.x}
              y={nodeProps.y}
              width={width}
              height={height}
              value={entries}
            />
          );
        }

        return (
          <TextNode
            isParent={data.data.isParent}
            width={width}
            height={height}
            value={data.text}
            x={nodeProps.x}
            y={nodeProps.y}
          />
        );
      }}
    </Node>
  );
});
