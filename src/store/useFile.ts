import debounce from "lodash.debounce";
import { toast } from "react-hot-toast";
import { create } from "zustand";
import { defaultJson } from "src/constants/data";
import { getFromCloud } from "src/services/json";
import useGraph from "./useGraph";
import useJson from "./useJson";
import useUser from "./useUser";

type SetContents = {
  contents?: string;
  hasChanges?: boolean;
  skipUpdate?: boolean;
};

interface JsonActions {
  getContents: () => string;
  getHasChanges: () => boolean;
  setError: (error: boolean) => void;
  setHasChanges: (hasChanges: boolean) => void;
  setContents: (data: SetContents) => void;
  fetchFile: (fileId: string) => void;
  fetchUrl: (url: string) => void;
  clear: () => void;
  setFile: (fileData: File) => void;
  setJsonSchema: (jsonSchema: object | null) => void;
}

export type File = {
  _id: string;
  name: string;
  json: string;
  private: boolean;
  createdAt: string;
  updatedAt: string;
};

const initialStates = {
  fileData: null as File | null,
  contents: defaultJson,
  error: false,
  hasChanges: false,
  jsonSchema: null as object | null,
};

export type FileStates = typeof initialStates;

const isURL =
  /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;

const debouncedUpdateJson = debounce((value: unknown) => {
  if (!useFile.getState().error) useJson.getState().setJson(JSON.stringify(value, null, 2));
}, 800);

const useFile = create<FileStates & JsonActions>()((set, get) => ({
  ...initialStates,
  clear: () => {
    set({ contents: "" });
    useJson.getState().clear();
  },
  setJsonSchema: jsonSchema => {
    if (useUser.getState().isPremium()) set({ jsonSchema });
  },
  setFile: fileData => {
    set({ fileData });
    get().setContents({ contents: fileData.json, hasChanges: false });
  },
  getContents: () => get().contents,
  getHasChanges: () => get().hasChanges,
  setContents: ({ contents, hasChanges = true }) => {
    set({ ...(contents && { contents }), hasChanges });
    debouncedUpdateJson(contents);
  },
  setError: error => set({ error }),
  setHasChanges: hasChanges => set({ hasChanges }),
  fetchUrl: async url => {
    try {
      const res = await fetch(url);
      const json = await res.json();
      const jsonStr = JSON.stringify(json, null, 2);

      useGraph.getState().setGraph(jsonStr);
      return useJson.setState({ json: jsonStr, loading: false });
    } catch (error) {
      get().clear();
      useJson.setState({ loading: false });
      useGraph.setState({ loading: false });
      toast.error("Failed to fetch document from URL!");
    }
  },
  fetchFile: async id => {
    try {
      if (isURL.test(id)) return get().fetchUrl(id);

      const file = await getFromCloud(id);
      get().setFile(file);
    } catch (error) {
      useJson.setState({ loading: false });
      useGraph.setState({ loading: false });
      console.error(error);
    }
  },
}));

export default useFile;
