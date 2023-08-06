/* eslint unused-imports/no-unused-imports: 0 */
import { NodeType } from "jsonc-parser";

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

export enum FileFormat {
  "JSON" = "json",
  "YAML" = "yaml",
  "XML" = "xml",
  "TOML" = "toml",
  "CSV" = "csv",
}
