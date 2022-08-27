import create from "zustand";
import { EdgeData, NodeData } from "reaflow";
import { Graph } from "src/components/Graph";
import { findEdgeChildren } from "src/utils/findEdgeChildren";
import { findNodeChildren } from "src/utils/findNodeChildren";

export interface Graph {
  nodes: NodeData[];
  edges: EdgeData[];
  collapsedNodes: string[];
  collapsedEdges: string[];
}

interface GraphActions {
  setGraphValue: (key: keyof Graph, value: any) => void;
  expandNodes: (nodeId: string) => void;
  collapseNodes: (nodeId: string) => void;
}

const initialStates: Graph = {
  nodes: [],
  edges: [],
  collapsedNodes: [],
  collapsedEdges: [],
};

const useGraph = create<Graph & GraphActions>((set) => ({
  ...initialStates,
  setGraphValue: (key, value) =>
    set((state) => ({
      ...state,
      [key]: value,
    })),
  expandNodes: (nodeId) =>
    set((state) => {
      const childrenNodes = findNodeChildren(nodeId, state.nodes, state.edges);
      const childrenEdges = findEdgeChildren(
        nodeId,
        childrenNodes,
        state.edges
      );

      const nodeIds = childrenNodes.map((node) => node.id);
      const edgeIds = childrenEdges.map((edge) => edge.id);

      return {
        ...state,
        collapsedNodes: state.collapsedNodes.filter(
          (nodeId) => !nodeIds.includes(nodeId)
        ),
        collapsedEdges: state.collapsedEdges.filter(
          (edgeId) => !edgeIds.includes(edgeId)
        ),
      };
    }),
  collapseNodes: (nodeId) =>
    set((state) => {
      const childrenNodes = findNodeChildren(nodeId, state.nodes, state.edges);
      const childrenEdges = findEdgeChildren(
        nodeId,
        childrenNodes,
        state.edges
      );

      const nodeIds = childrenNodes.map((node) => node.id);
      const edgeIds = childrenEdges.map((edge) => edge.id);

      return {
        ...state,
        collapsedNodes: state.collapsedNodes.concat(nodeIds),
        collapsedEdges: state.collapsedEdges.concat(edgeIds),
      };
    }),
}));

export default useGraph;
