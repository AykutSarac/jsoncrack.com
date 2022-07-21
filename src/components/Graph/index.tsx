import React from "react";
import { Canvas, EdgeData, ElkRoot, NodeData } from "reaflow";
import { CustomNode } from "src/components/CustomNode";
import { getEdgeNodes } from "src/containers/LiveEditor/helpers";
import useConfig from "src/hooks/store/useConfig";
import shallow from "zustand/shallow";

export const Graph: React.FC = () => {
  const json = useConfig((state) => state.json);
  const [expand, layout] = useConfig(
    (state) => [state.settings.expand, state.settings.layout],
    shallow
  );

  const [nodes, setNodes] = React.useState<NodeData[]>([]);
  const [edges, setEdges] = React.useState<EdgeData[]>([]);
  const [size, setSize] = React.useState({
    width: 2000,
    height: 2000,
  });

  React.useEffect(() => {
    const { nodes, edges } = getEdgeNodes(json, expand);

    setNodes(nodes);
    setEdges(edges);
  }, [json, expand]);

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
      direction={layout}
      key={layout}
      onCanvasClick={onCanvasClick}
      onLayoutChange={onLayoutChange}
      node={CustomNode}
      zoomable={false}
      readonly
    />
  );
};
