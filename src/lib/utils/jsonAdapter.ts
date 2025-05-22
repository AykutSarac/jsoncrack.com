import type { ParseError } from "jsonc-parser";
import { FileFormat } from "../../enums/file.enum";

// Removes unused capture groups from the regex replacement function
function quoteLargeNumbers(input: string): string {
  // Matches numbers with 16+ digits after : or - (YAML key or array), not already in quotes
  // Also matches numbers in arrays and negative numbers
  return input.replace(
    /((:\s*|- )(-?\d{16,}))(?!\s*["\d])/g,
    (_match, p1, _p2, p3) => p1.replace(p3, `"${p3}"`)
  );
}

export const contentToJson = (value: string, format = FileFormat.JSON): Promise<object> => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!value) return resolve({});

      // Preprocess value for all formats
      const safeValue = quoteLargeNumbers(value);

      if (format === FileFormat.JSON) {
        const { parse } = await import("jsonc-parser");
        const errors: ParseError[] = [];
        const result = parse(safeValue, errors);
        if (errors.length > 0) JSON.parse(safeValue);
        return resolve(result);
      }

      if (format === FileFormat.YAML) {
        const { load } = await import("js-yaml");
        return resolve(load(safeValue) as object);
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
        return resolve(parser.parse(safeValue));
      }

      if (format === FileFormat.CSV) {
        const { csv2json } = await import("json-2-csv");
        const result = csv2json(safeValue, {
          trimFieldValues: true,
          trimHeaderFields: true,
          wrapBooleans: true,
          excelBOM: true,
        });
        return resolve(result);
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

      if (format === FileFormat.CSV) {
        const { json2csv } = await import("json-2-csv");
        const parsedJson = JSON.parse(json);

        const data = Array.isArray(parsedJson) ? parsedJson : [parsedJson];
        return resolve(
          json2csv(data, {
            expandArrayObjects: true,
            expandNestedObjects: true,
            excelBOM: true,
            wrapBooleans: true,
            trimFieldValues: true,
            trimHeaderFields: true,
          })
        );
      }

      return resolve(json);
    } catch (error) {
      console.error(json, error);
      return resolve(json);
    }
  });
};
