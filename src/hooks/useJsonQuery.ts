import toast from "react-hot-toast";
import useFile from "src/store/useFile";
import useJson from "src/store/useJson";

const useJsonQuery = () => {
  const getJson = useJson(state => state.getJson);
  const setContents = useFile(state => state.setContents);

  const transformer = async ({ value }) => {
    const { run } = await import("json_typegen_wasm");
    return run("Root", value, JSON.stringify({ output_mode: "typescript/typealias" }));
  };

  const updateJson = async (query: string, cb?: () => void) => {
    try {
      const jq = await import("jq-web");
      const res = await jq.promised.json(JSON.parse(getJson()), query);

      setContents({ contents: JSON.stringify(res, null, 2) });
      cb?.();
    } catch (error) {
      console.error(error);
      toast.error("Unable to process the request.");
    }
  };

  const getJsonType = async () => {
    const types = await transformer({ value: getJson() });
    return types;
  };

  return { updateJson, getJsonType };
};

export default useJsonQuery;
