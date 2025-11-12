import { applyEdits, modify } from "jsonc-parser";
import type { JSONPath } from "jsonc-parser";

const FORMATTING = { formattingOptions: { tabSize: 2, insertSpaces: true } } as any;

/**
 * Updates the actual JSON value at the given path.
 * For object nodes, updates the "name" field if it exists, otherwise updates the value directly.
 * For text nodes (leaf values), updates the value at the path.
 */
export function updateJsonValue(
  jsonStr: string,
  path: JSONPath | undefined,
  newValue: string | number | null,
  fieldKey?: string | null
): string {
  if (!path || path.length === 0) {
    // Root level - can't update root directly
    return jsonStr;
  }

  let text = jsonStr ?? "{}";

  // If fieldKey is provided (e.g., "name"), update that specific field in the object
  if (fieldKey) {
    const fieldPath = [...path, fieldKey];
    const edits = modify(text, fieldPath, newValue, FORMATTING);
    if (edits.length) {
      return applyEdits(text, edits);
    }
  } else {
    // Update the value directly at the path
    const edits = modify(text, path, newValue, FORMATTING);
    if (edits.length) {
      return applyEdits(text, edits);
    }
  }

  return text;
}

export default updateJsonValue;

