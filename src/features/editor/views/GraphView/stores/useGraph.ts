import type { ViewPort } from "react-zoomable-ui/dist/ViewPort";
import type { CanvasDirection } from "reaflow/dist/layout/elkLayout";
import { create } from "zustand";
import { toast } from "react-hot-toast";
import { SUPPORTED_LIMIT } from "../../../../../constants/graph";
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
  updateNode: (updatedNode: NodeData) => Promise<void>;
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
  updateNode: async updatedNode => {
    try {
      // Get the current JSON
      const currentJson = JSON.parse(useJson.getState().json);
      
      // Update the JSON at the node's path
      let current = currentJson;
      const path = updatedNode.path || [];
      
      // Navigate to the parent object
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]];
      }

      // Update the value
      if (path.length > 0) {
        const lastKey = path[path.length - 1];
        if (updatedNode.text.length === 1 && !updatedNode.text[0].key) {
          // Single value node
          const value = updatedNode.text[0].value;
          // Convert string values to their proper types
          const parsedValue = 
            updatedNode.text[0].type === 'number' ? Number(value) :
            updatedNode.text[0].type === 'boolean' ? value === 'true' :
            updatedNode.text[0].type === 'null' ? null :
            value;
          current[lastKey] = parsedValue;
        } else {
          // Object node
          const obj = {};
          updatedNode.text.forEach(row => {
            if (row.type !== "array" && row.type !== "object" && row.key) {
              const value = row.value;
              // Convert string values to their proper types
              const parsedValue = 
                row.type === 'number' ? Number(value) :
                row.type === 'boolean' ? value === 'true' :
                row.type === 'null' ? null :
                value;
              obj[row.key] = parsedValue;
            }
          });
          current[lastKey] = obj;
        }
      }

      // Update the store with the new JSON and trigger updates
      const newJsonString = JSON.stringify(currentJson, null, 2);
      useJson.getState().setJson(newJsonString);
      
      // Update the text editor contents
      const useFileStore = (await import('../../../../../store/useFile')).default;
      useFileStore.getState().setContents({ contents: newJsonString });

    } catch (error) {
      console.error('Error updating JSON:', error);
      toast.error('Failed to update the visualization');
    }
  },
}));

export default useGraph;
