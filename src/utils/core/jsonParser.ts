import { parseTree } from "jsonc-parser";
import { getNodePath } from "../getNodePath";
import { addEdgeToGraph } from "./addEdgeToGraph";
import { addNodeToGraph } from "./addNodeToGraph";
import { traverse } from "./traverse";

export type Graph = {
  nodes: NodeData[];
  edges: EdgeData[];
};

export type States = {
  parentName: string;
  bracketOpen: { id: string; type: string }[];
  objectsFromArray: number[];
  objectsFromArrayId: number;
  notHaveParent: string[];
  brothersNode: [string, string][];
  brothersParentId: string | undefined;
  brotherKey: string;
  brothersNodeProps: {
    id: string;
    parentId: string | undefined;
    objectsFromArrayId: number | undefined;
  }[];
  graph: {
    nodes: NodeData[];
    edges: EdgeData[];
  };
};

export const parser = (jsonStr: string) => {
  try {
    let json = parseTree(jsonStr);
    if (!json) throw "Invalid JSON"!;

    const states: States = {
      parentName: "",
      bracketOpen: [],
      objectsFromArray: [],
      objectsFromArrayId: 0,
      notHaveParent: [],
      brothersNode: [],
      brothersParentId: undefined,
      brotherKey: "",
      brothersNodeProps: [],
      graph: {
        nodes: [],
        edges: [],
      },
    };

    traverse(states, json);

    if (states.notHaveParent.length > 1) {
      if (json.type !== "array") {
        const emptyId = addNodeToGraph({ graph: states.graph, text: "", isEmpty: true });
        states.notHaveParent.forEach(children => {
          addEdgeToGraph(states.graph, emptyId, children);
        });
      }
    }

    if (states.graph.nodes.length === 0) {
      if (json.type === "array") addNodeToGraph({ graph: states.graph, text: "[]" });
      else addNodeToGraph({ graph: states.graph, text: "{}" });
    }

    states.graph.nodes = states.graph.nodes.map(node => ({
      ...node,
      path: getNodePath(states.graph.nodes, states.graph.edges, node.id),
    }));

    return states.graph;
  } catch (error) {
    console.error(error);
    return {
      nodes: [],
      edges: [],
    };
  }
};
