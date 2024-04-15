import debounce from "lodash.debounce";
import { toast } from "react-hot-toast";
import { create } from "zustand";
import { defaultJson } from "src/constants/data";
import { FileFormat } from "src/enums/file.enum";
import { gaEvent } from "src/lib/utils/gaEvent";
import { contentToJson, jsonToContent } from "src/lib/utils/json/jsonAdapter";
import { isIframe } from "src/lib/utils/widget";
import { documentSvc } from "src/services/document.service";
import useConfig from "./useConfig";
import useGraph from "./useGraph";
import useJson from "./useJson";

type SetContents = {
  contents?: string;
  hasChanges?: boolean;
  skipUpdate?: boolean;
};

type Query = string | string[] | undefined;

interface JsonActions {
  getContents: () => string;
  getFormat: () => FileFormat;
  getHasChanges: () => boolean;
  setError: (error: string | null) => void;
  setHasChanges: (hasChanges: boolean) => void;
  setContents: (data: SetContents) => void;
  fetchFile: (fileId: string) => void;
  fetchUrl: (url: string) => void;
  setFormat: (format: FileFormat) => void;
  clear: () => void;
  setFile: (fileData: File) => void;
  setJsonSchema: (jsonSchema: object | null) => void;
  checkEditorSession: (url: Query, widget?: boolean) => void;
}

export type File = {
  id: string;
  views: number;
  owner_email: string;
  name: string;
  content: string;
  private: boolean;
  format: FileFormat;
  created_at: string;
  updated_at: string;
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

const debouncedUpdateJson = debounce((value: unknown) => {
  useGraph.getState().setLoading(true);
  useJson.getState().setJson(JSON.stringify(value, null, 2));
}, 800);

const filterArrayAndObjectFields = (obj: object) => {
  const result = {};

  for (const key in obj) {
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
  setJsonSchema: jsonSchema => set({ jsonSchema }),
  setFile: fileData => {
    set({ fileData, format: fileData.format || FileFormat.JSON });
    get().setContents({ contents: fileData.content, hasChanges: false });
  },
  getContents: () => get().contents,
  getFormat: () => get().format,
  getHasChanges: () => get().hasChanges,
  setFormat: async format => {
    try {
      const prevFormat = get().format;

      set({ format });
      const contentJson = await contentToJson(get().contents, prevFormat);
      const jsonContent = await jsonToContent(JSON.stringify(contentJson, null, 2), format);

      get().setContents({ contents: jsonContent });
      gaEvent("input", "file format change");
    } catch (error) {
      get().clear();
      console.warn("The content was unable to be converted, so it was cleared instead.");
    }
  },
  setContents: async ({ contents, hasChanges = true, skipUpdate = false }) => {
    try {
      set({ ...(contents && { contents }), error: null, hasChanges });

      const isFetchURL = window.location.href.includes("?");
      const json = await contentToJson(get().contents, get().format);

      if (!useConfig.getState().liveTransformEnabled && skipUpdate) return;

      if (get().hasChanges && contents && contents.length < 80_000 && !isIframe() && !isFetchURL) {
        sessionStorage.setItem("content", contents);
        sessionStorage.setItem("format", get().format);
        set({ hasChanges: true });
      }

      debouncedUpdateJson(json);
    } catch (error: any) {
      if (error?.mark?.snippet) return set({ error: error.mark.snippet });
      if (error?.message) set({ error: error.message });
      useJson.setState({ loading: false });
      useGraph.setState({ loading: false });
    }
  },
  setError: error => set({ error }),
  setHasChanges: hasChanges => set({ hasChanges }),
  fetchUrl: async url => {
    try {
      const res = await fetch(url);
      const json = await res.json();
      const jsonStr = JSON.stringify(json, null, 2);

      get().setContents({ contents: jsonStr });
      return useJson.setState({ json: jsonStr, loading: false });
    } catch (error) {
      get().clear();
      toast.error("Failed to fetch document from URL!");
    }
  },
  checkEditorSession: (url, widget) => {
    if (url && typeof url === "string") {
      if (isURL(url)) return get().fetchUrl(url);
      return get().fetchFile(url);
    }

    let contents = defaultJson;
    const sessionContent = sessionStorage.getItem("content") as string | null;
    const format = sessionStorage.getItem("format") as FileFormat | null;
    if (sessionContent && !widget) contents = sessionContent;

    if (format) set({ format });
    get().setContents({ contents, hasChanges: false });
  },
  fetchFile: async id => {
    try {
      const { data, error } = await documentSvc.getById(id);
      if (error) throw error;

      if (data?.length) get().setFile(data[0]);
      if (data?.length === 0) throw new Error("Document not found");
    } catch (error: any) {
      if (error?.message) toast.error(error?.message);
      get().setContents({ contents: defaultJson, hasChanges: false });
    }
  },
}));

export default useFile;
