import { decompressFromBase64 } from "lz-string";
import toast from "react-hot-toast";
import { altogic } from "src/api/altogic";
import { defaultJson } from "src/constants/data";
import useGraph from "src/store/useGraph";
import create from "zustand";

interface Json {
  _id: string;
  createdAt: string;
  updatedAt: string;
  json: string;
  name: string;
  private: false;
}

interface JsonActions {
  setJson: (json: string) => void;
  getJson: () => string;
  fetchJson: (jsonId: string | string[] | undefined) => void;
  setError: (hasError: boolean) => void;
  setHasChanges: (hasChanges: boolean) => void;
}

const initialStates = {
  data: null as Json | null,
  json: "",
  loading: true,
  hasChanges: false,
  hasError: false,
};

export type JsonStates = typeof initialStates;

const useJson = create<JsonStates & JsonActions>()((set, get) => ({
  ...initialStates,
  getJson: () => get().json,
  fetchJson: async jsonId => {
    const isURL = new RegExp(
      /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/
    );

    if (typeof jsonId === "string" && isURL.test(jsonId)) {
      try {
        const res = await fetch(jsonId);
        const json = await res.json();
        const jsonStr = JSON.stringify(json, null, 2);

        useGraph.getState().setGraph(jsonStr);
        return set({ json: jsonStr, loading: false });
      } catch (error) {
        useGraph.getState().setGraph(defaultJson);
        set({ json: defaultJson, loading: false });
        toast.error("Failed to fetch JSON from URL!");
      }
    } else if (jsonId) {
      const { data, errors } = await altogic.endpoint.get(`json/${jsonId}`);

      if (!errors) {
        const decompressedData = decompressFromBase64(data.json);
        if (decompressedData) {
          useGraph.getState().setGraph(decompressedData);
          return set({
            data: data,
            json: decompressedData ?? undefined,
            loading: false,
          });
        }
      }
    }

    useGraph.getState().setGraph(defaultJson);
    set({ json: defaultJson, loading: false });
  },
  setJson: json => {
    useGraph.getState().setGraph(json);
    set({ json, hasChanges: true });
  },
  setError: (hasError: boolean) => set({ hasError }),
  setHasChanges: (hasChanges: boolean) => set({ hasChanges }),
}));

export default useJson;
