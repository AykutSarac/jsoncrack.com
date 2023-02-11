import { Node, NodeType } from "jsonc-parser";
import { addEdgeToGraph } from "./addEdgeToGraph";
import { addNodeToGraph } from "./addNodeToGraph";
import { calculateNodeSize } from "./calculateNodeSize";
import { States } from "./jsonParser";

const isPrimitiveOrNullType = (type?: NodeType) => {
  return type === "boolean" || type === "string" || type === "number" || type === "null";
};

const alignChildren = (a: Node, b: Node) => {
  if (
    isPrimitiveOrNullType(a?.children?.[1]?.type) &&
    !isPrimitiveOrNullType(b?.children?.[1]?.type)
  ) {
    return -1;
  }
  return 0;
};

export const traverse = (
  states: States,
  objectToTraverse: Node,
  parentType?: string,
  myParentId?: string,
  nextType?: string
) => {
  const graph = states.graph;
  let { type, children, value } = objectToTraverse;

  if (!children) {
    if (value !== undefined) {
      if (parentType === "property" && nextType !== "object" && nextType !== "array") {
        states.brothersParentId = myParentId;
        if (nextType === undefined) {
          // add key and value to brothers node
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
  } else if (children) {
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
      (branch, index, array) => {
        if (array[index + 1]) {
          traverse(
            states,
            branch,
            type,
            states.bracketOpen[states.bracketOpen.length - 1]
              ? states.bracketOpen[states.bracketOpen.length - 1].id
              : undefined,
            array[index + 1].type
          );
        } else {
          traverse(
            states,
            branch,
            type,
            states.bracketOpen[states.bracketOpen.length - 1]
              ? states.bracketOpen[states.bracketOpen.length - 1].id
              : undefined
          );
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
      if (parentType !== "array") {
        if (states.bracketOpen.length > 0) {
          let newBracketOpen = [...states.bracketOpen];
          newBracketOpen.splice(newBracketOpen.length - 1);
          states.bracketOpen = [...newBracketOpen];
        }
      } else if (parentType === "array") {
        if (states.objectsFromArray.length > 0) {
          let newobjectsFromArray = [...states.objectsFromArray];
          newobjectsFromArray.splice(newobjectsFromArray.length - 1);
          states.objectsFromArray = [...newobjectsFromArray];
        }
      }

      if (parentId) {
        let myChildrens = graph.edges.filter(e => e.from === parentId);
        let myIndex = graph.nodes.findIndex(e => e.id === parentId);

        let ModifyNodes = [...graph.nodes];
        if (ModifyNodes[myIndex]) {
          ModifyNodes[myIndex].data.childrenCount = myChildrens.length;
          graph.nodes = [...ModifyNodes];
        }
      }
    }
  }
};
