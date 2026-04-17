import type { RefObject } from "react";
import type { JSONPath } from "jsonc-parser";
import type { LayoutDirection, NodeData, JSONCrackRef } from "jsoncrack-react";
import type { ViewPort } from "react-zoomable-ui";
import { create } from "zustand";

const pathKey = (path: JSONPath): string => JSON.stringify(path);

export interface Graph {
  viewPort: ViewPort | null;
  jsonCrackRef: RefObject<JSONCrackRef | null> | null;
  direction: LayoutDirection;
  fullscreen: boolean;
  selectedNode: NodeData | null;
  collapsedPaths: string[];
}

const initialStates: Graph = {
  viewPort: null,
  jsonCrackRef: null,
  direction: "RIGHT",
  fullscreen: false,
  selectedNode: null,
  collapsedPaths: [],
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
  toggleCollapse: (path: JSONPath) => void;
  setCollapsedPaths: (paths: string[]) => void;
  expandAll: () => void;
  collapseAllDepth1: (json: string) => void;
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
  toggleCollapse: path => {
    const key = pathKey(path);
    const current = get().collapsedPaths;
    const next = current.includes(key) ? current.filter(p => p !== key) : [...current, key];
    set({ collapsedPaths: next });
  },
  setCollapsedPaths: paths => {
    const prev = get().collapsedPaths;
    if (prev.length === paths.length && prev.every((p, i) => p === paths[i])) return;
    set({ collapsedPaths: paths });
  },
  expandAll: () => set({ collapsedPaths: [] }),
  collapseAllDepth1: json => {
    try {
      const parsed = JSON.parse(json);
      if (!parsed || typeof parsed !== "object") return;
      const keys = Array.isArray(parsed)
        ? parsed.map((_, i) => i)
        : Object.keys(parsed as Record<string, unknown>);
      const paths: string[] = [];
      for (const key of keys) {
        const value = (parsed as Record<string | number, unknown>)[key as any];
        if (value && typeof value === "object") {
          if (Array.isArray(value) && value.length === 0) continue;
          if (!Array.isArray(value) && Object.keys(value).length === 0) continue;
          paths.push(pathKey([key]));
        }
      }
      set({ collapsedPaths: paths });
    } catch {
      // ignore invalid JSON
    }
  },
}));

export default useGraph;
