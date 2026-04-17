import type { JSONPath } from "jsonc-parser";

const resolveAtPath = (root: unknown, path: JSONPath): unknown => {
  let current: unknown = root;
  for (const segment of path) {
    if (current == null || typeof current !== "object") return undefined;
    current = (current as Record<string | number, unknown>)[segment as any];
  }
  return current;
};

/**
 * Drop collapsed paths that no longer resolve to an object/array in the current JSON.
 * Returns the input verbatim if the JSON cannot be parsed — we prefer to preserve
 * user intent through a transient syntax error over nuking state.
 */
export const pruneInvalidPaths = (json: string, paths: string[]): string[] => {
  if (!paths.length) return paths;
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    return paths;
  }

  const kept: string[] = [];
  for (const serialized of paths) {
    let path: JSONPath;
    try {
      path = JSON.parse(serialized) as JSONPath;
    } catch {
      continue;
    }
    const value = resolveAtPath(parsed, path);
    if (value && typeof value === "object") kept.push(serialized);
  }
  return kept;
};
