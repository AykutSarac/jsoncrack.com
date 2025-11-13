import type { JSONPath } from "jsonc-parser";
import { create } from "zustand";
import useGraph from "../features/editor/views/GraphView/stores/useGraph";
import useNodeEdit from "../features/editor/views/GraphView/stores/useNodeEdit";
import { updateJsonByPath } from "../lib/utils/updateJsonByPath";
import useFile from "./useFile";

interface JsonActions {
  setJson: (json: string) => void;
  getJson: () => string;
  clear: () => void;
  updateNodeValue: (path: JSONPath | undefined, newValue: string) => void;
  handleSave: (path: JSONPath | undefined, newValue: string) => void;
  handleCancel: () => void;
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
  clear: () => {
    set({ json: "", loading: false });
    useGraph.getState().clearGraph();
  },
  updateNodeValue: (path: JSONPath | undefined, newValue: string) => {
    const currentJson = get().json;
    const updatedJson = updateJsonByPath(currentJson, path, newValue);

    // Update JSON state and re-parse graph
    set({ json: updatedJson });
    useGraph.getState().setGraph(updatedJson);
  },
  handleSave: (path: JSONPath | undefined, newValue: string) => {
    const currentJson = get().json;
    const updatedJson = updateJsonByPath(currentJson, path, newValue);

    // Update JSON state and re-parse graph
    set({ json: updatedJson });
    useGraph.getState().setGraph(updatedJson);

    // Sync editor text with updated JSON
    useFile.getState().setContents({
      contents: updatedJson,
      hasChanges: false,
      skipUpdate: true,
    });
  },
  handleCancel: () => {
    // Exit edit mode without modifying JSON
    // Component's tempValue state is automatically discarded
    useNodeEdit.getState().stopEdit();
  },
}));

export default useJson;
