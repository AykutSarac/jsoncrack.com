import React from "react";
import RenderIfVisible from "react-render-if-visible";
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

export const ConditionalWrapper: React.FC<{
  condition?: boolean;
  children: React.ReactNode;
}> = ({ condition, children }) =>
  condition ? <RenderIfVisible>{children}</RenderIfVisible> : <>{children}</>;

export const CustomNode = (nodeProps: NodeProps) => {
  const { properties } = nodeProps;

  return (
    <Node {...nodeProps} label={<Label style={baseLabelStyle} />}>
      {({ width, height, x, y }) => {
        if (properties.text instanceof Object) {
          const entries = Object.entries<string>(properties.text);

          return (
            <ObjectNode
              value={entries}
              width={width}
              height={height}
              x={x}
              y={y}
            />
          );
        }

        return (
          <TextNode
            isParent={properties.data.isParent}
            value={properties.text}
            width={width}
            height={height}
            x={x}
            y={y}
          />
        );
      }}
    </Node>
  );
};
