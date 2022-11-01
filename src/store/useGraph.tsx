import { CanvasDirection } from "reaflow";
import { Graph } from "src/components/Graph";
import { getChildrenEdges } from "src/utils/getChildrenEdges";
import { getOutgoers } from "src/utils/getOutgoers";
import create from "zustand";

const initialStates = {
  loading: false,
  direction: "RIGHT" as CanvasDirection,
  graphCollapsed: false,
  nodes: [] as NodeData[],
  edges: [] as EdgeData[],
  collapsedNodes: [] as string[],
  collapsedEdges: [] as string[],
  collapsedParents: [] as string[],
};

export type Graph = typeof initialStates;

interface GraphActions {
  setGraphValue: (key: keyof Graph, value: any) => void;
  setLoading: (loading: boolean) => void;
  setDirection: (direction: CanvasDirection) => void;
  expandNodes: (nodeId: string) => void;
  collapseNodes: (nodeId: string) => void;
  collapseGraph: () => void;
  expandGraph: () => void;
}

const useGraph = create<Graph & GraphActions>((set, get) => ({
  ...initialStates,
  setDirection: direction => set({ direction }),
  setGraphValue: (key, value) =>
    set({
      collapsedParents: [],
      collapsedNodes: [],
      collapsedEdges: [],
      graphCollapsed: false,
      loading: true,
      [key]: value,
    }),
  setLoading: loading => set({ loading }),
  expandNodes: nodeId => {
    const [childrenNodes, matchingNodes] = getOutgoers(
      nodeId,
      get().nodes,
      get().edges,
      get().collapsedParents
    );
    const childrenEdges = getChildrenEdges(childrenNodes, get().edges);

    let nodesConnectedToParent = childrenEdges.reduce((nodes: string[], edge) => {
      edge.from && !nodes.includes(edge.from) && nodes.push(edge.from);
      edge.to && !nodes.includes(edge.to) && nodes.push(edge.to);
      return nodes;
    }, []);
    const matchingNodesConnectedToParent = matchingNodes.filter(node =>
      nodesConnectedToParent.includes(node)
    );
    const nodeIds = childrenNodes
      .map(node => node.id)
      .concat(matchingNodesConnectedToParent);
    const edgeIds = childrenEdges.map(edge => edge.id);

    const collapsedParents = get().collapsedParents.filter(cp => cp !== nodeId);
    const collapsedNodes = get().collapsedNodes.filter(
      nodeId => !nodeIds.includes(nodeId)
    );
    const collapsedEdges = get().collapsedEdges.filter(
      edgeId => !edgeIds.includes(edgeId)
    );

    set({
      collapsedParents,
      collapsedNodes,
      collapsedEdges,
      graphCollapsed: !!collapsedNodes.length,
    });
  },
  collapseNodes: nodeId => {
    const [childrenNodes] = getOutgoers(nodeId, get().nodes, get().edges);
    const childrenEdges = getChildrenEdges(childrenNodes, get().edges);

    const nodeIds = childrenNodes.map(node => node.id);
    const edgeIds = childrenEdges.map(edge => edge.id);

    set({
      collapsedParents: get().collapsedParents.concat(nodeId),
      collapsedNodes: get().collapsedNodes.concat(nodeIds),
      collapsedEdges: get().collapsedEdges.concat(edgeIds),
      graphCollapsed: !!get().collapsedNodes.concat(nodeIds).length,
    });
  },
  collapseGraph: () => {
    const edges = get().edges;
    const tos = edges.map(edge => edge.to);
    const froms = edges.map(edge => edge.from);
    const parentNodesIds = froms.filter(id => !tos.includes(id));
    const secondDegreeNodesIds = edges
      .filter(edge => parentNodesIds.includes(edge.from))
      .map(edge => edge.to);

    set({
      collapsedParents: get()
        .nodes.filter(
          node => !parentNodesIds.includes(node.id) && node.data.isParent
        )
        .map(node => node.id),
      collapsedNodes: get()
        .nodes.filter(
          node =>
            !parentNodesIds.includes(node.id) &&
            !secondDegreeNodesIds.includes(node.id)
        )
        .map(node => node.id),
      collapsedEdges: get()
        .edges.filter(edge => !parentNodesIds.includes(edge.from))
        .map(edge => edge.id),
      graphCollapsed: true,
    });
  },
  expandGraph: () => {
    set({
      collapsedNodes: [],
      collapsedEdges: [],
      collapsedParents: [],
      graphCollapsed: false,
    });
  },
}));

export default useGraph;
