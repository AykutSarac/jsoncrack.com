import { parseTree } from "jsonc-parser";
import { addEdgeToGraph } from "./addEdgeToGraph";
import { addNodeToGraph } from "./addNodeToGraph";
import { calculateNodeSize } from "./calculateNodeSize";
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
};

export const parser = (jsonStr: string) => {
  try {
    let json = parseTree(jsonStr);

    const graph: Graph = {
      nodes: [],
      edges: [],
    };

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
    };

    if (json) {
      traverse(graph, states, json);

      if (states.notHaveParent.length > 1) {
        if (json.type !== "array") {
          const text = "";
          const { width, height } = calculateNodeSize(text, false);
          const emptyId = addNodeToGraph(graph, text, width, height, false, true);
          states.notHaveParent.forEach(children => {
            addEdgeToGraph(graph, emptyId, children);
          });
        }
      }

      if (graph.nodes.length === 0) {
        if (json.type === "array") {
          const text = "[]";
          const { width, height } = calculateNodeSize(text, false);
          addNodeToGraph(graph, text, width, height, false);
        } else {
          const text = "{}";
          const { width, height } = calculateNodeSize(text, false);
          addNodeToGraph(graph, text, width, height, false);
        }
      }
    }

    return graph;
  } catch (error) {
    console.error(error);
    return {
      nodes: [],
      edges: [],
    };
  }
};

export const parseDataToJSON = (nodes: NodeData[], edges: EdgeData[]) => { // this utility function builds a JSON object from the nodes and edges arrays, and returns it stringified

  const isString = (x: any) => Object.prototype.toString.call(x) === "[object String]";

  const buildObjRecursively = (nodeId?: string) => {
    const filteredNodes = nodes.filter(node => node.id === nodeId);
    const node = filteredNodes.length === 1 ? filteredNodes[0] : undefined;
    if (node && node.text) {
      const childrenIds = edges.filter(edge => edge.from === node.id);
      const childrenNodes = childrenIds.map(edge => buildObjRecursively(edge.to));
      if (node.data.parent === false) {
        if (Array.isArray(node.text) && node.text.length > 0) {
          return {...Object.fromEntries(node.text), ...childrenNodes.reduce((acc, curr) => acc.concat(curr), [])[0]};
        } else if (isString(node.text)) {
          return node.text;
        }
      } else if (node.data.parent === 'array' && isString(node.text)) {
        return {[node.text]: childrenNodes}
      }
    }
  };

  return JSON.stringify(buildObjRecursively("1"));  // start at node 1, root node
};
