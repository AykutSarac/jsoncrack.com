// import type { Node, NodeType } from "jsonc-parser";
import type { Node } from "jsonc-parser";
import type {
  // Graph,
  States,
} from "src/containers/Editor/components/views/GraphView/lib/jsonParser";
// import { calculateNodeSize } from "src/containers/Editor/components/views/GraphView/lib/utils/calculateNodeSize";
import { addEdgeToGraph } from "./addEdgeToGraph";
import { addNodeToGraph } from "./addNodeToGraph";

// type PrimitiveOrNullType = "boolean" | "string" | "number" | "null";

type Traverse = {
  states: States;
  objectToTraverse: Node;
  parentType?: string;
  myParentId?: string;
  nextType?: string;
};

const traverseArray = (states: States, array: Node, parentId: string) => {
  const graph = states.graph;
  if (array.children) {
    const parentNode = graph.nodes.at(Number(parentId) - 1);
    if (parentNode) {
      parentNode.data.childrenCount = array.children.length;
    }
    for (let i = 0; i < array.children.length; i++) {
      const child = array.children[i];
      let nodeText = "";
      if (child.value !== undefined) {
        nodeText = String(child.value);
      }
      const nodeId = addNodeToGraph({
        graph,
        text: String(nodeText),
        type: child.type,
      });
      addEdgeToGraph(graph, parentId, nodeId);
      if (child.type === "array") {
        traverseArray(states, array.children[i], nodeId);
      } else if (child.type === "object") {
        traverse({ objectToTraverse: child, states, myParentId: nodeId });
      }
    }
  }
};

export const traverse = ({ objectToTraverse, states, myParentId }: Traverse) => {
  const graph = states.graph;
  const { type, children } = objectToTraverse;
  const childQueue: Node[] = [];

  let nodeText: [string, string][] = [];
  let nodeId = "";
  if (children) {
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (child.children) {
        if (child.children[1].type !== "object" && child.children[1].type !== "array") {
          nodeText.push([child.children[0].value, child.children[1].value]);
        } else {
          childQueue.push(child);
        }
      }
    }
  }


  if (myParentId && nodeText.length !== 0) {
    nodeId = addNodeToGraph({ graph, text: nodeText });
    addEdgeToGraph(graph, myParentId, nodeId);
  }

  if (myParentId) {
    const node = graph.nodes.at(Number(myParentId) - 1);
    if (node) {
      node.data.childrenCount = childQueue.length;
      if (nodeText.length !== 0) {
        node.data.childrenCount += 1;
      }
    }
  }

  childQueue.forEach(child => {
    if (child.children) {
      const brotherNodeId = addNodeToGraph({ 
        graph, 
        text: child.children[0].value, 
        type: child.children[1].type,
      });
      if (myParentId) {
        addEdgeToGraph(graph, myParentId, brotherNodeId);
      }
      if (child.children[1].type === "object") {
        traverse({ objectToTraverse: child.children[1], states, myParentId: brotherNodeId });
      } else if (child.children[1].type === "array") {
        traverseArray(states, child.children[1], brotherNodeId);
      }
    }
  });
};
