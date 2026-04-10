import type { RefObject } from "react";
import type { LayoutDirection, NodeData, JSONCrackRef } from "jsoncrack-react";
import type { ViewPort } from "react-zoomable-ui";
import { create } from "zustand";

export interface Graph {
  viewPort: ViewPort | null;
  jsonCrackRef: RefObject<JSONCrackRef | null> | null;
  direction: LayoutDirection;
  fullscreen: boolean;
  selectedNode: NodeData | null;
}

const initialStates: Graph = {
  viewPort: null,
  jsonCrackRef: null,
  direction: "RIGHT",
  fullscreen: false,
  selectedNode: null,
};

interface GraphActions {
  setDirection: (direction: LayoutDirection) => void;
  setViewPort: (ref: ViewPort) => void;
  setJsonCrackRef: (ref: RefObject<JSONCrackRef | null>) => void;
  setSelectedNode: (nodeData: NodeData | null) => void;
  focusFirstNode: () => void;
  toggleFullscreen: (value: boolean) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  centerView: () => void;
}

const useGraph = create<Graph & GraphActions>((set, get) => ({
  ...initialStates,
  setSelectedNode: nodeData => set({ selectedNode: nodeData }),
  setDirection: (direction = "RIGHT") => {
    set({ direction });
    setTimeout(() => get().centerView(), 200);
  },
  focusFirstNode: () => {
    get().jsonCrackRef?.current?.focusFirstNode();
  },
  zoomIn: () => {
    get().jsonCrackRef?.current?.zoomIn();
  },
  zoomOut: () => {
    get().jsonCrackRef?.current?.zoomOut();
  },
  centerView: () => {
    get().jsonCrackRef?.current?.centerView();
  },
  toggleFullscreen: fullscreen => set({ fullscreen }),
  setViewPort: viewPort => set({ viewPort }),
  setJsonCrackRef: jsonCrackRef => set({ jsonCrackRef }),
}));

export default useGraph;
