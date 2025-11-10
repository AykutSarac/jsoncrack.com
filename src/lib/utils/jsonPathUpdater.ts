/**
 * Helper functions for updating JSON by path
 */
import type { JSONPath } from "jsonc-parser";
import type { NodeRow } from "../../types/graph";

/**
 * Updates a value in a JSON object at a specific path
 * @param json - The JSON object to update
 * @param path - The path to the value to update (e.g., ["customer", "address", 0, "street"])
 * @param newData - The new data to set at the path
 * @returns The updated JSON object
 */
export function updateJsonByPath(
  json: any,
  path: JSONPath | undefined,
  newData: NodeRow[]
): any {
  if (!path || path.length === 0) {
    // Root level update
    return createObjectFromNodeRows(newData);
  }

  // Deep clone to avoid mutation
  const result = JSON.parse(JSON.stringify(json));
  
  // Navigate to the parent of the target
  let current = result;
  for (let i = 0; i < path.length - 1; i++) {
    const segment = path[i];
    current = current[segment];
    
    if (current === undefined) {
      throw new Error(`Invalid path: cannot find segment "${segment}"`);
    }
  }
  
  // Update the target
  const lastSegment = path[path.length - 1];
  const newValue = createObjectFromNodeRows(newData);
  
  // If it's a simple value (not an object/array), set it directly
  if (newData.length === 1 && newData[0].key === null) {
    current[lastSegment] = newData[0].value;
  } else {
    current[lastSegment] = newValue;
  }
  
  return result;
}

/**
 * Creates an object or value from NodeRow data
 * @param nodeRows - The node rows to convert
 * @returns The created object or primitive value
 */
function createObjectFromNodeRows(nodeRows: NodeRow[]): any {
  // Handle primitive values (single row with no key)
  if (nodeRows.length === 1 && nodeRows[0].key === null) {
    return parseValue(nodeRows[0].value, nodeRows[0].type);
  }
  
  // Handle objects
  const result: any = {};
  
  for (const row of nodeRows) {
    // Skip array and object types as they're references to other nodes
    if (row.type === "array" || row.type === "object") {
      continue;
    }
    
    if (row.key !== null) {
      result[row.key] = parseValue(row.value, row.type);
    }
  }
  
  return result;
}

/**
 * Parse a value based on its type
 * @param value - The value to parse
 * @param type - The type of the value
 * @returns The parsed value
 */
function parseValue(value: string | number | null, type: string): any {
  if (value === null || type === "null") return null;
  
  switch (type) {
    case "boolean":
      if (typeof value === "boolean") return value;
      return value === "true";
    case "number":
      return typeof value === "number" ? value : parseFloat(value as string);
    case "string":
      return String(value);
    default:
      return value;
  }
}
