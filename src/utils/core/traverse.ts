import { Node, NodeType } from "jsonc-parser";
import { Graph, States } from "../json/jsonParser";
import { addEdgeToGraph } from "./addEdgeToGraph";
import { addNodeToGraph } from "./addNodeToGraph";
import { calculateNodeSize } from "./calculateNodeSize";

type PrimitiveOrNullType = "boolean" | "string" | "number" | "null";

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
  value: any,
  states: States,
  graph: Graph,
  myParentId?: string,
  parentType?: string,
  nextType?: string
) {
  if (value !== undefined) {
    if (parentType === "property" && nextType !== "object" && nextType !== "array") {
      states.brothersParentId = myParentId;
      if (nextType === undefined) {
        states.brothersNode = [...states.brothersNode, [states.brotherKey, value]];
      } else {
        states.brotherKey = value;
      }
    } else if (parentType === "array") {
      const nodeFromArrayId = addNodeToGraph({ graph, text: String(value) });
      if (myParentId) {
        addEdgeToGraph(graph, myParentId, nodeFromArrayId);
      }
    }
    if (nextType && parentType !== "array") {
      if (nextType === "object" || nextType === "array") {
        states.parentName = value;
      }
    }
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
      // add or concat brothers node of same parent
      let findBrothersNode = states.brothersNodeProps.find(
        e =>
          e.parentId === states.brothersParentId &&
          e.objectsFromArrayId === states.objectsFromArray[states.objectsFromArray.length - 1]
      );
      if (findBrothersNode) {
        let ModifyNodes = [...graph.nodes];
        let findNode = graph.nodes.findIndex(e => e.id === findBrothersNode?.id);

        if (ModifyNodes[findNode]) {
          ModifyNodes[findNode].text = ModifyNodes[findNode].text.concat(states.brothersNode);
          const { width, height } = calculateNodeSize(ModifyNodes[findNode].text, false);
          ModifyNodes[findNode].width = width;
          ModifyNodes[findNode].height = height;
          graph.nodes = [...ModifyNodes];
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

        states.brothersNodeProps = [
          ...states.brothersNodeProps,
          {
            id: brothersNodeId,
            parentId: states.brothersParentId,
            objectsFromArrayId: states.objectsFromArray[states.objectsFromArray.length - 1],
          },
        ];
      }
    }

    // add parent node
    parentId = addNodeToGraph({ graph, type, text: states.parentName });
    states.bracketOpen = [...states.bracketOpen, { id: parentId, type }];
    states.parentName = "";

    // add edges from parent node
    let brothersProps = states.brothersNodeProps.filter(
      e =>
        e.parentId === myParentId &&
        e.objectsFromArrayId === states.objectsFromArray[states.objectsFromArray.length - 1]
    );
    if (
      (brothersProps.length > 0 &&
        states.bracketOpen[states.bracketOpen.length - 2] &&
        states.bracketOpen[states.bracketOpen.length - 2].type !== "object") ||
      (brothersProps.length > 0 && states.bracketOpen.length === 1)
    ) {
      addEdgeToGraph(graph, brothersProps[brothersProps.length - 1].id, parentId);
    } else if (myParentId) {
      addEdgeToGraph(graph, myParentId, parentId);
    } else {
      states.notHaveParent = [...states.notHaveParent, parentId];
    }
  } else if (parentType === "array") {
    states.objectsFromArray = [...states.objectsFromArray, states.objectsFromArrayId++];
  }
  (type === "object" ? children.sort(alignChildren) : children).forEach(
    (objectToTraverse, index, array) => {
      if (array[index + 1]) {
        traverse({
          states,
          objectToTraverse,
          parentType: type,
          myParentId: states.bracketOpen[states.bracketOpen.length - 1]
            ? states.bracketOpen[states.bracketOpen.length - 1].id
            : undefined,
          nextType: array[index + 1].type,
        });
      } else {
        traverse({
          states,
          objectToTraverse,
          parentType: type,
          myParentId: states.bracketOpen[states.bracketOpen.length - 1]
            ? states.bracketOpen[states.bracketOpen.length - 1].id
            : undefined,
          nextType: undefined,
        });
      }
    }
  );

  if (type !== "property") {
    // when children end
    // add or concat brothers node when it is the last parent node
    if (states.brothersNode.length > 0) {
      let findBrothersNode = states.brothersNodeProps.find(
        e =>
          e.parentId === states.brothersParentId &&
          e.objectsFromArrayId === states.objectsFromArray[states.objectsFromArray.length - 1]
      );
      if (findBrothersNode) {
        let ModifyNodes = [...graph.nodes];
        let findNode = graph.nodes.findIndex(e => e.id === findBrothersNode?.id);

        if (ModifyNodes[findNode]) {
          ModifyNodes[findNode].text = ModifyNodes[findNode].text.concat(states.brothersNode);
          const { width, height } = calculateNodeSize(ModifyNodes[findNode].text, false);
          ModifyNodes[findNode].width = width;
          ModifyNodes[findNode].height = height;
          graph.nodes = [...ModifyNodes];
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

        states.brothersNodeProps = [
          ...states.brothersNodeProps,
          {
            id: brothersNodeId,
            parentId: states.brothersParentId,
            objectsFromArrayId: states.objectsFromArray[states.objectsFromArray.length - 1],
          },
        ];
      }
    }

    // close brackets
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
      const myIndex = graph.nodes.findIndex(node => node.id === parentId);

      const modifiedNodes = graph.nodes.map((node, index) => {
        if (index === myIndex) {
          return { ...node, data: { ...node.data, childrenCount: myChildren.length } };
        }
        return node;
      });

      graph.nodes = modifiedNodes;
    }
  }
}

type Traverse = {
  states: States;
  objectToTraverse: Node;
  parentType?: string;
  myParentId?: string;
  nextType?: string;
};

export const traverse = ({
  objectToTraverse,
  states,
  myParentId,
  nextType,
  parentType,
}: Traverse) => {
  const graph = states.graph;
  let { type, children, value } = objectToTraverse;

  if (!children) {
    handleNoChildren(value, states, graph, myParentId, parentType, nextType);
  } else if (children) {
    handleHasChildren(type, states, graph, children, myParentId, parentType);
  }
};
