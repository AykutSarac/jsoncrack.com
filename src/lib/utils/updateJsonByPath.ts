/**
 * Utility functions to update nested JSON values by path
 * Handles updating primitives in nested objects/arrays
 */
import type { JSONPath } from "jsonc-parser";

/**
 * Updates a nested JSON value by its path
 * @param json - Stringified JSON
 * @param path - JSONPath array (e.g., ["user", "name"])
 * @param newValue - New value (will be parsed if it looks like JSON)
 * @returns Updated JSON string
 */
export const updateJsonByPath = (
  json: string,
  path: JSONPath | undefined,
  newValue: string
): string => {
  try {
    if (!path || path.length === 0) {
      // Root level update
      return newValue;
    }

    const obj = JSON.parse(json);
    const parsedValue = parseValueInput(newValue);

    setNestedValue(obj, path, parsedValue);
    return JSON.stringify(obj);
  } catch (error) {
    console.error("Error updating JSON:", error);
    return json; // Return original on error
  }
};

/**
 * Sets a value deep in an object using a path array
 * @param obj - Object to modify (mutated)
 * @param path - Path array
 * @param value - Value to set
 */
export const setNestedValue = (obj: any, path: JSONPath, value: any): void => {
  let current = obj;

  // Navigate to the parent of the target
  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i];
    if (!(key in current)) {
      current[key] = typeof path[i + 1] === "number" ? [] : {};
    }
    current = current[key];
  }

  // Set the final value
  if (path.length > 0) {
    current[path[path.length - 1]] = value;
  }
};

/**
 * Intelligently parses user input as JSON value
 * - "true" / "false" → boolean
 * - "null" → null
 * - "123" → number
 * - "[1,2,3]" or "{}" → parsed object/array
 * - everything else → string
 * @param input - User input string
 * @returns Parsed value
 */
export const parseValueInput = (input: string): any => {
  const trimmed = input.trim();

  // Boolean literals
  if (trimmed === "true") return true;
  if (trimmed === "false") return false;

  // Null literal
  if (trimmed === "null") return null;

  // Numbers
  if (!isNaN(Number(trimmed)) && trimmed !== "") {
    return Number(trimmed);
  }

  // Arrays and Objects
  if (
    (trimmed.startsWith("[") && trimmed.endsWith("]")) ||
    (trimmed.startsWith("{") && trimmed.endsWith("}"))
  ) {
    try {
      return JSON.parse(trimmed);
    } catch {
      // If parsing fails, treat as string
      return trimmed;
    }
  }

  // Default to string
  return trimmed;
};

/**
 * Gets a value from nested JSON by path
 * @param json - Stringified JSON
 * @param path - JSONPath array
 * @returns The value at that path or undefined
 */
export const getJsonValueByPath = (json: string, path: JSONPath | undefined): any => {
  try {
    if (!path || path.length === 0) {
      return JSON.parse(json);
    }

    const obj = JSON.parse(json);
    let current = obj;

    for (const key of path) {
      current = current[key];
      if (current === undefined) return undefined;
    }

    return current;
  } catch (error) {
    console.error("Error reading JSON:", error);
    return undefined;
  }
};

/**
 * Validates that a JSON string is valid JSON
 * @param json - String to validate
 * @returns true if valid JSON
 */
export const isValidJson = (json: string): boolean => {
  try {
    JSON.parse(json);
    return true;
  } catch {
    return false;
  }
};
