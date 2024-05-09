import type { NodeType } from "jsonc-parser";

export interface NodeData {
  id: string;
  text: string | [string, string][];
  width: number;
  height: number;
  path?: string;
  data: {
    type: NodeType;
    isParent: boolean;
    isEmpty: boolean;
    childrenCount: number;
  };
}

export interface EdgeData {
  id: string;
  from: string;
  to: string;
}
