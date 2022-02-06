export type Layout = "TB" | "BT" | "LR" | "RL";

export interface StorageConfig {
    layout: Layout;
    minimap: boolean;
    controls: boolean;
  }