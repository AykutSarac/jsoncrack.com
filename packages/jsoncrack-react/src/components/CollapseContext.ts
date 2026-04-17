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
