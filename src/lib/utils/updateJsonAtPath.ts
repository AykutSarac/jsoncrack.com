import { applyEdits, modify, type FormattingOptions, type JSONPath } from "jsonc-parser";

const formatting: FormattingOptions = {
  insertSpaces: true,
  tabSize: 2,
  eol: "\n",
};

export const updateJsonAtPath = (json: string, path: JSONPath | undefined, value: unknown): string => {
  const targetPath: JSONPath = Array.isArray(path) ? path : [];

  try {
    const edits = modify(json, targetPath, value, { formattingOptions: formatting });
    return applyEdits(json, edits);
  } catch (error) {
    console.error("Failed to update JSON at path", { path: targetPath, error });
    throw error instanceof Error ? error : new Error("Failed to update JSON at path");
  }
};
