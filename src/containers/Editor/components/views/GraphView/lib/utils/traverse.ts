import type { Node, NodeType } from "jsonc-parser";
import type {
  Graph,
  States,
} from "src/containers/Editor/components/views/GraphView/lib/jsonParser";
import { calculateNodeSize } from "src/containers/Editor/components/views/GraphView/lib/utils/calculateNodeSize";
import { addEdgeToGraph } from "./addEdgeToGraph";
import { addNodeToGraph } from "./addNodeToGraph";

type PrimitiveOrNullType = "boolean" | "string" | "number" | "null";

type Traverse = {
  states: States;
  objectToTraverse: Node;
  parentType?: string;
  myParentId?: string;
  nextType?: string;
};

const isPrimitiveOrNullType = (type: unknown): type is PrimitiveOrNullType => {
  return ["boolean", "string", "number", "null"].includes(type as string);
};

const alignChildren = (nodeA: Node, nodeB: Node): number => {
  const aChildType = nodeA?.children?.[1]?.type;
  const bChildType = nodeB?.children?.[1]?.type;

  if (isPrimitiveOrNullType(aChildType) && !isPrimitiveOrNullType(bChildType)) {
    return -1;
  }

  return 0;
};

function handleNoChildren(
  value: string | undefined,
  states: States,
  graph: Graph,
  myParentId?: string,
  parentType?: string,
  nextType?: string
) {
  if (value === undefined) return;

  if (parentType === "property" && nextType !== "object" && nextType !== "array") {
    states.brothersParentId = myParentId;
    if (nextType === undefined && Array.isArray(states.brothersNode)) {
      states.brothersNode.push([states.brotherKey, value]);
    } else {
      states.brotherKey = value;
    }
  } else if (parentType === "array") {
    const nodeFromArrayId = addNodeToGraph({ graph, text: String(value) });

    if (myParentId) {
      addEdgeToGraph(graph, myParentId, nodeFromArrayId);
    }
  }

  if (nextType && parentType !== "array" && (nextType === "object" || nextType === "array")) {
    states.parentName = value;
  }
}

