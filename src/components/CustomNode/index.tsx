import React from "react";
import { Node, NodeProps } from "reaflow";
import { ObjectNode } from "./ObjectNode";
import { TextNode } from "./TextNode";

export interface CustomNodeProps {
  node: NodeData;
  x: number;
  y: number;
  hasCollapse?: boolean;
}

const rootProps = {
  width: 40,
  height: 40,
  rx: 50,
  ry: 50,
};

const NodeComponent = (nodeProps: NodeProps) => {
  const { text, data } = nodeProps.properties;

  return (
    <Node {...nodeProps} {...(data.isEmpty && rootProps)} label={<React.Fragment />}>
      {({ node, x, y }) => {
        if (Array.isArray(text)) {
          return <ObjectNode node={node as NodeData} x={x} y={y} />;
        }

        return (
          <TextNode node={node as NodeData} hasCollapse={data.childrenCount > 0} x={x} y={y} />
        );
      }}
    </Node>
  );
};

export const CustomNode = React.memo(NodeComponent, (prev, next) => {
  return (
    String(prev.properties.text) === String(next.properties.text) &&
    prev.properties.width === next.properties.width &&
    prev.properties.height === next.properties.height &&
    prev.x === next.x &&
    prev.y === next.y
  );
});
