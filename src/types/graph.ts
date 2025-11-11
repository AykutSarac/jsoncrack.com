import type { JSONPath, Node } from "jsonc-parser";

export interface NodeRow {
  key: string | null;
  value: string | number | null;
  type: Node["type"];
  childrenCount?: number;
  to?: string[];
}

export interface NodeData {
  id: string;
  text: Array<NodeRow>;
  width: number;
  height: number;
  path?: JSONPath;
  // optional UI customizations
  color?: string;
  // optional display override for the node's primary label
  displayName?: string;
}

export interface EdgeData {
  id: string;
  from: string;
  to: string;
  text: string | null;
}

export type LayoutDirection = "LEFT" | "RIGHT" | "DOWN" | "UP";
