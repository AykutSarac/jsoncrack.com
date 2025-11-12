import { create } from "zustand";
import useGraph from "../features/editor/views/GraphView/stores/useGraph";

interface JsonActions {
  setJson: (json: string) => void;
  getJson: () => string;
  clear: () => void;
  // Set a value at a given JSON path and update the graph
  setValueAtPath: (path: any[] | undefined, value: unknown) => void;
  // Rename a key at a given JSON path (path points to the key to rename)
  setKeyAtPath: (path: any[] | undefined, newKey: string) => void;
}

const initialStates = {
  json: "{}",
  loading: true,
};

export type JsonStates = typeof initialStates;

const useJson = create<JsonStates & JsonActions>()((set, get) => ({
  ...initialStates,
  getJson: () => get().json,
  setJson: json => {
    set({ json, loading: false });
    useGraph.getState().setGraph(json);
  },
  setValueAtPath: (path, value) => {
    try {
      const current = get().json || "{}";
      const obj = JSON.parse(current);

      if (!path || path.length === 0) {
        // replace root
        const newJson = typeof value === "string" ? value : JSON.stringify(value, null, 2);
        get().setJson(newJson);
        return;
      }

      // traverse
      let cur: any = obj;
      for (let i = 0; i < path.length - 1; i++) {
        const seg = path[i] as any;
        if (cur[seg] === undefined) cur[seg] = {};
        cur = cur[seg];
      }

      const last = path[path.length - 1] as any;
      cur[last] = value;

      const newJson = JSON.stringify(obj, null, 2);
      get().setJson(newJson);
    } catch (err) {
      // fallback: do nothing
      console.warn("Failed to set value at path", err);
    }
  },
  setKeyAtPath: (path, newKey) => {
    try {
      if (!path || path.length === 0) return;
      const current = get().json || "{}";
      const obj = JSON.parse(current);

      // traverse to parent
      let cur: any = obj;
      for (let i = 0; i < path.length - 1; i++) {
        const seg = path[i] as any;
        if (cur[seg] === undefined) cur[seg] = {};
        cur = cur[seg];
      }

      const last = path[path.length - 1] as any;
      // only rename if parent is object and has the key
      if (cur && Object.prototype.hasOwnProperty.call(cur, last)) {
        cur[newKey] = cur[last];
        delete cur[last];
      }

      const newJson = JSON.stringify(obj, null, 2);
      get().setJson(newJson);
    } catch (err) {
      console.warn("Failed to set key at path", err);
    }
  },
  clear: () => {
    set({ json: "", loading: false });
    useGraph.getState().clearGraph();
  },
}));

export default useJson;
