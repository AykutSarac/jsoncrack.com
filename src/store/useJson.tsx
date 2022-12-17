import { decompressFromBase64 } from "lz-string";
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
    if (jsonId) {
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
