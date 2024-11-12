import { type FileFormat, TypeLanguage } from "src/enums/file.enum";
import { contentToJson } from "./jsonAdapter";

export const generateType = async (input: string, format: FileFormat, output: TypeLanguage) => {
  try {
    const inputToJson = await contentToJson(input, format);
    const jsonString = JSON.stringify(inputToJson);

    if (output === TypeLanguage.Go) {
      const json2go = await import("src/lib/utils/json2go.js");
      const gofmt = await import("gofmt.js");
      const types = json2go.default(jsonString);

      return gofmt.default(types.go);
    } else {
      const { run } = await import("json_typegen_wasm");
      return run("Root", jsonString, JSON.stringify({ output_mode: output }));
    }
  } catch (error) {
    console.error(error);
    return "";
  }
};
