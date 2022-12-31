import { Graph } from "./jsonParser";

export const addNodeToGraph = (
  graph: Graph,
  text: any,
  width: number,
  height: number,
  parent: "string" | "number" | "boolean" | "object" | "array" | "null" | false,
  isEmpty?: boolean
) => {
  let actualId = String(graph.nodes.length + 1);

  graph.nodes = graph.nodes.concat([
    {
      id: actualId,
      text: text,
      width: width,
      height: height,
      data: {
        parent: parent === "array" || parent === "object" ? parent : false,
        childrenCount: parent ? 1 : 0,
        isEmpty: isEmpty,
      },
    },
  ]);
  return actualId;
};
