export const getOutgoers = (
  nodeId: string,
  nodes: NodeData[],
  edges: EdgeData[],
  parent: string[] = []
): [NodeData[], string[]] => {
  const outgoerNodes: NodeData[] = [];
  const matchingNodes: string[] = [];

  if (parent.includes(nodeId)) {
    const initialParentNode = nodes.find(n => n.id === nodeId);
    if (initialParentNode) outgoerNodes.push(initialParentNode);
  }

  const runner = (nodeId: string) => {
    const outgoerIds = edges.filter(e => e.from === nodeId).map(e => e.to);
    const nodeList = nodes.filter(n => {
      if (parent.includes(n.id) && !matchingNodes.includes(n.id)) matchingNodes.push(n.id);
      return outgoerIds.includes(n.id) && !parent.includes(n.id);
    });

    outgoerNodes.push(...nodeList);
    nodeList.forEach(node => runner(node.id));
  };

  runner(nodeId);
  return [outgoerNodes, matchingNodes];
};
