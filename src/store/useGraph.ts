import { ReactZoomPanPinchRef } from "react-zoom-pan-pinch";
import { CanvasDirection } from "reaflow/dist/layout/elkLayout";
import { create } from "zustand";
import { getChildrenEdges } from "src/lib/utils/graph/getChildrenEdges";
import { getOutgoers } from "src/lib/utils/graph/getOutgoers";
import { parser } from "src/lib/utils/json/jsonParser";
import { NodeData, EdgeData } from "src/types/models";
import useJson from "./useJson";

export interface Graph {
  zoomPanPinch: ReactZoomPanPinchRef | null;
  direction: CanvasDirection;
  loading: boolean;
  graphCollapsed: boolean;
  foldNodes: boolean;
  fullscreen: boolean;
  nodes: NodeData[];
  edges: EdgeData[];
  collapsedNodes: string[];
  collapsedEdges: string[];
  collapsedParents: string[];
  selectedNode: NodeData | null;
  path: string;
}

const initialStates: Graph = {
  zoomPanPinch: null,
  direction: "RIGHT",
  loading: true,
  graphCollapsed: false,
  foldNodes: false,
  fullscreen: false,
  nodes: [],
  edges: [],
  collapsedNodes: [],
  collapsedEdges: [],
  collapsedParents: [],
  selectedNode: null,
  path: "",
};

interface GraphActions {
  setGraph: (json?: string, options?: Partial<Graph>[]) => void;
  setLoading: (loading: boolean) => void;
  setDirection: (direction: CanvasDirection) => void;
  setZoomPanPinch: (ref: ReactZoomPanPinchRef) => void;
  setSelectedNode: (nodeData: NodeData) => void;
  expandNodes: (nodeId: string) => void;
  expandGraph: () => void;
  collapseNodes: (nodeId: string) => void;
  collapseGraph: () => void;
  toggleFold: (value: boolean) => void;
  toggleFullscreen: (value: boolean) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  centerView: () => void;
  clearGraph: () => void;
}

const useGraph = create<Graph & GraphActions>((set, get) => ({
  ...initialStates,
  clearGraph: () => set({ nodes: [], edges: [], loading: false }),
  setSelectedNode: nodeData => set({ selectedNode: nodeData }),
  setGraph: (data, options) => {
    const { nodes, edges } = parser(data ?? useJson.getState().json);

    set({
      nodes,
      edges,
      collapsedParents: [],
      collapsedNodes: [],
      collapsedEdges: [],
      graphCollapsed: false,
      loading: true,
      ...options,
    });
  },
  setDirection: (direction = "RIGHT") => {
    set({ direction });
    setTimeout(() => get().centerView(), 200);
  },
  setLoading: loading => set({ loading }),
  expandNodes: nodeId => {
    const [childrenNodes, matchingNodes] = getOutgoers(
      nodeId,
      get().nodes,
      get().edges,
      get().collapsedParents
    );
    const childrenEdges = getChildrenEdges(childrenNodes, get().edges);

    const nodesConnectedToParent = childrenEdges.reduce((nodes: string[], edge) => {
      edge.from && !nodes.includes(edge.from) && nodes.push(edge.from);
      edge.to && !nodes.includes(edge.to) && nodes.push(edge.to);
      return nodes;
    }, []);
    const matchingNodesConnectedToParent = matchingNodes.filter(node =>
      nodesConnectedToParent.includes(node)
    );
    const nodeIds = childrenNodes.map(node => node.id).concat(matchingNodesConnectedToParent);
    const edgeIds = childrenEdges.map(edge => edge.id);

    const collapsedParents = get().collapsedParents.filter(cp => cp !== nodeId);
    const collapsedNodes = get().collapsedNodes.filter(nodeId => !nodeIds.includes(nodeId));
    const collapsedEdges = get().collapsedEdges.filter(edgeId => !edgeIds.includes(edgeId));

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

    const collapsedParents = get()
      .nodes.filter(node => !parentNodesIds.includes(node.id) && node.data?.isParent)
      .map(node => node.id);

    const collapsedNodes = get()
      .nodes.filter(
        node => !parentNodesIds.includes(node.id) && !secondDegreeNodesIds.includes(node.id)
      )
      .map(node => node.id);

    // const closestParentToRoot = Math.min(...collapsedParents.map(n => +n));
    // const focusNodeId = `g[id*='node-${closestParentToRoot}']`;
    // const rootNode = document.querySelector(focusNodeId);

    set({
      collapsedParents,
      collapsedNodes,
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
  zoomIn: () => {
    const zoomPanPinch = get().zoomPanPinch;

    zoomPanPinch?.setTransform(
      zoomPanPinch?.state.positionX,
      zoomPanPinch?.state.positionY,
      zoomPanPinch?.state.scale + 0.4
    );
  },
  zoomOut: () => {
    const zoomPanPinch = get().zoomPanPinch;

    zoomPanPinch?.setTransform(
      zoomPanPinch?.state.positionX,
      zoomPanPinch?.state.positionY,
      zoomPanPinch?.state.scale - 0.4
    );
  },
  centerView: () => {
    const zoomPanPinch = get().zoomPanPinch;
    const canvas = document.querySelector(".jsoncrack-canvas") as HTMLElement;

    if (zoomPanPinch && canvas) zoomPanPinch.zoomToElement(canvas);
  },
  toggleFold: foldNodes => {
    set({ foldNodes });
    get().setGraph();
  },
  toggleFullscreen: fullscreen => set({ fullscreen }),
  setZoomPanPinch: zoomPanPinch => set({ zoomPanPinch }),
}));

export default useGraph;
