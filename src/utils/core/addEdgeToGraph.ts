import { Graph } from "./jsonParser";

export const addEdgeToGraph = (graph: Graph, from: string, to: string) => {
  graph.edges = graph.edges.concat([
    {
      id: `e${from}-${to}`,
      from: from,
      to: to,
    },
  ]);
};
