import React from "react";
import { Canvas, EdgeData, NodeData } from "reaflow";
import { CustomNode } from "src/components/CustomNode";
import { useConfig } from "src/hocs/config";
import { getEdgeNodes } from "src/containers/LiveEditor/helpers";

export const Graph = () => {
  const [nodes, setNodes] = React.useState<NodeData[]>([]);
  const [edges, setEdges] = React.useState<EdgeData[]>([]);
  const [size, setSize] = React.useState({
    width: 2000,
    height: 2000,
  });

  const {
    states: { json, settings },
  } = useConfig();

  React.useEffect(() => {
    const { nodes, edges } = getEdgeNodes(json, settings.expand);

    setNodes(nodes);
    setEdges(edges);
  }, [json, settings.expand]);

  const onCanvasClick = () => {
    const input = document.querySelector("input:focus") as HTMLInputElement;
    if (input) input.blur();
  };

  return (
    <Canvas
      nodes={nodes}
      node={(props) => <CustomNode {...props} />}
      edges={edges}
      maxWidth={size.width}
      maxHeight={size.height}
      zoomable={false}
      direction={settings.layout}
      readonly
      key={settings.layout}
      onCanvasClick={onCanvasClick}
      onLayoutChange={(lay) => {
        if (lay.width && lay.height)
          setSize({ width: lay.width, height: lay.height });
      }}
    />
  );
};
