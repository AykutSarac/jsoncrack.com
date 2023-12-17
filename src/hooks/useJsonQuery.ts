import jq from "jq-web";
import jts from "json-to-ts";
import toast from "react-hot-toast";
import useFile from "src/store/useFile";
import useJson from "src/store/useJson";

const useJsonQuery = () => {
  const getJson = useJson(state => state.getJson);
  const setContents = useFile(state => state.setContents);

  const updateJson = (query: string) => {
    try {
      const res = jq.json(JSON.parse(getJson()), query);
      setContents({ contents: JSON.stringify(res, null, 2) });
    } catch (error) {
      console.error(error);
      toast.error("Unable to process the request.");
    }
  };

  const getJsonType = () => {
    const types = jts(JSON.parse(getJson()));
    return types.flat().join("\n\n");
  };

  return { updateJson, getJsonType };
};

export default useJsonQuery;
