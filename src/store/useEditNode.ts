import { create } from "zustand";
import type { NodeData, NodeRow } from "../types/graph";

interface EditNodeState {
  isEditing: boolean;
  editingNodeId: string | null;
  originalData: NodeRow[] | null;
  editedData: NodeRow[] | null;
}

interface EditNodeActions {
  startEditing: (nodeId: string, nodeData: NodeRow[]) => void;
  updateEditedData: (data: NodeRow[]) => void;
  cancelEditing: () => void;
  resetEditState: () => void;
}

const initialState: EditNodeState = {
  isEditing: false,
  editingNodeId: null,
  originalData: null,
  editedData: null,
};

export const useEditNode = create<EditNodeState & EditNodeActions>((set, get) => ({
  ...initialState,
  
  startEditing: (nodeId, nodeData) => {
    // Deep copy the original data
    const originalCopy = JSON.parse(JSON.stringify(nodeData));
    const editedCopy = JSON.parse(JSON.stringify(nodeData));
    
    set({
      isEditing: true,
      editingNodeId: nodeId,
      originalData: originalCopy,
      editedData: editedCopy,
    });
  },
  
  updateEditedData: (data) => {
    set({ editedData: data });
  },
  
  cancelEditing: () => {
    set(initialState);
  },
  
  resetEditState: () => {
    set(initialState);
  },
}));
