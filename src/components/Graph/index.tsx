import React from "react";
import { Canvas, EdgeData, ElkRoot, NodeData } from "reaflow";
import { CustomNode } from "src/components/CustomNode";
import { useConfig } from "src/hocs/config";
import { getEdgeNodes } from "src/containers/LiveEditor/helpers";

export const Graph = () => {
  const { json, settings } = useConfig();
  const [nodes, setNodes] = React.useState<NodeData[]>([]);
  const [edges, setEdges] = React.useState<EdgeData[]>([]);
  const [size, setSize] = React.useState({
    width: 2000,
    height: 2000,
  });

  React.useEffect(() => {
    const { nodes, edges } = getEdgeNodes(json, settings.expand);

    setNodes(nodes);
    setEdges(edges);
  }, [json, settings.expand]);

  const onCanvasClick = () => {
    const input = document.querySelector("input:focus") as HTMLInputElement;
    if (input) input.blur();
  };

  const onLayoutChange = (layout: ElkRoot) => {
    if (layout.width && layout.height)
      setSize({ width: layout.width, height: layout.height });
  };

  return (
    <Canvas
      nodes={nodes}
      edges={edges}
      maxWidth={size.width}
      maxHeight={size.height}
      direction={settings.layout}
      key={settings.layout}
      onCanvasClick={onCanvasClick}
      onLayoutChange={onLayoutChange}
      node={CustomNode}
      zoomable={false}
      readonly
    />
  );
};