function handleHasChildren(
  type: NodeType,
  states: States,
  graph: Graph,
  children: Node[],
  myParentId?: string,
  parentType?: string
) {
  let parentId: string | undefined;

  if (type !== "property" && states.parentName !== "") {
    // add last brothers node and add parent node

    if (states.brothersNode.length > 0) {
      const findBrothersNode = states.brothersNodeProps.find(
        e =>
          e.parentId === states.brothersParentId &&
          e.objectsFromArrayId === states.objectsFromArray[states.objectsFromArray.length - 1]
      );

      if (findBrothersNode) {
        const findNodeIndex = graph.nodes.findIndex(e => e.id === findBrothersNode?.id);

        if (findNodeIndex !== -1) {
          const modifyNodes = [...graph.nodes];
          const foundNode = modifyNodes[findNodeIndex];

          foundNode.text = foundNode.text.concat(states.brothersNode as any);
          const { width, height } = calculateNodeSize(foundNode.text, false);

          foundNode.width = width;
          foundNode.height = height;

          graph.nodes = modifyNodes;
          states.brothersNode = [];
        }
      } else {
        const brothersNodeId = addNodeToGraph({ graph, text: states.brothersNode });

        states.brothersNode = [];

        if (states.brothersParentId) {
          addEdgeToGraph(graph, states.brothersParentId, brothersNodeId);
        } else {
          states.notHaveParent.push(brothersNodeId);
        }

        states.brothersNodeProps.push({
          id: brothersNodeId,
          parentId: states.brothersParentId,
          objectsFromArrayId: states.objectsFromArray[states.objectsFromArray.length - 1],
        });
      }
    }

    // Add parent node
    parentId = addNodeToGraph({ graph, type, text: states.parentName });
    states.bracketOpen.push({ id: parentId, type });
    states.parentName = "";

    // Add edges from parent node
    const brothersProps = states.brothersNodeProps.filter(
      e =>
        e.parentId === myParentId &&
        e.objectsFromArrayId === states.objectsFromArray[states.objectsFromArray.length - 1]
    );

    if (
      (brothersProps.length > 0 &&
        states.bracketOpen[states.bracketOpen.length - 2]?.type !== "object") ||
      (brothersProps.length > 0 && states.bracketOpen.length === 1)
    ) {
      addEdgeToGraph(graph, brothersProps[brothersProps.length - 1].id, parentId);
    } else if (myParentId) {
      addEdgeToGraph(graph, myParentId, parentId);
    } else {
      states.notHaveParent.push(parentId);
    }
  } else if (parentType === "array") {
    states.objectsFromArray = [...states.objectsFromArray, states.objectsFromArrayId++];
  }
  const traverseObject = (objectToTraverse: Node, nextType: string) => {
    traverse({
      states,
      objectToTraverse,
      parentType: type,
      myParentId: states.bracketOpen[states.bracketOpen.length - 1]?.id,
      nextType,
    });
  };

  const traverseArray = () => {
    children.forEach((objectToTraverse, index, array) => {
      const nextType = array[index + 1]?.type;

      traverseObject(objectToTraverse, nextType);
    });
  };

  if (type === "object") {
    children.sort(alignChildren);
    traverseArray();
  } else {
    traverseArray();
  }

  if (type !== "property") {
    // Add or concatenate brothers node when it is the last parent node
    if (states.brothersNode.length > 0) {
      const findBrothersNode = states.brothersNodeProps.find(
        e =>
          e.parentId === states.brothersParentId &&
          e.objectsFromArrayId === states.objectsFromArray[states.objectsFromArray.length - 1]
      );

      if (findBrothersNode) {
        const modifyNodes = [...graph.nodes];
        const findNodeIndex = modifyNodes.findIndex(e => e.id === findBrothersNode?.id);

        if (modifyNodes[findNodeIndex] && typeof states.brothersNode === "string") {
          modifyNodes[findNodeIndex].text += states.brothersNode;

          const { width, height } = calculateNodeSize(modifyNodes[findNodeIndex].text, false);

          modifyNodes[findNodeIndex].width = width;
          modifyNodes[findNodeIndex].height = height;

          graph.nodes = modifyNodes;
          states.brothersNode = [];
        }
      } else {
        const brothersNodeId = addNodeToGraph({ graph, text: states.brothersNode });

        states.brothersNode = [];

        if (states.brothersParentId) {
          addEdgeToGraph(graph, states.brothersParentId, brothersNodeId);
        } else {
          states.notHaveParent = [...states.notHaveParent, brothersNodeId];
        }

        const brothersNodeProps = {
          id: brothersNodeId,
          parentId: states.brothersParentId,
          objectsFromArrayId: states.objectsFromArray[states.objectsFromArray.length - 1],
        };

        states.brothersNodeProps = [...states.brothersNodeProps, brothersNodeProps];
      }
    }

    // Close brackets
    if (parentType === "array") {
      if (states.objectsFromArray.length > 0) {
        states.objectsFromArray.pop();
      }
    } else {
      if (states.bracketOpen.length > 0) {
        states.bracketOpen.pop();
      }
    }

    if (parentId) {
      const myChildren = graph.edges.filter(edge => edge.from === parentId);
      const parentIndex = graph.nodes.findIndex(node => node.id === parentId);

      graph.nodes = graph.nodes.map((node, index) => {
        if (index === parentIndex) {
          const childrenCount = myChildren.length;

          return { ...node, data: { ...node.data, childrenCount } };
        }
        return node;
      });
    }
  }
}

export const traverse = ({
  objectToTraverse,
  states,
  myParentId,
  nextType,
  parentType,
}: Traverse) => {
  const graph = states.graph;
  const { type, children, value } = objectToTraverse;

  if (!children) {
    handleNoChildren(value, states, graph, myParentId, parentType, nextType);
  } else if (children) {
    handleHasChildren(type, states, graph, children, myParentId, parentType);
  }
};
