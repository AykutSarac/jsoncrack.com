import { NodeData, EdgeData } from "reaflow/dist/types";

export const findNodeChildren = (
  selectedNode: string,
  nodes: NodeData[],
  edges: EdgeData[]
) => {
  const toByFrom = {};
  for (const edge of edges) {
    if (edge.from) {
      toByFrom[edge.from] ??= [];
      toByFrom[edge.from].push(edge.to);
    }
  }

  const getNodes = (parent, allNodesIds: string[] = []) => {
    const tos = toByFrom[parent];
    if (tos) {
      allNodesIds.push(...tos);
      for (const to of tos) {
        getNodes(to, allNodesIds);
      }
    }
    return allNodesIds;
  };

  const myNodes = getNodes(selectedNode);

  const findNodes = myNodes.map((id) => {
    const node = nodes.find((n) => n.id === id);
    return node as NodeData<any>;
  });

  return findNodes;
};
