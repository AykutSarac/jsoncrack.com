// import type { Node, NodeType } from "jsonc-parser";
import type { Node } from "jsonc-parser";
import type { States } from "src/containers/Editor/components/views/GraphView/lib/jsonParser";
import { addEdgeToGraph } from "./addEdgeToGraph";
import { addNodeToGraph } from "./addNodeToGraph";

type Traverse = {
  states: States;
  objectToTraverse: Node;
  parentType?: string;
  myParentId?: string;
  nextType?: string;
};

const traverseArray = (states: States, array: Node, parentId: string) => {
  // Unpack input args
  const graph = states.graph;

  // Check that the array has children
  if (array.children) {
    // Records the number of child elements the array will have
    const parentNode = graph.nodes.at(Number(parentId) - 1);
    if (parentNode) {
      parentNode.data.childrenCount = array.children.length;
    }

    // Begin looping over each array element processing accordingly
    for (let i = 0; i < array.children.length; i++) {
      const child = array.children[i];

      // Set up the node text
      // For an array of complex type (object/array), we need
      // to construct dummy nodes that handle either nested arrays
      // or multiple nodes within an object
      // For simple types, we can just read in the child object's value
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

      // Call the appropriate traversal function
      // or end if there are no more nested elements.
      if (child.type === "array") {
        traverseArray(states, array.children[i], nodeId);
      } else if (child.type === "object") {
        traverse({ objectToTraverse: child, states, myParentId: nodeId });
      }
    }
  }
};

export const traverse = ({ objectToTraverse, states, myParentId }: Traverse) => {
  // Unpack input arguments
  const graph = states.graph;
  const { children } = objectToTraverse;

  // Setup initial step conditions
  let nodeId = "";
  const nodeText: [string, string][] = [];
  const childQueue: Node[] = [];
  if (children) {
    // Loop over the children of the JSON node
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (child.children) {
        // If the child is not an object or array, it is a property;
        // record it into the nodeText.
        // Otherwise, push it onto the nodes to be traversed.
        if (child.children[1].type !== "object" && child.children[1].type !== "array") {
          nodeText.push([child.children[0].value, child.children[1].value]);
        } else {
          childQueue.push(child);
        }
      }
    }
  }

  // If we have parent and we have recorded some number of properties,
  // add each as a node in the graph.
  if (myParentId && nodeText.length !== 0) {
    nodeId = addNodeToGraph({ graph, text: nodeText });
    addEdgeToGraph(graph, myParentId, nodeId);
  }

  // Record the number of child objects the node will have
  if (myParentId) {
    const node = graph.nodes.at(Number(myParentId) - 1);
    if (node) {
      node.data.childrenCount = childQueue.length;
      if (nodeText.length !== 0) {
        node.data.childrenCount += 1;
      }
    }
  }

  // Iterate over the child queue, processing each child accordingly.
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
