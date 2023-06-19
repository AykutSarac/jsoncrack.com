import debounce from "lodash.debounce";
import _get from "lodash.get";
import _set from "lodash.set";
import { toast } from "react-hot-toast";
import { create } from "zustand";
import { defaultJson } from "src/constants/data";
import { FileFormat } from "src/constants/file";
import { getFromCloud, saveToCloud } from "src/services/json";
import { contentToJson, jsonToContent } from "src/utils/json/jsonAdapter";
import useGraph from "./useGraph";
import useJson from "./useJson";
import useStored from "./useStored";
import useUser from "./useUser";

type SetContents = {
  contents?: string;
  hasChanges?: boolean;
  skipUpdate?: boolean;
};

interface JsonActions {
  getContents: () => string;
  getFormat: () => FileFormat;
  getHasChanges: () => boolean;
  setError: (error: object | null) => void;
  setHasChanges: (hasChanges: boolean) => void;
  setContents: (data: SetContents) => void;
  saveToCloud: (isNew?: boolean) => void;
  fetchFile: (fileId: string) => void;
  fetchUrl: (url: string) => void;
  editContents: (path: string, value: string, callback?: () => void) => void;
  setFormat: (format: FileFormat) => void;
  clear: () => void;
  setFile: (fileData: File) => void;
  setJsonSchema: (jsonSchema: object | null) => void;
}

export type File = {
  _id: string;
  name: string;
  json: string;
  private: boolean;
  format?: FileFormat;
  createdAt: string;
  updatedAt: string;
};

const initialStates = {
  fileData: null as File | null,
  format: FileFormat.JSON,
  contents: defaultJson,
  error: null as any,
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
  (value: unknown) => useJson.getState().setJson(JSON.stringify(value, null, 2)),
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
    set({ fileData, format: fileData.format });
    get().setContents({ contents: fileData.json, hasChanges: false });
  },
  getContents: () => get().contents,
  getFormat: () => get().format,
  getHasChanges: () => get().hasChanges,
  setFormat: async format => {
    try {
      const contentJson = await contentToJson(get().contents, get().format);
      const jsonContent = await jsonToContent(JSON.stringify(contentJson, null, 2), format);
      get().setContents({ contents: jsonContent, hasChanges: false });
    } catch (error) {
      get().clear();
      console.info("The content was unable to be converted, so it was cleared instead.");
    } finally {
      set({ format });
    }
  },
  setContents: async ({ contents, hasChanges = true, skipUpdate = false }) => {
    try {
      set({ ...(contents && { contents }), error: null, hasChanges });
      const json = await contentToJson(get().contents, get().format);
      if (!useStored.getState().liveTransform && skipUpdate) return;

      debouncedUpdateJson(json);
    } catch (error: any) {
      if (error?.mark?.snippet) return set({ error: error.mark.snippet });
      if (error?.message) set({ error: error.message });
    }
  },
  setError: error => set({ error }),
  setHasChanges: hasChanges => set({ hasChanges }),
  saveToCloud: async (isNew = true) => {
    try {
      const url = new URL(window.location.href);
      const params = new URLSearchParams(url.search);
      const jsonQuery = params.get("doc");

      toast.loading("Saving File...", { id: "fileSave" });
      const res = await saveToCloud(isNew ? null : jsonQuery, get().contents, get().format);

      if (res.errors && res.errors.items.length > 0) throw res.errors;

      toast.success("File saved to cloud", { id: "fileSave" });
      set({ hasChanges: false });
      return res.data._id;
    } catch (error: any) {
      if (error?.items?.length > 0) {
        toast.error(error.items[0].message, { id: "fileSave", duration: 5000 });
        return undefined;
      }

      toast.error("Failed to save File!", { id: "fileSave" });
      return undefined;
    }
  },
  fetchUrl: async url => {
    try {
      const res = await fetch(url);
      const json = await res.json();
      const jsonStr = JSON.stringify(json, null, 2);

      useGraph.getState().setGraph(jsonStr);
      return useJson.setState({ json: jsonStr, loading: false });
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

      const contents = await jsonToContent(JSON.stringify(newJson, null, 2), get().format);
      get().setContents({ contents });
      if (callback) callback();
    } catch (error) {
      toast.error("Invalid Property!");
    }
  },
}));

export default useFile;
