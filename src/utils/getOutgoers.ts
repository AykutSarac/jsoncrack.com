export const getOutgoers = (
  nodeId: string,
  nodes: NodeData[],
  edges: EdgeData[]
): NodeData[] => {
  const allOutgoers: NodeData[] = [];

  const runner = (nodeId: string) => {
    const outgoerIds = edges.filter((e) => e.from === nodeId).map((e) => e.to);
    const nodeList = nodes.filter((n) => outgoerIds.includes(n.id));
    allOutgoers.push(...nodeList);
    nodeList.forEach((node) => runner(node.id));
  };

  runner(nodeId);

  return allOutgoers;
};
