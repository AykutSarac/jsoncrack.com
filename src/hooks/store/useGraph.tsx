import create from "zustand";
import { EdgeData, NodeData } from "reaflow";
import { Graph } from "src/components/Graph";
import { findEdgeChildren } from "src/utils/findEdgeChildren";
import { findNodeChildren } from "src/utils/findNodeChildren";

export interface Graph {
  initialNodes: NodeData[];
  initialEdges: EdgeData[];
  nodes: NodeData[];
  edges: EdgeData[];
  collapsedNodes: { [key: string]: NodeData[] };
  collapsedEdges: { [key: string]: EdgeData[] };
}

interface GraphActions {
  setGraphValue: (key: keyof Graph, value: any) => void;
  toggleNode: (node: NodeData, isExpanded: boolean) => void;
}

function isNode(element: NodeData | EdgeData) {
  if ("text" in element) return true;
  return false;
}

export const getIncomers = (
  node: NodeData,
  nodes: NodeData[],
  edges: EdgeData[]
): NodeData[] => {
  if (!isNode(node)) {
    return [];
  }

  const incomersIds = edges.filter((e) => e.to === node.id).map((e) => e.from);
  return nodes.filter((n) => incomersIds.includes(n.id));
};

export const getOutgoingEdges = (
  node: NodeData,
  edges: EdgeData[]
): EdgeData[] => {
  if (!isNode(node)) {
    return [];
  }

  return edges.filter((edge) => edge.from === node.id);
};

export const getIncomingEdges = (
  node: NodeData,
  edges: EdgeData[]
): EdgeData[] => {
  if (!isNode(node)) {
    return [];
  }

  return edges.filter((edge) => edge.to === node.id);
};

export const getOutgoers = (
  node: NodeData,
  nodes: NodeData[],
  edges: EdgeData[]
) => {
  const allOutgoers: NodeData[] = [];

  if (!isNode(node)) {
    return [];
  }

  const runner = (currentNode: NodeData) => {
    const outgoerIds = edges
      .filter((e) => e.from === currentNode.id)
      .map((e) => e.to);
    const nodeList = nodes.filter((n) => outgoerIds.includes(n.id));
    allOutgoers.push(...nodeList);
    nodeList.forEach((node) => runner(node));
  };

  return allOutgoers;
};

const initialStates: Graph = {
  initialNodes: [],
  initialEdges: [],
  nodes: [],
  edges: [],
  collapsedNodes: {},
  collapsedEdges: {},
};

const useGraph = create<Graph & GraphActions>((set, get) => ({
  ...initialStates,
  setGraphValue: (key, value) =>
    set((state) => ({
      ...state,
      [key]: value,
    })),
  toggleNode: (node, isExpanded) =>
    set((state) => {
      const childrenNodes = findNodeChildren(
        node.id,
        state.initialNodes,
        state.initialEdges
      );
      const childrenEdges = findEdgeChildren(
        node.id,
        childrenNodes,
        state.initialEdges
      );

      const expand = () => {
        if (isExpanded) {
          return {
            nodes: state.nodes.filter(
              (sNode) => !childrenNodes.map((n) => n.id).includes(sNode.id)
            ),
            edges: state.edges.filter(
              (sEdge) => !childrenEdges.map((n) => n.id).includes(sEdge.id)
            ),
          };
        }

        return {
          nodes: state.nodes.concat(childrenNodes),
          edges: state.edges.concat(childrenEdges),
        };
      };

      return {
        ...state,
        nodes: expand().nodes,
        edges: expand().edges,
      };
    }),
}));

export default useGraph;
