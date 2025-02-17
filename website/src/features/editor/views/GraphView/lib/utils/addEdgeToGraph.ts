import type { Graph } from "../jsonParser";

export const addEdgeToGraph = (graph: Graph, from: string, to: string) => {
  const newEdge = {
    id: `e${from}-${to}`,
    from: from,
    to: to,
  };

  graph.edges.push(newEdge);
};
