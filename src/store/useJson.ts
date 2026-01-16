import { create } from "zustand";
import useGraph from "../features/editor/views/GraphView/stores/useGraph";
import useFile from "./useFile";

interface JsonActions {
  setJson: (json: string) => void;
  getJson: () => string;
  clear: () => void;
  setEditMode: (isEditing: boolean) => void;
  updateNodeValue: (path: (string | number)[], value: any) => void;
}

const initialStates = {
  json: "{}",
  loading: true,
  isEditing: false,
  tempJson: null as string | null,
};

export type JsonStates = typeof initialStates;

const useJson = create<JsonStates & JsonActions>()((set, get) => ({
  ...initialStates,
  getJson: () => get().json,
  setJson: json => {
    set({ json, loading: false, tempJson: null });
    useGraph.getState().setGraph(json);
  },
  clear: () => {
    set({ json: "", loading: false, tempJson: null });
    useGraph.getState().clearGraph();
  },
  setEditMode: (isEditing: boolean) => {
    set({ isEditing, tempJson: isEditing ? get().json : null });
  },
  updateNodeValue: (path: (string | number)[], value: any) => {
    try {
      // Parse the value if it's a string that looks like JSON
      let parsedValue = value;
      if (typeof value === 'string') {
        try {
          parsedValue = JSON.parse(value);
        } catch {
          // Keep as string if not valid JSON
          parsedValue = value;
        }
      }

      const currentJson = JSON.parse(get().json);
      let target = currentJson;
      
      // Navigate to the parent object
      for (let i = 0; i < path.length - 1; i++) {
        target = target[path[i]];
      }
      
      // Update the value
      target[path[path.length - 1]] = parsedValue;
      
      const newJson = JSON.stringify(currentJson, null, 2);
      // First update the graph to reflect changes
      useGraph.getState().setGraph(newJson);
      // Update the file editor contents so the left-side editor shows the change
      try {
        useFile.getState().setContents({ contents: newJson, hasChanges: true, skipUpdate: true });
      } catch (e) {
        // fallback to updating json state directly
        set({ json: newJson, loading: false });
      }
    } catch (error) {
      console.error('Failed to update JSON:', error);
    }
  },
}));

export default useJson;
