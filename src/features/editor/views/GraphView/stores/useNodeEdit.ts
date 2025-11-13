import { create } from "zustand";

export interface NodeEditState {
  isEditing: boolean;
  editingNodeId: string | null;
}

interface NodeEditActions {
  startEdit: (nodeId: string) => void;
  stopEdit: () => void;
  toggleEdit: (nodeId: string) => void;
}

const useNodeEdit = create<NodeEditState & NodeEditActions>((set, get) => ({
  isEditing: false,
  editingNodeId: null,

  startEdit: (nodeId: string) => {
    set({ isEditing: true, editingNodeId: nodeId });
  },

  stopEdit: () => {
    set({ isEditing: false, editingNodeId: null });
  },

  toggleEdit: (nodeId: string) => {
    const { editingNodeId, isEditing } = get();
    if (editingNodeId === nodeId && isEditing) {
      set({ isEditing: false, editingNodeId: null });
    } else {
      set({ isEditing: true, editingNodeId: nodeId });
    }
  },
}));

export default useNodeEdit;
