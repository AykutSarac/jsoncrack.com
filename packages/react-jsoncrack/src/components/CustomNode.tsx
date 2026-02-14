import React from "react";
import type { NodeProps } from "reaflow";
import { Node } from "reaflow";
import type { NodeData } from "../types";
import { ObjectNode } from "./ObjectNode";
import { TextNode } from "./TextNode";

type CustomNodeProps = NodeProps<NodeData> & {
  imagePreviewEnabled: boolean;
  onNodeClick?: (node: NodeData) => void;
};

const CustomNodeBase = ({
  imagePreviewEnabled,
  onNodeClick,
  ...nodeProps
}: CustomNodeProps) => {
  const handleNodeClick = React.useCallback(
    (_: React.MouseEvent<SVGGElement, MouseEvent>, data: NodeData) => {
      onNodeClick?.(data);
    },
    [onNodeClick],
  );

  return (
    <Node
      {...nodeProps}
      onClick={handleNodeClick as any}
      animated={false}
      label={null as any}
      onEnter={(event) => {
        event.currentTarget.style.stroke = "#3B82F6";
      }}
      onLeave={(event) => {
        event.currentTarget.style.stroke = "var(--node-stroke)";
      }}
      style={{
        fill: "var(--node-fill)",
        stroke: "var(--node-stroke)",
        strokeWidth: 1,
      }}
    >
      {({ node, x, y }) => {
        const hasKey = nodeProps.properties.text[0]?.key;
        if (!hasKey) {
          return (
            <TextNode
              node={nodeProps.properties as NodeData}
              x={x}
              y={y}
              imagePreviewEnabled={imagePreviewEnabled}
            />
          );
        }

        return <ObjectNode node={node as NodeData} x={x} y={y} />;
      }}
    </Node>
  );
};

export const CustomNode = React.memo(CustomNodeBase);
