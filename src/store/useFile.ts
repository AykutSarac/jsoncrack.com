import { parse } from "jsonc-parser";
import debounce from "lodash.debounce";
import _get from "lodash.get";
import _set from "lodash.set";
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
  editContents: (path: string, value: string, callback?: () => void) => void;
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
  hasError: false,
  hasChanges: false,
  jsonSchema: null as object | null,
};

export type FileStates = typeof initialStates;

const isURL = (value: string) => {
  return /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi.test(
    value
  );
};

const debouncedUpdateJson = debounce(
  (value: string) => useJson.getState().setJson(JSON.stringify(parse(value as string), null, 2)),
  800
);

const filterArrayAndObjectFields = (obj: object) => {
  const result = {};

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (Array.isArray(obj[key]) || typeof obj[key] === "object") {
        result[key] = obj[key];
      }
    }
  }

  return result;
};

const useFile = create<FileStates & JsonActions>()((set, get) => ({
  ...initialStates,
  clear: () => {
    set({ contents: "" });
    useJson.getState().clear();
  },
  setJsonSchema: jsonSchema => {
    if (useUser.getState().premium) set({ jsonSchema });
  },
  setFile: fileData => {
    set({ fileData });
    get().setContents({ contents: fileData.json, hasChanges: false });
  },
  getContents: () => get().contents,
  getHasChanges: () => get().hasChanges,
  setContents: ({ contents, hasChanges = true }) => {
    if (!contents || get().hasError) return;
    set({ ...(contents && { contents }), hasChanges });
    debouncedUpdateJson(contents);
  },
  setError: hasError => set({ hasError }),
  setHasChanges: hasChanges => set({ hasChanges }),
  fetchUrl: async url => {
    try {
      const res = await fetch(url);
      const json = await res.json();
      const jsonStr = JSON.stringify(json, null, 2);

      useGraph.getState().setGraph(jsonStr);
      get().setContents({ contents: jsonStr });
    } catch (error) {
      get().clear();
      toast.error("Failed to fetch document from URL!");
    }
  },
  fetchFile: async id => {
    try {
      if (isURL(id)) return get().fetchUrl(id);

      const file = await getFromCloud(id);
      get().setFile(file);
    } catch (error) {
      useJson.setState({ loading: false });
      useGraph.setState({ loading: false });
      console.error(error);
    }
  },
  editContents: async (path, value, callback) => {
    try {
      if (!value) return;

      let tempValue = value;
      const pathJson = _get(JSON.parse(useJson.getState().json), path.replace("{Root}.", ""));
      const changedValue = JSON.parse(value);

      // check if array string value
      if (typeof changedValue !== "string") {
        tempValue = {
          ...filterArrayAndObjectFields(pathJson),
          ...changedValue,
        };
      } else {
        tempValue = tempValue.replaceAll('"', "");
      }

      const newJson = _set(
        JSON.parse(useJson.getState().json),
        path.replace("{Root}.", ""),
        tempValue
      );

      get().setContents({ contents: JSON.stringify(newJson, null, 2) });
      if (callback) callback();
    } catch (error) {
      toast.error("Invalid Property!");
    }
  },
}));

export default useFile;
