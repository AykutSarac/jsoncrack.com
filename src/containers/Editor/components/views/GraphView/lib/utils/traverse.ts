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
    for (let i = 0; i < array.children.length; i++) {
      if (array.children[i].type === "array") {
        const nodeId = addNodeToGraph({
          graph,
          text: String(i),
          type: array.children[i].type,
        });
        addEdgeToGraph(graph, parentId, nodeId);
        traverseArray(states, array.children[i], nodeId);
      } else if (array.children[i].type === "object") {
        traverse({ objectToTraverse: array.children[i], states, myParentId: parentId });
      } else {
        console.log(array.children[i].value);
        console.log(array.children[i].type);
        const nodeId = addNodeToGraph({
          graph,
          text: String(array.children[i].value),
          type: array.children[i].type,
        });
        addEdgeToGraph(graph, parentId, nodeId);
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

  if (nodeText.length !== 0) {
    nodeId = addNodeToGraph({ graph, text: nodeText, type });
  }
  else if (myParentId) {
    nodeId = myParentId;
  }

  if (myParentId && nodeId !== myParentId) {
    addEdgeToGraph(graph, myParentId, nodeId);
  }

  childQueue.forEach(child => {
    if (child.children) {
      if (child.children[1].type === "object") {
        // const subNodeId = addNodeToGraph({
        //   graph,
        //   text: child.children[0].value,
        //   type: child.children[1].type,
        // });
        // addEdgeToGraph(graph, nodeId, subNodeId);
        traverse({ objectToTraverse: child.children[1], states, myParentId: myParentId });
      } else if (child.children[1].type === "array") {
        const subNodeId = addNodeToGraph({ 
          graph, 
          text: child.children[0].value, 
          type: child.children[1].type,
        });
        addEdgeToGraph(graph, nodeId, subNodeId);
        traverseArray(states, child.children[1], subNodeId);
      } else {
        console.log(":(");
      }
    }
  });
};
