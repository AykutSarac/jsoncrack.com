import { load, dump } from "js-yaml";
import { csv2json, json2csv } from "json-2-csv";
import { parse } from "jsonc-parser";
import jxon from "jxon";
import toml from "toml";
import { FileFormat } from "src/types/models";

const keyExists = (obj: object, key: string) => {
  if (!obj || (typeof obj !== "object" && !Array.isArray(obj))) {
    return false;
  } else if (obj.hasOwnProperty(key)) {
    return obj[key];
  } else if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      const result = keyExists(obj[i], key);

      if (result) {
        return result;
      }
    }
  } else {
    for (const k in obj) {
      const result = keyExists(obj[k], key);

      if (result) {
        return result;
      }
    }
  }

  return false;
};

const contentToJson = async (value: string, format = FileFormat.JSON): Promise<object> => {
  try {
    let json: object = {};

    if (format === FileFormat.JSON) json = parse(value);
    if (format === FileFormat.YAML) json = load(value) as object;
    if (format === FileFormat.XML) json = jxon.stringToJs(value);
    if (format === FileFormat.TOML) json = toml.parse(value);
    if (format === FileFormat.CSV) json = await csv2json(value);
    if (format === FileFormat.XML && keyExists(json, "parsererror")) throw Error("Unknown error!");

    return Promise.resolve(json);
  } catch (error: any) {
    throw error;
  }
};

const jsonToContent = async (json: string, format: FileFormat): Promise<string> => {
  try {
    let contents = json;

    if (!json) return json;
    if (format === FileFormat.JSON) contents = json;
    if (format === FileFormat.YAML) contents = dump(parse(json));
    if (format === FileFormat.XML) contents = dump(parse(json));
    if (format === FileFormat.TOML) contents = dump(parse(json));
    if (format === FileFormat.CSV) contents = await json2csv(parse(json));

    return Promise.resolve(contents);
  } catch (error: any) {
    throw error;
  }
};

export { contentToJson, jsonToContent };
