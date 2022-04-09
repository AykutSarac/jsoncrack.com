import { CanvasDirection } from "reaflow";

export interface StorageConfig {
  layout: CanvasDirection;
  expand: boolean;
  autoformat: boolean;
  hideEditor: boolean;
  showSearch: boolean;
  zoomScale: number;
  transform: number;
  searchNode: string;
}
