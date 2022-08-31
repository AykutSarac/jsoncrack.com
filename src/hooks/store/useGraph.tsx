import create from "zustand";
import { Graph } from "src/components/Graph";
import { getChildrenEdges } from "src/utils/getChildrenEdges";
import { getOutgoers } from "src/utils/getOutgoers";

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

const useGraph = create<Graph & GraphActions>((set, get) => ({
  ...initialStates,
  setGraphValue: (key, value) =>
    set({
      collapsedNodes: [],
      collapsedEdges: [],
      [key]: value,
    }),
  expandNodes: (nodeId) => {
    const childrenNodes = getOutgoers(nodeId, get().nodes, get().edges);
    const childrenEdges = getChildrenEdges(childrenNodes, get().edges);

    const nodeIds = childrenNodes.map((node) => node.id);
    const edgeIds = childrenEdges.map((edge) => edge.id);

    set({
      collapsedNodes: get().collapsedNodes.filter(
        (nodeId) => !nodeIds.includes(nodeId)
      ),
      collapsedEdges: get().collapsedEdges.filter(
        (edgeId) => !edgeIds.includes(edgeId)
      ),
    });
  },
  collapseNodes: (nodeId) => {
    const childrenNodes = getOutgoers(nodeId, get().nodes, get().edges);
    const childrenEdges = getChildrenEdges(childrenNodes, get().edges);

    const nodeIds = childrenNodes.map((node) => node.id);
    const edgeIds = childrenEdges.map((edge) => edge.id);

    set({
      collapsedNodes: get().collapsedNodes.concat(nodeIds),
      collapsedEdges: get().collapsedEdges.concat(edgeIds),
    });
  },
}));

export default useGraph;
