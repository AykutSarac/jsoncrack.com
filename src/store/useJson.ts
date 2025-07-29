import { create } from "zustand";
import useGraph from "../features/editor/views/GraphView/stores/useGraph";

interface JsonActions {
  setJson: (json: string) => void;
  getJson: () => string;
  clear: () => void;
  updateJson: (path: string, value: any) => void;
}

const initialStates = {
  json: "{}",
  loading: true,
};

export type JsonStates = typeof initialStates;

function setByPath(obj: any, path: string, value: any) {
  const keys = path.split(".");
  let temp = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    if (!(keys[i] in temp)) temp[keys[i]] = {};
    temp = temp[keys[i]];
  }
  temp[keys[keys.length - 1]] = value;
}

const useJson = create<JsonStates & JsonActions & { updateJson: (path: string, value: any) => void }>()((set, get) => {
  return {
    ...initialStates,
    getJson: () => get().json,
    setJson: json => {
      set({ json, loading: false });
      useGraph.getState().setGraph(json);
    },
    updateJson: (path, value) => {
      let jsonObj;
      try {
        jsonObj = JSON.parse(get().json);
      } catch {
        jsonObj = {};
      }

      // Modify JSON in-place
      setByPath(jsonObj, path, value);

      const newJson = JSON.stringify(jsonObj, null, 2);
      set({ json: newJson });
    },
    
    clear: () => {
      set({ json: "", loading: false });
      useGraph.getState().clearGraph();
    },
  };
});

export default useJson;
