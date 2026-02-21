import type { JSONPath, Node } from "jsonc-parser";

export interface NodeRow {
  key: string | null;
  value: string | number | null | boolean;
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
  lineNumber?: number;
  parentKey?: string;
  parentType?: string;
}

export interface EdgeData {
  id: string;
  from: string;
  to: string;
  text: string | null;
}

export interface GraphData {
  nodes: NodeData[];
  edges: EdgeData[];
}

export type LayoutDirection = "LEFT" | "RIGHT" | "DOWN" | "UP";

export type CanvasThemeMode = "light" | "dark";
