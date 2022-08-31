import React from "react";
import RenderIfVisible from "react-render-if-visible";
import { Label, Node, NodeProps } from "reaflow";
import ObjectNode from "./ObjectNode";
import { StyledTextWrapper } from "./styles";
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
  condition ? (
    <RenderIfVisible rootElementClass="renderVisible">
      {children}
    </RenderIfVisible>
  ) : (
    <StyledTextWrapper>{children}</StyledTextWrapper>
  );

export const CustomNode = (nodeProps: NodeProps) => {
  const { properties } = nodeProps;

  return (
    <Node {...nodeProps} label={<Label style={baseLabelStyle} />}>
      {({ width, height, x, y, node }) => {
        if (properties.text instanceof Object) {
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
            node={node}
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
