import type { LayoutDirection, NodeData } from "@jsoncrack/react-canvas";
import type { ViewPort } from "react-zoomable-ui";
import { create } from "zustand";

export interface Graph {
  viewPort: ViewPort | null;
  direction: LayoutDirection;
  fullscreen: boolean;
  selectedNode: NodeData | null;
}

const initialStates: Graph = {
  viewPort: null,
  direction: "RIGHT",
  fullscreen: false,
  selectedNode: null,
};

interface GraphActions {
  setDirection: (direction: LayoutDirection) => void;
  setViewPort: (ref: ViewPort) => void;
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
    const rootNode = document.querySelector("g[id$='node-1']");
    get().viewPort?.camera?.centerFitElementIntoView(rootNode as HTMLElement, {
      elementExtraMarginForZoom: 100,
    });
  },
  zoomIn: () => {
    const viewPort = get().viewPort;
    viewPort?.camera?.recenter(viewPort.centerX, viewPort.centerY, viewPort.zoomFactor + 0.1);
  },
  zoomOut: () => {
    const viewPort = get().viewPort;
    viewPort?.camera?.recenter(viewPort.centerX, viewPort.centerY, viewPort.zoomFactor - 0.1);
  },
  centerView: () => {
    const viewPort = get().viewPort;
    viewPort?.updateContainerSize();

    const canvas = document.querySelector(".jsoncrack-canvas") as HTMLElement | null;
    if (canvas) {
      viewPort?.camera?.centerFitElementIntoView(canvas);
    }
  },
  toggleFullscreen: fullscreen => set({ fullscreen }),
  setViewPort: viewPort => set({ viewPort }),
}));

export default useGraph;
