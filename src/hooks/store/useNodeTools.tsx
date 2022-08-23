import create from "zustand";
import { EdgeData, NodeData } from "reaflow";

export interface NodeTools {
  selectedNode: string;
  copySelectedNode: boolean;
  nodes: NodeData[];
  edges: EdgeData[];
  newNodes: NodeData[];
  newEdges: EdgeData[];
  collapsedNodes: { [key: string]: NodeData[] };
  collapsedEdges: { [key: string]: EdgeData[] };
}

export interface SettingsNodeTools {
  setNodeTools: (key: keyof NodeTools, value: unknown) => void;
}

const initialStates: NodeTools = {
  selectedNode: "",
  copySelectedNode: false,
  nodes: [],
  edges: [],
  newNodes: [],
  newEdges: [],
  collapsedNodes: {},
  collapsedEdges: {},
};

const useNodeTools = create<NodeTools & SettingsNodeTools>((set) => ({
  ...initialStates,
  setNodeTools: (nodeTool: keyof NodeTools, value: unknown) =>
    set((state) => ({
      ...state,
      [nodeTool]: value,
    })),
}));

export default useNodeTools;
