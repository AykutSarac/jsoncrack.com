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
        const { csv2json } = await import("json-2-csv");
        const result = csv2json(value, {
          trimFieldValues: true,
          trimHeaderFields: true,
          wrapBooleans: true,
          excelBOM: true,
        });
        return resolve(result);
      }
      if (format === FileFormat.XLSX) {
      const { read, utils } = await import("xlsx");
      const { csv2json } = await import("json-2-csv");

      // Read the XLSX content; adjust 'type' based on your input format
      const workbook = read(value, { type: "string" }); // or 'buffer', 'binary' if needed
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      // Convert XLSX sheet to CSV (exactly like a real CSV)
      const csv = utils.sheet_to_csv(sheet, {
        blankrows: false,
        strip: true,
      });

      // Now treat it just like CSV
      const result = csv2json(csv, {
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

      if (format === FileFormat.XLSX) {
        const { utils, write } = await import("xlsx");
        const parsedJson = JSON.parse(json);
        const data = Array.isArray(parsedJson) ? parsedJson : [parsedJson];

        const worksheet = utils.json_to_sheet(data);
        const workbook = utils.book_new();
        utils.book_append_sheet(workbook, worksheet, "Sheet1");

        // Export to base64 for browser-safe handling
        const xlsxOutput = write(workbook, { type: "base64", bookType: "xlsx" });
        return resolve(xlsxOutput);
      }

  
      return resolve(json);
    } catch (error) {
      console.error(json, error);
      return resolve(json);
    }
  });
};
