import React from "react";
import type { NodeProps } from "reaflow";
import { Node } from "reaflow";
import type { NodeData } from "../types";
import { ObjectNode } from "./ObjectNode";
import { TextNode } from "./TextNode";
import { useSearchContext } from "./SearchContext";
import styles from "./Node.module.css";

type CustomNodeProps = NodeProps<NodeData> & {
  onNodeClick?: (node: NodeData) => void;
};

const CustomNodeBase = ({ onNodeClick, ...nodeProps }: CustomNodeProps) => {
  const { isSearchActive, isNodeMatched, matchedNodeIds } = useSearchContext();
  const nodeId = nodeProps.id;
  const isMatched = isNodeMatched(nodeId);

  const handleNodeClick = React.useCallback(
    (_: React.MouseEvent<SVGGElement, MouseEvent>, data: NodeData) => {
      onNodeClick?.(data);
    },
    [onNodeClick]
  );

  let nodeClassName = "";
  if (isSearchActive) {
    nodeClassName = isMatched ? styles.nodeMatched : styles.nodeUnmatched;
  }

  return (
    <Node
      {...nodeProps}
      onClick={handleNodeClick as any}
      animated={false}
      label={null as any}
      className={nodeClassName || undefined}
      onEnter={event => {
        event.currentTarget.style.stroke = "#3B82F6";
      }}
      onLeave={event => {
        event.currentTarget.style.stroke = "var(--node-stroke)";
      }}
      style={{
        fill: "var(--node-fill)",
        stroke: "var(--node-stroke)",
        strokeWidth: 1,
      }}
    >
      {({ node, x, y }) => {
        if (nodeProps.properties.text[0]?.key == null) {
          return <TextNode node={nodeProps.properties as NodeData} x={x} y={y} />;
        }

        return <ObjectNode node={node as NodeData} x={x} y={y} />;
      }}
    </Node>
  );
};

export const CustomNode = React.memo(CustomNodeBase);
