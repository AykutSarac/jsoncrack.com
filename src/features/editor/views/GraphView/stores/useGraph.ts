import type { ViewPort } from "react-zoomable-ui/dist/ViewPort";
import type { CanvasDirection } from "reaflow/dist/layout/elkLayout";
import { create } from "zustand";
import { SUPPORTED_LIMIT } from "../../../../../constants/graph";
import useFile from "../../../../../store/useFile";
import useJson from "../../../../../store/useJson";
import type { EdgeData, NodeData } from "../../../../../types/graph";
import { parser } from "../lib/jsonParser";

export interface Graph {
  viewPort: ViewPort | null;
  direction: CanvasDirection;
  loading: boolean;
  fullscreen: boolean;
  nodes: NodeData[];
  edges: EdgeData[];
  selectedNode: NodeData | null;
  path: string;
  aboveSupportedLimit: boolean;
}

const initialStates: Graph = {
  viewPort: null,
  direction: "RIGHT",
  loading: true,
  fullscreen: false,
  nodes: [],
  edges: [],
  selectedNode: null,
  path: "",
  aboveSupportedLimit: false,
};

interface GraphActions {
  setGraph: (json?: string, options?: Partial<Graph>[]) => void;
  setLoading: (loading: boolean) => void;
  setDirection: (direction: CanvasDirection) => void;
  setViewPort: (ref: ViewPort) => void;
  setSelectedNode: (nodeData: NodeData) => void;
  focusFirstNode: () => void;
  toggleFullscreen: (value: boolean) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  centerView: () => void;
  clearGraph: () => void;
  setZoomFactor: (zoomFactor: number) => void;
  updateNodeValue: (nodeId: string, newValue: string) => void;
}

const useGraph = create<Graph & GraphActions>((set, get) => ({
  ...initialStates,
  clearGraph: () => set({ nodes: [], edges: [], loading: false }),
  setSelectedNode: nodeData => set({ selectedNode: nodeData }),
  setGraph: (data, options) => {
    const { nodes, edges } = parser(data ?? useJson.getState().json);

    if (nodes.length > SUPPORTED_LIMIT) {
      return set({
        aboveSupportedLimit: true,
        ...options,
        loading: false,
      });
    }

    set({
      nodes,
      edges,
      aboveSupportedLimit: false,
      ...options,
    });
  },
  setDirection: (direction = "RIGHT") => {
    set({ direction });
    setTimeout(() => get().centerView(), 200);
  },
  setLoading: loading => set({ loading }),
  focusFirstNode: () => {
    const rootNode = document.querySelector("g[id$='node-1']");
    get().viewPort?.camera?.centerFitElementIntoView(rootNode as HTMLElement, {
      elementExtraMarginForZoom: 100,
    });
  },
  setZoomFactor: zoomFactor => {
    const viewPort = get().viewPort;
    viewPort?.camera?.recenter(viewPort.centerX, viewPort.centerY, zoomFactor);
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
  updateNodeValue: (nodeId: string, newValue: string) => {
    const nodes = get().nodes;

    // Find the node to update
    const nodeIndex = nodes.findIndex(n => n.id === nodeId);
    if (nodeIndex === -1) return;

    const node = nodes[nodeIndex];
    if (!node.path || node.path.length === 0) return;

    // Get the current JSON from useFile (the actual source)
    const currentContent = useFile.getState().getContents();
    try {
      const jsonObj = JSON.parse(currentContent);

      // Navigate to parent and the target node
      let parent = jsonObj;
      const path = node.path as (string | number)[];
      
      for (let i = 0; i < path.length - 1; i++) {
        parent = parent[path[i]];
      }

      const lastKey = path[path.length - 1];
      const currentNode = parent[lastKey];

      // If the current node is an object with nested properties, merge the updates
      if (typeof currentNode === "object" && currentNode !== null && !Array.isArray(currentNode)) {
        try {
          const editedValues = JSON.parse(newValue);
          // Merge: keep existing nested objects/arrays, update primitive fields
          const merged = { ...currentNode };
          Object.keys(editedValues).forEach(key => {
            merged[key] = editedValues[key];
          });
          parent[lastKey] = merged;
        } catch {
          // If parse fails, treat as string replacement
          parent[lastKey] = newValue;
        }
      } else {
        // For primitives or arrays, replace entirely
        let parsedValue: any = newValue;
        try {
          parsedValue = JSON.parse(newValue);
        } catch {
          parsedValue = newValue;
        }
        parent[lastKey] = parsedValue;
      }

      // Update the file with the new JSON using setContents (which triggers the full sync)
      const updatedJson = JSON.stringify(jsonObj, null, 2);
      useFile.getState().setContents({ contents: updatedJson });
    } catch (error) {
      console.error("Failed to update node value:", error);
    }
  },
}));

export default useGraph;
