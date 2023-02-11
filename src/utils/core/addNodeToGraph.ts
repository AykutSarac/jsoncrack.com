import { calculateNodeSize } from "./calculateNodeSize";
import { Graph } from "./jsonParser";

type Props = {
  graph: Graph;
  text: any;
  isEmpty?: boolean;
  type?: "string" | "number" | "boolean" | "object" | "array" | "null";
};

export const addNodeToGraph = ({ graph, text, type = "null", isEmpty = false }: Props) => {
  let id = String(graph.nodes.length + 1);
  const isParent = type === "array" || type === "object";
  const { width, height } = calculateNodeSize(text, isParent);

  const node = {
    id,
    text,
    width,
    height,
    data: {
      type,
      isParent,
      isEmpty,
      childrenCount: isParent ? 1 : 0,
    },
  };

  graph.nodes = graph.nodes.concat([node]);

  return id;
};
