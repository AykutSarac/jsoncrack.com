import { decompressFromBase64 } from "lz-string";
import toast from "react-hot-toast";
import { create } from "zustand";
import { altogic } from "src/api/altogic";
import { defaultJson } from "src/constants/data";
import { saveJson as saveJsonDB } from "src/services/db/json";
import useGraph from "src/store/useGraph";
import { Json } from "src/typings/altogic";

interface JsonActions {
  setJson: (json: string) => void;
  getJson: () => string;
  getHasChanges: () => boolean;
  fetchJson: (jsonId: string | string[] | undefined) => void;
  setError: (hasError: boolean) => void;
  setHasChanges: (hasChanges: boolean) => void;
  saveJson: (isNew?: boolean) => Promise<string | undefined>;
}

const initialStates = {
  data: null as Json | null,
  json: "",
  loading: true,
  hasChanges: false,
  hasError: false,
};

function inIframe() {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
}

export type JsonStates = typeof initialStates;

const useJson = create<JsonStates & JsonActions>()((set, get) => ({
  ...initialStates,
  getJson: () => get().json,
  getHasChanges: () => get().hasChanges,
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
      const { data, errors } = await altogic.endpoint.get(`json/${jsonId}`, undefined, {
        userid: altogic.auth.getUser()?._id,
      });

      if (!errors) {
        const decompressedData = decompressFromBase64(data.json);
        if (decompressedData) {
          useGraph.getState().setGraph(decompressedData);
          return set({
            data,
            json: decompressedData ?? undefined,
            loading: false,
          });
        }
      }
    }

    if (inIframe()) {
      useGraph.getState().setGraph("[]");
      return set({ json: "[]", loading: false });
    } else {
      useGraph.getState().setGraph(defaultJson);
      set({ json: defaultJson, loading: false });
    }
  },
  setJson: json => {
    useGraph.getState().setGraph(json);
    set({ json, hasChanges: true });
  },
  saveJson: async (isNew = true) => {
    try {
      const url = new URL(window.location.href);
      const params = new URLSearchParams(url.search);
      const jsonQuery = params.get("json");

      toast.loading("Saving JSON...", { id: "jsonSave" });
      const res = await saveJsonDB({ id: isNew ? undefined : jsonQuery, data: get().json });

      if (res.errors && res.errors.items.length > 0) throw res.errors;

      toast.success("JSON saved to cloud", { id: "jsonSave" });
      set({ hasChanges: false });
      return res.data._id;
    } catch (error: any) {
      if (error?.items?.length > 0) {
        toast.error(error.items[0].message, { id: "jsonSave", duration: 5000 });
        return undefined;
      }

      toast.error("Failed to save JSON!", { id: "jsonSave" });
      return undefined;
    }
  },
  setError: hasError => set({ hasError }),
  setHasChanges: (hasChanges: boolean) => set({ hasChanges }),
}));

export default useJson;
