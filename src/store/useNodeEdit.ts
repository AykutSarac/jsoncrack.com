import { create } from "zustand";

type NodeDraft = {
  name: string;
  color: string;
};

type EditState = {
  open: boolean;
  editingNodeId: string | null;
  // when true, the inline editor inside nodes should be suppressed (use modal editor instead)
  suppressInline: boolean;
  draft: NodeDraft;
  start: (nodeId: string, initial?: Partial<NodeDraft>, options?: { suppressInline?: boolean }) => void;
  updateDraft: (patch: Partial<NodeDraft>) => void;
  reset: () => void;
};

const DEFAULT_COLOR = "#4C6EF5";

export const useNodeEdit = create<EditState>((set) => ({
  open: false,
  editingNodeId: null,
  suppressInline: false,
  draft: { name: "", color: DEFAULT_COLOR },
  start: (nodeId, initial = {}, options = {}) =>
    set({ open: true, editingNodeId: nodeId, suppressInline: !!options.suppressInline, draft: { name: initial.name ?? "", color: initial.color ?? DEFAULT_COLOR } }),
  updateDraft: (patch) => set((s) => ({ draft: { ...s.draft, ...patch } })),
  reset: () => set({ open: false, editingNodeId: null, suppressInline: false, draft: { name: "", color: DEFAULT_COLOR } }),
}));

export default useNodeEdit;
