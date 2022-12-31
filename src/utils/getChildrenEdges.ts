export const getChildrenEdges = (nodes: NodeData[], edges: EdgeData[]): EdgeData[] => {
  const nodeIds = nodes.map(node => node.id);

  return edges.filter(
    edge => nodeIds.includes(edge.from as string) || nodeIds.includes(edge.to as string)
  );
};
