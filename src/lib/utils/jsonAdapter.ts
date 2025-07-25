import type { ParseError } from "jsonc-parser";
import { FileFormat } from "../../enums/file.enum";

export const contentToJson = (value: string, format = FileFormat.JSON): Promise<object> => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!value) return resolve({});

      if (format === FileFormat.JSON) {
        const { parse } = await import("jsonc-parser");
        const errors: ParseError[] = [];
        const result = parse(value, errors);
        if (errors.length > 0) JSON.parse(value);
        return resolve(result);
      }

      if (format === FileFormat.YAML) {
        const { load } = await import("js-yaml");
        return resolve(load(value) as object);
      }

      if (format === FileFormat.XML) {
        const { XMLParser } = await import("fast-xml-parser");
        const parser = new XMLParser({
          attributeNamePrefix: "$",
          ignoreAttributes: false,
          allowBooleanAttributes: true,
          parseAttributeValue: true,
          trimValues: true,
          parseTagValue: true,
        });
        return resolve(parser.parse(value));
      }

      if (format === FileFormat.CSV) {
        try {
          const { csv2json } = await import("json-2-csv");
          const result = await csv2json(value, {
            trimFieldValues: true,
            trimHeaderFields: true,
            wrapBooleans: true,
            excelBOM: true,
          });
          return resolve(Array.isArray(result) ? result : []);
        } catch (e) {
          return resolve([]);
        }
      }

      if (format === FileFormat.XLSX) {
        try {
          const { read, utils } = await import("xlsx");
          const workbook = read(value, { type: "string" });
          if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
            return resolve([]);
          }
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          if (!sheet) {
            return resolve([]);
          }
          const jsonData = utils.sheet_to_json(sheet, { raw: false });
          return resolve(Array.isArray(jsonData) ? jsonData : []);
        } catch (e) {
          return resolve([]);
        }
      }

      return resolve({});
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to parse content";
      return reject(errorMessage);
    }
  });
};

export const jsonToContent = async (json: string, format: FileFormat): Promise<string> => {
  return new Promise(async resolve => {
    try {
      if (!json) return resolve("");

      if (format === FileFormat.JSON) {
        const parsedJson = JSON.parse(json);
        return resolve(JSON.stringify(parsedJson, null, 2));
      }

      if (format === FileFormat.YAML) {
        const { dump } = await import("js-yaml");
        const { parse } = await import("jsonc-parser");
        return resolve(dump(parse(json)));
      }

      if (format === FileFormat.XML) {
        const { XMLBuilder } = await import("fast-xml-parser");
        const builder = new XMLBuilder({
          format: true,
          attributeNamePrefix: "$",
          ignoreAttributes: false,
        });

        return resolve(builder.build(JSON.parse(json)));
      }
      if (format === FileFormat.XLSX) {
        try {
          // For XLSX, just return the JSON string as is (since we can't convert JSON back to XLSX here)
          // or you can implement XLSX export if needed
          return resolve(json);
        } catch (e) {
          return resolve("[]");
        }
      }

      return resolve(json);
    } catch (error) {
      console.error(json, error);
      return resolve(json);
    }
  });
};
