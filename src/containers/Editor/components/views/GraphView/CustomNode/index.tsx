import React from "react";
import type { NodeProps } from "reaflow";
import { Node } from "reaflow";
import useGraph from "src/containers/Editor/components/views/GraphView/stores/useGraph";
import useModal from "src/store/useModal";
import type { NodeData } from "src/types/graph";
import { ObjectNode } from "./ObjectNode";
import { TextNode } from "./TextNode";

export interface CustomNodeProps {
  node: NodeData;
  x: number;
  y: number;
  hasCollapse?: boolean;
}

const rootProps = {
  rx: 50,
  ry: 50,
};

const CustomNodeWrapper = (nodeProps: NodeProps<NodeData["data"]>) => {
  const data = nodeProps.properties.data;
  const setSelectedNode = useGraph(state => state.setSelectedNode);
  const setVisible = useModal(state => state.setVisible);

  const handleNodeClick = React.useCallback(
    (_: React.MouseEvent<SVGGElement, MouseEvent>, data: NodeData) => {
      if (setSelectedNode) setSelectedNode(data);
      setVisible("node")(true);
    },
    [setSelectedNode, setVisible]
  );

  return (
    <Node
      {...nodeProps}
      {...(data?.isEmpty && rootProps)}
      onClick={handleNodeClick as any}
      animated={false}
      label={null as any}
    >
      {({ node, x, y }) => {
        if (Array.isArray(nodeProps.properties.text)) {
          if (data?.isEmpty) return null;
          return <ObjectNode node={node as NodeData} x={x} y={y} />;
        }

        return <TextNode node={node as NodeData} hasCollapse={!!data?.childrenCount} x={x} y={y} />;
      }}
    </Node>
  );
};

export const CustomNode = React.memo(CustomNodeWrapper);
