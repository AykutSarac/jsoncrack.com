import { createContext, useContext } from "react";
import type { JSONPath } from "jsonc-parser";

export interface CollapseContextValue {
  collapsedSet: Set<string>;
  onToggleCollapse?: (path: JSONPath) => void;
}

const EMPTY: CollapseContextValue = { collapsedSet: new Set() };

export const CollapseContext = createContext<CollapseContextValue>(EMPTY);

export const useCollapseContext = (): CollapseContextValue => useContext(CollapseContext);

export const pathKey = (path: JSONPath): string => JSON.stringify(path);

export const isPathCollapsed = (collapsedSet: Set<string>, path: JSONPath): boolean =>
  collapsedSet.has(pathKey(path));

export const isNodeHidden = (
  collapsedPrefixes: readonly JSONPath[],
  nodePath: JSONPath | undefined
): boolean => {
  if (!nodePath || collapsedPrefixes.length === 0) return false;
  for (const prefix of collapsedPrefixes) {
    if (prefix.length > nodePath.length) continue;
    let matches = true;
    for (let i = 0; i < prefix.length; i += 1) {
      if (prefix[i] !== nodePath[i]) {
        matches = false;
        break;
      }
    }
    if (matches) return true;
  }
  return false;
};

/**
 * Drop serialized collapsed-paths that no longer resolve to an object/array
 * in the given JSON. Invalid JSON returns the input verbatim so a transient
 * edit error doesn't nuke state.
 */
export const prunePaths = (jsonText: string, paths: readonly string[]): string[] => {
  if (paths.length === 0) return paths as string[];
  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonText);
  } catch {
    return paths as string[];
  }
  const kept: string[] = [];
  for (const key of paths) {
    let path: JSONPath;
    try {
      path = JSON.parse(key) as JSONPath;
    } catch {
      continue;
    }
    let cur: unknown = parsed;
    let ok = true;
    for (const seg of path) {
      if (cur == null || typeof cur !== "object") {
        ok = false;
        break;
      }
      cur = (cur as Record<string | number, unknown>)[seg as string & number];
    }
    if (ok && cur != null && typeof cur === "object") kept.push(key);
  }
  return kept;
};
